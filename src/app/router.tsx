import { createBrowserRouter } from "react-router";

import { RootLayout } from "@/app/layout";
import { FieldFormPage } from "@/features/field-definitions/pages/FieldFormPage";
import { FieldListPage } from "@/features/field-definitions/pages/FieldListPage";
import { HomePage } from "@/features/home/HomePage";
import { NotFoundPage } from "@/features/home/NotFoundPage";

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
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
