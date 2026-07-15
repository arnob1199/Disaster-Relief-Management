import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MetricCard from '../components/common/MetricCard';
import PageHeader from '../components/common/PageHeader';
import { api, getErrorMessage } from '../services/api';

const adminMetrics = [['Total Users', 'total_users', 'primary'], ['Total Victims', 'total_victims', 'info'], ['Total Shelters', 'total_shelters', 'success'], ['Supply Types', 'total_supplies', 'secondary'], ['Pending Requests', 'pending_requests', 'warning'], ['Approved Requests', 'approved_requests', 'primary'], ['Completed Requests', 'completed_requests', 'success'], ['Total Distributions', 'total_distributions', 'info'], ['Low Stock Supplies', 'low_stock_supplies', 'danger']];
const victimMetrics = [['My Requests', 'my_requests', 'primary'], ['Pending Requests', 'pending_requests', 'warning'], ['Approved Requests', 'approved_requests', 'primary'], ['Completed Requests', 'completed_requests', 'success']];

function Dashboard({ admin }) {
  const [data, setData] = useState(null); const [error, setError] = useState('');
  useEffect(() => { (async () => { try { const response = admin ? await api.dashboard.admin() : await api.dashboard.victim(); setData(response.data.data); } catch (err) { setError(getErrorMessage(err)); } })(); }, [admin]);
  if (!data && !error) return <LoadingSpinner />;
  return <><PageHeader title={admin ? 'Admin Dashboard' : 'Victim Dashboard'} description={admin ? 'Operational overview of relief distribution.' : 'Overview of your relief requests.'} />{error ? <div className="alert alert-danger">{error}</div> : <div className="row g-3">{(admin ? adminMetrics : victimMetrics).map(([title, key, accent]) => <div className="col-sm-6 col-xl-4" key={key}><MetricCard title={title} value={data[key]} accent={accent} /></div>)}</div>}{admin && <div className="alert alert-info mt-4 mb-0">Low stock supplies have fewer than 20 units remaining.</div>}</>;
}

export const AdminDashboardPage = () => <Dashboard admin />;
export const VictimDashboardPage = () => <Dashboard admin={false} />;
