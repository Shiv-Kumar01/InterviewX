import { Button } from '../components/ui';

export default function NotFound() {
  return (
    <div className="auth-wrap">
      <div className="stack" style={{ alignItems: 'center', textAlign: 'center' }}>
        <h1>Page not found</h1>
        <p className="muted" style={{ color: 'var(--text-muted)' }}>That address does not match any page in InterviewX.</p>
        <Button to="/">Back to home</Button>
      </div>
    </div>
  );
}
