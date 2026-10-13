import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { builtinCatalog, presentCatalog, type CatalogDocument } from "./catalogDocument";
import { peekCatalog, publishCatalog, subscribeCatalog } from "./catalogLive";
import type { Category } from "./data/catalog";
import { LOCALES, messages, type Locale, type Messages } from "./i18n/messages";
import { builtinSite, presentSite, type PresentedSite, type SiteDocument } from "./siteDocument";
import { peekSite, publishSite, subscribeSite } from "./siteLive";

const KEY = "algarve-locale";

function readLocale(): Locale {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "pt" || saved === "fr") return saved;
  } catch {
    /* private mode */
  }
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("pt")) return "pt";
  if (lang.startsWith("fr")) return "fr";
  return "en";
}

type LocaleState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  m: Messages;
  dateLocale: string;
  categories: Category[];
  periods: { id: string; label: string; start: string; end: string }[];
  site: PresentedSite;
  titleOf: (id: string, fallback?: string) => string;
};

const LocaleContext = createContext<LocaleState | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readLocale);
  const remote = useSyncExternalStore(subscribeCatalog, peekCatalog, () => null);
  const siteRemote = useSyncExternalStore(subscribeSite, peekSite, () => null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        const data = (await response.json()) as { catalog?: CatalogDocument | null };
        return data.catalog ?? null;
      })
      .then((document) => {
        if (!cancelled && document) publishCatalog(document);
      })
      .catch(() => {
        /* the built-in page stays in place */
      });
    fetch("/api/site", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        const data = (await response.json()) as { site?: SiteDocument | null };
        return data.site ?? null;
      })
      .then((document) => {
        if (!cancelled && document) publishSite(document);
      })
      .catch(() => {
        /* the built-in about and contact stay in place */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
  };

  const m = messages[locale];
  const meta = LOCALES.find((item) => item.id === locale) ?? LOCALES[0];

  useEffect(() => {
    document.documentElement.lang = meta.html;
    document.title = m.pageTitle;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", m.pageDescription);
  }, [meta.html, m.pageTitle, m.pageDescription]);

  const value = useMemo<LocaleState>(() => {
    const presented = presentCatalog(remote ?? builtinCatalog(), locale);
    const categories = presented.categories;
    const periods = presented.periods;
    const site = presentSite(siteRemote ?? builtinSite(), locale);
    const titleOf = (id: string, fallback = id) =>
      categories.flatMap((category) => category.activities).find((activity) => activity.id === id)?.title ??
      fallback;
    return { locale, setLocale, m, dateLocale: meta.date, categories, periods, site, titleOf };
  }, [locale, m, meta.date, remote, siteRemote]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleState {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale must be used inside LocaleProvider");
  return value;
}
