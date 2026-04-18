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
        path: "/campos",
        element: <FieldListPage />,
      },
      {
        path: "/campos/nuevo",
        element: <FieldFormPage />,
      },
      {
        path: "/campos/:id/editar",
        element: <FieldFormPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
