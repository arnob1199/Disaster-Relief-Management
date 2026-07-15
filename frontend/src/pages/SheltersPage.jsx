import ResourceManager from './ResourceManager';
import StatusBadge from '../components/common/StatusBadge';
import { api } from '../services/api';

const fields = [{ name: 'name', label: 'Shelter name' }, { name: 'location', label: 'Location' }, { name: 'contact_number', label: 'Contact number' }, { name: 'capacity', label: 'Capacity', type: 'number', min: 0 }, { name: 'current_occupancy', label: 'Current occupancy', type: 'number', min: 0, defaultValue: 0 }];
const columns = [{ label: 'Name', key: 'name' }, { label: 'Location', key: 'location' }, { label: 'Contact', key: 'contact_number' }, { label: 'Capacity', key: 'capacity' }, { label: 'Occupancy', render: (row) => <span>{row.current_occupancy} / {row.capacity}</span> }];
export default function SheltersPage() { return <ResourceManager title="Shelters" description="View and manage available disaster shelters." apiResource={api.shelters} fields={fields} columns={columns} itemName="Shelter" />; }
