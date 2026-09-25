import { cn } from "@/lib/utils";
export function GlassCard({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("glass-card", className)} {...props}>
      {children}
    </div>
  );
}
