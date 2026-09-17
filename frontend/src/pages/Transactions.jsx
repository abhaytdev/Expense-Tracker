import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as transactionApi from '../api/transactionApi';
import TransactionTable from '../components/TransactionTable';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingMessage from '../components/LoadingMessage';
import { CATEGORIES } from '../utils/constants';
import '../styles/transactions.css';

export default function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', type: '', category: '' });
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.type) params.type = filters.type;
    if (filters.category) params.category = filters.category;

    transactionApi
      .getTransactions(params)
      .then((res) => setTransactions(res.data))
      .catch(() => setError('Could not load transactions.'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFilterChange = (field) => (e) => setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  const clearFilters = () => setFilters({ search: '', type: '', category: '' });

  const handleEdit = (t) => navigate(`/transactions/${t.id}/edit`);

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    try {
      await transactionApi.deleteTransaction(pendingDelete.id);
      setPendingDelete(null);
      load();
    } catch {
      setError('Could not delete this transaction.');
      setPendingDelete(null);
    }
  };

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <h1>Transactions</h1>
        <button type="button" className="btn btn--primary" onClick={() => navigate('/transactions/add')}>
          Add transaction
        </button>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search description or category"
          value={filters.search}
          onChange={handleFilterChange('search')}
        />
        <select value={filters.type} onChange={handleFilterChange('type')}>
          <option value="">All types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
        <select value={filters.category} onChange={handleFilterChange('category')}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn--ghost" onClick={clearFilters}>
          Clear filters
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <LoadingMessage text="Loading transactions..." />
      ) : (
        <TransactionTable transactions={transactions} onEdit={handleEdit} onDelete={setPendingDelete} />
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete transaction"
        message={pendingDelete ? `Delete this ${pendingDelete.category} transaction? This cannot be undone.` : ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
