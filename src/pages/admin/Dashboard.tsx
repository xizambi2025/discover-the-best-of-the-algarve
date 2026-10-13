import { Link } from "react-router-dom";
import type { StayRequest } from "./types";

export default function Dashboard({ requests }: { requests: StayRequest[] }) {
  const unpaid = requests.filter((request) => !request.paid).length;

  return (
    <div className="admin-home">
      <h1>Dashboard</h1>
      <section className="admin-stats">
        <article>
          <p className="eyebrow">Requests</p>
          <Link className="stat-link" to="/admin/requests">
            {requests.length}
          </Link>
        </article>
        <article>
          <p className="eyebrow">Not yet paid</p>
          <strong>{unpaid}</strong>
        </article>
      </section>
    </div>
  );
}
