import { useEffect, useState } from 'react';
import { Card, Button, Badge } from '../components/ui';
import Loading from '../components/Loading';
import ErrorNote from '../components/ErrorNote';
import RoadmapDays from '../components/RoadmapDays';
import { api } from '../services/api';

export default function Roadmap() {
  const [r, setR] = useState(undefined);
  const [error, setError] = useState('');
  useEffect(() => { api('/roadmap').then((d) => setR(d.roadmap)).catch((e) => setError(e.message)); }, []);
  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (r === undefined) return <Loading />;
  return (
    <>
      <div className="page-head"><h1>Your 7-day improvement plan</h1><p>Built from the weakest areas of your latest interview.</p></div>
      {!r ? <Card className="placeholder"><p>Finish an interview to get a personalised plan.</p><Button to="/interview/new">Start an interview</Button></Card> : (
        <>
          <p className="row">{r.focusTopics.map((t) => <Badge key={t} tone="warning">{t}</Badge>)}{r.source === 'fallback' && <span className="muted-s">Generated from scores (AI was unavailable).</span>}</p>
          <RoadmapDays days={r.days} />
        </>
      )}
    </>
  );
}
