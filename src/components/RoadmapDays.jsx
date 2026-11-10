export default function RoadmapDays({ days }) {
  return (
    <div className="grid grid-3">
      {days.map((d) => (
        <div key={d.day} className="card day">
          <span className="badge badge-accent">Day {d.day}</span>
          <h4>{d.title}</h4>
          <ul>{d.tasks.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}
