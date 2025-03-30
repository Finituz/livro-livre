import { defineRouting } from "next-intl/routing";

export const availableLanguages: Array<string> = ["en", "br"];
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: availableLanguages,

  // Used when no locale matches
  defaultLocale: availableLanguages[0],
});
