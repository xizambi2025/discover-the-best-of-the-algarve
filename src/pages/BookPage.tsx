import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../catalogDocument";
import { DAY_END, DAY_START, toMinutes, type TimeRange } from "../data/catalog";
import { whatsappReady } from "../config";
import { useDraft, type NoticeCode } from "../draft";
import { useLocale } from "../i18n";
import { isEmail, isPhone } from "../validate";

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

function prettyDate(iso: string, dateLocale: string): string {
  if (!iso) return "";
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Date(year, month - 1, day).toLocaleDateString(dateLocale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function overlapsOthers(
  activityId: string,
  date: string,
  range: TimeRange,
  lines: { activityId: string; date: string; ranges: TimeRange[] }[],
) {
  if (!date) return false;
  return lines.some(
    (line) =>
      line.activityId !== activityId &&
      line.date === date &&
      line.ranges.some(
        (item) => toMinutes(item.start) < toMinutes(range.end) && toMinutes(range.start) < toMinutes(item.end),
      ),
  );
}

export default function BookPage() {
  const draft = useDraft();
  const { m, categories, periods, dateLocale } = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  const [receivedRef, setReceivedRef] = useState<string | null>(null);
  const [seen, setSeen] = useState<Record<string, boolean>>({});
  const [scrollTo, setScrollTo] = useState<string | null>(null);
  const [notice, setNotice] = useState<NoticeCode | null>(null);
  const [custom, setCustom] = useState<Record<string, TimeRange>>({});

  const clash = useMemo(
    () =>
      draft.lines.some((line) =>
        line.ranges.some((range) => overlapsOthers(line.activityId, line.date, range, draft.lines)),
      ),
    [draft.lines],
  );

  const reveal = (key: string) => setSeen((current) => ({ ...current, [key]: true }));
  const shown = (key: string) => submitted || Boolean(seen[key]);

  const nameError = shown("name") && draft.guest.name.trim().length < 2 ? m.errName : "";
  const emailValue = draft.guest.email.trim();
  const emailError = !shown("email")
    ? ""
    : !emailValue
      ? m.errEmail
      : !isEmail(emailValue)
        ? m.errEmailFormat
        : "";
  const phoneError = shown("phone") && !isPhone(draft.guest.phone) ? m.errPhone : "";
  const activityError = submitted && draft.lines.length === 0 ? m.errActivity : "";
  const termsError = submitted && !draft.guest.acceptedTerms ? m.errTerms : "";
  const submitError = sendError ? m.errSend : activityError;

  useEffect(() => {
    if (!scrollTo) return;
    document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth", block: "center" });
    setScrollTo(null);
  }, [scrollTo]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setSendError(false);
    const result = draft.prepare();
    if (!result.ok) {
      const anchor = (() => {
        switch (result.code) {
          case "activity":
            return "submit-error";
          case "terms":
            return "error-terms";
          case "name":
            return "error-name";
          case "email":
          case "email-format":
            return "error-email";
          case "phone":
            return "error-phone";
          case "date":
            return `error-date-${result.activityId}`;
          case "time":
            return `error-time-${result.activityId}`;
        }
      })();
      setScrollTo(anchor);
      return;
    }
    setSending(true);
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(result.payload),
      });
      const data = (await response.json()) as { ok?: boolean; ref?: string; code?: string };
      if (!response.ok || !data.ref) {
        setSendError(true);
        setScrollTo("submit-error");
        return;
      }
      setReceivedRef(data.ref);
      setSubmitted(false);
      setSeen({});
      setNotice(null);
      draft.clearStay();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSendError(true);
      setScrollTo("submit-error");
    } finally {
      setSending(false);
    }
  };

  const noticeText =
    notice === "overlap" ? m.noticeOverlap : notice === "order" ? m.noticeOrder : notice === "overlap-range" ? m.noticeRange : "";

  return (
    <div className="book">
      <header className="book-intro">
        <p className="eyebrow">{m.bookEyebrow}</p>
        <h1>{m.bookTitle}</h1>
        <p>{m.bookLede}</p>
      </header>

      {receivedRef && (
        <section className="confirm" aria-live="polite">
          <p className="eyebrow">{m.savedEyebrow}</p>
          <h2>
            {m.reference} {receivedRef}
          </h2>
          <p>{m.savedBody}</p>
        </section>
      )}

      {!receivedRef && (
      <div className="book-layout">
        <form className="book-form" autoComplete="off" noValidate onSubmit={onSubmit}>
          <fieldset className="guest">
            <legend>{m.who}</legend>
            <label>
              {m.name}
              <input
                required
                aria-required="true"
                name="guest-name"
                autoComplete="off"
                value={draft.guest.name}
                aria-invalid={Boolean(nameError)}
                onBlur={() => reveal("name")}
                onChange={(event) => draft.setGuest({ name: event.target.value })}
              />
              {nameError && (
                <p className="field-error" id="error-name" role="alert">
                  {nameError}
                </p>
              )}
            </label>
            <label>
              {m.email}
              <input
                required
                aria-required="true"
                type="email"
                inputMode="email"
                name="guest-email"
                autoComplete="off"
                spellCheck={false}
                value={draft.guest.email}
                aria-invalid={Boolean(emailError)}
                onBlur={() => reveal("email")}
                onChange={(event) => draft.setGuest({ email: event.target.value })}
              />
              {emailError && (
                <p className="field-error" id="error-email" role="alert">
                  {emailError}
                </p>
              )}
            </label>
            <label>
              {m.contact}
              <input
                required
                aria-required="true"
                type="tel"
                inputMode="tel"
                name="guest-phone"
                autoComplete="off"
                value={draft.guest.phone}
                aria-invalid={Boolean(phoneError)}
                onBlur={() => reveal("phone")}
                onChange={(event) => draft.setGuest({ phone: event.target.value })}
              />
              {phoneError && (
                <p className="field-error" id="error-phone" role="alert">
                  {phoneError}
                </p>
              )}
            </label>
          </fieldset>

          {categories.map((category) => (
            <fieldset key={category.id} className={`tone-${category.tone}`}>
              <legend>{category.title}</legend>
              {category.activities.map((activity) => {
                const line = draft.lines.find((item) => item.activityId === activity.id);
                const selected = Boolean(line);
                const price = formatPrice(activity.price, dateLocale);
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
                        <small>
                          {activity.duration}
                          {price && ` · ${price}`}
                        </small>
                      </span>
                    </label>
                    {line && (
                      <div className="details">
                        <div className="detail-meta">
                          <label className="when">
                            {m.date}
                            <input
                              required
                              aria-required="true"
                              type="date"
                              name={`date-${activity.id}`}
                              autoComplete="off"
                              min={todayISO()}
                              value={line.date}
                              aria-invalid={submitted && !line.date}
                              onBlur={() => reveal(`date:${activity.id}`)}
                              onChange={(event) => draft.setDate(activity.id, event.target.value)}
                            />
                            {(submitted || seen[`date:${activity.id}`]) && !line.date && (
                              <p className="field-error" id={`error-date-${activity.id}`} role="alert">
                                {m.errDate(activity.title)}
                              </p>
                            )}
                          </label>
                          <label className="people">
                            {m.peopleLabel}
                            <input
                              type="number"
                              name={`people-${activity.id}`}
                              autoComplete="off"
                              min={1}
                              max={16}
                              value={line.people}
                              onChange={(event) =>
                                draft.setPeople(activity.id, Number(event.target.value))
                              }
                            />
                          </label>
                        </div>
                        <div className="periods">
                          {periods.map((period) => {
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
                            {m.from}
                            <input
                              type="time"
                              autoComplete="off"
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
                            {m.until}
                            <input
                              type="time"
                              autoComplete="off"
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
                            {m.addRange}
                          </button>
                        </div>
                        {submitted && line.ranges.length === 0 && (
                          <p className="field-error" id={`error-time-${activity.id}`} role="alert">
                            {m.errTime(activity.title)}
                          </p>
                        )}
                        {line.ranges.length > 0 && (
                          <ul className="chosen">
                            {line.ranges.map((range, index) => (
                              <li key={`${range.start}-${range.end}-${index}`}>
                                {range.start}–{range.end}
                                <button
                                  type="button"
                                  onClick={() => draft.removeRange(activity.id, index)}
                                >
                                  {m.remove}
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
            {m.notes}
            <textarea
              rows={3}
              name="guest-notes"
              autoComplete="off"
              value={draft.guest.notes}
              onChange={(event) => draft.setGuest({ notes: event.target.value })}
              placeholder={m.notesPlaceholder}
            />
          </label>

          <label className="check accept">
            <input
              type="checkbox"
              name="accept-terms"
              autoComplete="off"
              checked={draft.guest.acceptedTerms}
              aria-invalid={Boolean(termsError)}
              onChange={(event) => draft.setGuest({ acceptedTerms: event.target.checked })}
            />
            <span>{m.accept}</span>
          </label>
          {termsError && (
            <p className="field-error" id="error-terms" role="alert">
              {termsError}
            </p>
          )}

          {noticeText && <p className="warn">{noticeText}</p>}
          {clash && <p className="warn soft">{m.clash}</p>}
          {submitError && (
            <p className="field-error" id="submit-error" role="alert">
              {submitError}
            </p>
          )}

          <button className="solid submit" type="submit" disabled={sending}>
            {whatsappReady() ? m.requestWhatsapp : m.requestStay}
          </button>
        </form>

        <aside className="dayboard">
          <h2>{m.boardTitle}</h2>
          <p>{m.boardLede}</p>
          {draft.lines.length === 0 ? (
            <p className="empty">
              {m.boardEmpty} <Link to="/">{m.programme}</Link>.
            </p>
          ) : (
            [...new Set(draft.lines.map((line) => line.date))].sort().map((date) => (
              <section key={date || "undated"} className="day-group">
                <h3>{date ? prettyDate(date, dateLocale) : m.datePending}</h3>
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
                  {draft.lines
                    .filter((line) => line.date === date)
                    .map((line) => {
                      const activity = categories
                        .flatMap((category) => category.activities)
                        .find((item) => item.id === line.activityId);
                      const tone = categories.find((category) =>
                        category.activities.some((item) => item.id === line.activityId),
                      )?.tone;
                      return (
                        <div key={line.activityId} className="lane">
                          <p>
                            {activity?.title}
                            <small>
                              {line.people} {line.people === 1 ? m.person : m.people}
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
              </section>
            ))
          )}
        </aside>
      </div>
      )}
    </div>
  );
}









