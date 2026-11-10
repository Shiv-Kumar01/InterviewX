import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const runner = fileURLToPath(new URL('../utils/sandboxRunner.js', import.meta.url));

// Never runs user code inside the API process: a child process with a memory cap and a hard timeout.
export function runTests(code, question) {
  const total = question.tests.length;
  const fail = (error) => ({ error, passed: 0, total, results: [] });
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ['--max-old-space-size=64', runner], { stdio: ['pipe', 'pipe', 'ignore'], env: {} });
    let out = '';
    const timer = setTimeout(() => { child.kill('SIGKILL'); resolve(fail('Time limit exceeded (possible infinite loop).')); }, 5000);
    child.stdout.on('data', (d) => (out += d));
    child.on('close', () => { clearTimeout(timer); try { resolve(JSON.parse(out)); } catch { resolve(fail('Your code could not be run.')); } });
    child.stdin.on('error', () => {});
    child.stdin.end(JSON.stringify({ code, fn: question.functionName, tests: question.tests }));
  });
}
