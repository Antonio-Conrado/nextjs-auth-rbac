export const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/confirm-account",
  "/not-found",
  "/reset-password",
];

export const isPublicRoute = (pathname: string) =>
  publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
