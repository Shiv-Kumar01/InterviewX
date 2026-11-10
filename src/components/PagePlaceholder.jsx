import { Card, Badge } from './ui';

// Shown on routes whose real feature arrives in a later phase.
export default function PagePlaceholder({ title, description, phase }) {
  return (
    <>
      <div className="page-head"><h1>{title}</h1><p>{description}</p></div>
      <Card className="placeholder">
        <h3>Coming in Phase {phase}</h3>
        <p>The route and layout are ready. The feature itself is built in a later phase.</p>
        <Badge tone="accent">Phase {phase}</Badge>
      </Card>
    </>
  );
}
