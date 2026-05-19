import { Hero } from "@/components/home/Hero";
import { CategoryCards } from "@/components/home/CategoryCards";
import { PortfolioTeaser } from "@/components/home/PortfolioTeaser";
import { MaterialeStrip } from "@/components/home/MaterialeStrip";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { DespreTeaser } from "@/components/home/DespreTeaser";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryCards />
      <PortfolioTeaser />
      <MaterialeStrip />
      <ProcessSteps />
      <DespreTeaser />
      <CtaBanner />
    </>
  );
}
