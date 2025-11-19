import { NextRequest, NextResponse } from "next/server";
import { getChurchSlugFromHost, isValidChurchSlug } from "@/lib/database";

// Proxy function to handle multi-church routing and headers
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "localhost:3000";

  // Get church slug from the host
  const churchSlug = getChurchSlugFromHost(host);

  // For localhost development, use path-based or parameter-based routing
  if (host.startsWith("localhost") || host.startsWith("127.0.0.1")) {
    let selectedChurchSlug = "demo"; // default

    // Check multiple sources for church slug in priority order:
    const url = new URL(request.url);
    const churchParam = url.searchParams.get("church");
    const cookieChurchSlug = request.cookies.get("church-slug")?.value;
    const headerChurchSlug = request.headers.get("x-church-slug");

    // Priority: URL param > Header > Cookie > Default
    if (churchParam && isValidChurchSlug(churchParam)) {
      selectedChurchSlug = churchParam;
    } else if (headerChurchSlug && isValidChurchSlug(headerChurchSlug)) {
      selectedChurchSlug = headerChurchSlug;
    } else if (cookieChurchSlug && isValidChurchSlug(cookieChurchSlug)) {
      selectedChurchSlug = cookieChurchSlug;
    }

    // Create response with headers and cookies
    const response = NextResponse.next();
    response.headers.set("x-church-slug", selectedChurchSlug);

    // Update cookie if needed
    if (cookieChurchSlug !== selectedChurchSlug) {
      response.cookies.set("church-slug", selectedChurchSlug, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
    }

    return response;
  }

  // Validate church slug for production domains
  if (!isValidChurchSlug(churchSlug)) {
    return NextResponse.redirect(
      new URL("/error?code=invalid-church", request.url)
    );
  }

  // Set headers and cookies for valid church
  const response = NextResponse.next();
  response.headers.set("x-church-slug", churchSlug);
  response.cookies.set("church-slug", churchSlug, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return response;
}

// Optimized matcher configuration following Next.js best practices
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes that don't need church context
     */
    "/((?!_next/static|_next/image|favicon.ico|api/health).*)",
  ],
};
