import { useState, type FormEvent } from "react";

export default function Settings({ username }: { username: string }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const changePassword = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");
    const response = await fetch("/api/admin/password", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ current, next }),
    });
    if (!response.ok) {
      setError(response.status === 400 ? "Use at least 7 characters." : "The current password is not right.");
      return;
    }
    setCurrent("");
    setNext("");
    setMessage("Password changed.");
  };

  return (
    <div className="admin-page">
      <h1>Settings</h1>
      <form className="admin-password" onSubmit={changePassword}>
        <p>
          Username <strong>{username}</strong>
        </p>
        <label>
          Current password
          <input type="password" autoComplete="current-password" value={current} onChange={(event) => setCurrent(event.target.value)} />
        </label>
        <label>
          New password
          <input type="password" autoComplete="new-password" value={next} onChange={(event) => setNext(event.target.value)} />
        </label>
        {error && <p className="field-error">{error}</p>}
        {message && <p>{message}</p>}
        <button className="solid" type="submit">
          Change password
        </button>
      </form>
    </div>
  );
}
