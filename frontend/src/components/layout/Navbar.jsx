import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  return <header className="navbar navbar-expand bg-white border-bottom px-3 sticky-top"><button className="btn btn-outline-primary d-lg-none me-2" onClick={onMenuToggle}>☰</button><span className="navbar-brand mb-0 fw-bold text-primary">Disaster Relief</span><div className="ms-auto d-flex align-items-center gap-3"><div className="text-end d-none d-sm-block"><div className="fw-semibold small">{user?.full_name}</div><div className="text-secondary small text-capitalize">{user?.role}</div></div><button className="btn btn-sm btn-outline-danger" onClick={logout}>Logout</button></div></header>;
}
