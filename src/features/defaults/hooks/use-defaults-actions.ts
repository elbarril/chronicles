import { useState } from "react";
import { toast } from "sonner";

import { defaultsMessages } from "@/features/defaults/lib/messages";
import {
  type DemoEncounterOutcome,
  type DemoEncounterRemovalOutcome,
  removeDemoEncounter,
  restoreAllDefaultForms,
  restoreDefaultFields,
  restoreDefaultForm,
  seedDemoEncounter,
} from "@/features/defaults/services/defaults-service";

export function useDefaultsActions() {
  const [isLoading, setIsLoading] = useState(false);

  async function restoreFields() {
    setIsLoading(true);

    try {
      const outcome = await restoreDefaultFields();
      const changed = outcome.created + outcome.restored;

      toast.success(
        changed > 0 ? defaultsMessages.fieldsRestored : defaultsMessages.fieldsAlreadyActive,
      );
    } catch (error) {
      toast.error(defaultsMessages.fieldsRestoreError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function restoreForm() {
    setIsLoading(true);

    try {
      const outcome = await restoreDefaultForm();
      const formChanged = outcome.created + outcome.restored;
      const fieldsChanged = outcome.fields.created + outcome.fields.restored;

      toast.success(
        formChanged + fieldsChanged > 0
          ? defaultsMessages.formRestored
          : defaultsMessages.formAlreadyActive,
      );
    } catch (error) {
      toast.error(defaultsMessages.formRestoreError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function restoreAllForms() {
    setIsLoading(true);

    try {
      const outcome = await restoreAllDefaultForms();
      const formChanged = outcome.created + outcome.restored;
      const fieldsChanged = outcome.fields.created + outcome.fields.restored;

      toast.success(
        formChanged + fieldsChanged > 0
          ? defaultsMessages.allFormsRestored
          : defaultsMessages.allFormsAlreadyActive,
      );
    } catch (error) {
      toast.error(defaultsMessages.allFormsRestoreError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function loadDemoEncounter(): Promise<DemoEncounterOutcome> {
    setIsLoading(true);

    try {
      const outcome = await seedDemoEncounter();

      toast.success(
        outcome.created
          ? defaultsMessages.demoEncounterCreated
          : defaultsMessages.demoEncounterAlreadyExists,
      );

      return outcome;
    } catch (error) {
      toast.error(defaultsMessages.demoEncounterError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteDemoEncounter(): Promise<DemoEncounterRemovalOutcome> {
    setIsLoading(true);

    try {
      const outcome = await removeDemoEncounter();

      toast.success(
        outcome.removed
          ? defaultsMessages.demoEncounterRemoved
          : defaultsMessages.demoEncounterAlreadyEmpty,
      );

      return outcome;
    } catch (error) {
      toast.error(defaultsMessages.demoEncounterRemoveError);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    restoreFields,
    restoreForm,
    restoreAllForms,
    loadDemoEncounter,
    removeDemoEncounter: deleteDemoEncounter,
  };
}
