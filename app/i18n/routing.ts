import { defineRouting } from "next-intl/routing";

export const availableLanguages: Array<string> = ["en-US", "pt-BR", "es-AR"];
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: availableLanguages,

  // Used when no locale matches
  defaultLocale: availableLanguages[0],
});
