import type { SiteDocument } from "./siteDocument";

let current: SiteDocument | null = null;
const listeners = new Set<() => void>();

export function peekSite(): SiteDocument | null {
  return current;
}

export function publishSite(document: SiteDocument | null) {
  current = document;
  for (const listener of listeners) listener();
}

export function subscribeSite(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
