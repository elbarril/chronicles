import { createBrowserRouter } from "react-router";

import { RootLayout } from "@/app/layout";
import { ChronicleDetailPage } from "@/features/chronicles/pages/ChronicleDetailPage";
import { ChronicleListPage } from "@/features/chronicles/pages/ChronicleListPage";
import { EncounterDetailPage } from "@/features/encounters/pages/EncounterDetailPage";
import { EncounterListPage } from "@/features/encounters/pages/EncounterListPage";
import { EncounterNewPage } from "@/features/encounters/pages/EncounterNewPage";
import { FieldFormPage } from "@/features/field-definitions/pages/FieldFormPage";
import { FieldListPage } from "@/features/field-definitions/pages/FieldListPage";
import { FormBuilderPage } from "@/features/forms/pages/FormBuilderPage";
import { FormListPage } from "@/features/forms/pages/FormListPage";
import { GroupFormPage } from "@/features/groups/pages/GroupFormPage";
import { GroupListPage } from "@/features/groups/pages/GroupListPage";
import { HomePage } from "@/features/home/HomePage";
import { NotFoundPage } from "@/features/home/NotFoundPage";
import { ImportPage } from "@/features/import/pages/ImportPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/fields",
        element: <FieldListPage />,
      },
      {
        path: "/fields/new",
        element: <FieldFormPage />,
      },
      {
        path: "/fields/:id/edit",
        element: <FieldFormPage />,
      },
      {
        path: "/forms",
        element: <FormListPage />,
      },
      {
        path: "/forms/new",
        element: <FormBuilderPage />,
      },
      {
        path: "/forms/:id/edit",
        element: <FormBuilderPage />,
      },
      {
        path: "/groups",
        element: <GroupListPage />,
      },
      {
        path: "/groups/new",
        element: <GroupFormPage />,
      },
      {
        path: "/groups/:id/edit",
        element: <GroupFormPage />,
      },
      {
        path: "/encounters",
        element: <EncounterListPage />,
      },
      {
        path: "/encounters/new",
        element: <EncounterNewPage />,
      },
      {
        path: "/encounters/:id",
        element: <EncounterDetailPage />,
      },
      {
        path: "/encounters/:id/observations/new",
        element: <EncounterDetailPage />,
      },
      {
        path: "/import",
        element: <ImportPage />,
      },
      {
        path: "/chronicles",
        element: <ChronicleListPage />,
      },
      {
        path: "/chronicles/:id",
        element: <ChronicleDetailPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
