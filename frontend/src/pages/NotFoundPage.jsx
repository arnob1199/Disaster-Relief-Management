import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function NotFoundPage() { const { user } = useAuth(); const home = user?.role === 'admin' ? '/admin/dashboard' : '/victim/dashboard'; return <div className="not-found text-center"><div className="display-1 fw-bold text-primary">404</div><h1 className="h3">Page not found</h1><p className="text-secondary">The page you requested does not exist.</p><Link className="btn btn-primary" to={user ? home : '/login'}>Go to dashboard</Link></div>; }
