import { useState, useEffect } from 'react';
import { CATEGORIES } from '../utils/constants';

const emptyForm = {
  type: 'EXPENSE',
  amount: '',
  category: '',
  transactionDate: new Date().toISOString().slice(0, 10),
  description: ''
};

export default function TransactionForm({ initialValues, presetType, onSubmit, submitLabel = 'Save', serverError }) {
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...(presetType ? { type: presetType } : {}),
    ...initialValues
  }));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // EditTransaction loads its transaction after the initial render, so the form
  // needs to pick up initialValues once they arrive, not just on mount.
  useEffect(() => {
    if (initialValues) {
      setForm((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const validate = () => {
    const next = {};
    if (!form.type) next.type = 'Transaction type is required';
    if (!form.amount || Number(form.amount) <= 0) next.amount = 'Amount must be greater than zero';
    if (!form.category) next.category = 'Category is required';
    if (!form.transactionDate) next.transactionDate = 'Transaction date is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      {serverError && <p className="form-error form-error--top">{serverError}</p>}

      <div className="form-field">
        <label htmlFor="tx-type">Type</label>
        <select id="tx-type" value={form.type} onChange={handleChange('type')}>
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>
        {errors.type && <span className="form-error">{errors.type}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="tx-amount">Amount</label>
        <input
          id="tx-amount"
          type="number"
          step="0.01"
          min="0"
          value={form.amount}
          onChange={handleChange('amount')}
          placeholder="0.00"
        />
        {errors.amount && <span className="form-error">{errors.amount}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="tx-category">Category</label>
        <select id="tx-category" value={form.category} onChange={handleChange('category')}>
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && <span className="form-error">{errors.category}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="tx-date">Date</label>
        <input id="tx-date" type="date" value={form.transactionDate} onChange={handleChange('transactionDate')} />
        {errors.transactionDate && <span className="form-error">{errors.transactionDate}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="tx-description">Description</label>
        <textarea
          id="tx-description"
          value={form.description || ''}
          onChange={handleChange('description')}
          placeholder="Optional note"
          rows={3}
        />
      </div>

      <button type="submit" className="btn btn--primary" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
