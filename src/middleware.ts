import { NextRequest, NextResponse } from "next/server";
import { getTokens } from "./lib/const/cookies";
import { isPublicRoute } from "./lib/routes";

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const { accessToken } = await getTokens();
  if (!isPublicRoute(path) && !accessToken) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute(path) && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|\\.well-known/).*)"],
};
