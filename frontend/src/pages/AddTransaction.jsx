import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as transactionApi from '../api/transactionApi';
import TransactionForm from '../components/TransactionForm';

export default function AddTransaction() {
  const navigate = useNavigate();
  const location = useLocation();
  const presetType = location.state?.presetType;
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (data) => {
    setServerError('');
    try {
      await transactionApi.createTransaction(data);
      navigate('/transactions');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not save this transaction.');
    }
  };

  return (
    <div className="page-narrow">
      <h1>Add transaction</h1>
      <TransactionForm
        presetType={presetType}
        onSubmit={handleSubmit}
        submitLabel="Add transaction"
        serverError={serverError}
      />
    </div>
  );
}
