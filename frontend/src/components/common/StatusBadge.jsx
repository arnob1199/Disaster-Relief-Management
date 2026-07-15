const variants = {
  Pending: 'warning',
  Approved: 'primary',
  Distributed: 'success',
  Rejected: 'danger',
  Low: 'secondary',
  Medium: 'info',
  High: 'danger'
};
export default function StatusBadge({ value }) {
  return <span className={`badge text-bg-${variants[value] || 'secondary'} px-3 py-2`}>{value || '—'}</span>;
}
