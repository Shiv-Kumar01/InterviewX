export default function Card({ title, glass = false, className = '', children, ...props }) {
  return (
    <section className={`card ${glass ? 'card-glass' : ''} ${className}`} {...props}>
      {title && <h3 className="card-title">{title}</h3>}
      {children}
    </section>
  );
}
