import { useState } from 'react';
import { Card, Badge } from '../components/ui';
import TwoSumViz from '../visualizers/TwoSumViz';
import SortViz from '../visualizers/SortViz';
import RecursionViz from '../visualizers/RecursionViz';

const VIZ = [
  { id: 'twosum', label: 'Two Sum (HashMap)', note: 'Time O(n), space O(n)', C: TwoSumViz },
  { id: 'sort', label: 'Bubble sort', note: 'Time O(n^2), space O(1)', C: SortViz },
  { id: 'rec', label: 'Recursion stack', note: 'factorial(4): the call stack grows, then unwinds', C: RecursionViz },
];

export default function Visualizer() {
  const [id, setId] = useState('twosum');
  const v = VIZ.find((x) => x.id === id);
  return (
    <>
      <div className="page-head"><h1>DSA visualizer</h1><p>Step through the algorithms that come up in interviews. These run in your browser with plain JavaScript, no AI involved.</p></div>
      <div className="chips" style={{ marginBottom: 'var(--sp-4)' }}>{VIZ.map((x) => <button key={x.id} className={`chip ${x.id === id ? 'active' : ''}`} onClick={() => setId(x.id)}>{x.label}</button>)}</div>
      <Card><Badge tone="accent">{v.note}</Badge><v.C key={v.id} /></Card>
    </>
  );
}
