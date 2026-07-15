import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

export default function LoginPage() {
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' }); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (event) => { event.preventDefault(); setError(''); setBusy(true); try { const user = await login(form); navigate(location.state?.from?.pathname || (user.role === 'admin' ? '/admin/dashboard' : '/victim/dashboard'), { replace: true }); } catch (err) { setError(getErrorMessage(err)); } finally { setBusy(false); } };
  return <div className="auth-page"><div className="auth-card card border-0 shadow"><div className="card-body p-4 p-md-5"><div className="text-center mb-4"><div className="brand-mark">DR</div><h1 className="h3 mt-3">Welcome back</h1><p className="text-secondary">Sign in to manage relief operations.</p></div>{error && <div className="alert alert-danger">{error}</div>}<form onSubmit={submit}><div className="mb-3"><label className="form-label">Email</label><input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div><div className="mb-4"><label className="form-label">Password</label><input type="password" className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength="6" required /></div><button className="btn btn-primary w-100" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button></form><p className="text-center small mt-4 mb-0">Need an account? <Link to="/register">Register as a victim</Link></p></div></div></div>;
}
