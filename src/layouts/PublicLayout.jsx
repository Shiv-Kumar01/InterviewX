import { Link, Outlet } from 'react-router-dom';
import { Button } from '../components/ui';

export default function PublicLayout() {
  return (
    <>
      <header className="pub-nav">
        <Link to="/" className="brand"><span className="brand-mark">X</span>InterviewX</Link>
        <div className="row">
          <Button to="/login" variant="ghost">Log in</Button>
          <Button to="/register" variant="secondary">Create account</Button>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="pub-footer">InterviewX runs locally. Your answers never leave your machine.</footer>
    </>
  );
}
