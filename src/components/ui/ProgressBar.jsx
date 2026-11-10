// value is 0-100. Used for skill scores and interview progress.
export default function ProgressBar({ label, value }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-row" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      {label && <span className="progress-label">{label}</span>}
      <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
      <span className="progress-value">{pct}%</span>
    </div>
  );
}
