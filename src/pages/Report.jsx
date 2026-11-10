import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Button } from '../components/ui';
import Loading from '../components/Loading';
import ErrorNote from '../components/ErrorNote';
import ReportView from '../components/ReportView';
import { api } from '../services/api';

export default function Report() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api(`/interviews/${id}`).then(setData).catch((e) => setError(e.message)); }, [id]);
  if (error) return <Card><ErrorNote>{error}</ErrorNote></Card>;
  if (!data) return <Loading text="Loading report..." />;
  if (!data.interview.report) return <Card><p>This interview has no report yet.</p><Button to={`/interview/${id}`}>Resume interview</Button></Card>;
  return <ReportView title={data.interview.title} report={data.interview.report} answers={data.answers} />;
}
