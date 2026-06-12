import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, lazy: () => import("./pages/Home") },
      { path: "setup", lazy: () => import("./pages/Setup") },
      { path: "game", lazy: () => import("./pages/Game") },
      { path: "ending", lazy: () => import("./pages/Ending") },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
