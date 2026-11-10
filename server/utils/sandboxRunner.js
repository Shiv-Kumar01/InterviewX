// Runs in a SEPARATE Node process (see codeRunnerService). Uses vm with time limits.
import vm from 'node:vm';

let input = '';
process.stdin.on('data', (d) => (input += d)).on('end', () => {
  const { code, fn, tests } = JSON.parse(input);
  const out = (o) => process.stdout.write(JSON.stringify({ passed: 0, total: tests.length, results: [], ...o }));
  const ctx = vm.createContext({});
  try {
    vm.runInContext(`${code}\n;globalThis.__fn = typeof ${fn} === 'function' ? ${fn} : undefined;`, ctx, { timeout: 1500 });
  } catch (e) { return out({ error: `Error in your code: ${e.message}` }); }
  if (typeof ctx.__fn !== 'function') return out({ error: `Define a function named ${fn}.` });

  const results = tests.map((t) => {
    const base = { input: JSON.stringify(t.args), expected: JSON.stringify(t.expected) };
    try {
      ctx.__args = JSON.parse(JSON.stringify(t.args));
      vm.runInContext('globalThis.__result = __fn(...__args)', ctx, { timeout: 1000 });
      const actual = JSON.stringify(ctx.__result);
      return { ...base, ok: actual === base.expected, actual };
    } catch (e) { return { ...base, ok: false, actual: `Error: ${e.message}` }; }
  });
  out({ passed: results.filter((r) => r.ok).length, results });
});
