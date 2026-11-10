import { Button, Card, Badge, ProgressBar, Field } from '../components/ui';

// Living reference for every reusable component. Handy for testing and for the README screenshots.
export default function DesignSystem() {
  return (
    <>
      <div className="page-head"><h1>Design system</h1><p>The building blocks used across InterviewX.</p></div>
      <div className="grid grid-3">
        <Card title="Buttons"><div className="row">
          <Button>Primary</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost</Button><Button disabled>Disabled</Button>
        </div></Card>
        <Card title="Badges"><div className="row">
          <Badge>Neutral</Badge><Badge tone="accent">Accent</Badge><Badge tone="success">Success</Badge><Badge tone="warning">Warning</Badge><Badge tone="danger">Danger</Badge>
        </div></Card>
        <Card title="Progress"><div className="stack"><ProgressBar label="Technical" value={84} /><ProgressBar label="Clarity" value={61} /></div></Card>
        <Card title="Form field"><Field id="demo" label="Label" placeholder="Type something" /></Card>
        <Card title="Glass card" glass>Used sparingly for floating panels.</Card>
      </div>
    </>
  );
}
