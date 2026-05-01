import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dataStorageGuide } from "@/features/help/messages";

type DataStorageGuideProps = {
  showQuickLinks?: boolean;
};

export function DataStorageGuide({ showQuickLinks = true }: DataStorageGuideProps): JSX.Element {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{dataStorageGuide.storageSection.title}</CardTitle>
          <CardDescription>{dataStorageGuide.storageSection.intro}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-foreground list-disc space-y-2 pl-5 text-sm">
            {dataStorageGuide.storageSection.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{dataStorageGuide.riskSection.title}</CardTitle>
          <CardDescription>{dataStorageGuide.riskSection.intro}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-foreground list-disc space-y-2 pl-5 text-sm">
            {dataStorageGuide.riskSection.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{dataStorageGuide.backupSection.title}</CardTitle>
          <CardDescription>{dataStorageGuide.backupSection.intro}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="text-foreground list-disc space-y-2 pl-5 text-sm">
            {dataStorageGuide.backupSection.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          {showQuickLinks ? (
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/encounters">{dataStorageGuide.backupSection.encountersLink}</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/import">{dataStorageGuide.backupSection.importLink}</Link>
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{dataStorageGuide.recommendationsSection.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-foreground list-disc space-y-2 pl-5 text-sm">
            {dataStorageGuide.recommendationsSection.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{dataStorageGuide.privacySection.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground text-sm">{dataStorageGuide.privacySection.intro}</p>
        </CardContent>
      </Card>
    </div>
  );
}
