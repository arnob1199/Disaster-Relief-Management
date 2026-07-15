export default function PageHeader({ title, description, action }) {
  return <div className="d-flex justify-content-between align-items-start gap-3 mb-4 flex-wrap"><div><h1 className="h3 mb-1">{title}</h1>{description && <p className="text-secondary mb-0">{description}</p>}</div>{action}</div>;
}
