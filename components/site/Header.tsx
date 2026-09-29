"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLink } from "./ArrowLink";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/books", label: "Books" },
  { href: "/poetry", label: "Poetry" },
  { href: "/writing", label: "Writing" },
  { href: "/listen", label: "Listen" },
  { href: "/links", label: "Links" },
];

export function Header({
  authorName,
  subscribeHref,
  subscribeLabel,
}: {
  authorName: string;
  subscribeHref: string;
  subscribeLabel: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="shell flex h-[4.25rem] items-center justify-between gap-6">
        <Link href="/" className="font-serif text-[1.35rem] italic leading-none tracking-tight">
          {authorName}
        </Link>
        <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className="nav-link" aria-current={active ? "page" : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-5">
          <span className="hidden sm:inline">
            <ArrowLink href={subscribeHref}>{subscribeLabel}</ArrowLink>
          </span>
          <button type="button" className="text-btn xl:hidden" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}>
            Menu
          </button>
        </div>
      </div>
      {open ? (
        <div id="mobile-menu" className="fixed inset-0 z-[80] flex flex-col bg-paper px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="font-serif text-2xl italic">{authorName}</p>
            <button type="button" className="text-btn" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
          <nav className="mt-16 flex flex-col gap-5" aria-label="Mobile">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="font-serif text-5xl leading-none tracking-tight" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex gap-8 pb-8">
            <ArrowLink href={subscribeHref}>{subscribeLabel}</ArrowLink>
            <ArrowLink href="/contact">Write</ArrowLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
