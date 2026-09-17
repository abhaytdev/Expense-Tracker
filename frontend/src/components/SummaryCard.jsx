export default function SummaryCard({ title, value, variant = 'default', subtitle }) {
  return (
    <div className={`summary-card summary-card--${variant}`}>
      <p className="summary-card-title">{title}</p>
      <p className="summary-card-value">{value}</p>
      {subtitle && <p className="summary-card-subtitle">{subtitle}</p>}
    </div>
  );
}
