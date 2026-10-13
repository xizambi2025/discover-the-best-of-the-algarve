import { useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { SITE_URL } from "./config";
import { DraftProvider, useDraft } from "./draft";
import { LOCALES } from "./i18n/messages";
import { useLocale } from "./i18n";
import Mark from "./Mark";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import BookPage from "./pages/BookPage";
import FlyerPage from "./pages/FlyerPage";
import LegalPage from "./pages/LegalPage";

function Shell() {
  const { lines } = useDraft();
  const { m, locale, setLocale } = useLocale();
  const { pathname } = useLocation();
  const admin = pathname.startsWith("/admin");
  useEffect(() => {
    const href = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = href;
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (admin) {
      if (!robots) {
        robots = document.createElement("meta");
        robots.name = "robots";
        document.head.appendChild(robots);
      }
      robots.content = "noindex";
    } else if (robots) {
      robots.remove();
    }
  }, [admin, pathname]);
  if (admin) {
    return (
      <main id="content">
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </main>
    );
  }
  return (
    <>
      <a className="skip" href="#content">
        {m.skip}
      </a>
      <header className="topbar">
        <Link className="brand" to="/">
          <Mark />
          {m.brand}
        </Link>
        <nav className="topnav">
          <div className="lang" role="group" aria-label={m.langLabel}>
            {LOCALES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={locale === item.id}
                aria-label={item.name}
                onClick={() => setLocale(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <a href="/#water">{m.navWater}</a>
          <a href="/#horse">{m.navHorse}</a>
          <Link className="nav-about" to="/about">
            {m.navAbout}
          </Link>
          <Link className="book-link" to="/book">
            {m.navBook}
            {lines.length > 0 && <span>{lines.length}</span>}
          </Link>
        </nav>
      </header>
      <main id="content">
        <Routes>
          <Route path="/" element={<FlyerPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/terms" element={<LegalPage kind="terms" />} />
          <Route path="/privacy" element={<LegalPage kind="privacy" />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <div className="site-footer-start">
          <p className="site-footer-year">
            © {new Date().getFullYear()} {m.brand}
          </p>
          <div className="site-footer-social" aria-hidden="true" />
        </div>
        <nav className="legal-links" aria-label={m.termsLink}>
          <Link to="/terms">{m.termsLink}</Link>
          <Link to="/privacy">{m.privacyLink}</Link>
        </nav>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <DraftProvider>
      <Shell />
    </DraftProvider>
  );
}
