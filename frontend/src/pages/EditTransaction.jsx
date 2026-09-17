import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as transactionApi from '../api/transactionApi';
import TransactionForm from '../components/TransactionForm';
import LoadingMessage from '../components/LoadingMessage';

export default function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    let active = true;
    transactionApi
      .getTransaction(id)
      .then((res) => {
        if (!active) return;
        const t = res.data;
        setInitialValues({
          type: t.type,
          amount: t.amount,
          category: t.category,
          transactionDate: t.transactionDate,
          description: t.description || ''
        });
      })
      .catch(() => {
        if (active) setServerError('Could not load this transaction.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (data) => {
    setServerError('');
    try {
      await transactionApi.updateTransaction(id, data);
      navigate('/transactions');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Could not update this transaction.');
    }
  };

  if (loading) return <LoadingMessage text="Loading transaction..." />;

  return (
    <div className="page-narrow">
      <h1>Edit transaction</h1>
      {initialValues ? (
        <TransactionForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
          serverError={serverError}
        />
      ) : (
        <p className="form-error">{serverError}</p>
      )}
    </div>
  );
}
