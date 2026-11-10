import { Card, ProgressBar, Badge } from './ui';
import { DIMENSIONS, CONFIDENCE_NOTE } from '../utils/constants';

export default function EvaluationPanel({ evaluation: e, testResults }) {
  const tone = e.overall >= 75 ? 'success' : e.overall >= 50 ? 'warning' : 'danger';
  return (
    <Card className="eval">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h3>Answer feedback</h3><Badge tone={tone}>{e.overall} / 100</Badge>
      </div>
      <div className="stack" style={{ margin: 'var(--sp-4) 0' }}>
        {DIMENSIONS.map(([k, label]) => <ProgressBar key={k} label={label} value={e.scores[k]} />)}
      </div>
      <p className="muted-s">{CONFIDENCE_NOTE}</p>
      {e.keywordCoverage !== null && <p className="muted-s">Key concept coverage: {e.keywordCoverage}% (blended into the score with the AI rating).</p>}
      {testResults && <p className="muted-s">Automated tests: {testResults.error || `${testResults.passed} of ${testResults.total} passed`}.</p>}
      {(e.timeComplexity || e.spaceComplexity) && <p className="muted-s">Complexity (AI review): time {e.timeComplexity || '?'}, space {e.spaceComplexity || '?'}</p>}
      {e.strengths.length > 0 && <><h4>What worked</h4><ul>{e.strengths.map((s) => <li key={s}>{s}</li>)}</ul></>}
      {e.missingPoints.length > 0 && <><h4>What you missed</h4><ul>{e.missingPoints.map((s) => <li key={s}>{s}</li>)}</ul></>}
      {e.improvement && <p><strong>Improve:</strong> {e.improvement}</p>}
    </Card>
  );
}
