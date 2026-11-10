// tone: neutral | accent | success | warning | danger
export default function Badge({ tone = 'neutral', children }) {
  return <span className={`badge ${tone === 'neutral' ? '' : `badge-${tone}`}`}>{children}</span>;
}
