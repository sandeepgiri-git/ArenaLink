import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/profile", "/matches", "/settings"];
const authRoutes = ["/login", "/signup"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check for the auth session cookie
  const sessionCookie =
    req.cookies.get("authjs.session-token") ||
    req.cookies.get("__Secure-authjs.session-token");

  const isLoggedIn = !!sessionCookie;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route)) || pathname === "/";

  const botUserAgents = [
    "facebookexternalhit",
    "twitterbot",
    "whatsapp",
    "linkedinbot",
    "skypeuripreview",
    "telegrambot",
    "discordbot"
  ];
  const userAgent = req.headers.get("user-agent")?.toLowerCase() || "";
  const isBot = botUserAgents.some((bot) => userAgent.includes(bot));

  if (isProtectedRoute && !isLoggedIn) {
    if (isBot && pathname.startsWith("/matches/")) {
      return NextResponse.next();
    }
    
    // EDGE SAFE REDIRECT
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && isLoggedIn) {
    // EDGE SAFE REDIRECT
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    // Clear any search params to avoid forwarding query strings incorrectly
    url.searchParams.forEach((_, key) => url.searchParams.delete(key));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/profile/:path*",
    "/matches/:path*",
    "/settings/:path*",
    "/login",
    "/signup"
  ],
};
