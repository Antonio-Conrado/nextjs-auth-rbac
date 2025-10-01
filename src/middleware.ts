import { NextRequest, NextResponse } from "next/server";
import { getTokens } from "./lib/const/cookies";

const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/confirm-account",
  "/not-found",
];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  const { accessToken } = await getTokens();

  if (!publicRoutes.includes(path) && !accessToken) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
