import { useMemo, useState } from 'react';

export default function DataTable({ columns, rows, searchPlaceholder = 'Search records...' }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const filtered = useMemo(() => rows.filter((row) => JSON.stringify(row).toLowerCase().includes(query.toLowerCase())), [rows, query]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const changeQuery = (event) => { setQuery(event.target.value); setPage(1); };

  return <><div className="d-flex justify-content-between align-items-center gap-3 mb-3 flex-wrap"><div className="text-secondary small">{filtered.length} record{filtered.length === 1 ? '' : 's'}</div><input className="form-control table-search" value={query} onChange={changeQuery} placeholder={searchPlaceholder} /></div><div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead className="table-light"><tr>{columns.map((column) => <th key={column.label}>{column.label}</th>)}</tr></thead><tbody>{visible.length ? visible.map((row) => <tr key={row.id}>{columns.map((column) => <td key={column.label}>{column.render ? column.render(row) : row[column.key] ?? '—'}</td>)}</tr>) : <tr><td colSpan={columns.length} className="text-center py-4 text-secondary">No records found.</td></tr>}</tbody></table></div>{pages > 1 && <nav className="d-flex justify-content-end mt-3"><ul className="pagination pagination-sm mb-0"><li className={`page-item ${page === 1 ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPage(page - 1)}>Previous</button></li>{Array.from({ length: pages }, (_, index) => <li className={`page-item ${page === index + 1 ? 'active' : ''}`} key={index}><button className="page-link" onClick={() => setPage(index + 1)}>{index + 1}</button></li>)}<li className={`page-item ${page === pages ? 'disabled' : ''}`}><button className="page-link" onClick={() => setPage(page + 1)}>Next</button></li></ul></nav>}</>;
}
