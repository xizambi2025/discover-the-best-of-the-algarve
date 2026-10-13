import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "react-router-dom";
import { rangesOverlap, type Activity, type TimeRange } from "./data/catalog";
import { useLocale } from "./i18n";
import { isEmail, isPhone } from "./validate";

export type DraftLine = {
  activityId: string;
  date: string;
  people: number;
  ranges: TimeRange[];
};

export type Guest = {
  name: string;
  email: string;
  phone: string;
  date: string;
  notes: string;
  acceptedTerms: boolean;
};

export type NoticeCode = "overlap" | "order" | "overlap-range";

export type SubmitError =
  | { ok: false; code: "name" | "email" | "email-format" | "phone" | "activity" | "terms" }
  | { ok: false; code: "date" | "time"; activityId: string };

export type SavedLine = DraftLine & { title: string };

export type RequestPayload = {
  name: string;
  email: string;
  phone: string;
  notes: string;
  acceptedTerms: true;
  lines: SavedLine[];
};

const emptyGuest: Guest = {
  name: "",
  email: "",
  phone: "",
  date: "",
  notes: "",
  acceptedTerms: false,
};

type DraftState = {
  guest: Guest;
  lines: DraftLine[];
  setGuest: (patch: Partial<Guest>) => void;
  isSelected: (id: string) => boolean;
  toggleActivity: (activity: Activity) => void;
  setPeople: (id: string, people: number) => void;
  setDate: (id: string, date: string) => void;
  togglePeriod: (id: string, range: TimeRange) => NoticeCode | null;
  addCustomRange: (id: string, range: TimeRange) => NoticeCode | null;
  removeRange: (id: string, index: number) => void;
  prepare: () => { ok: true; payload: RequestPayload } | SubmitError;
  clearStay: () => void;
};

const DraftContext = createContext<DraftState | null>(null);

export function DraftProvider({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams();
  const { categories } = useLocale();
  const [guest, setGuestState] = useState<Guest>(emptyGuest);
  const [lines, setLines] = useState<DraftLine[]>([]);

  useEffect(() => {
    sessionStorage.removeItem("algarve-day-draft");
    localStorage.removeItem("algarve-bookings");
  }, []);

  const requested = searchParams.get("activity");
  useEffect(() => {
    if (!requested) return;
    const activity = categories.flatMap((category) => category.activities).find((item) => item.id === requested);
    if (!activity) return;
    setLines((current) => {
      if (current.some((line) => line.activityId === activity.id)) return current;
      return [
        ...current,
        { activityId: activity.id, date: "", people: 2, ranges: [{ ...activity.suggested }] },
      ];
    });
  }, [requested, categories]);

  const api = useMemo<DraftState>(() => {
    const replaceLine = (id: string, next: DraftLine) => {
      setLines((current) => current.map((line) => (line.activityId === id ? next : line)));
    };

    return {
      guest,
      lines,
      setGuest: (patch) => setGuestState((current) => ({ ...current, ...patch })),
      isSelected: (id) => lines.some((line) => line.activityId === id),
      toggleActivity: (activity) => {
        setLines((current) => {
          if (current.some((line) => line.activityId === activity.id)) {
            return current.filter((line) => line.activityId !== activity.id);
          }
          return [
            ...current,
            { activityId: activity.id, date: "", people: 2, ranges: [{ ...activity.suggested }] },
          ];
        });
      },
      setPeople: (id, people) => {
        const line = lines.find((item) => item.activityId === id);
        if (!line) return;
        replaceLine(id, { ...line, people: Math.min(16, Math.max(1, people)) });
      },
      setDate: (id, date) => {
        const line = lines.find((item) => item.activityId === id);
        if (!line) return;
        replaceLine(id, { ...line, date });
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
          return "overlap";
        }
        replaceLine(id, { ...line, ranges: [...line.ranges, range] });
        return null;
      },
      addCustomRange: (id, range) => {
        if (range.end <= range.start) return "order";
        const line = lines.find((item) => item.activityId === id);
        if (!line) return null;
        if (line.ranges.some((item) => rangesOverlap(item, range))) {
          return "overlap-range";
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
      clearStay: () => {
        setLines([]);
        setGuestState((current) => ({ ...current, notes: "", acceptedTerms: false }));
      },
      prepare: () => {
        const name = guest.name.trim();
        const email = guest.email.trim();
        const phone = guest.phone.trim();
        if (name.length < 2) return { ok: false, code: "name" };
        if (!email) return { ok: false, code: "email" };
        if (!isEmail(email)) return { ok: false, code: "email-format" };
        if (!isPhone(phone)) return { ok: false, code: "phone" };
        if (lines.length === 0) return { ok: false, code: "activity" };
        const undated = lines.find((line) => !line.date);
        if (undated) return { ok: false, code: "date", activityId: undated.activityId };
        const missing = lines.find((line) => line.ranges.length === 0);
        if (missing) return { ok: false, code: "time", activityId: missing.activityId };
        if (!guest.acceptedTerms) return { ok: false, code: "terms" };
        return {
          ok: true,
          payload: {
            name,
            email,
            phone,
            notes: guest.notes.trim(),
            acceptedTerms: true,
            lines: lines.map((line) => ({
              ...line,
              title:
                categories.flatMap((category) => category.activities).find((item) => item.id === line.activityId)
                  ?.title ?? line.activityId,
            })),
          },
        };
      },
    };
  }, [categories, guest, lines]);

  return <DraftContext.Provider value={api}>{children}</DraftContext.Provider>;
}

export function useDraft(): DraftState {
  const value = useContext(DraftContext);
  if (!value) throw new Error("useDraft must be used inside DraftProvider");
  return value;
}
