
// @file toaster.tsx
// Implements a toast notification system that displays temporary messages to users
// with automatic dismissal after a specified duration.

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

// @component Main Toaster component for rendering toast notifications
export function Toaster() {
  // @section Toast state management
  const { toasts } = useToast()

  return (
    // @component ToastProvider with global duration setting
    <ToastProvider duration={1000}> {/* <- define a duração global */}
      {/* @component Map through and render all active toast notifications */}
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-xl transition-opacity duration-300">
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
