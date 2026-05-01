import { AiSetupGuide } from "@/features/help/components/AiSetupGuide";
import { ApiKeyForm } from "@/features/settings/components/ApiKeyForm";
import { settingsMessages } from "@/features/settings/lib/messages";

export function SettingsPage(): JSX.Element {
  return (
    <section className="space-y-8" aria-labelledby="settings-title">
      <div>
        <h1 id="settings-title" className="text-3xl font-bold tracking-tight">
          {settingsMessages.pageTitle}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">{settingsMessages.pageDescription}</p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="mb-1 text-xl font-semibold">{settingsMessages.aiSectionTitle}</h2>
        </div>

        <AiSetupGuide showCta={false} />

        <div className="border-t pt-6">
          <ApiKeyForm />
        </div>
      </div>
    </section>
  );
}
