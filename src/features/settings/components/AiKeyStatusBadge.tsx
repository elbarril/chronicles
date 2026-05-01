import { Settings, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { settingsMessages } from "@/features/settings/lib/messages";
import { hasGeminiApiKey } from "@/features/settings/services/settings-service";

export function AiKeyStatusBadge(): JSX.Element {
  const [isConfigured] = useState(() => hasGeminiApiKey());

  if (isConfigured) {
    return (
      <Link
        to="/settings"
        className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700 hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-800/40"
        aria-label={settingsMessages.aiStatusActiveAriaLabel}
      >
        <Sparkles className="h-3 w-3" aria-hidden="true" />
        {settingsMessages.aiStatusActive}
      </Link>
    );
  }

  return (
    <Link
      to="/settings"
      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs"
      aria-label={settingsMessages.aiStatusConfigureAriaLabel}
    >
      <Settings className="h-3 w-3" aria-hidden="true" />
      {settingsMessages.aiStatusConfigure}
    </Link>
  );
}
