import { categories as sourceCategories, PERIODS, type Activity, type Category, type TimeRange } from "./data/catalog";
import { catalogCopy } from "./i18n/catalogCopy";
import type { Locale } from "./i18n/messages";

export type Trio = { en: string; pt: string; fr: string };
export type TrioList = { en: string[]; pt: string[]; fr: string[] };

export type StoredPeriod = {
  id: string;
  label: Trio;
  start: string;
  end: string;
};

export type StoredActivity = {
  id: string;
  title: Trio;
  blurb: Trio;
  image: string;
  imageAlt: Trio;
  videoId: string;
  videoUrl: string;
  videoTitle: string;
  startAt: number | null;
  duration: Trio;
  suggested: TimeRange;
  offers: TrioList;
  price: number | null;
};

export type StoredCategory = {
  id: string;
  title: Trio;
  kicker: Trio;
  tone: string;
  points: TrioList;
  activities: StoredActivity[];
};

export type CatalogDocument = {
  periods: StoredPeriod[];
  categories: StoredCategory[];
};

export const TONES = ["sea", "olive", "land", "wine", "walk", "balloon", "horse", "ink", "navy"] as const;

function trio(en: string, pt?: string, fr?: string): Trio {
  return { en, pt: pt?.trim() ? pt : en, fr: fr?.trim() ? fr : en };
}

function lines(en?: string[], pt?: string[], fr?: string[]): TrioList {
  const base = en ?? [];
  return {
    en: base,
    pt: pt && pt.length > 0 ? pt : [...base],
    fr: fr && fr.length > 0 ? fr : [...base],
  };
}

function pick(value: Trio, locale: Locale): string {
  const chosen = value[locale]?.trim();
  return chosen || value.en;
}

function pickList(value: TrioList, locale: Locale): string[] {
  const chosen = value[locale]?.map((item) => item.trim()).filter(Boolean) ?? [];
  if (chosen.length > 0) return chosen;
  return value.en.map((item) => item.trim()).filter(Boolean);
}

export function builtinCatalog(): CatalogDocument {
  const pt = catalogCopy.pt;
  const fr = catalogCopy.fr;
  return {
    periods: PERIODS.map((period) => ({
      id: period.id,
      label: trio(period.label, pt.periods[period.id], fr.periods[period.id]),
      start: period.start,
      end: period.end,
    })),
    categories: sourceCategories.map((category) => ({
      id: category.id,
      title: trio(category.title, pt.categories[category.id]?.title, fr.categories[category.id]?.title),
      kicker: trio(category.kicker, pt.categories[category.id]?.kicker, fr.categories[category.id]?.kicker),
      tone: category.tone,
      points: lines(category.points, pt.categories[category.id]?.points, fr.categories[category.id]?.points),
      activities: category.activities.map((activity) => ({
        id: activity.id,
        title: trio(activity.title, pt.activities[activity.id]?.title, fr.activities[activity.id]?.title),
        blurb: trio(activity.blurb, pt.activities[activity.id]?.blurb, fr.activities[activity.id]?.blurb),
        image: activity.image,
        imageAlt: trio(activity.imageAlt, pt.activities[activity.id]?.imageAlt, fr.activities[activity.id]?.imageAlt),
        videoId: activity.videoId,
        videoUrl: activity.videoUrl ?? "",
        videoTitle: activity.videoTitle,
        startAt: activity.startAt ?? null,
        duration: trio(activity.duration, pt.activities[activity.id]?.duration, fr.activities[activity.id]?.duration),
        suggested: { ...activity.suggested },
        offers: lines(activity.offers, pt.activities[activity.id]?.offers, fr.activities[activity.id]?.offers),
        price: activity.price ?? null,
      })),
    })),
  };
}

export function presentCatalog(document: CatalogDocument, locale: Locale): {
  categories: Category[];
  periods: { id: string; label: string; start: string; end: string }[];
} {
  return {
    periods: document.periods.map((period) => ({
      id: period.id,
      label: pick(period.label, locale),
      start: period.start,
      end: period.end,
    })),
    categories: document.categories.map((category) => ({
      id: category.id,
      title: pick(category.title, locale),
      kicker: pick(category.kicker, locale),
      tone: category.tone,
      points: pickList(category.points, locale).length > 0 ? pickList(category.points, locale) : undefined,
      activities: category.activities.map((activity) => {
        const offers = pickList(activity.offers, locale);
        const projected: Activity = {
          id: activity.id,
          title: pick(activity.title, locale),
          blurb: pick(activity.blurb, locale),
          image: activity.image,
          imageAlt: pick(activity.imageAlt, locale),
          videoId: activity.videoId,
          videoUrl: activity.videoUrl || undefined,
          videoTitle: activity.videoTitle,
          startAt: activity.startAt ?? undefined,
          duration: pick(activity.duration, locale),
          suggested: activity.suggested,
          offers: offers.length > 0 ? offers : undefined,
          price: activity.price,
        };
        return projected;
      }),
    })),
  };
}

export function formatPrice(price: number | null | undefined, dateLocale: string): string {
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) return "";
  return new Intl.NumberFormat(dateLocale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function filmLink(activity: Pick<StoredActivity, "videoId" | "videoUrl">): string {
  if (activity.videoUrl) return activity.videoUrl;
  if (activity.videoId) return `https://www.youtube.com/watch?v=${activity.videoId}`;
  return "";
}

export function readFilmLink(raw: string): { videoId: string; videoUrl: string; startAt: number | null } {
  const value = raw.trim();
  if (!value) return { videoId: "", videoUrl: "", startAt: null };
  let url: URL | null = null;
  try {
    url = new URL(value);
  } catch {
    url = null;
  }
  if (url && (url.hostname === "youtu.be" || url.hostname.endsWith("youtube.com") || url.hostname.endsWith("youtube-nocookie.com"))) {
    const fromPath = url.hostname === "youtu.be" ? url.pathname.slice(1) : "";
    const fromQuery = url.searchParams.get("v") ?? "";
    const fromEmbed = url.pathname.startsWith("/embed/") ? url.pathname.slice("/embed/".length) : "";
    const id = (fromQuery || fromPath || fromEmbed).split(/[?&/]/)[0] ?? "";
    const stamp = url.searchParams.get("t") ?? url.searchParams.get("start") ?? "";
    const startAt = /^\d+$/.test(stamp) ? Number(stamp) : null;
    return { videoId: id, videoUrl: "", startAt };
  }
  if (url && url.hostname.endsWith("facebook.com")) return { videoId: "", videoUrl: value, startAt: null };
  if (/^[\w-]{6,20}$/.test(value)) return { videoId: value, videoUrl: "", startAt: null };
  if (value.startsWith("https://")) return { videoId: "", videoUrl: value, startAt: null };
  return { videoId: "", videoUrl: "", startAt: null };
}

export function slug(value: string): string {
  const base = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "item";
}

export function uniqueSlug(value: string, used: Set<string>): string {
  const base = slug(value);
  let id = base;
  let count = 2;
  while (used.has(id)) {
    id = `${base}-${count}`.slice(0, 48);
    count += 1;
  }
  return id;
}

export function blankTrio(): Trio {
  return { en: "", pt: "", fr: "" };
}

export function blankList(): TrioList {
  return { en: [], pt: [], fr: [] };
}
