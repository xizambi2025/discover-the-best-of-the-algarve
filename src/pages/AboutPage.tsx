import { useEffect, useRef, useState } from "react";
import { useLocale } from "../i18n";
import { launchContact, phoneHref, whatsappHref, type SiteContact } from "../siteDocument";

type ContactAction = {
  contact: SiteContact;
  mode: "phone" | "whatsapp";
};

export default function AboutPage() {
  const { m, site } = useLocale();
  const [action, setAction] = useState<ContactAction | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!action) return;
    dialogRef.current?.querySelector("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAction(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [action]);

  useEffect(() => {
    if (action) return;
    returnFocus.current?.focus();
  }, [action]);

  function openAction(contact: SiteContact, mode: ContactAction["mode"], opener: HTMLElement) {
    returnFocus.current = opener;
    setAction({ contact, mode });
    launchContact(mode === "phone" ? phoneHref(contact.value) : whatsappHref(contact.value));
  }

  function closeAction() {
    setAction(null);
  }

  const actionHref = action
    ? action.mode === "phone"
      ? phoneHref(action.contact.value)
      : whatsappHref(action.contact.value)
    : "";

  return (
    <article className="legal">
      <p className="eyebrow">{m.aboutKicker}</p>
      <h1>{site.aboutTitle}</h1>
      {site.aboutParagraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {site.contacts.length > 0 && (
        <div className="about-contacts">
          {site.contacts.map((contact) =>
            contact.kind === "email" ? (
              <a key={contact.id} className="contact-chip" href={`mailto:${contact.value}`}>
                {contact.value}
              </a>
            ) : (
              <span key={contact.id} className="contact-chip">
                {contact.name?.trim() ? <span className="contact-name">{contact.name}</span> : null}
                <button type="button" onClick={(event) => openAction(contact, "phone", event.currentTarget)}>
                  {contact.value}
                </button>
                <button type="button" onClick={(event) => openAction(contact, "whatsapp", event.currentTarget)}>
                  {m.contactWhatsapp}
                </button>
              </span>
            ),
          )}
        </div>
      )}
      {action && (
        <div className="dialog-back" role="presentation" onClick={closeAction}>
          <div
            className="dialog contact-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-dialog-title"
            ref={dialogRef}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="dialog-copy">
              <h2 id="contact-dialog-title">{action.contact.name?.trim() || action.contact.value}</h2>
              {action.contact.name?.trim() ? <p className="contact-dialog-number">{action.contact.value}</p> : null}
              <div className="dialog-actions">
                <a className="solid" href={actionHref}>
                  {action.mode === "whatsapp" ? m.contactWhatsapp : action.contact.value}
                </a>
                <button type="button" className="texty" onClick={closeAction}>
                  {m.close}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
