'use client'

import { useEffect, useState } from 'react'

export function PrototypeNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const dismissed = window.localStorage.getItem('prototype-notice-dismissed')
      if (dismissed !== 'true') {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- show notice on first mount only
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    try {
      window.localStorage.setItem('prototype-notice-dismissed', 'true')
    } catch {
      // ignore
    }
  }

  if (!visible) {
    return null
  }

  return (
    <div
      role="alert"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-line bg-ink p-3 text-center text-sm text-muted"
    >
      <div className="mx-auto flex max-w-[1650px] items-center justify-between gap-4 px-6">
        <span>
          ⚠️ This is a prototype of the Full Circle Event Production website. It is not affiliated
          with, commissioned by or endorsed by the business.
        </span>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded bg-accent px-3 py-1 text-accent-ink hover:bg-white"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
