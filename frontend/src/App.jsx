import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AdminDashboardPage, VictimDashboardPage } from './pages/DashboardPages';
import SheltersPage from './pages/SheltersPage';
import SuppliesPage from './pages/SuppliesPage';
import RequestsPage from './pages/RequestsPage';
import DistributionsPage from './pages/DistributionsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function ProtectedRoute({ roles }) { const { user } = useAuth(); const location = useLocation(); if (!user) return <Navigate to="/login" replace state={{ from: location }} />; if (roles && !roles.includes(user.role)) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/victim/dashboard'} replace />; return <Outlet />; }
function PublicRoute({ children }) { const { user } = useAuth(); return user ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/victim/dashboard'} replace /> : children; }

export default function App() { return <Routes><Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} /><Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} /><Route element={<ProtectedRoute />}><Route element={<AppLayout />}><Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']} />}><Route index element={<AdminDashboardPage />} /></Route><Route path="/victim/dashboard" element={<ProtectedRoute roles={['victim']} />}><Route index element={<VictimDashboardPage />} /></Route><Route path="/shelters" element={<SheltersPage />} /><Route path="/supplies" element={<SuppliesPage />} /><Route path="/requests" element={<RequestsPage />} /><Route path="/distributions" element={<ProtectedRoute roles={['admin']} />}><Route index element={<DistributionsPage />} /></Route><Route path="/profile" element={<ProfilePage />} /><Route path="*" element={<NotFoundPage />} /></Route></Route><Route path="*" element={<NotFoundPage />} /></Routes>; }
