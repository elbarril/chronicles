import { useSearchParams } from "react-router";

import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { AiSetupGuide } from "@/features/help/components/AiSetupGuide";
import { DataStorageGuide } from "@/features/help/components/DataStorageGuide";
import { HowItWorksGuide } from "@/features/help/components/HowItWorksGuide";
import { helpPage } from "@/features/help/messages";

const TABS = ["funcionamientos", "datos", "ia"] as const;
type HelpTab = (typeof TABS)[number];

function parseTab(value: string | null): HelpTab {
  return TABS.includes(value as HelpTab) ? (value as HelpTab) : "funcionamientos";
}

export function HelpPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = parseTab(searchParams.get("tab"));

  function selectTab(tab: HelpTab) {
    setSearchParams(tab === "funcionamientos" ? {} : { tab });
  }

  return (
    <section className="space-y-6" aria-labelledby="help-page-title">
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: helpPage.pageTitle }]} />

      <header className="space-y-2">
        <h1 id="help-page-title" className="text-3xl font-bold tracking-tight">
          {helpPage.pageTitle}
        </h1>
        <p className="text-muted-foreground text-base">{helpPage.pageDescription}</p>
      </header>

      <div className="flex gap-2" role="tablist" aria-label={helpPage.tabsAriaLabel}>
        {TABS.map((tab) => (
          <Button
            key={tab}
            type="button"
            variant={activeTab === tab ? "tab-active" : "outline"}
            onClick={() => selectTab(tab)}
            role="tab"
            aria-selected={activeTab === tab}
          >
            {helpPage.tabs[tab]}
          </Button>
        ))}
      </div>

      {activeTab === "funcionamientos" ? <HowItWorksGuide showNextStep={false} /> : null}
      {activeTab === "datos" ? <DataStorageGuide /> : null}
      {activeTab === "ia" ? <AiSetupGuide /> : null}
    </section>
  );
}
