import { LOCALE } from "@/lib/const/environments";

export function formatDate(isoString: string): string {
  const date = new Date(isoString);

  const LOCALE_STRING = LOCALE === "en" ? "en-US" : "es-ES";
  const formatter = new Intl.DateTimeFormat(LOCALE_STRING, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return formatter.format(date);
}

export function getYear(isoString: string): string {
  const date = new Date(isoString);

  const LOCALE_STRING = LOCALE === "en" ? "en-US" : "es-ES";
  const formatter = new Intl.DateTimeFormat(LOCALE_STRING, {
    year: "numeric",
    timeZone: "UTC",
  });
  return formatter.format(date);
}

export function getMonth(isoString: string): string {
  const date = new Date(isoString);

  const LOCALE_STRING = LOCALE === "en" ? "en-US" : "es-ES";
  const formatter = new Intl.DateTimeFormat(LOCALE_STRING, {
    month: "short",
    timeZone: "UTC",
  });
  return formatter.format(date);
}

export function getDay(isoString: string): string {
  const date = new Date(isoString);

  const LOCALE_STRING = LOCALE === "en" ? "en-US" : "es-ES";
  const formatter = new Intl.DateTimeFormat(LOCALE_STRING, {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
  return formatter.format(date);
}
