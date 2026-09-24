import { assetUrl } from '../assetUrl'

export function Flag({ code }: { code: string }) {
  return (
    <img
      className="country-flag"
      src={assetUrl(`/assets/flags/${code}.png`)}
      width="24"
      height="18"
      alt=""
      loading="lazy"
    />
  )
}
