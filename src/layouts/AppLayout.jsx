import { useState } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlayCircle, History, BarChart3, Library, Map, Menu, LogOut, Binary } from 'lucide-react';
import { Button } from '../components/ui';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/interview/new', label: 'New interview', icon: PlayCircle },
  { to: '/history', label: 'History', icon: History },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/questions', label: 'Question bank', icon: Library },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/visualizer', label: 'DSA visualizer', icon: Binary },
];

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const current = NAV.find((n) => pathname.startsWith(n.to))?.label ?? 'InterviewX';

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <Link to="/" className="brand"><span className="brand-mark">X</span>InterviewX</Link>
        <nav className="nav" aria-label="Main">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>
        <p className="sidebar-foot">Practice. Perform. Improve.</p>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="row">
            <Button variant="ghost" className="menu-btn" aria-label="Open menu" onClick={() => setOpen((o) => !o)}><Menu size={18} /></Button>
            <strong>{current}</strong>
          </div>
          <div className="row">
            <Button variant="ghost" aria-label="Log out" onClick={logout}><LogOut size={18} />Log out</Button>
            <div className="avatar" title={user?.name}>{user?.name?.[0]?.toUpperCase()}</div>
          </div>
        </header>
        <div className="content"><Outlet /></div>
      </div>
    </div>
  );
}
