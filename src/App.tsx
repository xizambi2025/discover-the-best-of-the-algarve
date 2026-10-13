import { useEffect, useRef, type MouseEvent } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
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
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const admin = pathname.startsWith("/admin");
  const returnHome = useRef(false);

  useEffect(() => {
    if (!returnHome.current || pathname !== "/" || hash) return;
    returnHome.current = false;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  function goHome(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (pathname !== "/" || hash) {
      returnHome.current = true;
      navigate("/");
    }
    window.scrollTo(0, 0);
  }
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
        <Link className="brand" to="/" onClick={goHome}>
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
          <div className="nav-activities">
            <a href="/#water">{m.navWater}</a>
            <a href="/#land">{m.navLand}</a>
            <a href="/#balloon">{m.navAir}</a>
          </div>
          <ActivityMenu />
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

function ActivityMenu() {
  const { m } = useLocale();
  const menu = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const close = (event: PointerEvent) => {
      const node = menu.current;
      if (!node?.open || !(event.target instanceof Node) || node.contains(event.target)) return;
      node.open = false;
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  function choose() {
    if (menu.current) menu.current.open = false;
  }

  return (
    <details className="nav-menu" ref={menu}>
      <summary>{m.navActivities}</summary>
      <div>
        <a href="/#water" onClick={choose}>
          {m.navWater}
        </a>
        <a href="/#land" onClick={choose}>
          {m.navLand}
        </a>
        <a href="/#balloon" onClick={choose}>
          {m.navAir}
        </a>
      </div>
    </details>
  );
}

export default function App() {
  return (
    <DraftProvider>
      <Shell />
    </DraftProvider>
  );
}
