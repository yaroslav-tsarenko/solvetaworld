import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// In Next.js 16 this file convention is `proxy` (formerly `middleware`). It runs
// before every matched request and is what makes locale routing coherent:
//   - `/` redirects to the visitor's locale (cookie → Accept-Language → default)
//   - a locale-less path like `/catalog` is redirected to `/en/catalog`
//   - the active locale is persisted in the NEXT_LOCALE cookie
// Without it, next-intl's navigation helpers cannot strip the locale segment,
// which is what produced doubled prefixes like `/fr/en`.
export default createMiddleware(routing);

export const config = {
  // Run on everything except API routes, Next internals, and files with an
  // extension (images, fonts, etc.).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
