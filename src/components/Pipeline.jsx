import { MessageSquare, PenLine, ScanSearch, TrendingUp } from 'lucide-react';
import { Card } from './ui';

const FLOW = [
  { icon: MessageSquare, title: 'Question', text: 'Asked one at a time, like a real interviewer' },
  { icon: PenLine, title: 'Answer', text: 'You write your response under a timer' },
  { icon: ScanSearch, title: 'Analysis', text: 'Scored on accuracy, depth and clarity', live: true },
  { icon: TrendingUp, title: 'Improvement', text: 'A study plan built from your gaps' },
];

// Used as the fallback when WebGL is unavailable.
export default function Pipeline() {
  return (
    <div className="pipeline" aria-label="How an interview session flows">
      {FLOW.map(({ icon: Icon, title, text, live }) => (
        <Card key={title} glass className={`pipe-step ${live ? 'live' : ''}`}>
          <span className="pipe-icon"><Icon size={20} /></span>
          <div><strong>{title}</strong><small>{text}</small></div>
        </Card>
      ))}
    </div>
  );
}
