import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

export function Modal({
  children,
  onClose,
  label,
  className = '',
}: {
  children: ReactNode
  onClose: () => void
  label: string
  className?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current!
    const trigger = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = overflow
      trigger?.focus({ preventScroll: true })
    }
  }, [])
  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <button
        className="icon-button modal-close"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={21} aria-hidden="true" />
      </button>
      {children}
    </dialog>
  )
}
