import type { CatalogDocument } from "./catalogDocument";

let current: CatalogDocument | null = null;
const listeners = new Set<() => void>();

export function peekCatalog(): CatalogDocument | null {
  return current;
}

export function publishCatalog(document: CatalogDocument | null) {
  current = document;
  for (const listener of listeners) listener();
}

export function subscribeCatalog(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
