"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions";

const ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/home", label: "Home" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/books", label: "Books" },
  { href: "/admin/poetry", label: "Poetry" },
  { href: "/admin/writing", label: "Writing" },
  { href: "/admin/audio", label: "Audio" },
  { href: "/admin/links", label: "Links" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/messages", label: "Notes" },
  { href: "/admin/settings", label: "Settings" },
];

export function Sidebar({ authorName }: { authorName: string }) {
  const pathname = usePathname();
  return (
    <aside className="border-b border-white/10 bg-ink text-paper lg:min-h-screen lg:border-b-0 lg:border-r">
      <div className="flex items-end justify-between gap-6 px-5 py-6 lg:block lg:px-6 lg:py-8">
        <div>
          <p className="font-sans text-[0.68rem] tracking-[0.18em] uppercase text-paper/50">Studio</p>
          <p className="mt-2 font-serif text-2xl italic">{authorName}</p>
        </div>
        <Link href="/" className="font-sans text-[0.68rem] tracking-[0.16em] uppercase text-paper/70 lg:mt-8 lg:inline-block">
          View site →
        </Link>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:block lg:px-3 lg:pb-8" aria-label="Studio">
        {ITEMS.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block whitespace-nowrap px-3 py-2 font-sans text-[0.78rem] tracking-[0.12em] uppercase ${active ? "text-paper" : "text-paper/55"}`}
              aria-current={active ? "page" : undefined}
            >
              <span className={active ? "border-b border-[#e7c4bb] pb-0.5" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <form action={logoutAction} className="px-6 pb-6 lg:pb-8">
        <button className="font-sans text-[0.68rem] tracking-[0.16em] uppercase text-paper/50">Sign out</button>
      </form>
    </aside>
  );
}
