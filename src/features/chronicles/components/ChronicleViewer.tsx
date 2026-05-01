import { Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChronicleGeneratedWith } from "@/domain/chronicle";
import { chronicleMessages } from "@/features/chronicles/lib/messages";

interface ChronicleViewerProps {
  body: string;
  generatedWith?: ChronicleGeneratedWith;
}

export function ChronicleViewer({ body, generatedWith }: ChronicleViewerProps): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{chronicleMessages.viewerTitle}</CardTitle>
          {generatedWith === "gemini" && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
              aria-label={chronicleMessages.generatedWithAiBadge}
            >
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              {chronicleMessages.generatedWithAiBadge}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <article className="bg-muted/20 rounded-md border p-4">
          <pre className="font-sans text-sm leading-6 whitespace-pre-wrap">{body}</pre>
        </article>
      </CardContent>
    </Card>
  );
}
