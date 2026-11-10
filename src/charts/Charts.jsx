import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

const ACCENT = '#4fd8c4', GRID = '#243044', MUTED = '#93a1b8';
const tip = { contentStyle: { background: '#151b26', border: '1px solid #243044', borderRadius: 8, color: '#e8edf5' } };

export function RadarCard({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke={GRID} />
        <PolarAngleAxis dataKey="skill" tick={{ fill: MUTED, fontSize: 12 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar dataKey="score" stroke={ACCENT} fill={ACCENT} fillOpacity={0.25} />
        <Tooltip {...tip} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function TrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={{ fill: MUTED, fontSize: 12 }} stroke={GRID} />
        <YAxis domain={[0, 100]} tick={{ fill: MUTED, fontSize: 12 }} stroke={GRID} />
        <Tooltip {...tip} />
        <Line type="monotone" dataKey="score" stroke={ACCENT} strokeWidth={2.5} dot={{ r: 4, fill: ACCENT }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TopicBars({ data }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 38)}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, left: 24, bottom: 0 }}>
        <XAxis type="number" domain={[0, 100]} tick={{ fill: MUTED, fontSize: 12 }} stroke={GRID} />
        <YAxis type="category" dataKey="topic" width={110} tick={{ fill: MUTED, fontSize: 12 }} stroke={GRID} />
        <Tooltip {...tip} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Bar dataKey="score" fill={ACCENT} radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
