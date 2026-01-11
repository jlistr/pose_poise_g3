import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  
  // Allow localhost for dev
  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname.replace(`.yourdomain.com`, "") // TODO: Set this when deploying
      : hostname.replace(`.localhost:3000`, ""); // Dev

  // If there's a subdomain (and it's not the main domain/localhost itself)
  // For dev: if hostname is "foo.localhost:3000", currentHost is "foo".
  // If hostname is "localhost:3000", currentHost is "localhost:3000".
  // Let's refine the logic to detect subdomain.
  
  const isDev = process.env.NODE_ENV === "development";
  const mainDomain = isDev ? "localhost:3000" : "poseandpoise.studio"; // Fallback/Goal

  // If visiting the root domain, let it pass to normal routing
  if (hostname === mainDomain || hostname === 'localhost:3000') {
      return NextResponse.next();
  }

  // Extract subdomain
  // e.g. jbananadancer.localhost:3000 -> subdomain: jbananadancer
  const subdomain = hostname.split('.')[0];

  // If it's a subdomain, rewrite to public_preview
  if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
      console.log(`Rewriting subdomain ${subdomain} to /public_preview`);
      // Rewrite the URL to the public preview page, passing the subdomain as username
      url.pathname = `/public_preview`;
      url.searchParams.set("username", subdomain);
      return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
