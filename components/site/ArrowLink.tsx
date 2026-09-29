import Link from "next/link";
import { cx, isExternal, linkRel } from "@/lib/utils";

export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const classes = cx("arrow-link", className);
  const content = (
    <>
      <span>{children}</span>
      <span className="arrow" aria-hidden="true">
        →
      </span>
    </>
  );
  if (isExternal(href)) {
    return (
      <a href={href} className={classes} {...linkRel(href)}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href || "/"} className={classes}>
      {content}
    </Link>
  );
}
