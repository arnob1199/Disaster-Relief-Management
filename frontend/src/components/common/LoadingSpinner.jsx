export default function LoadingSpinner({ label = 'Loading...' }) {
  return <div className="d-flex justify-content-center align-items-center gap-2 py-5 text-primary"><div className="spinner-border" role="status" /><span>{label}</span></div>;
}
