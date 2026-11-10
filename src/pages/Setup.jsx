import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import Loading from '../components/Loading';
import ErrorNote from '../components/ErrorNote';
import { api } from '../services/api';
import { TOPICS, ROLES, DIFFICULTIES, MODES, COUNTS, DURATIONS } from '../utils/constants';

function Chips({ options, value, onChange, multi }) {
  const on = (id) => (multi ? value.includes(id) : value === id);
  const click = (id) => onChange(multi ? (value.includes(id) ? value.filter((x) => x !== id) : [...value, id]) : id);
  return <div className="chips">{options.map((o) => { const id = o.id ?? o.v ?? o; return <button type="button" key={id} className={`chip ${on(id) ? 'active' : ''}`} onClick={() => click(id)}>{o.label ?? o}</button>; })}</div>;
}

export default function Setup() {
  const nav = useNavigate();
  const [cfg, setCfg] = useState({ role: 'Full Stack Developer', difficulty: 'Medium', topics: ROLES['Full Stack Developer'], mode: 'technical', questionCount: 5, durationMin: 0 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [health, setHealth] = useState(null);
  const set = (k) => (v) => setCfg((c) => ({ ...c, [k]: v }));
  const usesTopics = ['technical', 'mixed', 'rapid'].includes(cfg.mode);

  useEffect(() => { api('/health').then(setHealth).catch(() => setHealth({ database: 'unavailable', ai: 'unavailable' })); }, []);

  async function begin() {
    setBusy(true); setError('');
    try { const d = await api('/interviews', { method: 'POST', body: cfg }); nav(`/interview/${d.interview._id}`); }
    catch (e) { setError(e.message); setBusy(false); }
  }
  if (busy) return <Loading text="Generating interview..." />;

  return (
    <>
      <div className="page-head"><h1>New interview</h1><p>Choose what to practise. Questions adapt to your answers as you go.</p></div>
      {health && (health.ai !== 'connected' || !health.modelConfigured) && (
        <Card className="warn-card"><strong>AI not ready.</strong> {health.ai !== 'connected' ? 'Ollama is not reachable. Start it before submitting answers.' : 'Set OLLAMA_MODEL in your .env file and restart the server.'}</Card>
      )}
      <Card className="stack setup">
        <div className="field"><label>Role</label><Chips options={Object.keys(ROLES)} value={cfg.role} onChange={(r) => setCfg((c) => ({ ...c, role: r, topics: ROLES[r] }))} /></div>
        <div className="field"><label>Mode</label><Chips options={MODES} value={cfg.mode} onChange={set('mode')} /></div>
        {usesTopics && <div className="field"><label>Topics</label><Chips multi options={TOPICS} value={cfg.topics} onChange={set('topics')} /></div>}
        <div className="field"><label>Difficulty</label><Chips options={DIFFICULTIES} value={cfg.difficulty} onChange={set('difficulty')} /></div>
        <div className="field"><label>Number of questions</label><Chips options={COUNTS} value={cfg.questionCount} onChange={set('questionCount')} /></div>
        <div className="field"><label>Time limit</label><Chips options={DURATIONS} value={cfg.durationMin} onChange={set('durationMin')} /></div>
        <ErrorNote>{error}</ErrorNote>
        <div><Button size="lg" onClick={begin}>Begin interview</Button></div>
      </Card>
    </>
  );
}
