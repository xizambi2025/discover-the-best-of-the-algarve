import { euros, when, type StayRequest } from "./types";

export default function Financial({ requests }: { requests: StayRequest[] }) {
  const paid = requests.filter((request) => request.paid);
  const received = paid.reduce((sum, request) => sum + (request.amount ?? 0), 0);

  return (
    <div className="admin-page">
      <h1>Financial</h1>
      <section className="admin-summary">
        <p className="eyebrow">Payments received</p>
        <p className="admin-total">{euros(received)}</p>
        <p>{paid.length === 1 ? "1 stay has been paid." : `${paid.length} stays have been paid.`}</p>
      </section>
      {paid.length === 0 ? (
        <p>No payments recorded yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Guest</th>
                <th>Paid on</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {paid.map((request) => (
                <tr key={request.id}>
                  <td>{request.ref}</td>
                  <td>{request.name}</td>
                  <td>{request.paidAt ? when(request.paidAt) : "—"}</td>
                  <td>{request.amount !== null ? euros(request.amount) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
