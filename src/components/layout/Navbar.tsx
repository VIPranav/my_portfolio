"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
const links = [
  ["Work", "/work"],
  ["About", "/about"],
  ["Skills", "/skills"],
  ["Journey", "/journey"],
  ["Contact", "/contact"],
];
export default function Navbar() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);
  const items = links.map(([label, href]) => (
    <Link
      href={href}
      key={href}
      aria-current={pathname === href ? "page" : undefined}
      onClick={() => dialog.current?.close()}
    >
      {label}
    </Link>
  ));
  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link href="/" className="wordmark" aria-label="Pranav VP home">
          VP<span className="accent">.</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main">
          {items}
        </nav>
        <div className="nav-actions">
          <ThemeToggle />
          <Link href="/contact" className="hire-button">
            Hire me <span aria-hidden="true">↗</span>
          </Link>
          <button
            className="icon-button menu-trigger"
            aria-label="Open navigation"
            onClick={() => dialog.current?.showModal()}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      <dialog
        ref={dialog}
        className="mobile-menu"
        aria-label="Main navigation"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        <button
          className="icon-button close-menu"
          aria-label="Close navigation"
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        <nav>{items}</nav>
      </dialog>
    </header>
  );
}
