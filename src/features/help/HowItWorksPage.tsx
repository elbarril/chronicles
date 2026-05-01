import { HowItWorksGuide } from "@/features/help/components/HowItWorksGuide";
import { howItWorksPage } from "@/features/help/messages";

export function HowItWorksPage(): JSX.Element {
  return (
    <section className="space-y-6" aria-labelledby="how-it-works-page-title">
      <header className="space-y-2">
        <h1 id="how-it-works-page-title" className="text-3xl font-bold tracking-tight">
          {howItWorksPage.pageTitle}
        </h1>
        <p className="text-muted-foreground text-base">{howItWorksPage.pageDescription}</p>
      </header>

      <HowItWorksGuide />
    </section>
  );
}
