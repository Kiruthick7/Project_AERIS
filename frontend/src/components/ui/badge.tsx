import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-slate-100 text-slate-900": variant === "default",
          "border-transparent bg-slate-800 text-slate-100": variant === "secondary",
          "border-transparent bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400": variant === "destructive",
          "border-transparent bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400": variant === "warning",
          "border-transparent bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400": variant === "success",
          "text-slate-100": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
