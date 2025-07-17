
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
import { ScrollArea } from "./scroll-area"
import { cn } from "@/lib/utils"

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
        const isError = variant === 'destructive' && !!description;

        return (
          <Toast key={id} variant={variant} {...props} className={cn(isError && "w-[480px]")}>
            <div className="grid gap-1 flex-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                isError ? (
                  <ScrollArea className="h-20 w-full rounded-md border bg-destructive-foreground/10 p-2">
                    <pre className="text-xs text-destructive-foreground whitespace-pre-wrap break-all select-text">
                      {description as string}
                    </pre>
                  </ScrollArea>
                ) : (
                   <ToastDescription>{description}</ToastDescription>
                )
              )}
            </div>
             <div className="flex flex-col items-center gap-2 self-start">
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
               <ToastClose className="static transform-none" />
            </div>
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
