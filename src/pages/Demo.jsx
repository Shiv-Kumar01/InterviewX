import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '../components/ui';
import ReportView from '../components/ReportView';
import StatGrid from '../components/StatGrid';
import { TrendChart } from '../charts/Charts';
import { statItems } from './Dashboard';
import { demoReport, demoAnswers, demoAnalytics } from '../demo/demoData';

// Works with no backend, MongoDB or Ollama. Everything here is static sample data.
export default function Demo() {
  return (
    <div className="content">
      <Card className="warn-card"><Badge tone="warning">Demo Data</Badge> This page shows sample results so you can explore the interface. Nothing here was generated live by the AI.
        <div className="row" style={{ marginTop: 'var(--sp-3)' }}><Button to="/register">Create an account</Button></div></Card>
      <div style={{ margin: 'var(--sp-5) 0' }}><StatGrid items={statItems(demoAnalytics)} /></div>
      <Card title="Improvement over time" style={{ marginBottom: 'var(--sp-6)' }}><TrendChart data={demoAnalytics.trend} /></Card>
      <ReportView demo title="Full Stack Developer - technical" report={demoReport} answers={demoAnswers} />
    </div>
  );
}
