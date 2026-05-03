import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { chronicleMessages } from "@/features/chronicles/lib/messages";
import { type ChronicleListItem } from "@/features/chronicles/services/chronicle-service";

interface ChronicleListTableProps {
  chronicles: ChronicleListItem[];
}

function formatDate(value: string): string {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function ChronicleActions({ id }: { id: string }): JSX.Element {
  return (
    <Button asChild size="sm" variant="outline">
      <Link to={`/chronicles/${id}`}>Ver crónica</Link>
    </Button>
  );
}

export function ChronicleListTable({ chronicles }: ChronicleListTableProps): JSX.Element {
  return (
    <>
      {/* Mobile / tablet: cards */}
      <ul className="grid gap-3 lg:hidden" aria-label="Listado de crónicas">
        {chronicles.map((item) => (
          <li key={item.chronicle.id} className="bg-muted/40 space-y-3 rounded-2xl p-4">
            <div className="space-y-1">
              <p className="text-base font-semibold">
                <Link
                  to={`/chronicles/${item.chronicle.id}`}
                  className="hover:underline focus-visible:underline focus-visible:outline-none"
                >
                  {item.chronicle.title}
                </Link>
              </p>
              <p className="text-muted-foreground text-xs">
                {chronicleMessages.generatedAtLabel}: {formatDate(item.chronicle.generatedAt)}
              </p>
            </div>
            <dl className="space-y-1 text-sm">
              <div className="flex gap-2">
                <dt className="text-muted-foreground">{chronicleMessages.encounterLabel}:</dt>
                <dd>{item.encounter?.name ?? "No disponible"}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-2 pt-1">
              <ChronicleActions id={item.chronicle.id} />
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">Listado de crónicas</caption>
          <thead>
            <tr className="text-muted-foreground text-xs tracking-wide uppercase">
              <th className="px-3 py-2 text-left font-medium">Título</th>
              <th className="px-3 py-2 text-left font-medium">
                {chronicleMessages.encounterLabel}
              </th>
              <th className="px-3 py-2 text-left font-medium">
                {chronicleMessages.generatedAtLabel}
              </th>
              <th className="px-3 py-2 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {chronicles.map((item) => (
              <tr key={item.chronicle.id} className="border-border/60 border-t">
                <td className="px-3 py-3 align-middle font-medium">
                  <Link
                    to={`/chronicles/${item.chronicle.id}`}
                    className="hover:underline focus-visible:underline focus-visible:outline-none"
                  >
                    {item.chronicle.title}
                  </Link>
                </td>
                <td className="px-3 py-3 align-middle">
                  {item.encounter?.name ?? "No disponible"}
                </td>
                <td className="text-muted-foreground px-3 py-3 align-middle">
                  {formatDate(item.chronicle.generatedAt)}
                </td>
                <td className="px-3 py-3 align-middle">
                  <div className="flex justify-end gap-2">
                    <ChronicleActions id={item.chronicle.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
