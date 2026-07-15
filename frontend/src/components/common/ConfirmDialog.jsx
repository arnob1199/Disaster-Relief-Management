export default function ConfirmDialog({ show, title = 'Confirm action', message, onConfirm, onClose, busy }) {
  if (!show) return null;
  return <div className="modal-backdrop-custom"><div className="modal d-block" tabIndex="-1"><div className="modal-dialog modal-dialog-centered"><div className="modal-content shadow"><div className="modal-header"><h5 className="modal-title">{title}</h5><button className="btn-close" onClick={onClose} disabled={busy} /></div><div className="modal-body"><p className="mb-0">{message}</p></div><div className="modal-footer"><button className="btn btn-light" onClick={onClose} disabled={busy}>Cancel</button><button className="btn btn-danger" onClick={onConfirm} disabled={busy}>{busy ? 'Working...' : 'Confirm'}</button></div></div></div></div></div>;
}
