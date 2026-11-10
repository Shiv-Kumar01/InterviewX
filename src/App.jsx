import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import Demo from './pages/Demo';
import DesignSystem from './pages/DesignSystem';
import Dashboard from './pages/Dashboard';
import Setup from './pages/Setup';
import Interview from './pages/Interview';
import Report from './pages/Report';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Questions from './pages/Questions';
import Roadmap from './pages/Roadmap';
import Visualizer from './pages/Visualizer';
import NotFound from './pages/NotFound';

// Public shell: landing, auth, demo. App shell: everything behind login (ProtectedRoute).
export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/design-system" element={<DesignSystem />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview/new" element={<Setup />} />
          <Route path="/interview/:id" element={<Interview />} />
          <Route path="/interview/:id/report" element={<Report />} />
          <Route path="/history" element={<History />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/visualizer" element={<Visualizer />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
