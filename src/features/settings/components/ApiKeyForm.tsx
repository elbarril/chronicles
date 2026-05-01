import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { settingsMessages } from "@/features/settings/lib/messages";

export function ApiKeyForm(): JSX.Element {
  const { hasKey, saveKey, clearKey } = useSettings();
  const [inputValue, setInputValue] = useState("");
  const [showKey, setShowKey] = useState(false);

  function handleSave() {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      toast.error(settingsMessages.saveError);
      return;
    }
    saveKey(trimmed);
    setInputValue("");
    toast.success(settingsMessages.saveSuccess);
  }

  function handleClear() {
    clearKey();
    setInputValue("");
    toast.success(settingsMessages.clearSuccess);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            hasKey
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-muted text-muted-foreground"
          }`}
          aria-live="polite"
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${hasKey ? "bg-green-500" : "bg-gray-400"}`}
            aria-hidden="true"
          />
          {hasKey ? settingsMessages.apiKeyConfigured : settingsMessages.apiKeyNotConfigured}
        </span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gemini-api-key">{settingsMessages.apiKeyLabel}</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="gemini-api-key"
              type={showKey ? "text" : "password"}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={settingsMessages.apiKeyPlaceholder}
              className="pr-10"
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 p-1"
              aria-label={showKey ? settingsMessages.hideKey : settingsMessages.showKey}
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <Button type="button" onClick={handleSave} disabled={!inputValue.trim()}>
            {settingsMessages.saveButton}
          </Button>
        </div>
      </div>

      {hasKey && (
        <Button type="button" variant="outline" size="sm" onClick={handleClear}>
          {settingsMessages.clearButton}
        </Button>
      )}
    </div>
  );
}
