import { cn } from "../../lib/utils"

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-muted dark:bg-slate-700 bg-gray-200", className)}
            {...props}
        />
    )
}

export { Skeleton }
