import ResourceManager from './ResourceManager';
import { api } from '../services/api';

const fields = [{ name: 'name', label: 'Supply name' }, { name: 'category', label: 'Category' }, { name: 'description', label: 'Description', type: 'textarea', optional: true }, { name: 'quantity', label: 'Quantity', type: 'number', min: 0 }, { name: 'unit', label: 'Unit' }];
const columns = [{ label: 'Name', key: 'name' }, { label: 'Category', key: 'category' }, { label: 'Available quantity', render: (row) => <span className={row.quantity < 20 ? 'text-danger fw-semibold' : ''}>{row.quantity} {row.unit}</span> }, { label: 'Description', render: (row) => row.description || '—' }];
export default function SuppliesPage() { return <ResourceManager title="Supplies" description="View and manage relief supply inventory." apiResource={api.supplies} fields={fields} columns={columns} itemName="Supply" />; }
