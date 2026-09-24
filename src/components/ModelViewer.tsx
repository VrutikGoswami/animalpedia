import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  RefreshCw,
  ScanSearch,
  ExternalLink,
} from 'lucide-react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { AnimalModel } from '../data/models'
import { Modal } from './Modal'
import '../model.css'

type ViewerActions = {
  turn: (direction: number) => void
  zoom: (factor: number) => void
  reset: () => void
  rotate: (enabled: boolean) => void
}

function disposeModel(object: THREE.Object3D) {
  const textures = new Set<THREE.Texture>()
  const materials = new Set<THREE.Material>()
  object.traverse((node) => {
    if (!(node instanceof THREE.Mesh)) return
    node.geometry.dispose()
    for (const material of Array.isArray(node.material)
      ? node.material
      : [node.material]) {
      materials.add(material)
      for (const value of Object.values(material))
        if (value instanceof THREE.Texture) textures.add(value)
    }
  })
  materials.forEach((material) => material.dispose())
  textures.forEach((texture) => {
    if (
      typeof ImageBitmap !== 'undefined' &&
      texture.image instanceof ImageBitmap
    )
      texture.image.close()
    texture.dispose()
  })
}

export default function ModelViewer({
  model,
  name,
}: {
  model: AnimalModel
  name: string
}) {
  const host = useRef<HTMLDivElement>(null)
  const actions = useRef<ViewerActions | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  const [rotating, setRotating] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const markers = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const container = host.current!
    const abort = new AbortController()
    let disposed = false
    let object: THREE.Object3D | undefined
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      })
    } catch {
      queueMicrotask(() => {
        if (!disposed) setStatus('error')
      })
      return () => {
        disposed = true
      }
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    const canvas = renderer.domElement
    canvas.setAttribute('aria-label', `${name}, interactive 3D illustration`)
    canvas.setAttribute('role', 'img')
    container.append(canvas)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.01, 100)
    const controls = new OrbitControls(camera, canvas)
    controls.enablePan = false
    controls.enableZoom = false
    controls.minPolarAngle = Math.PI * 0.15
    controls.maxPolarAngle = Math.PI * 0.75
    controls.autoRotateSpeed = 0.7
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8b9687, 2.7))
    const key = new THREE.DirectionalLight(0xfff8ed, 3.2)
    key.position.set(3, 5, 4)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xe1ecff, 1.5)
    fill.position.set(-3, 2, -3)
    scene.add(fill)
    let baseDistance = 4
    let visible = true
    const raycaster = new THREE.Raycaster()
    let anchors: THREE.Vector3[] = []
    const projectMarkers = () => {
      if (!object) return
      camera.updateMatrixWorld()
      anchors.forEach((anchor, index) => {
        const button = markers.current[index]
        if (!button) return
        const point = anchor.clone().project(camera)
        const direction = anchor.clone().sub(camera.position)
        const distance = direction.length()
        raycaster.set(camera.position, direction.normalize())
        const hit = raycaster.intersectObject(object!, true)[0]
        const unobscured = !hit || hit.distance >= distance - 0.045
        const show =
          unobscured &&
          Math.abs(point.x) < 0.96 &&
          Math.abs(point.y) < 0.94 &&
          point.z > -1 &&
          point.z < 1
        button.style.transform = `translate(${((point.x + 1) * container.clientWidth) / 2}px, ${((1 - point.y) * container.clientHeight) / 2}px) translate(-50%, -50%)`
        button.style.visibility = show ? 'visible' : 'hidden'
        button.tabIndex = show ? 0 : -1
      })
    }
    const render = () => {
      if (!disposed && visible && !document.hidden) {
        renderer.render(scene, camera)
        projectMarkers()
      }
    }
    const fit = () => {
      const width = Math.max(1, container.clientWidth)
      const height = Math.max(1, container.clientHeight)
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      if (object) {
        // Fit all eight bounds corners in camera space, including the tail.
        const box = new THREE.Box3().setFromObject(object)
        const center = box.getCenter(new THREE.Vector3())
        const direction = new THREE.Vector3().setFromSphericalCoords(
          1,
          THREE.MathUtils.degToRad(77),
          THREE.MathUtils.degToRad(model.angle),
        )
        camera.position.copy(center).add(direction)
        camera.lookAt(center)
        const inverse = camera.quaternion.clone().invert()
        const tanY = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
        const tanX = tanY * camera.aspect
        baseDistance = 0
        for (const x of [box.min.x, box.max.x])
          for (const y of [box.min.y, box.max.y])
            for (const z of [box.min.z, box.max.z]) {
              const point = new THREE.Vector3(x, y, z)
                .sub(center)
                .applyQuaternion(inverse)
              baseDistance = Math.max(
                baseDistance,
                point.z +
                  Math.max(Math.abs(point.x) / tanX, Math.abs(point.y) / tanY) *
                    1.08,
              )
            }
        controls.target.copy(center)
        camera.position.copy(center).addScaledVector(direction, baseDistance)
        camera.far = baseDistance * 15
        camera.updateProjectionMatrix()
        controls.update()
        controls.saveState()
      }
      render()
    }
    const observer = new ResizeObserver(fit)
    observer.observe(container)
    const visibility = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
      if (visible) render()
    })
    visibility.observe(container)
    controls.addEventListener('change', render)
    const changeCamera = (angle: number, factor: number) => {
      const orbit = new THREE.Spherical().setFromVector3(
        camera.position.clone().sub(controls.target),
      )
      orbit.theta += angle
      orbit.radius = THREE.MathUtils.clamp(
        orbit.radius * factor,
        baseDistance * 0.65,
        baseDistance * 1.6,
      )
      camera.position
        .copy(controls.target)
        .add(new THREE.Vector3().setFromSpherical(orbit))
      controls.update()
      render()
    }
    actions.current = {
      turn: (direction) => changeCamera(direction * 0.25, 1),
      zoom: (factor) => changeCamera(0, factor),
      reset: () => {
        controls.reset()
        render()
      },
      rotate: (enabled) => {
        controls.autoRotate = enabled
      },
    }
    let previous = performance.now()
    renderer.setAnimationLoop((time) => {
      const delta = Math.min((time - previous) / 1000, 0.05)
      previous = time
      if (visible && !document.hidden && controls.autoRotate)
        controls.update(delta)
    })
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const stopMotion = () => {
      if (motion.matches) {
        controls.autoRotate = false
        setRotating(false)
      }
    }
    motion.addEventListener('change', stopMotion)
    const lost = (event: Event) => {
      event.preventDefault()
      setStatus('error')
      setRotating(false)
      controls.autoRotate = false
    }
    canvas.addEventListener('webglcontextlost', lost)
    const timer = window.setTimeout(() => {
      abort.abort()
      if (!disposed) setStatus('error')
    }, 25000)
    fetch(model.src, { signal: abort.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Model unavailable')
        return response.arrayBuffer()
      })
      .then((bytes) => new GLTFLoader().parseAsync(bytes, ''))
      .then((gltf) => {
        if (disposed || abort.signal.aborted) {
          disposeModel(gltf.scene)
          return
        }
        object = gltf.scene
        scene.add(object)
        object.updateMatrixWorld(true)
        anchors = model.points.map((point) => {
          const anchor = new THREE.Vector3(...point.position)
          const normal = new THREE.Vector3(...point.normal).normalize()
          raycaster.set(
            anchor.clone().addScaledVector(normal, 0.7),
            normal.clone().negate(),
          )
          const hits = raycaster.intersectObject(object!, true)
          hits.sort(
            (a, b) =>
              a.point.distanceToSquared(anchor) -
              b.point.distanceToSquared(anchor),
          )
          if (hits[0])
            return hits[0].point.clone().addScaledVector(normal, 0.006)
          // Thin ears can miss the normal ray; snap the marker to the nearest mesh vertex.
          let nearest = anchor.clone(),
            best = Infinity
          const vertex = new THREE.Vector3()
          object!.traverse((node) => {
            if (!(node instanceof THREE.Mesh)) return
            const positions = node.geometry.getAttribute('position')
            for (let i = 0; i < positions.count; i++) {
              vertex
                .fromBufferAttribute(positions, i)
                .applyMatrix4(node.matrixWorld)
              const distance = vertex.distanceToSquared(anchor)
              if (distance < best) {
                best = distance
                nearest = vertex.clone()
              }
            }
          })
          return nearest.addScaledVector(normal, 0.006)
        })
        fit()
        anchors = anchors.map((anchor, index) => {
          if (model.points[index].id !== 'ears') return anchor
          const direction = anchor.clone().sub(camera.position).normalize()
          raycaster.set(camera.position, direction)
          const hit = raycaster.intersectObject(object!, true)[0]
          return hit
            ? hit.point.clone().addScaledVector(direction, -0.006)
            : anchor
        })
        render()
        setStatus('ready')
      })
      .catch(() => {
        if (!disposed) setStatus('error')
      })
      .finally(() => window.clearTimeout(timer))
    fit()
    return () => {
      disposed = true
      abort.abort()
      window.clearTimeout(timer)
      observer.disconnect()
      visibility.disconnect()
      motion.removeEventListener('change', stopMotion)
      canvas.removeEventListener('webglcontextlost', lost)
      controls.dispose()
      renderer.setAnimationLoop(null)
      if (object) disposeModel(object)
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
      actions.current = null
    }
  }, [model, name, attempt])

  const ready = status === 'ready'
  const inspect = (index: number) => {
    actions.current?.rotate(false)
    setRotating(false)
    setSelected(index)
  }
  return (
    <div className="model-viewer" data-model-state={status}>
      <div className="model-canvas" ref={host} />
      <div className="model-markers" hidden={!ready}>
        {model.points.map((point, index) => (
          <button
            key={point.id}
            ref={(node) => {
              markers.current[index] = node
            }}
            className="model-node"
            aria-label={`Explore ${point.title}`}
            title={point.title}
            onClick={() => inspect(index)}
          >
            <span />
          </button>
        ))}
      </div>
      {selected !== null && (
        <Modal
          label={`${name}: body parts`}
          className="model-note-dialog"
          onClose={() => setSelected(null)}
        >
          <p className="eyebrow">{name}</p>
          <h2>{model.points[selected].title}</h2>
          <label className="model-part-select">
            Body part
            <select
              aria-label="Body part"
              value={selected}
              onChange={(event) => setSelected(Number(event.target.value))}
            >
              {model.points.map((point, index) => (
                <option key={point.id} value={index}>
                  {point.title}
                </option>
              ))}
            </select>
          </label>
          <p className="model-part-description">
            {model.points[selected].description}
          </p>
          <a
            href={model.points[selected].source}
            target="_blank"
            rel="noreferrer"
          >
            {model.points[selected].publisher} <ExternalLink size={14} />
          </a>
          <p className="model-part-disclaimer">
            Illustrated body region, not an anatomical measurement.
          </p>
        </Modal>
      )}
      {!ready && (
        <img
          className="model-poster"
          src={model.poster.src}
          alt={model.poster.alt}
        />
      )}
      {status === 'loading' && (
        <span className="model-status" role="status">
          Loading 3D model
        </span>
      )}
      {status === 'error' && (
        <div className="model-error" role="alert">
          <span>3D model unavailable. Showing the illustration.</span>
          <button
            className="icon-button"
            title="Retry 3D model"
            aria-label="Retry 3D model"
            onClick={() => {
              setStatus('loading')
              setRotating(false)
              setAttempt(attempt + 1)
            }}
          >
            <RefreshCw size={17} />
          </button>
        </div>
      )}
      <div
        className="model-toolbar"
        role="group"
        aria-label={`${name} model controls`}
      >
        <button
          disabled={!ready}
          className="icon-button model-parts-button"
          title="Body parts"
          aria-label="Body parts"
          onClick={() => inspect(0)}
        >
          <ScanSearch size={18} />
        </button>
        <button
          disabled={!ready}
          className="icon-button"
          title="Rotate left"
          aria-label="Rotate left"
          onClick={() => actions.current?.turn(-1)}
        >
          <ArrowLeft size={17} />
        </button>
        <button
          disabled={!ready}
          className="icon-button"
          title="Rotate right"
          aria-label="Rotate right"
          onClick={() => actions.current?.turn(1)}
        >
          <ArrowRight size={17} />
        </button>
        <button
          disabled={!ready}
          className="icon-button"
          title="Zoom in"
          aria-label="Zoom in"
          onClick={() => actions.current?.zoom(0.9)}
        >
          <ZoomIn size={17} />
        </button>
        <button
          disabled={!ready}
          className="icon-button"
          title="Zoom out"
          aria-label="Zoom out"
          onClick={() => actions.current?.zoom(1.1)}
        >
          <ZoomOut size={17} />
        </button>
        <button
          disabled={!ready}
          className="icon-button"
          title="Reset view"
          aria-label="Reset view"
          onClick={() => {
            actions.current?.reset()
            actions.current?.rotate(false)
            setRotating(false)
          }}
        >
          <RotateCcw size={17} />
        </button>
        <button
          disabled={!ready}
          className="icon-button"
          title={rotating ? 'Pause rotation' : 'Start rotation'}
          aria-label={rotating ? 'Pause rotation' : 'Start rotation'}
          aria-pressed={rotating}
          onClick={() => {
            actions.current?.rotate(!rotating)
            setRotating(!rotating)
          }}
        >
          {rotating ? <Pause size={17} /> : <Play size={17} />}
        </button>
      </div>
    </div>
  )
}
