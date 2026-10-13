import { useEffect, useState, type FormEvent } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import Mark from "../Mark";
import Dashboard from "./admin/Dashboard";
import Financial from "./admin/Financial";
import PageEdit from "./admin/PageEdit";
import Reports from "./admin/Reports";
import SiteEdit from "./admin/SiteEdit";
import Requests from "./admin/Requests";
import Settings from "./admin/Settings";
import type { StayRequest } from "./admin/types";

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [who, setWho] = useState("");
  const [requests, setRequests] = useState<StayRequest[]>([]);
  const [error, setError] = useState(false);

  const load = async () => {
    const response = await fetch("/api/admin/requests", { credentials: "same-origin" });
    if (response.status === 401) {
      setReady(false);
      setWho("");
      return;
    }
    const data = (await response.json()) as { requests?: StayRequest[]; username?: string };
    setRequests(data.requests ?? []);
    setWho(data.username ?? "");
    setReady(true);
  };

  useEffect(() => {
    void load().catch(() => setError(true));
  }, []);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setError(false);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      setError(true);
      return;
    }
    setPassword("");
    await load();
  };

  const signOut = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    setReady(false);
    setWho("");
    setRequests([]);
  };

  if (!ready) {
    return (
      <article className="admin">
        <p className="eyebrow">Private</p>
        <h1>
          <Mark />
          Sign in
        </h1>
        <form className="admin-gate" autoComplete="off" onSubmit={signIn}>
          <label>
            Username
            <input
              name="login-user"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="login-pass"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error && <p className="field-error">That sign-in is not right.</p>}
          <button className="solid" type="submit">
            Sign in
          </button>
        </form>
      </article>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <p className="admin-who">
          <Mark />
          {who}
        </p>
        <nav aria-label="Admin">
          <NavLink to="/admin" end>
            Dashboard
          </NavLink>
          <NavLink to="/admin/requests">Requests</NavLink>
          <NavLink to="/admin/financial">Financial</NavLink>
          <NavLink to="/admin/reports">Reports</NavLink>
          <NavLink to="/admin/page">Page edit</NavLink>
          <NavLink to="/admin/site">About & contact</NavLink>
          <NavLink to="/admin/settings">Settings</NavLink>
        </nav>
        <button type="button" className="ghost" onClick={() => void signOut()}>
          Sign out
        </button>
      </aside>
      <div className="admin-main">
        <Routes>
          <Route index element={<Dashboard requests={requests} />} />
          <Route path="requests" element={<Requests requests={requests} onChange={load} />} />
          <Route path="financial" element={<Financial requests={requests} />} />
          <Route path="reports" element={<Reports requests={requests} />} />
          <Route path="page" element={<PageEdit />} />
          <Route path="site" element={<SiteEdit />} />
          <Route path="settings" element={<Settings username={who} />} />
        </Routes>
      </div>
    </div>
  );
}
