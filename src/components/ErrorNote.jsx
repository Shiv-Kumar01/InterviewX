export default function ErrorNote({ children }) {
  return children ? <p role="alert" className="error-note">{children}</p> : null;
}
