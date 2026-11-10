import StepPlayer from './StepPlayer';

const START = [5, 2, 9, 1, 6];

function buildSteps() {
  const a = [...START], steps = [{ arr: [...a], caption: 'Bubble sort: compare neighbours and swap if out of order.' }];
  for (let end = a.length - 1; end > 0; end--) {
    for (let j = 0; j < end; j++) {
      const swap = a[j] > a[j + 1];
      steps.push({ arr: [...a], cmp: [j, j + 1], caption: `Compare ${a[j]} and ${a[j + 1]}${swap ? ': swap.' : ': already in order.'}` });
      if (swap) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; steps.push({ arr: [...a], cmp: [j, j + 1], swapped: true, caption: `Swapped. Array is now [${a.join(', ')}].` }); }
    }
  }
  steps.push({ arr: [...a], done: true, caption: `Sorted: [${a.join(', ')}]. Time O(n^2), space O(1).` });
  return steps;
}

export default function SortViz() {
  return (
    <StepPlayer steps={buildSteps()} render={(s) => (
      <div className="viz-row bars">
        {s.arr.map((n, idx) => (
          <div key={idx} className={`bar ${s.cmp?.includes(idx) ? (s.swapped ? 'good' : 'active') : ''} ${s.done ? 'good' : ''}`} style={{ height: n * 22 }}>{n}</div>
        ))}
      </div>
    )} />
  );
}
