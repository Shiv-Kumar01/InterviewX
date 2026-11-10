import { useEffect, useState } from 'react';
import { Card, Button } from '../components/ui';
import Loading from '../components/Loading';
import ErrorNote from '../components/ErrorNote';
import StatGrid from '../components/StatGrid';
import { RadarCard, TrendChart, TopicBars } from '../charts/Charts';
import { api } from '../services/api';
import { statItems } from './Dashboard';

export function AnalyticsView({ a, skills }) {
  return (
    <>
      <StatGrid items={statItems(a)} />
      <div className="grid grid-2" style={{ marginTop: 'var(--sp-4)' }}>
        <Card title="Score trend"><TrendChart data={a.trend} /></Card>
        <Card title="Skill radar (all interviews)"><RadarCard data={skills} /></Card>
      </div>
      <Card title="Topic performance" style={{ marginTop: 'var(--sp-4)' }}><TopicBars data={a.topics} /></Card>
    </>
  );
}

export default function Analytics() {
  const [state, setState] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { Promise.all([api('/analytics'), api('/skills')]).then(([a, s]) => setState({ a, skills: s.skills })).catch((e) => setError(e.message)); }, []);
  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (!state) return <Loading text="Crunching your numbers..." />;
  return (
    <>
      <div className="page-head"><h1>Analytics</h1><p>How your scores and topics are trending.</p></div>
      {!state.a.totalInterviews ? <Card className="placeholder"><p>Complete an interview to see analytics.</p><Button to="/interview/new">Start an interview</Button></Card> : <AnalyticsView {...state} />}
    </>
  );
}
