import { DataStorageGuide } from "@/features/help/components/DataStorageGuide";
import { dataStoragePage } from "@/features/help/messages";

export function HelpPage(): JSX.Element {
  return (
    <section className="space-y-6" aria-labelledby="help-page-title">
      <header className="space-y-2">
        <h1 id="help-page-title" className="text-3xl font-bold tracking-tight">
          {dataStoragePage.pageTitle}
        </h1>
        <p className="text-muted-foreground text-base">{dataStoragePage.pageDescription}</p>
      </header>

      <DataStorageGuide />
    </section>
  );
}
