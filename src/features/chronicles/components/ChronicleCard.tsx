import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { chronicleMessages } from "@/features/chronicles/lib/messages";
import { type ChronicleListItem } from "@/features/chronicles/services/chronicle-service";

interface ChronicleCardProps {
  item: ChronicleListItem;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function ChronicleCard({ item }: ChronicleCardProps): JSX.Element {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg">{item.chronicle.title}</CardTitle>
        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
          <span className="bg-muted rounded-full px-2 py-0.5 font-medium">
            {chronicleMessages.generatedAtLabel}
          </span>
          <span>{formatDate(item.chronicle.generatedAt)}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <span className="text-muted-foreground">{chronicleMessages.encounterLabel}: </span>
          <span>{item.encounter?.activity ?? "No disponible"}</span>
        </p>
      </CardContent>
      <CardContent>
        <Button asChild variant="outline" size="sm">
          <Link to={`/chronicles/${item.chronicle.id}`}>Ver crónica</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
