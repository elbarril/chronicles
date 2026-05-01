import { useTheme, type BrandColor } from "@/app/theme";
import { settingsMessages } from "@/features/settings/lib/messages";
import { cn } from "@/lib/utils";

type BrandOption = {
  value: BrandColor;
  label: string;
  description: string;
  color: string;
};

const brandOptions: BrandOption[] = [
  {
    value: "amber",
    label: settingsMessages.brandAmber,
    description: settingsMessages.brandAmberDescription,
    color: "oklch(0.52 0.18 68)",
  },
  {
    value: "indigo",
    label: settingsMessages.brandIndigo,
    description: settingsMessages.brandIndigoDescription,
    color: "oklch(0.48 0.22 272)",
  },
  {
    value: "forest",
    label: settingsMessages.brandForest,
    description: settingsMessages.brandForestDescription,
    color: "oklch(0.44 0.12 155)",
  },
];

export function BrandColorPicker(): JSX.Element {
  const { brandColor, setBrandColor } = useTheme();

  return (
    <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Color de acento">
      {brandOptions.map((opt) => {
        const isSelected = brandColor === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${opt.label} — ${opt.description}`}
            onClick={() => setBrandColor(opt.value)}
            className={cn(
              "flex items-center gap-2.5 rounded-full px-4 py-2 text-sm font-medium",
              "focus-visible:ring-ring border transition-all focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
              isSelected
                ? "border-foreground/25 bg-foreground/5 text-foreground shadow-sm"
                : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "ring-offset-background h-4 w-4 flex-shrink-0 rounded-full transition-all",
                isSelected
                  ? "ring-primary ring-2 ring-offset-2"
                  : "ring-1 ring-black/10 dark:ring-white/10",
              )}
              style={{ backgroundColor: opt.color }}
            />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
