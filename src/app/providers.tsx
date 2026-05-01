import { useEffect, type PropsWithChildren } from "react";

import { ThemeProvider } from "@/app/theme";
import { Toaster } from "@/components/ui/sonner";
import { seedDefaultsIfMissing } from "@/features/defaults/services/defaults-service";
import { db } from "@/infra/db/client";

export function Providers({ children }: PropsWithChildren): JSX.Element {
  useEffect(() => {
    db.open()
      .then(() => seedDefaultsIfMissing())
      .catch(() => undefined);
  }, []);

  return (
    <ThemeProvider>
      {children}
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
