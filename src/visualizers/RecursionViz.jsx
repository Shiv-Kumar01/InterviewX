import StepPlayer from './StepPlayer';

// factorial(4): shows the call stack growing, then unwinding with return values.
function buildSteps(n = 4) {
  const steps = [], stack = [];
  for (let k = n; k >= 1; k--) {
    stack.push({ label: `factorial(${k})` });
    steps.push({ stack: stack.map((f) => ({ ...f })), caption: k === 1 ? 'Base case reached: factorial(1) returns 1.' : `Call factorial(${k}); it needs factorial(${k - 1}) first.` });
  }
  let value = 1;
  for (let k = 1; k <= n; k++) {
    value = k === 1 ? 1 : k * value;
    stack[n - k].ret = value;
    steps.push({ stack: stack.slice(0, n - k + 1).map((f) => ({ ...f })), caption: `factorial(${k}) returns ${value}. Frame popped.` });
  }
  return steps;
}

export default function RecursionViz() {
  return (
    <StepPlayer steps={buildSteps()} render={(s) => (
      <div className="stack-view">
        {[...s.stack].reverse().map((f, i) => (
          <div key={f.label} className={`frame ${i === 0 ? 'active' : ''}`}>{f.label}{f.ret ? ` = ${f.ret}` : ''}</div>
        ))}
        <small className="muted-s">call stack (top first)</small>
      </div>
    )} />
  );
}
