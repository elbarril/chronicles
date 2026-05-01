import { AiSetupGuide } from "@/features/help/components/AiSetupGuide";
import { ImportSection } from "@/features/import/components/ImportSection";
import { ApiKeyForm } from "@/features/settings/components/ApiKeyForm";
import { BrandColorPicker } from "@/features/settings/components/BrandColorPicker";
import { ExportSection } from "@/features/settings/components/ExportSection";
import { UserNameForm } from "@/features/settings/components/UserNameForm";
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

      <div className="space-y-4">
        <div>
          <h2 className="mb-1 text-xl font-semibold">{settingsMessages.appearanceSectionTitle}</h2>
          <p className="text-muted-foreground mb-4 text-sm">
            {settingsMessages.appearanceSectionDescription}
          </p>
          <BrandColorPicker />
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="mb-4">
          <h2 className="mb-1 text-xl font-semibold">{settingsMessages.userNameSectionTitle}</h2>
          <p className="text-muted-foreground text-sm">
            {settingsMessages.userNameSectionDescription}
          </p>
        </div>
        <UserNameForm />
      </div>

      <div className="border-t pt-6">
        <div className="mb-4">
          <h2 className="mb-1 text-xl font-semibold">{settingsMessages.exportSectionTitle}</h2>
          <p className="text-muted-foreground text-sm">
            {settingsMessages.exportSectionDescription}
          </p>
        </div>
        <ExportSection />
      </div>

      <div className="border-t pt-6">
        <div className="mb-4">
          <h2 className="mb-1 text-xl font-semibold">{settingsMessages.importSectionTitle}</h2>
          <p className="text-muted-foreground text-sm">
            {settingsMessages.importSectionDescription}
          </p>
        </div>
        <ImportSection />
      </div>

      <div className="border-t pt-6">
        <div className="mb-6">
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
