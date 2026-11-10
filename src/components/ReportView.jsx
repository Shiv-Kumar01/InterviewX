import { Link } from 'react-router-dom';
import { Card, Badge, ProgressBar, Button } from './ui';
import { RadarCard, TopicBars } from '../charts/Charts';
import RoadmapDays from './RoadmapDays';
import { DIMENSIONS, CONFIDENCE_NOTE } from '../utils/constants';
import { fmt } from '../utils/format';

export default function ReportView({ title, report, answers = [], demo }) {
  const fb = report.feedback;
  return (
    <>
      <div className="page-head">
        <h1>Interview complete</h1>
        <p>{title} {demo && <Badge tone="warning">Demo Data</Badge>}</p>
      </div>

      <div className="grid report-top">
        <Card className="score-card">
          <div className="big-score">{report.overall}<span> / 100</span></div>
          <p>Overall score</p>
          <p className="muted-s">{fmt(report.totalSeconds)} total, {report.avgSecondsPerQuestion}s average per question, {report.questionsAnswered} answered</p>
        </Card>
        <Card title="Score breakdown">
          <div className="stack">{DIMENSIONS.map(([k, l]) => <ProgressBar key={k} label={l} value={report.dimensions[k]} />)}</div>
          <p className="muted-s" style={{ marginTop: 'var(--sp-3)' }}>{CONFIDENCE_NOTE}</p>
        </Card>
      </div>

      <div className="grid grid-2" style={{ marginTop: 'var(--sp-4)' }}>
        <Card title="Skill radar"><RadarCard data={report.skills} /><p className="muted-s">An axis at 0 means that area was not covered in this interview.</p></Card>
        <Card title="Topic performance"><TopicBars data={report.byTopic} /></Card>
      </div>

      {fb && (
        <Card title="AI feedback" style={{ marginTop: 'var(--sp-4)' }}>
          <p>{fb.summary}</p>
          <div className="grid grid-2" style={{ marginTop: 'var(--sp-4)' }}>
            <div><h4>What you did well</h4><ul>{fb.wentWell.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div><h4>What you missed</h4><ul>{fb.missed.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </div>
          {fb.improvement && <p><strong>Recommended improvement:</strong> {fb.improvement}</p>}
          {fb.source === 'fallback' && <p className="muted-s">The AI was unavailable, so this feedback was generated from your scores.</p>}
        </Card>
      )}

      {report.roadmap && (
        <section style={{ marginTop: 'var(--sp-6)' }}>
          <h2 className="section-title">Your 7-day improvement plan</h2>
          <RoadmapDays days={report.roadmap} />
        </section>
      )}

      {answers.length > 0 && (
        <section style={{ marginTop: 'var(--sp-6)' }}>
          <h2 className="section-title">Question by question</h2>
          <div className="stack">
            {answers.map((a) => (
              <details key={a.order} className="card qa">
                <summary><span>{a.order}. {a.question.text}</span><Badge tone={a.evaluation.overall >= 70 ? 'success' : 'warning'}>{a.evaluation.overall}</Badge></summary>
                <p className="muted-s">{a.question.topic} - {a.question.difficulty}{a.question.isFollowUp ? ' - follow-up' : ''}</p>
                <pre className="answer-text">{a.code || a.answerText}</pre>
                {a.evaluation.missingPoints.length > 0 && <p><strong>Missed:</strong> {a.evaluation.missingPoints.join('; ')}</p>}
              </details>
            ))}
          </div>
        </section>
      )}
      {!demo && <div className="row" style={{ marginTop: 'var(--sp-6)' }}><Button to="/interview/new">Start another interview</Button><Button to="/history" variant="secondary">All interviews</Button></div>}
    </>
  );
}
