import { Button } from "@/components/ui/button";
import { useDefaultsActions } from "@/features/defaults/hooks/use-defaults-actions";
import { useDemoEncounterStatus } from "@/features/defaults/hooks/use-demo-encounter-status";
import { defaultsMessages } from "@/features/defaults/lib/messages";

interface DemoEncounterButtonProps {
  /**
   * Optional callback fired after the demo content has been freshly
   * created. Most consumers use it to navigate to the encounter detail.
   * Has no effect when `removeOnly` is set since the create button is
   * never rendered.
   */
  onLoaded?: (encounterId: string) => void;
  /**
   * Optional callback fired after the demo content has been wiped.
   * Pages that show demo data (e.g. encounter detail) can use it to
   * navigate away.
   */
  onRemoved?: () => void;
  /**
   * When `true`, the component only renders the destructive twin and
   * stays hidden while no demo content is loaded. The "Cargar encuentro
   * de prueba" entry point lives exclusively in the home page; list
   * pages just need a way to clear demo content when it shows up there.
   */
  removeOnly?: boolean;
  className?: string;
}

/**
 * Toggle button that flips between "Cargar encuentro de prueba" and
 * "Eliminar contenido de prueba" based on the live presence of the
 * demo encounter. The state is reactive: clicking either action keeps
 * the rest of the page in sync without any manual refresh.
 *
 * Pages that should never invite users to create the demo (i.e. every
 * page other than the home) pass `removeOnly` so that the component
 * renders nothing while the demo is absent.
 */
export function DemoEncounterButton({
  onLoaded,
  onRemoved,
  removeOnly = false,
  className,
}: DemoEncounterButtonProps): JSX.Element | null {
  const { isLoaded, isLoading: isStatusLoading } = useDemoEncounterStatus();
  const actions = useDefaultsActions();

  if (isStatusLoading) {
    return null;
  }

  if (isLoaded) {
    return (
      <Button
        type="button"
        variant="outline"
        disabled={actions.isLoading}
        onClick={async () => {
          try {
            await actions.removeDemoEncounter();
            onRemoved?.();
          } catch {
            // Error already surfaced via toast inside the hook.
          }
        }}
        className={className}
      >
        {actions.isLoading
          ? defaultsMessages.removingDemoEncounter
          : defaultsMessages.removeDemoEncounter}
      </Button>
    );
  }

  if (removeOnly) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={actions.isLoading}
      onClick={async () => {
        try {
          const outcome = await actions.loadDemoEncounter();
          onLoaded?.(outcome.encounterId);
        } catch {
          // Error already surfaced via toast inside the hook.
        }
      }}
      className={className}
    >
      {actions.isLoading
        ? defaultsMessages.loadingDemoEncounter
        : defaultsMessages.loadDemoEncounter}
    </Button>
  );
}
