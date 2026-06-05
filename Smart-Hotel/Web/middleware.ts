import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["es", "fr", "en"],
  defaultLocale: "fr",
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};