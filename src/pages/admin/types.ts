export type StayLine = {
  activityId: string;
  title: string;
  date: string;
  people: number;
  ranges: { start: string; end: string }[];
};

export type StayRequest = {
  id: string;
  ref: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  paid: boolean;
  amount: number | null;
  paidAt: string | null;
  paymentLink: string | null;
  paymentLinkAt: string | null;
  lines: StayLine[];
};

export function when(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("pt-PT", {
    timeZone: "Europe/Lisbon",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function euros(value: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR" }).format(value);
}
