import { useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui';

// Generic player: each visualizer precomputes `steps` (plain data); this just walks through them.
export default function StepPlayer({ steps, render }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return undefined;
    if (i >= steps.length - 1) { setPlaying(false); return undefined; }
    const id = setTimeout(() => setI((n) => n + 1), 900);
    return () => clearTimeout(id);
  }, [playing, i, steps.length]);

  const step = steps[i];
  return (
    <div className="viz">
      <div className="viz-stage">{render(step)}</div>
      <p className="viz-caption">{step.caption}</p>
      <div className="row">
        <Button variant="ghost" aria-label="Previous step" onClick={() => setI(Math.max(0, i - 1))}><SkipBack size={16} /></Button>
        <Button variant="secondary" onClick={() => { if (i >= steps.length - 1) setI(0); setPlaying(!playing); }}>
          {playing ? <><Pause size={16} />Pause</> : <><Play size={16} />Play</>}
        </Button>
        <Button variant="ghost" aria-label="Next step" onClick={() => setI(Math.min(steps.length - 1, i + 1))}><SkipForward size={16} /></Button>
        <Button variant="ghost" aria-label="Reset" onClick={() => { setPlaying(false); setI(0); }}><RotateCcw size={16} /></Button>
        <span className="muted-s">Step {i + 1} / {steps.length}</span>
      </div>
    </div>
  );
}
