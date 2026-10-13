import type { StayRequest } from "./types";

function monthLabel(date: string): { key: string; label: string } | null {
  const match = /^(\d{4})-(\d{2})-\d{2}$/.exec(date);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return {
    key: `${match[1]}-${match[2]}`,
    label: new Date(year, month - 1, 1).toLocaleString("en-GB", { month: "long", year: "numeric" }),
  };
}

export default function Reports({ requests }: { requests: StayRequest[] }) {
  const byExperience = new Map<string, { title: string; count: number }>();
  const byMonth = new Map<string, { label: string; count: number }>();

  for (const request of requests) {
    for (const line of request.lines) {
      const key = line.activityId || line.title;
      const current = byExperience.get(key) ?? { title: line.title, count: 0 };
      current.count += 1;
      byExperience.set(key, current);
      const month = monthLabel(line.date);
      if (!month) continue;
      const bucket = byMonth.get(month.key) ?? { label: month.label, count: 0 };
      bucket.count += 1;
      byMonth.set(month.key, bucket);
    }
  }

  const experiences = [...byExperience.values()].sort(
    (left, right) => right.count - left.count || left.title.localeCompare(right.title),
  );
  const months = [...byMonth.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, value]) => value);

  return (
    <div className="admin-reports">
      <h1>Reports</h1>
      {experiences.length === 0 ? (
        <p>Nothing to report yet.</p>
      ) : (
        <>
          <section>
            <h2>Most requested</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Experience</th>
                    <th>Times requested</th>
                  </tr>
                </thead>
                <tbody>
                  {experiences.map((item) => (
                    <tr key={item.title}>
                      <td>{item.title}</td>
                      <td>{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <section>
            <h2>Time of year</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Experiences</th>
                  </tr>
                </thead>
                <tbody>
                  {months.map((item) => (
                    <tr key={item.label}>
                      <td>{item.label}</td>
                      <td>{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
