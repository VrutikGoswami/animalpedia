import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import type { Still } from '../types'

export function AnimalImage({
  asset,
  name,
  index,
  small = false,
}: {
  asset: Still | null
  name: string
  index: number
  small?: boolean
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  if (asset && failedSrc !== asset.src)
    return (
      <img
        className={`animal-image ${asset.kind}`}
        src={asset.src}
        alt={small ? '' : asset.alt}
        onError={() => setFailedSrc(asset.src)}
      />
    )
  return (
    <div
      className={`image-placeholder${small ? ' thumbnail-placeholder' : ''}`}
      aria-label={
        small
          ? undefined
          : `${name} photograph ${asset ? 'unavailable' : 'awaiting media'}`
      }
      aria-hidden={small ? true : undefined}
      role={small ? undefined : 'img'}
    >
      <span className="placeholder-number" aria-hidden="true">
        0{index + 1}
      </span>
      {!small && (
        <>
          <span className="placeholder-cross cross-top" aria-hidden="true">
            +
          </span>
          <span className="placeholder-cross cross-bottom" aria-hidden="true">
            +
          </span>
          <span className="placeholder-caption">
            <ImageOff size={16} aria-hidden="true" />{' '}
            {asset ? 'Photograph unavailable' : 'Field photograph forthcoming'}
          </span>
        </>
      )}
    </div>
  )
}
