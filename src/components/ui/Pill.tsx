import { cn } from "@/lib/utils";
export function Pill({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("pill", className)} {...props}>
      {children}
    </div>
  );
}
