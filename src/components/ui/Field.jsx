export default function Field({ label, id, ...inputProps }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} className="input" {...inputProps} />
    </div>
  );
}
