import type { Trio } from "./catalogDocument";
import type { Locale } from "./i18n/messages";

export type SiteContact = {
  id: string;
  kind: "phone" | "email";
  value: string;
  name?: string;
};

export type SiteDocument = {
  aboutTitle: Trio;
  aboutBody: Trio;
  contacts: SiteContact[];
};

export type PresentedSite = {
  aboutTitle: string;
  aboutParagraphs: string[];
  contacts: SiteContact[];
};

function trio(en: string, pt: string, fr: string): Trio {
  return { en, pt, fr };
}

function pick(value: Trio, locale: Locale): string {
  const chosen = value[locale]?.trim();
  return chosen || value.en;
}

export function builtinSite(): SiteDocument {
  return {
    aboutTitle: trio("About us", "Sobre nós", "À propos"),
    aboutBody: trio(
      "We arrange private days along the Algarve coast: the water, the horses, the table, and the hour of light you prefer.\n\nTell us who is coming. We look after the timing, the hosts, and the details, and we confirm the day before you travel.",
      "Organizamos dias privados ao longo da costa do Algarve: o mar, os cavalos, a mesa e a hora de luz que prefere.\n\nDiga-nos quem vem. Tratamos dos horários, dos anfitriões e dos pormenores, e confirmamos o dia antes de viajar.",
      "Nous organisons des journées privées le long de la côte de l’Algarve : la mer, les chevaux, la table, et l’heure de lumière que vous préférez.\n\nDites-nous qui vient. Nous veillons aux horaires, aux hôtes et aux détails, et nous confirmons la journée avant votre départ.",
    ),
    contacts: [
      { id: "phone-one", kind: "phone", value: "+351967403120", name: "" },
      { id: "phone-two", kind: "phone", value: "+351910527541", name: "" },
      { id: "email", kind: "email", value: "hi@discoverthebestofthealgarve.com" },
    ],
  };
}

export function presentSite(document: SiteDocument, locale: Locale): PresentedSite {
  const body = pick(document.aboutBody, locale);
  const aboutParagraphs = body
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  return {
    aboutTitle: pick(document.aboutTitle, locale),
    aboutParagraphs,
    contacts: document.contacts,
  };
}

export function phoneHref(value: string): string {
  const digits = value.replace(/\D/g, "");
  return `tel:+${digits}`;
}

export function whatsappHref(value: string): string {
  return `whatsapp://send?phone=${value.replace(/\D/g, "")}`;
}

export function launchContact(url: string) {
  const link = document.createElement("a");
  link.href = url;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
