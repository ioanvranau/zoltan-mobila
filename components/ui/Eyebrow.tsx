import { cn } from "@/lib/cn";

export function Eyebrow({
  children, className, tone = "muted",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "muted" | "brass";
}) {
  return (
    <p
      className={cn(
        "text-eyebrow uppercase",
        tone === "brass" ? "text-brass" : "text-text-muted",
        className,
      )}
    >
      {children}
    </p>
  );
}
