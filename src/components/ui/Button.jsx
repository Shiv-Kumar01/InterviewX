// Reusable button. variant: primary | secondary | ghost. Pass `to` to render a router link.
import { Link } from 'react-router-dom';

export default function Button({ variant = 'primary', size, to, className = '', children, ...props }) {
  const cls = `btn btn-${variant} ${size === 'lg' ? 'btn-lg' : ''} ${className}`;
  if (to) return <Link to={to} className={cls} {...props}>{children}</Link>;
  return <button className={cls} {...props}>{children}</button>;
}
