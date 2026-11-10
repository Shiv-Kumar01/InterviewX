export default function StatGrid({ items }) {
  return <div className="stats">{items.map(([label, value]) => <div key={label} className="card stat"><span className="muted-s">{label}</span><strong>{value}</strong></div>)}</div>;
}
