import { Toaster } from "@/components/ui/sonner";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import {
  Outlet,
  createRootRoute,
  createRoute,
  redirect,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import LandingPage from "./pages/LandingPage";
import LearnerDashboard from "./pages/LearnerDashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TeacherDashboard from "./pages/TeacherDashboard";

// Dark mode init from localStorage
function initDarkMode() {
  const saved = localStorage.getItem("aikya-dark-mode");
  if (
    saved === "true" ||
    (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}
initDarkMode();

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const teacherDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/teacher",
  component: TeacherDashboard,
});

const learnerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/learner",
  component: LearnerDashboard,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  teacherDashboardRoute,
  learnerDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}
