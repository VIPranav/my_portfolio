"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/admin";
import ThemeToggle from "@/components/layout/ThemeToggle";
export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="admin-sidebar">
      <Link href="/" className="wordmark">
        VP<span className="accent">.</span>
      </Link>
      <p className="small muted">Content studio</p>
      <nav aria-label="Admin navigation">
        {[
          ["Dashboard", "/admin"],
          ["Projects", "/admin/projects"],
          ["Skills", "/admin/skills"],
          ["Messages", "/admin/messages"],
          ["Settings", "/admin/settings"],
        ].map(([label, href]) => (
          <Link
            key={href}
            href={href}
            aria-current={path === href ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      <ThemeToggle />
      <form action={logoutAction}>
        <button className="text-button">Sign out</button>
      </form>
    </aside>
  );
}
