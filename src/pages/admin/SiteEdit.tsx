import { useEffect, useState, type FormEvent } from "react";
import { uniqueSlug } from "../../catalogDocument";
import type { Locale } from "../../i18n/messages";
import { builtinSite, type SiteContact, type SiteDocument } from "../../siteDocument";
import { publishSite } from "../../siteLive";

const LANGUAGES: { id: Locale; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "pt", label: "PT" },
  { id: "fr", label: "FR" },
];

function move<T>(list: T[], index: number, delta: number): T[] {
  const next = index + delta;
  if (next < 0 || next >= list.length) return list;
  const copy = list.slice();
  const [item] = copy.splice(index, 1);
  copy.splice(next, 0, item);
  return copy;
}

export default function SiteEdit() {
  const [lang, setLang] = useState<Locale>("en");
  const [document, setDocument] = useState<SiteDocument | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/site", { credentials: "same-origin", cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return builtinSite();
        const data = (await response.json()) as { site?: SiteDocument | null };
        return data.site ?? builtinSite();
      })
      .then((site) => {
        if (!cancelled) setDocument(site);
      })
      .catch(() => {
        if (!cancelled) setDocument(builtinSite());
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!document) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/site", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ site: document }),
      });
      if (response.status === 401) {
        setError("Your session expired. Sign in again, then save.");
        return;
      }
      if (!response.ok) {
        setError("Could not save. About us needs an English title and text. Each phone needs a number, and the email must be a real address.");
        return;
      }
      publishSite(document);
      setMessage("Saved. About us and the contact line are using this version.");
    } catch {
      setError("Could not save.");
    } finally {
      setSaving(false);
    }
  };

  if (!document) return <p>Loading…</p>;

  const addContact = (kind: SiteContact["kind"]) => {
    setDocument((doc) => {
      if (!doc) return doc;
      const contact: SiteContact = {
        id: uniqueSlug(kind, new Set(doc.contacts.map((item) => item.id))),
        kind,
        value: kind === "email" ? "hi@discoverthebestofthealgarve.com" : "+351",
        name: "",
      };
      return { ...doc, contacts: [...doc.contacts, contact] };
    });
  };

  return (
    <form className="page-edit" onSubmit={save}>
      <div className="page-edit-bar">
        <div>
          <h1>About & contact</h1>
          <p>
            About us is the only extra item in the public menu. The phones and email appear on that page, not at the
            bottom of the other pages. Titles and the about text follow the language. Numbers and the email are shared.
          </p>
        </div>
        <div className="edit-tools">
          <div className="lang" role="group" aria-label="Language">
            {LANGUAGES.map((item) => (
              <button key={item.id} type="button" aria-pressed={lang === item.id} onClick={() => setLang(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
          <button className="solid" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
      {message && <p className="edit-note">{message}</p>}
      {error && <p className="field-error">{error}</p>}

      <section className="edit-block edit-category">
        <h2>About us</h2>
        <div className="edit-fields">
          <label>
            Title
            <input
              value={document.aboutTitle[lang]}
              onChange={(event) =>
                setDocument((doc) =>
                  doc ? { ...doc, aboutTitle: { ...doc.aboutTitle, [lang]: event.target.value } } : doc,
                )
              }
            />
          </label>
          <label>
            Text, one paragraph per line
            <textarea
              rows={8}
              value={document.aboutBody[lang]}
              onChange={(event) =>
                setDocument((doc) =>
                  doc ? { ...doc, aboutBody: { ...doc.aboutBody, [lang]: event.target.value } } : doc,
                )
              }
            />
          </label>
        </div>
      </section>

      <section className="edit-block edit-category">
        <div className="edit-head">
          <div>
            <h2>Contact us</h2>
            <p className="edit-block-help">
              Add a name for each number. The number and WhatsApp open in a window on this page, then the phone or WhatsApp app. An email opens a new message.
            </p>
          </div>
          <div className="edit-tools">
            <button type="button" className="ghost" onClick={() => addContact("phone")}>
              Add phone
            </button>
            <button type="button" className="ghost" onClick={() => addContact("email")}>
              Add email
            </button>
          </div>
        </div>
        {document.contacts.map((contact, index) => (
          <div className="edit-period" key={contact.id}>
            <span className="edit-order-label">
              {index + 1} / {document.contacts.length}
            </span>
            <label>
              Shown as
              <select
                value={contact.kind}
                onChange={(event) => {
                  const kind = event.target.value === "email" ? "email" : "phone";
                  setDocument((doc) =>
                    doc
                      ? {
                          ...doc,
                          contacts: doc.contacts.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, kind } : item,
                          ),
                        }
                      : doc,
                  );
                }}
              >
                <option value="phone">Phone</option>
                <option value="email">Email</option>
              </select>
            </label>
            {contact.kind === "phone" && (
              <label>
                Name
                <input
                  value={contact.name ?? ""}
                  onChange={(event) =>
                    setDocument((doc) =>
                      doc
                        ? {
                            ...doc,
                            contacts: doc.contacts.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, name: event.target.value } : item,
                            ),
                          }
                        : doc,
                    )
                  }
                />
              </label>
            )}
            <label>
              {contact.kind === "email" ? "Email" : "Number"}
              <input
                value={contact.value}
                inputMode={contact.kind === "email" ? "email" : "tel"}
                onChange={(event) =>
                  setDocument((doc) =>
                    doc
                      ? {
                          ...doc,
                          contacts: doc.contacts.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, value: event.target.value } : item,
                          ),
                        }
                      : doc,
                  )
                }
              />
            </label>
            <button
              type="button"
              className="ghost mini"
              disabled={index === 0}
              onClick={() => setDocument((doc) => (doc ? { ...doc, contacts: move(doc.contacts, index, -1) } : doc))}
            >
              Earlier
            </button>
            <button
              type="button"
              className="ghost mini"
              disabled={index === document.contacts.length - 1}
              onClick={() => setDocument((doc) => (doc ? { ...doc, contacts: move(doc.contacts, index, 1) } : doc))}
            >
              Later
            </button>
            <button
              type="button"
              className="ghost"
              onClick={() =>
                setDocument((doc) => {
                  if (!doc) return doc;
                  if (doc.contacts.length < 2) {
                    setError("Keep at least one contact.");
                    return doc;
                  }
                  setError("");
                  return { ...doc, contacts: doc.contacts.filter((_, itemIndex) => itemIndex !== index) };
                })
              }
            >
              Delete
            </button>
          </div>
        ))}
      </section>
    </form>
  );
}
