import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  DAY_END,
  DAY_START,
  PERIODS,
  categories,
  findActivity,
  toMinutes,
  type TimeRange,
} from "../data/catalog";
import { useDraft, type SavedBooking } from "../draft";

function todayISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function place(range: TimeRange): { left: string; width: string } {
  const span = DAY_END - DAY_START;
  const start = Math.max(DAY_START, Math.min(DAY_END, toMinutes(range.start)));
  const end = Math.max(start, Math.min(DAY_END, toMinutes(range.end)));
  return {
    left: `${((start - DAY_START) / span) * 100}%`,
    width: `${((end - start) / span) * 100}%`,
  };
}

function summaryText(booking: SavedBooking): string {
  const lines = booking.lines
    .map((line) => {
      const times = line.ranges.map((range) => `${range.start}–${range.end}`).join(", ");
      return `• ${line.title} — ${line.people} ${line.people === 1 ? "person" : "people"} — ${times}`;
    })
    .join("\n");
  return [
    `Algarve day request ${booking.ref}`,
    `Name: ${booking.guest.name}`,
    booking.guest.email ? `Email: ${booking.guest.email}` : "",
    booking.guest.phone ? `Phone: ${booking.guest.phone}` : "",
    `Date: ${booking.guest.date}`,
    lines,
    booking.guest.notes ? `Notes: ${booking.guest.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function overlapsOthers(activityId: string, range: TimeRange, lines: { activityId: string; ranges: TimeRange[] }[]) {
  return lines.some(
    (line) =>
      line.activityId !== activityId &&
      line.ranges.some(
        (item) => toMinutes(item.start) < toMinutes(range.end) && toMinutes(range.start) < toMinutes(item.end),
      ),
  );
}

export default function BookPage() {
  const draft = useDraft();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [custom, setCustom] = useState<Record<string, TimeRange>>({});
  const [copied, setCopied] = useState(false);
  const latest = draft.bookings.find((booking) => booking.ref === draft.latestRef) ?? null;

  const clash = useMemo(
    () =>
      draft.lines.some((line) =>
        line.ranges.some((range) => overlapsOthers(line.activityId, range, draft.lines)),
      ),
    [draft.lines],
  );

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const result = draft.submit();
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    setNotice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="book">
      <header className="book-intro">
        <p className="eyebrow">Bookings</p>
        <h1>Build the day</h1>
        <p>
          Add your name, tick each activity, say how many people are coming, and place it on the
          clock. You can give one activity more than one time.
        </p>
      </header>

      {latest && (
        <section className="confirm" aria-live="polite">
          <p className="eyebrow">Request saved</p>
          <h2>Reference {latest.ref}</h2>
          <p>
            {latest.guest.name}, {latest.guest.date}. This stays in this browser so you can copy it
            into a message.
          </p>
          <pre>{summaryText(latest)}</pre>
          <div className="dialog-actions">
            <button
              type="button"
              className="solid"
              onClick={async () => {
                await navigator.clipboard.writeText(summaryText(latest));
                setCopied(true);
              }}
            >
              {copied ? "Copied" : "Copy summary"}
            </button>
            <button type="button" className="ghost" onClick={draft.clearLatest}>
              Plan another day
            </button>
          </div>
        </section>
      )}

      <div className="book-layout">
        <form className="book-form" onSubmit={onSubmit}>
          <fieldset className="guest">
            <legend>Who is coming</legend>
            <label>
              Name
              <input
                required
                name="name"
                autoComplete="name"
                value={draft.guest.name}
                onChange={(event) => draft.setGuest({ name: event.target.value })}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={draft.guest.email}
                onChange={(event) => draft.setGuest({ email: event.target.value })}
              />
            </label>
            <label>
              Phone
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                value={draft.guest.phone}
                onChange={(event) => draft.setGuest({ phone: event.target.value })}
              />
            </label>
            <label>
              Date
              <input
                required
                type="date"
                name="date"
                min={todayISO()}
                value={draft.guest.date}
                onChange={(event) => draft.setGuest({ date: event.target.value })}
              />
            </label>
          </fieldset>

          {categories.map((category) => (
            <fieldset key={category.id} className={`tone-${category.tone}`}>
              <legend>{category.title}</legend>
              {category.activities.map((activity) => {
                const line = draft.lines.find((item) => item.activityId === activity.id);
                const selected = Boolean(line);
                const draftRange = custom[activity.id] ?? { start: "09:00", end: "12:00" };
                return (
                  <div key={activity.id} className={selected ? "row open" : "row"}>
                    <label className="check">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => draft.toggleActivity(activity)}
                      />
                      <span>
                        <strong>{activity.title}</strong>
                        <small>{activity.duration}</small>
                      </span>
                    </label>
                    {line && (
                      <div className="details">
                        <label className="people">
                          People
                          <input
                            type="number"
                            min={1}
                            max={16}
                            value={line.people}
                            onChange={(event) =>
                              draft.setPeople(activity.id, Number(event.target.value))
                            }
                          />
                        </label>
                        <div className="periods">
                          {PERIODS.map((period) => {
                            const on = line.ranges.some(
                              (range) => range.start === period.start && range.end === period.end,
                            );
                            return (
                              <button
                                key={period.id}
                                type="button"
                                className={on ? "chip on" : "chip"}
                                aria-pressed={on}
                                onClick={() => {
                                  const message = draft.togglePeriod(activity.id, period);
                                  setNotice(message);
                                }}
                              >
                                {period.label}
                                <small>
                                  {period.start}–{period.end}
                                </small>
                              </button>
                            );
                          })}
                        </div>
                        <div className="custom">
                          <label>
                            From
                            <input
                              type="time"
                              min="06:00"
                              max="23:00"
                              value={draftRange.start}
                              onChange={(event) =>
                                setCustom((current) => ({
                                  ...current,
                                  [activity.id]: { ...draftRange, start: event.target.value },
                                }))
                              }
                            />
                          </label>
                          <label>
                            Until
                            <input
                              type="time"
                              min="06:00"
                              max="23:00"
                              value={draftRange.end}
                              onChange={(event) =>
                                setCustom((current) => ({
                                  ...current,
                                  [activity.id]: { ...draftRange, end: event.target.value },
                                }))
                              }
                            />
                          </label>
                          <button
                            type="button"
                            className="ghost"
                            onClick={() => {
                              const message = draft.addCustomRange(activity.id, draftRange);
                              setNotice(message);
                            }}
                          >
                            Add this range
                          </button>
                        </div>
                        {line.ranges.length > 0 && (
                          <ul className="chosen">
                            {line.ranges.map((range, index) => (
                              <li key={`${range.start}-${range.end}-${index}`}>
                                {range.start}–{range.end}
                                <button
                                  type="button"
                                  onClick={() => draft.removeRange(activity.id, index)}
                                >
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </fieldset>
          ))}

          <label className="notes">
            Notes
            <textarea
              rows={3}
              value={draft.guest.notes}
              onChange={(event) => draft.setGuest({ notes: event.target.value })}
              placeholder="Hotel, ages, or anything the guide should know"
            />
          </label>

          {notice && <p className="warn">{notice}</p>}
          {error && <p className="warn">{error}</p>}
          {clash && (
            <p className="warn soft">
              Some times overlap. That is fine if the group splits. Change them if everyone stays
              together.
            </p>
          )}

          <button className="solid submit" type="submit">
            Save this day
          </button>
        </form>

        <aside className="dayboard">
          <h2>Through the day</h2>
          <p>06:00 to 23:00. Each bar is a time you picked.</p>
          {draft.lines.length === 0 ? (
            <p className="empty">
              Tick an activity and it lands here. Or start from the{" "}
              <Link to="/">flyer</Link>.
            </p>
          ) : (
            <div className="lanes">
              <div className="hours" aria-hidden="true">
                {[6, 9, 12, 15, 18, 21].map((hour) => (
                  <span
                    key={hour}
                    style={{
                      left: `${((hour * 60 - DAY_START) / (DAY_END - DAY_START)) * 100}%`,
                    }}
                  >
                    {String(hour).padStart(2, "0")}
                  </span>
                ))}
              </div>
              {draft.lines.map((line) => {
                const activity = findActivity(line.activityId);
                const tone = categories.find((category) =>
                  category.activities.some((item) => item.id === line.activityId),
                )?.tone;
                return (
                  <div key={line.activityId} className="lane">
                    <p>
                      {activity?.title}
                      <small>
                        {line.people} {line.people === 1 ? "person" : "people"}
                      </small>
                    </p>
                    <div className="track">
                      {line.ranges.map((range, index) => (
                        <span
                          key={`${range.start}-${index}`}
                          className={`block tone-${tone ?? "sea"}`}
                          style={place(range)}
                          title={`${range.start}–${range.end}`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </aside>
      </div>

      {draft.bookings.length > 0 && (
        <section className="history">
          <h2>Saved on this device</h2>
          <ul>
            {draft.bookings.map((booking) => (
              <li key={booking.ref}>
                <strong>{booking.ref}</strong>
                <span>
                  {booking.guest.name} · {booking.guest.date} · {booking.lines.length}{" "}
                  {booking.lines.length === 1 ? "activity" : "activities"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
