import { useLocale } from "../i18n";

export default function LegalPage({ kind }: { kind: "terms" | "privacy" }) {
  const { m } = useLocale();
  const title = kind === "terms" ? m.termsTitle : m.privacyTitle;
  const kicker = kind === "terms" ? m.termsKicker : m.privacyKicker;
  const sections = kind === "terms" ? m.terms : m.privacy;

  return (
    <article className="legal">
      <p className="eyebrow">{kicker}</p>
      <h1>{title}</h1>
      {sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
