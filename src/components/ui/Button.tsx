import Link from "next/link";
import { cn } from "@/lib/utils";
export function Button({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"button">) {
  return (
    <button className={cn("button", className)} {...props}>
      {children}
    </button>
  );
}
export function ButtonLink({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link className={cn("button", className)} {...props}>
      {children}
    </Link>
  );
}
