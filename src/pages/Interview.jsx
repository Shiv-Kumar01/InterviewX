import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pause, Play, Square } from 'lucide-react';
import { Button, Card, Badge, ProgressBar } from '../components/ui';
import Modal from '../components/ui/Modal';
import Loading from '../components/Loading';
import ErrorNote from '../components/ErrorNote';
import CodeEditor from '../components/CodeEditor';
import EvaluationPanel from '../components/EvaluationPanel';
import TwoSumViz from '../visualizers/TwoSumViz';
import useTimer from '../hooks/useTimer';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { fmt } from '../utils/format';

export default function Interview() {
  const { id } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    api(`/interviews/${id}`).then((d) => (d.interview.status === 'completed' ? nav(`/interview/${id}/report`, { replace: true }) : setData(d))).catch((e) => setError(e.message));
  }, [id, nav]);
  if (error) return <Card><ErrorNote>{error}</ErrorNote></Card>;
  if (!data) return <Loading text="Loading interview..." />;
  return <Session interview={data.interview} previous={data.answers.reduce((s, a) => s + (a.timeSpentSec || 0), 0)} />;
}

function Session({ interview, previous }) {
  const nav = useNavigate();
  const toast = useToast();
  const total = interview.questionCount;
  const [current, setCurrent] = useState(interview.current);
  const [answered, setAnswered] = useState(interview.answeredCount);
  const [text, setText] = useState('');
  const [code, setCode] = useState(interview.current.starterCode?.javascript || '');
  const [lang, setLang] = useState('javascript');
  const [tests, setTests] = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState('');     // '', 'submit', 'run', 'finish'
  const [error, setError] = useState('');
  const [showEnd, setShowEnd] = useState(false);

  const timer = useTimer({ initial: previous, limit: interview.durationMin * 60, onExpire: () => { toast('Time is up. Building your report...'); finish(); } });
  const isCoding = current.type === 'coding';
  const locked = !!result || !!busy || !timer.running;

  async function submit() {
    if (locked) return;
    if (isCoding ? !code.trim() : !text.trim()) return toast('Write your answer first.');
    setBusy('submit'); setError('');
    try {
      const d = await api(`/interviews/${interview._id}/answer`, { method: 'POST', body: { answerText: text, code, language: lang, timeSpentSec: timer.sinceLap() } });
      timer.markLap(); setResult(d); setAnswered(d.answeredCount);
    } catch (e) { setError(e.message); } finally { setBusy(''); }
  }

  async function run() {
    if (locked) return;
    setBusy('run'); setError('');
    try { setTests(await api('/code/run', { method: 'POST', body: { questionId: current.questionId, code } })); }
    catch (e) { setError(e.message); } finally { setBusy(''); }
  }

  async function finish() {
    setShowEnd(false); setBusy('finish'); setError('');
    try { await api(`/interviews/${interview._id}/finish`, { method: 'POST', body: { totalSeconds: timer.seconds } }); nav(`/interview/${interview._id}/report`); }
    catch (e) { setError(e.message); setBusy(''); }
  }

  function next() {
    if (result.done) return finish();
    setCurrent(result.next); setResult(null); setText(''); setTests(null); setLang('javascript'); setCode(result.next.starterCode?.javascript || '');
  }

  useEffect(() => {
    const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); submit(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (busy === 'finish') return <Loading text="Building your performance report..." />;
  const qNum = result ? answered : answered + 1;
  const limit = interview.durationMin * 60;

  return (
    <>
      <Card className="session-bar">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="row"><strong>Question {Math.min(qNum, total)} / {total}</strong><Badge tone="accent">{current.topic}</Badge><Badge>{current.difficulty}</Badge>{current.isFollowUp && <Badge tone="warning">Follow-up</Badge>}</div>
          <div className="row">
            <span className="timer" aria-label="Timer">{fmt(limit ? Math.max(0, limit - timer.seconds) : timer.seconds)}</span>
            <Button variant="secondary" onClick={timer.running ? timer.pause : timer.resume}>{timer.running ? <><Pause size={16} />Pause</> : <><Play size={16} />Resume</>}</Button>
            <Button variant="ghost" onClick={() => setShowEnd(true)}><Square size={16} />End</Button>
          </div>
        </div>
        <ProgressBar value={Math.round(((qNum - 1 + (result ? 1 : 0)) / total) * 100)} />
      </Card>

      <Card className="question" glass>
        {!timer.running && <p className="paused">Paused. Resume to keep answering.</p>}
        <p className="q-text">{current.text}</p>
      </Card>

      {isCoding ? (
        <div className="stack" style={{ marginTop: 'var(--sp-4)' }}>
          <div className="row">
            <select className="input" value={lang} onChange={(e) => { setLang(e.target.value); setCode(current.starterCode?.[e.target.value] || ''); setTests(null); }} disabled={locked}>
              <option value="javascript">JavaScript (runs tests)</option><option value="java">Java (AI review only)</option>
            </select>
            <Button variant="secondary" onClick={run} disabled={locked || lang !== 'javascript'}>{busy === 'run' ? 'Running...' : 'Run code'}</Button>
          </div>
          <CodeEditor value={code} onChange={setCode} disabled={locked} />
          {tests && (
            <Card title={tests.error ? 'Could not run' : `Test cases: ${tests.passed} / ${tests.total} passed`}>
              {tests.error ? <ErrorNote>{tests.error}</ErrorNote> : tests.results.map((r, i) => (
                <p key={i} className={r.ok ? 'test-ok' : 'test-bad'}>{r.ok ? '✓' : '✗'} Test {i + 1}: input {r.input}, expected {r.expected}{r.ok ? '' : `, got ${r.actual}`}</p>
              ))}
            </Card>
          )}
          {current.visualizer === 'twosum' && <details className="card"><summary>Visualize the HashMap approach</summary><TwoSumViz /></details>}
        </div>
      ) : (
        <textarea className="input answer-box" placeholder="Type your answer here. Ctrl + Enter to submit." value={text} onChange={(e) => setText(e.target.value)} disabled={locked} aria-label="Your answer" />
      )}

      <ErrorNote>{error}</ErrorNote>
      {busy === 'submit' && <Loading text="Evaluating your answer..." />}
      {!result && <div className="row" style={{ marginTop: 'var(--sp-4)' }}><Button size="lg" onClick={submit} disabled={locked}>Submit answer</Button><span className="muted-s">Ctrl + Enter</span></div>}

      {result && (
        <div className="stack" style={{ marginTop: 'var(--sp-4)' }}>
          <EvaluationPanel evaluation={result.evaluation} testResults={result.testResults} />
          <div><Button size="lg" onClick={next}>{result.done ? 'Finish and view report' : 'Next question'}</Button></div>
        </div>
      )}

      <Modal open={showEnd} onClose={() => setShowEnd(false)} title="End this interview?">
        <p className="muted-s">Your answered questions will be scored in the report. The current question will be skipped.</p>
        <div className="row" style={{ marginTop: 'var(--sp-4)' }}><Button onClick={finish}>End and see report</Button><Button variant="ghost" onClick={() => setShowEnd(false)}>Keep going</Button></div>
      </Modal>
    </>
  );
}
