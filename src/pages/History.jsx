import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '../components/ui';
import Loading from '../components/Loading';
import ErrorNote from '../components/ErrorNote';
import { api } from '../services/api';
import { fmtDate } from '../utils/format';

export default function History() {
  const [list, setList] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api('/interviews').then((d) => setList(d.interviews)).catch((e) => setError(e.message)); }, []);
  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (!list) return <Loading />;
  return (
    <>
      <div className="page-head"><h1>History</h1><p>Open any interview to see its full report.</p></div>
      {!list.length ? <Card className="placeholder"><p>No interviews yet.</p><Button to="/interview/new">Start your first interview</Button></Card> : (
        <div className="grid grid-3">
          {list.map((i) => {
            const done = i.status === 'completed';
            return (
              <Link key={i._id} to={done ? `/interview/${i._id}/report` : `/interview/${i._id}`} className="card hist">
                <strong>{i.title}</strong>
                <div className="hist-score">{done ? `${i.report.overall}%` : 'In progress'}</div>
                <div className="row"><Badge>{i.difficulty}</Badge><Badge tone={done ? 'success' : 'warning'}>{done ? 'Completed' : `${i.answeredCount}/${i.questionCount}`}</Badge><span className="muted-s">{fmtDate(i.createdAt)}</span></div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
