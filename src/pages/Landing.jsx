import { lazy, Suspense } from 'react';
import { Mic, Gauge, Target, Route, Clock } from 'lucide-react';
import { Button, Card } from '../components/ui';

const CoreScene = lazy(() => import('../components/CoreScene')); // keeps three.js out of the main bundle

const FEATURES = [
  { icon: Mic, title: 'Realistic interviews', text: 'Pick a role, topics and difficulty. Follow-up questions adapt to how you answer.' },
  { icon: Gauge, title: 'AI evaluation', text: 'Every answer is scored on several dimensions with notes on what you missed.' },
  { icon: Target, title: 'Skill analysis', text: 'See which topics are strong and which need work, across every session.' },
  { icon: Route, title: 'Personalized improvement', text: 'Get a 7-day plan based on your weakest areas.' },
  { icon: Clock, title: 'Interview history', text: 'Reopen any past report and watch your scores climb.' },
];

export default function Landing() {
  return (
    <>
      <section className="hero">
        <div>
          <p className="hero-tag">Practice. Perform. Improve.</p>
          <h1>AI-Powered Mock Interviews</h1>
          <p>Practice realistic technical interviews, get instant AI feedback, identify skill gaps, and improve with every session.</p>
          <div className="row">
            <Button to="/register" size="lg">Start Interview</Button>
            <Button to="/demo" size="lg" variant="secondary">Explore Dashboard</Button>
          </div>
        </div>

        <Suspense fallback={<div className="scene" />}><CoreScene /></Suspense>
      </section>

      <section className="features">
        <h2>Everything you need to get interview-ready</h2>
        <div className="grid grid-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="feature">
              <span className="pipe-icon"><Icon size={20} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
