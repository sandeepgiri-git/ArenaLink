import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/profile", "/matches", "/settings"];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/login", "/signup"];

export function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;

    // Check for the auth session cookie (Auth.js v5 uses this cookie name)
    const sessionCookie =
      req.cookies.get("authjs.session-token") ||
      req.cookies.get("__Secure-authjs.session-token");

    const isLoggedIn = !!sessionCookie;

    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route)) || pathname === "/";

    // Known social media scraper user agents
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
    const isBot = botUserAgents.some(bot => userAgent.includes(bot));

    // If it's a protected route and not logged in
    if (isProtectedRoute && !isLoggedIn) {
      // BYPASS: If a bot is trying to access a match page for Open Graph tags, allow it
      if (isBot && pathname.startsWith("/matches/")) {
        return NextResponse.next();
      }

      // Use req.nextUrl instead of req.url to prevent Invalid URL crashes on Vercel Edge
      const loginUrl = new URL("/login", req.nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users from auth routes to dashboard
    if (isAuthRoute && isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware crash:", error);
    // If middleware crashes, let the request proceed rather than throwing a 500 error
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
