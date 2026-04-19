import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { chronicleMessages } from "@/features/chronicles/lib/messages";

interface ChronicleViewerProps {
  body: string;
}

export function ChronicleViewer({ body }: ChronicleViewerProps): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{chronicleMessages.viewerTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <article className="bg-muted/20 rounded-md border p-4">
          <pre className="font-sans text-sm leading-6 whitespace-pre-wrap">{body}</pre>
        </article>
      </CardContent>
    </Card>
  );
}
