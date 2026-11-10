import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, ProgressBar, Badge } from '../components/ui';
import Loading from '../components/Loading';
import ErrorNote from '../components/ErrorNote';
import StatGrid from '../components/StatGrid';
import { TrendChart } from '../charts/Charts';
import { api } from '../services/api';
import { DIMENSIONS } from '../utils/constants';
import { fmtDate } from '../utils/format';

export const statItems = (a) => [
  ['Interviews', a.totalInterviews], ['Average score', `${a.averageScore}%`], ['Best score', `${a.bestScore}%`],
  ['Questions answered', a.questionsAnswered], ['Day streak', a.streak], ['Avg response', `${a.averageResponseSec}s`],
  ['Strongest', a.strongest?.topic || '-'], ['Weakest', a.weakest?.topic || '-'],
];

export default function Dashboard() {
  const { user } = useAuth();
  const [a, setA] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api('/analytics').then(setA).catch((e) => setError(e.message)); }, []);
  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (!a) return <Loading />;

  return (
    <>
      <div className="page-head"><h1>Welcome, {user.name.split(' ')[0]}</h1><p>Here is where your interview readiness stands.</p></div>
      {!a.totalInterviews ? (
        <Card className="placeholder">
          <h3>No interviews yet</h3>
          <p>Take your first mock interview to unlock scores, charts and a personal roadmap.</p>
          <div className="row" style={{ justifyContent: 'center' }}><Button to="/interview/new">Start new interview</Button><Button to="/demo" variant="secondary">See a demo report</Button></div>
        </Card>
      ) : (
        <>
          <div className="grid grid-2">
            <Card title="Interview readiness">
              <div className="big-score">{a.readiness}<span> / 100</span></div>
              <p className="muted-s">Average of your last 3 interviews.</p>
              <div className="stack" style={{ marginTop: 'var(--sp-4)' }}>{DIMENSIONS.map(([k, l]) => <ProgressBar key={k} label={l} value={a.dimensions[k]} />)}</div>
            </Card>
            <Card title="Recent interviews">
              <div className="stack">
                {a.recent.map((r) => <Link key={r.id} to={`/interview/${r.id}/report`} className="row recent"><span>{r.title}</span><span className="muted-s">{fmtDate(r.date)}</span><Badge tone="accent">{r.score}%</Badge></Link>)}
                <Button to="/interview/new">Start new interview</Button>
              </div>
            </Card>
          </div>
          <div style={{ margin: 'var(--sp-4) 0' }}><StatGrid items={statItems(a)} /></div>
          <Card title="Improvement over time"><TrendChart data={a.trend} /></Card>
        </>
      )}
    </>
  );
}
