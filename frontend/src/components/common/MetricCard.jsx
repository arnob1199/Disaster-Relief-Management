export default function MetricCard({ title, value, accent = 'primary' }) {
  return <div className="card metric-card border-0 shadow-sm h-100"><div className="card-body"><div className={`metric-accent bg-${accent}`} /><p className="text-secondary text-uppercase small fw-semibold mb-2">{title}</p><h2 className="mb-0 fw-bold">{value ?? 0}</h2></div></div>;
}
