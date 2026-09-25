import NextAuth from "next-auth";
import { NextResponse, type NextRequest } from "next/server";
import { authConfig } from "@/lib/auth.config";
const { auth } = NextAuth(authConfig);
const guard = auth((request) => {
  if (!request.auth?.user?.id || "error" in request.auth)
    return NextResponse.redirect(new URL("/admin/login", request.url));
  return NextResponse.next();
});
export default function middleware(
  request: NextRequest,
  event: Parameters<typeof guard>[1],
) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();
  if (!process.env.AUTH_SECRET)
    return NextResponse.redirect(new URL("/admin/login", request.url));
  return guard(request, event);
}
export const config = { matcher: ["/admin/:path*"], runtime: "nodejs" };
