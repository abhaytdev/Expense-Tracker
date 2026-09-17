import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import EmptyMessage from './EmptyMessage';

export default function TransactionTable({ transactions, onEdit, onDelete, readOnly = false }) {
  if (!transactions || transactions.length === 0) {
    return <EmptyMessage text="No transactions found." />;
  }

  return (
    <div className="transaction-table-wrapper">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            {!readOnly && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{formatDate(t.transactionDate)}</td>
              <td>
                <span className={`type-badge type-badge--${t.type.toLowerCase()}`}>
                  {t.type === 'INCOME' ? 'Income' : 'Expense'}
                </span>
              </td>
              <td>{t.category}</td>
              <td>{t.description || '\u2014'}</td>
              <td className={`amount-cell amount-cell--${t.type.toLowerCase()}`}>
                {t.type === 'INCOME' ? '+' : '-'}
                {formatCurrency(t.amount)}
              </td>
              {!readOnly && (
                <td className="transaction-actions">
                  <button type="button" className="btn btn--small" onClick={() => onEdit(t)}>
                    Edit
                  </button>
                  <button type="button" className="btn btn--small btn--danger-outline" onClick={() => onDelete(t)}>
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
