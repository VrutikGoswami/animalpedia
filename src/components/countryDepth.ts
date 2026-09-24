import * as THREE from 'three'

// The camera travels through three depth layers; reverse scroll retraces it.
export function createCountryDepth(host: HTMLElement, cards: HTMLElement[]) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
  renderer.setClearColor(0, 0)
  renderer.domElement.className = 'country-depth-canvas'
  renderer.domElement.setAttribute('aria-hidden', 'true')
  host.prepend(renderer.domElement)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  const loader = new THREE.TextureLoader()
  let disposed = false
  let progress = 0
  let ready = false
  const items = cards.map((card, index) => {
    const image = card.querySelector('img')!
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      side: THREE.DoubleSide,
    })
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
    plane.rotation.z = THREE.MathUtils.degToRad(index % 2 ? -3 : 3)
    plane.position.z = -Math.floor(index / 4) * 10 - (index % 2) * 0.7
    scene.add(plane)
    return {
      card,
      image,
      plane,
      material,
      ratio: card.classList.contains('country-ch') ? 0.9 : 1.62,
    }
  })
  const render = () => {
    if (disposed || !ready) return
    camera.position.z = 8 - progress * 20
    camera.updateMatrixWorld()
    const w = host.clientWidth,
      h = host.clientHeight
    const mobile = w < 760
    const title =
      host.parentElement!.querySelector<HTMLElement>('.world-title')!
    const titleBounds = title.getBoundingClientRect()
    const hostBounds = host.getBoundingClientRect()
    for (const [index, { card, plane, material, ratio }] of items.entries()) {
      const distance = camera.position.z - plane.position.z
      const opacity =
        THREE.MathUtils.smoothstep(distance, 1.5, 4) *
        (1 -
          THREE.MathUtils.smoothstep(
            distance,
            mobile ? 10 : 16,
            mobile ? 16 : 24,
          ))
      plane.visible = distance > 0.2 && opacity > 0.01
      material.opacity = opacity
      const width =
        (plane.scale.x * h) /
        (2 * Math.tan(THREE.MathUtils.degToRad(22.5)) * Math.max(distance, 0.2))
      const unitsPerPixel =
        (2 *
          Math.tan(THREE.MathUtils.degToRad(22.5)) *
          Math.max(distance, 0.2)) /
        h
      const viewHeight = 16 * Math.tan(THREE.MathUtils.degToRad(22.5))
      plane.position.x =
        (index % 2 ? 1 : -1) *
        viewHeight *
        camera.aspect *
        (mobile ? 0.26 : 0.34)
      plane.position.y = viewHeight * (index % 4 < 2 ? 0.32 : -0.29)
      // Keep a clear reading corridor while deeper planes pass the title.
      if (mobile) {
        const topRow = index % 4 < 2
        const edge = topRow
          ? titleBounds.top - hostBounds.top - 38
          : titleBounds.bottom - hostBounds.top + 18
        const safeY = topRow
          ? edge - width / ratio / 2
          : edge + width / ratio / 2
        plane.position.y = topRow
          ? Math.max(plane.position.y, (h / 2 - safeY) * unitsPerPixel)
          : Math.min(plane.position.y, (h / 2 - safeY) * unitsPerPixel)
      } else {
        const minimum = (titleBounds.width / 2 + 24 + width / 2) * unitsPerPixel
        plane.position.x =
          Math.sign(plane.position.x) *
          Math.max(Math.abs(plane.position.x), minimum)
      }
      const p = plane.position.clone().project(camera)
      const x = ((p.x + 1) * w) / 2,
        y = ((1 - p.y) * h) / 2
      const visible =
        plane.visible &&
        x + width / 2 > 0 &&
        x - width / 2 < w &&
        y + width / ratio / 2 > 0 &&
        y - width / ratio / 2 < h
      card.style.width = `${width}px`
      card.style.transform = `translate(${x - width / 2}px, ${y - width / ratio / 2}px) rotate(${-THREE.MathUtils.radToDeg(plane.rotation.z)}deg)`
      card.style.opacity = `${opacity}`
      card.querySelector<HTMLElement>('.country-caption')!.style.opacity =
        `${1 - THREE.MathUtils.smoothstep(distance, 11, 15)}`
      card.style.visibility = visible ? 'visible' : 'hidden'
      card.style.zIndex = `${Math.round(100 - distance)}`
      card.inert = !visible
      card.dataset.depth = String(Math.floor(cards.indexOf(card) / 4))
    }
    renderer.render(scene, camera)
    host.dataset.cameraZ = camera.position.z.toFixed(3)
  }
  const resize = () => {
    const w = host.clientWidth,
      h = host.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
    const viewHeight = 16 * Math.tan(THREE.MathUtils.degToRad(22.5))
    const viewWidth = viewHeight * camera.aspect
    const mobile = w < 760
    items.forEach(({ plane, ratio }, index) => {
      const slot = index % 4
      const width = viewWidth * (mobile ? 0.43 : 0.27)
      plane.scale.set(width, width / ratio, 1)
      plane.position.x = viewWidth * (slot % 2 ? 0.34 : -0.34)
      plane.position.y = viewHeight * (slot < 2 ? 0.32 : -0.35)
    })
    render()
  }
  const observer = new ResizeObserver(resize)
  observer.observe(host)
  const lost = (event: Event) => {
    event.preventDefault()
    cleanup()
  }
  renderer.domElement.addEventListener('webglcontextlost', lost)
  function cleanup() {
    if (disposed) return
    disposed = true
    observer.disconnect()
    renderer.domElement.removeEventListener('webglcontextlost', lost)
    for (const { card, plane, material } of items) {
      plane.geometry.dispose()
      material.map?.dispose()
      material.dispose()
      for (const property of [
        'width',
        'transform',
        'opacity',
        'visibility',
        'z-index',
      ])
        card.style.removeProperty(property)
      card.inert = false
      card
        .querySelector<HTMLElement>('.country-caption')!
        .style.removeProperty('opacity')
    }
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.domElement.remove()
    host.classList.remove('depth-ready')
    delete host.dataset.cameraZ
  }
  Promise.all(
    items.map(async ({ image, material, ratio }) => {
      const texture = await loader.loadAsync(image.src)
      if (disposed) {
        texture.dispose()
        return
      }
      texture.colorSpace = THREE.SRGBColorSpace
      const aspect = texture.image.width / texture.image.height
      if (aspect > ratio) {
        texture.repeat.x = ratio / aspect
        texture.offset.x = (1 - texture.repeat.x) / 2
      } else {
        texture.repeat.y = aspect / ratio
        texture.offset.y = (1 - texture.repeat.y) / 2
      }
      material.map = texture
      material.needsUpdate = true
    }),
  )
    .then(() => {
      if (disposed) return
      ready = true
      host.classList.add('depth-ready')
      resize()
    })
    .catch(cleanup)
  return {
    update: (value: number) => {
      progress = value
      render()
    },
    dispose: cleanup,
  }
}
