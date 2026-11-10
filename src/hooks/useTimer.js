import { useEffect, useRef, useState } from 'react';

// Counts up while running. `limit` (seconds, 0 = none) triggers onExpire once.
export default function useTimer({ initial = 0, limit = 0, onExpire }) {
  const [seconds, setSeconds] = useState(initial);
  const [running, setRunning] = useState(true);
  const lapStart = useRef(initial);
  const fired = useRef(false);
  const expire = useRef(onExpire);
  expire.current = onExpire;

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (limit && seconds >= limit && !fired.current) { fired.current = true; expire.current?.(); }
  }, [seconds, limit]);

  return {
    seconds, running,
    pause: () => setRunning(false), resume: () => setRunning(true),
    sinceLap: () => seconds - lapStart.current,   // time on the current question
    markLap: () => { lapStart.current = seconds; },
  };
}
