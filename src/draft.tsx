import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "react-router-dom";
import {
  findActivity,
  rangesOverlap,
  type Activity,
  type TimeRange,
} from "./data/catalog";

export type DraftLine = {
  activityId: string;
  people: number;
  ranges: TimeRange[];
};

export type Guest = {
  name: string;
  email: string;
  phone: string;
  date: string;
  notes: string;
};

export type SavedLine = DraftLine & { title: string };

export type SavedBooking = {
  ref: string;
  createdAt: string;
  guest: Guest;
  lines: SavedLine[];
};

const DRAFT_KEY = "algarve-day-draft";
const BOOKINGS_KEY = "algarve-bookings";

const emptyGuest: Guest = { name: "", email: "", phone: "", date: "", notes: "" };

type DraftState = {
  guest: Guest;
  lines: DraftLine[];
  setGuest: (patch: Partial<Guest>) => void;
  isSelected: (id: string) => boolean;
  toggleActivity: (activity: Activity) => void;
  setPeople: (id: string, people: number) => void;
  togglePeriod: (id: string, range: TimeRange) => string | null;
  addCustomRange: (id: string, range: TimeRange) => string | null;
  removeRange: (id: string, index: number) => void;
  submit: () => { ok: true; booking: SavedBooking } | { ok: false; error: string };
  bookings: SavedBooking[];
  latestRef: string | null;
  clearLatest: () => void;
};

const DraftContext = createContext<DraftState | null>(null);

function loadDraft(): { guest: Guest; lines: DraftLine[] } {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return { guest: emptyGuest, lines: [] };
    const parsed = JSON.parse(raw) as { guest?: Guest; lines?: DraftLine[] };
    return {
      guest: { ...emptyGuest, ...parsed.guest },
      lines: Array.isArray(parsed.lines) ? parsed.lines : [],
    };
  } catch {
    return { guest: emptyGuest, lines: [] };
  }
}

function loadBookings(): SavedBooking[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    const parsed = raw ? (JSON.parse(raw) as SavedBooking[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function makeRef(): string {
  const chunk = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ALG-${chunk}`;
}

export function DraftProvider({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams();
  const initial = loadDraft();
  const [guest, setGuestState] = useState<Guest>(initial.guest);
  const [lines, setLines] = useState<DraftLine[]>(initial.lines);
  const [bookings, setBookings] = useState<SavedBooking[]>(loadBookings);
  const [latestRef, setLatestRef] = useState<string | null>(null);

  useEffect(() => {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ guest, lines }));
  }, [guest, lines]);

  const requested = searchParams.get("activity");
  useEffect(() => {
    if (!requested) return;
    const activity = findActivity(requested);
    if (!activity) return;
    setLines((current) => {
      if (current.some((line) => line.activityId === activity.id)) return current;
      return [
        ...current,
        { activityId: activity.id, people: 2, ranges: [{ ...activity.suggested }] },
      ];
    });
  }, [requested]);

  const api = useMemo<DraftState>(() => {
    const replaceLine = (id: string, next: DraftLine) => {
      setLines((current) => current.map((line) => (line.activityId === id ? next : line)));
    };

    return {
      guest,
      lines,
      bookings,
      latestRef,
      clearLatest: () => setLatestRef(null),
      setGuest: (patch) => setGuestState((current) => ({ ...current, ...patch })),
      isSelected: (id) => lines.some((line) => line.activityId === id),
      toggleActivity: (activity) => {
        setLines((current) => {
          if (current.some((line) => line.activityId === activity.id)) {
            return current.filter((line) => line.activityId !== activity.id);
          }
          return [
            ...current,
            { activityId: activity.id, people: 2, ranges: [{ ...activity.suggested }] },
          ];
        });
      },
      setPeople: (id, people) => {
        const line = lines.find((item) => item.activityId === id);
        if (!line) return;
        replaceLine(id, { ...line, people: Math.min(16, Math.max(1, people)) });
      },
      togglePeriod: (id, range) => {
        const line = lines.find((item) => item.activityId === id);
        if (!line) return null;
        const existing = line.ranges.findIndex(
          (item) => item.start === range.start && item.end === range.end,
        );
        if (existing >= 0) {
          replaceLine(id, {
            ...line,
            ranges: line.ranges.filter((_, index) => index !== existing),
          });
          return null;
        }
        if (line.ranges.some((item) => rangesOverlap(item, range))) {
          return "That period overlaps a time you already chose.";
        }
        replaceLine(id, { ...line, ranges: [...line.ranges, range] });
        return null;
      },
      addCustomRange: (id, range) => {
        if (range.end <= range.start) return "The end time needs to be after the start.";
        const line = lines.find((item) => item.activityId === id);
        if (!line) return null;
        if (line.ranges.some((item) => rangesOverlap(item, range))) {
          return "That range overlaps a time already on this activity.";
        }
        replaceLine(id, { ...line, ranges: [...line.ranges, range] });
        return null;
      },
      removeRange: (id, index) => {
        const line = lines.find((item) => item.activityId === id);
        if (!line) return;
        replaceLine(id, {
          ...line,
          ranges: line.ranges.filter((_, itemIndex) => itemIndex !== index),
        });
      },
      submit: () => {
        const name = guest.name.trim();
        if (name.length < 2) return { ok: false, error: "Add the name the booking should be under." };
        if (!guest.date) return { ok: false, error: "Choose the day you want to come." };
        if (guest.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email.trim())) {
          return { ok: false, error: "That email address does not look complete." };
        }
        if (lines.length === 0) return { ok: false, error: "Tick at least one activity." };
        const missing = lines.find((line) => line.ranges.length === 0);
        if (missing) {
          const title = findActivity(missing.activityId)?.title ?? "An activity";
          return { ok: false, error: `${title} still needs a time.` };
        }
        const saved: SavedBooking = {
          ref: makeRef(),
          createdAt: new Date().toISOString(),
          guest: { ...guest, name, email: guest.email.trim(), phone: guest.phone.trim() },
          lines: lines.map((line) => ({
            ...line,
            title: findActivity(line.activityId)?.title ?? line.activityId,
          })),
        };
        const next = [saved, ...bookings].slice(0, 12);
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(next));
        setBookings(next);
        setLines([]);
        setLatestRef(saved.ref);
        return { ok: true, booking: saved };
      },
    };
  }, [guest, lines, bookings, latestRef]);

  return <DraftContext.Provider value={api}>{children}</DraftContext.Provider>;
}

export function useDraft(): DraftState {
  const value = useContext(DraftContext);
  if (!value) throw new Error("useDraft must be used inside DraftProvider");
  return value;
}
