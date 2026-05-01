import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserName } from "@/features/settings/hooks/use-user-name";
import { settingsMessages } from "@/features/settings/lib/messages";

export function UserNameForm(): JSX.Element {
  const { userName, saveName, detectDefault } = useUserName();
  // The form seeds itself once from the stored or detected name. We do
  // not sync subsequent external changes — the user is editing the value
  // here, and any other caller that updates the name will be visible on
  // their next visit to the page.
  const [inputValue, setInputValue] = useState<string>(() => userName ?? detectDefault());

  function handleSave() {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      toast.error(settingsMessages.userNameSaveError);
      return;
    }
    saveName(trimmed);
    toast.success(settingsMessages.userNameSaveSuccess);
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="chronicle-user-name">{settingsMessages.userNameLabel}</Label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="chronicle-user-name"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder={settingsMessages.userNamePlaceholder}
          autoComplete="off"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSave();
            }
          }}
        />
        <Button type="button" onClick={handleSave} disabled={!inputValue.trim()}>
          {settingsMessages.userNameSaveButton}
        </Button>
      </div>
    </div>
  );
}
