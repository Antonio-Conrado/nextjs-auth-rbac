import { LOCALE } from "@/lib/const/environments";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const supportedLocales = ["es", "en"];

  // If the environment variable is not valid, fallback to "es"
  const locale = supportedLocales.includes(
    LOCALE || ""
  )
    ? LOCALE
    : "es";

  // Import translation files dynamically based on the selected locale
  const ui = (await import(`../locales/${locale}/ui.json`)).default;
  const auth = (await import(`../locales/${locale}/auth.json`)).default;
  const validation = (await import(`../locales/${locale}/validation.json`))
    .default;
  const api = (await import(`../locales/${locale}/api.json`)).default;

  // Return the configuration object expected by next-intl
  return {
    locale,
    messages: {
      ui,
      auth,
      validation,
      api,
    },
  };
});
