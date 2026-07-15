import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const adminLinks = [['Dashboard', '/admin/dashboard'], ['Shelters', '/shelters'], ['Supplies', '/supplies'], ['Relief Requests', '/requests'], ['Distributions', '/distributions'], ['Profile', '/profile']];
  const victimLinks = [['Dashboard', '/victim/dashboard'], ['Shelters', '/shelters'], ['Supplies', '/supplies'], ['My Requests', '/requests'], ['Profile', '/profile']];
  const links = user?.role === 'admin' ? adminLinks : victimLinks;
  return <aside className={`sidebar ${open ? 'show' : ''}`}><div className="sidebar-heading">Navigation<button className="btn-close btn-close-white d-lg-none" onClick={onClose} /></div><nav>{links.map(([label, to]) => <NavLink key={to} to={to} onClick={onClose} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>{label}</NavLink>)}</nav></aside>;
}
