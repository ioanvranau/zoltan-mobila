import { cn } from "@/lib/cn";
import { Container } from "./Container";

type Variant = "bg" | "elevated" | "warm";

export function Section({
  children,
  variant = "bg",
  className,
  containerClassName,
  id,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  containerClassName?: string;
  id?: string;
}) {
  const bg =
    variant === "elevated" ? "bg-bg-elevated" :
    variant === "warm" ? "bg-bg-warm" : "bg-bg";
  return (
    <section id={id} className={cn("py-20 md:py-28 lg:py-36 text-text", bg, className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
