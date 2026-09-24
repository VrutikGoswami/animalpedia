import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'

const expected = {
  'red-kangaroo': 'e5dedf92326140a7bed98c0d52fa2d6da20be78067ecd230eb9a78f30537a84e',
  'spinifex-hopping-mouse': 'be87679ee2714a6b0bc7ccb526b625a77744c33fff470d6016a5c174dab20595',
  'australian-sea-lion': 'f3f2b48e0e7951ca281783116239f6dceb7ceb56d214cfae710ade67e1a7c7ea',
}

for (const id of ['red-kangaroo', 'spinifex-hopping-mouse', 'australian-sea-lion']) {
  const bytes = await readFile(`public/assets/models/${id}/model.glb`)
  if (createHash('sha256').update(bytes).digest('hex') !== expected[id]) throw new Error(`Release hash mismatch: ${id}`)
  if (bytes.toString('ascii', 0, 4) !== 'glTF' || bytes.readUInt32LE(4) !== 2 || bytes.readUInt32LE(8) !== bytes.length) throw new Error(`Invalid GLB: ${id}`)
  const json = JSON.parse(bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)))
  if ([...(json.buffers ?? []), ...(json.images ?? [])].some(item => item.uri)) throw new Error(`External dependency: ${id}`)
  console.log(JSON.stringify({ id, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), meshes: json.meshes.length, materials: json.materials.length, embeddedImages: json.images.length, animations: json.animations?.length ?? 0, extensionsRequired: json.extensionsRequired ?? [] }))
}
