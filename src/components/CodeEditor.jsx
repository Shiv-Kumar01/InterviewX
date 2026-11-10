// Lightweight editor: monospace textarea with Tab-to-indent. (A full editor like Monaco is a future upgrade.)
export default function CodeEditor({ value, onChange, disabled }) {
  const onKeyDown = (e) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const { selectionStart: s, selectionEnd: en } = e.target;
    onChange(`${value.slice(0, s)}  ${value.slice(en)}`);
    requestAnimationFrame(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; });
  };
  return <textarea className="code-editor" spellCheck={false} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} onKeyDown={onKeyDown} aria-label="Code editor" />;
}
