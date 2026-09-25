import { cn } from "@/lib/utils";
export function Section({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"section">) {
  return (
    <section className={cn("section", className)} {...props}>
      {children}
    </section>
  );
}
