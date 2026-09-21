import { Link, Route, Routes } from "react-router-dom";
import { DraftProvider, useDraft } from "./draft";
import BookPage from "./pages/BookPage";
import FlyerPage from "./pages/FlyerPage";

function Shell() {
  const { lines } = useDraft();
  return (
    <>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark" aria-hidden="true" />
          Discover the <em>Algarve</em>
        </Link>
        <nav className="topnav">
          <a href="/#water">On the water</a>
          <a href="/#horse">Horse riding</a>
          <Link className="book-link" to="/book">
            Your day
            {lines.length > 0 && <span>{lines.length}</span>}
          </Link>
        </nav>
      </header>
      <main id="content">
        <Routes>
          <Route path="/" element={<FlyerPage />} />
          <Route path="/book" element={<BookPage />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <p>Adventure, nature and the long Algarve afternoon.</p>
        <p className="fine">
          Praia da Marinha and Benagil photographs via Wikimedia Commons. Films open on YouTube.
        </p>
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
