import StepPlayer from './StepPlayer';

const NUMS = [2, 7, 11, 15], TARGET = 9;

// Builds the algorithm's steps with the real one-pass HashMap logic.
function buildSteps() {
  const steps = [], map = {};
  for (let i = 0; i < NUMS.length; i++) {
    const need = TARGET - NUMS[i];
    if (need in map) {
      steps.push({ i, need, map: { ...map }, found: [map[need], i], caption: `i=${i}: need ${TARGET} - ${NUMS[i]} = ${need}. It is in the map at index ${map[need]}. Answer: [${map[need]}, ${i}]` });
      return steps;
    }
    steps.push({ i, need, map: { ...map }, caption: `i=${i}: need ${TARGET} - ${NUMS[i]} = ${need}. Not in the map, so store ${NUMS[i]} -> ${i}.` });
    map[NUMS[i]] = i;
  }
  return steps;
}

export default function TwoSumViz() {
  return (
    <StepPlayer steps={buildSteps()} render={(s) => (
      <>
        <div className="viz-row">
          {NUMS.map((n, idx) => (
            <div key={idx} className={`cell ${idx === s.i ? 'active' : ''} ${s.found?.includes(idx) ? 'good' : ''}`}>{n}<small>{idx}</small></div>
          ))}
        </div>
        <p className="muted-s">HashMap (value -&gt; index): {Object.keys(s.map).length ? Object.entries(s.map).map(([k, v]) => `${k}->${v}`).join(', ') : 'empty'}   |   target = {TARGET}</p>
      </>
    )} />
  );
}
