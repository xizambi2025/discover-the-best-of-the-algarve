import { useState } from "react";
import { euros, when, type StayLine, type StayRequest } from "./types";

function summary(lines: StayLine[]): string {
  if (lines.length === 0) return "—";
  return lines.map((line) => line.title).join(", ");
}

export default function Requests({
  requests,
  onChange,
}: {
  requests: StayRequest[];
  onChange: () => Promise<void>;
}) {
  const [editing, setEditing] = useState<StayRequest | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [payBusy, setPayBusy] = useState<string | null>(null);

  const generatePayment = async (request: StayRequest) => {
    setError("");
    if (request.paymentLink) {
      await navigator.clipboard.writeText(request.paymentLink);
      return;
    }
    setPayBusy(request.id);
    try {
      const response = await fetch("/api/admin/request", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: request.id, action: "generate-payment" }),
      });
      const data = (await response.json()) as { ok?: boolean; paymentLink?: string; code?: string };
      if (!response.ok || !data.ok || !data.paymentLink) {
        if (data.code === "amount") {
          setError("Set the amount due on this request before generating a payment link.");
        } else if (data.code === "wise-token" || data.code === "wise-config") {
          setError("Wise is not configured on the server yet.");
        } else if (data.code === "wise-auth") {
          setError("The Wise API token was rejected.");
        } else {
          setError("The payment link could not be created.");
        }
        return;
      }
      await navigator.clipboard.writeText(data.paymentLink);
      await onChange();
    } finally {
      setPayBusy(null);
    }
  };

  const save = async (request: StayRequest) => {
    setError("");
    const response = await fetch("/api/admin/request", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...request, action: "save" }),
    });
    if (!response.ok) {
      setError("The request could not be saved.");
      return;
    }
    setEditing(null);
    await onChange();
  };

  const remove = async (id: string) => {
    setError("");
    const response = await fetch("/api/admin/request", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, action: "delete" }),
    });
    if (!response.ok) {
      setError("The request could not be deleted.");
      return;
    }
    setPendingDelete(null);
    setEditing(null);
    await onChange();
  };

  return (
    <div className="admin-requests">
      <h1>Requests</h1>
      {requests.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Received</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Experiences</th>
                <th>Paid</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.ref}</td>
                  <td>{when(request.createdAt)}</td>
                  <td>{request.name}</td>
                  <td>{request.email}</td>
                  <td>{request.phone}</td>
                  <td>{summary(request.lines)}</td>
                  <td>{request.paid ? "Paid" : "Not yet"}</td>
                  <td>{request.amount !== null ? euros(request.amount) : "—"}</td>
                  <td className="admin-actions">
                    {!request.paid && (
                      <button
                        type="button"
                        className="ghost"
                        disabled={payBusy === request.id}
                        onClick={() => void generatePayment(request)}
                      >
                        {payBusy === request.id ? "Working…" : "Generate payment link"}
                      </button>
                    )}
                    {request.paymentLink && (
                      <>
                        <button type="button" className="ghost" onClick={() => void navigator.clipboard.writeText(request.paymentLink ?? "")}>
                          Copy payment link
                        </button>
                        <a className="ghost" href={request.paymentLink} target="_blank" rel="noreferrer">
                          Open link
                        </a>
                      </>
                    )}
                    <button type="button" className="ghost" onClick={() => setEditing({ ...request, lines: request.lines.map((line) => ({ ...line, ranges: line.ranges.map((range) => ({ ...range })) })) })}>
                      Edit
                    </button>
                    {pendingDelete === request.id ? (
                      <>
                        <button type="button" className="ghost" onClick={() => void remove(request.id)}>
                          Confirm
                        </button>
                        <button type="button" className="ghost" onClick={() => setPendingDelete(null)}>
                          Keep
                        </button>
                      </>
                    ) : (
                      <button type="button" className="ghost" onClick={() => setPendingDelete(request.id)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {error && <p className="field-error">{error}</p>}
      {editing && (
        <form
          className="admin-edit"
          onSubmit={(event) => {
            event.preventDefault();
            void save(editing);
          }}
        >
          <h2>Edit {editing.ref}</h2>
          <label>
            Name
            <input value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} />
          </label>
          <label>
            Email
            <input value={editing.email} onChange={(event) => setEditing({ ...editing, email: event.target.value })} />
          </label>
          <label>
            Contact
            <input value={editing.phone} onChange={(event) => setEditing({ ...editing, phone: event.target.value })} />
          </label>
          <label>
            Notes
            <textarea value={editing.notes} onChange={(event) => setEditing({ ...editing, notes: event.target.value })} />
          </label>
          <label className="check accept">
            <input
              type="checkbox"
              checked={editing.paid}
              onChange={(event) => setEditing({ ...editing, paid: event.target.checked })}
            />
            <span>Paid</span>
          </label>
          <label>
            Amount due, in euros
            <input
              inputMode="decimal"
              value={editing.amount ?? ""}
              onChange={(event) => {
                const text = event.target.value;
                setEditing({ ...editing, amount: text === "" ? null : Number(text) });
              }}
            />
          </label>
          {editing.lines.map((line, index) => (
            <fieldset key={`${line.activityId}-${index}`}>
              <legend>{line.title}</legend>
              <label>
                Date
                <input
                  type="date"
                  value={line.date}
                  onChange={(event) => {
                    const lines = editing.lines.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, date: event.target.value } : item,
                    );
                    setEditing({ ...editing, lines });
                  }}
                />
              </label>
              <label>
                People
                <input
                  type="number"
                  min={1}
                  max={16}
                  value={line.people}
                  onChange={(event) => {
                    const lines = editing.lines.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, people: Number(event.target.value) } : item,
                    );
                    setEditing({ ...editing, lines });
                  }}
                />
              </label>
              {line.ranges.map((range, rangeIndex) => (
                <div className="admin-range" key={`${range.start}-${rangeIndex}`}>
                  <label>
                    From
                    <input
                      type="time"
                      value={range.start}
                      onChange={(event) => {
                        const ranges = line.ranges.map((item, itemIndex) =>
                          itemIndex === rangeIndex ? { ...item, start: event.target.value } : item,
                        );
                        const lines = editing.lines.map((item, itemIndex) => (itemIndex === index ? { ...item, ranges } : item));
                        setEditing({ ...editing, lines });
                      }}
                    />
                  </label>
                  <label>
                    Until
                    <input
                      type="time"
                      value={range.end}
                      onChange={(event) => {
                        const ranges = line.ranges.map((item, itemIndex) =>
                          itemIndex === rangeIndex ? { ...item, end: event.target.value } : item,
                        );
                        const lines = editing.lines.map((item, itemIndex) => (itemIndex === index ? { ...item, ranges } : item));
                        setEditing({ ...editing, lines });
                      }}
                    />
                  </label>
                </div>
              ))}
            </fieldset>
          ))}
          <div className="dialog-actions">
            <button className="solid" type="submit">
              Save
            </button>
            <button className="ghost" type="button" onClick={() => setEditing(null)}>
              Close
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
