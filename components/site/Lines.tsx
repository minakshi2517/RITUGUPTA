import { cx } from "@/lib/utils";

export function Lines({
  text,
  className,
  italicLast = false,
}: {
  text: string;
  className?: string;
  italicLast?: boolean;
}) {
  const lines = text.split("\n");
  return (
    <span className={cx("block", className)}>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`} className={cx("block", italicLast && index === lines.length - 1 && "italic font-light")}>
          {line || "\u00A0"}
        </span>
      ))}
    </span>
  );
}
