import { createBrowserRouter } from "react-router";

import { RootLayout } from "@/app/layout";
import { ChronicleDetailPage } from "@/features/chronicles/pages/ChronicleDetailPage";
import { ChronicleListPage } from "@/features/chronicles/pages/ChronicleListPage";
import { EncounterChroniclePage } from "@/features/chronicles/pages/EncounterChroniclePage";
import { EncounterDetailPage } from "@/features/encounters/pages/EncounterDetailPage";
import { EncounterEditPage } from "@/features/encounters/pages/EncounterEditPage";
import { EncounterNewPage } from "@/features/encounters/pages/EncounterNewPage";
import { FormBuilderPage } from "@/features/forms/pages/FormBuilderPage";
import { FormListPage } from "@/features/forms/pages/FormListPage";
import { HelpPage } from "@/features/help/HelpPage";
import { HomePage } from "@/features/home/HomePage";
import { NotFoundPage } from "@/features/home/NotFoundPage";
import { SupportPage } from "@/features/home/SupportPage";
import { ProjectDetailPage } from "@/features/projects/pages/ProjectDetailPage";
import { ProjectFormPage } from "@/features/projects/pages/ProjectFormPage";
import { ProjectListPage } from "@/features/projects/pages/ProjectListPage";
import { SettingsPage } from "@/features/settings/pages/SettingsPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
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
        path: "/projects",
        element: <ProjectListPage />,
      },
      {
        path: "/projects/new",
        element: <ProjectFormPage />,
      },
      {
        path: "/projects/:id",
        element: <ProjectDetailPage />,
      },
      {
        path: "/projects/:id/edit",
        element: <ProjectFormPage />,
      },
      {
        path: "/projects/:projectId/encounters/new",
        element: <EncounterNewPage />,
      },
      {
        path: "/encounters/:id",
        element: <EncounterDetailPage />,
      },
      {
        path: "/encounters/:id/edit",
        element: <EncounterEditPage />,
      },
      {
        path: "/encounters/:id/observations/new",
        element: <EncounterDetailPage />,
      },
      {
        path: "/encounters/:id/chronicle",
        element: <EncounterChroniclePage />,
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
        path: "/settings",
        element: <SettingsPage />,
      },
      {
        path: "/help",
        element: <HelpPage />,
      },
      {
        path: "/support",
        element: <SupportPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
