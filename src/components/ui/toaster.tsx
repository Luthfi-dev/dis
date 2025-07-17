
"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { Copy } from "lucide-react"
import { Button } from "./button"

export function Toaster() {
  const { toasts, toast } = useToast()

  const handleCopy = (description: React.ReactNode) => {
    if (typeof description === 'string') {
      navigator.clipboard.writeText(description);
      toast({
        title: "Tersalin!",
        description: "Detail error berhasil disalin.",
      })
    }
  }

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        // Updated logic: show copy button if variant is destructive and description is a long string.
        const isError = variant === 'destructive' && typeof description === 'string' && description.length > 50;

        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="grid gap-1 flex-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
             <div className="flex items-center gap-2">
              {action}
              {isError && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 group-[.destructive]:hover:bg-destructive/50 group-[.destructive]:text-destructive-foreground"
                  onClick={() => handleCopy(description)}
                >
                    <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
