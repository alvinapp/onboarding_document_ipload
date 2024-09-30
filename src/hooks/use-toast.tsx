import { useState, useEffect, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastOptions {
  title?: string
  description: string
  type?: ToastType
  duration?: number
}

interface Toast extends ToastOptions {
  id: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback(({ title, description, type = 'info', duration = 3000 }: ToastOptions) => {
    const id = Date.now()
    setToasts((prevToasts) => [...prevToasts, { id, title, description, type, duration }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }, [])

  useEffect(() => {
    const timers = toasts.map((toast) => {
      return setTimeout(() => removeToast(toast.id), toast.duration)
    })

    return () => timers.forEach(clearTimeout)
  }, [toasts, removeToast])

  return { addToast, removeToast, toasts }
}