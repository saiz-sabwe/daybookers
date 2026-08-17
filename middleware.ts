import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_ORIGIN = "https://www.daybooker.online";
const IP_HOST = "109.199.110.106";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (!host.startsWith(IP_HOST)) {
    return NextResponse.next();
  }

  const destination = new URL(request.nextUrl.pathname + request.nextUrl.search, CANONICAL_ORIGIN);
  return NextResponse.redirect(destination, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
