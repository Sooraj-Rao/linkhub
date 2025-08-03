import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-lg  bg-gray-300 dark:bg-muted/40 animate-pulse", className)}
      {...props}
    />
  )
}

export { Skeleton }
