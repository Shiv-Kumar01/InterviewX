import { useEffect, useState } from 'react';
import { Card, Badge } from '../components/ui';
import Loading from '../components/Loading';
import ErrorNote from '../components/ErrorNote';
import { api } from '../services/api';
import { TOPICS, DIFFICULTIES } from '../utils/constants';

export default function Questions() {
  const [f, setF] = useState({ topic: '', difficulty: '', type: '' });
  const [list, setList] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    setList(null);
    api(`/questions?${new URLSearchParams(Object.entries(f).filter(([, v]) => v))}`).then((d) => setList(d.questions)).catch((e) => setError(e.message));
  }, [f]);
  const sel = (k, opts, label) => (
    <select className="input" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-label={label}>
      <option value="">{label}</option>{opts.map((o) => <option key={o}>{o}</option>)}
    </select>
  );
  return (
    <>
      <div className="page-head"><h1>Question bank</h1><p>Browse the questions interviews are built from.</p></div>
      <div className="row" style={{ marginBottom: 'var(--sp-4)' }}>{sel('topic', [...TOPICS, 'Behavioral'], 'All topics')}{sel('difficulty', DIFFICULTIES, 'All levels')}{sel('type', ['technical', 'behavioral', 'coding'], 'All types')}</div>
      <ErrorNote>{error}</ErrorNote>
      {!list ? <Loading /> : (
        <div className="stack">
          {list.map((q) => (
            <Card key={q._id}>
              <p>{q.text}</p>
              <div className="row" style={{ marginTop: 'var(--sp-3)' }}><Badge tone="accent">{q.topic}</Badge><Badge>{q.difficulty}</Badge><Badge>{q.type}</Badge></div>
            </Card>
          ))}
          {!list.length && <p className="muted-s">No questions match these filters.</p>}
        </div>
      )}
    </>
  );
}
