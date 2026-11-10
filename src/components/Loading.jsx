export default function Loading({ text = 'Loading...' }) {
  return <p className="loading"><span className="spinner" aria-hidden="true" />{text}</p>;
}
