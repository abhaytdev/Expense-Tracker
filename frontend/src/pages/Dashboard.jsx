import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as dashboardApi from '../api/dashboardApi';
import Logo3D from '../components/Logo3D';
import SummaryCard from '../components/SummaryCard';
import TransactionTable from '../components/TransactionTable';
import LoadingMessage from '../components/LoadingMessage';
import { formatCurrency } from '../utils/formatCurrency';
import '../styles/dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    dashboardApi
      .getSummary()
      .then((res) => {
        if (active) setSummary(res.data);
      })
      .catch(() => {
        if (active) setError('Could not load your dashboard. Please refresh.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const goAdd = (type) => navigate('/transactions/add', { state: { presetType: type } });

  if (loading) return <LoadingMessage text="Loading your dashboard..." />;
  if (error) return <p className="form-error">{error}</p>;

  return (
    <div className="dashboard">
      <section className="dashboard-hero">
        <div className="dashboard-hero-text">
          <h1>Welcome back, {user?.name}</h1>
          <p className="dashboard-hero-tagline">Manage your money with clarity.</p>
          <p className="dashboard-hero-copy">
            See where your income and spending stand today, and log a new transaction in seconds.
          </p>
          <div className="dashboard-hero-actions">
            <button type="button" className="btn btn--primary" onClick={() => goAdd('INCOME')}>
              Add income
            </button>
            <button type="button" className="btn btn--secondary" onClick={() => goAdd('EXPENSE')}>
              Add expense
            </button>
          </div>
        </div>
        <div className="dashboard-hero-visual">
          <div className="dashboard-hero-blob dashboard-hero-blob--blue"></div>
          <div className="dashboard-hero-blob dashboard-hero-blob--green"></div>
          <Logo3D size={160} animated />
          <p className="dashboard-hero-caption">Your finances, organized.</p>
        </div>
      </section>

      <section className="summary-grid">
        <SummaryCard title="Total income" value={formatCurrency(summary.totalIncome)} variant="income" />
        <SummaryCard title="Total expenses" value={formatCurrency(summary.totalExpense)} variant="expense" />
        <SummaryCard title="Balance" value={formatCurrency(summary.balance)} variant="balance" />
        <SummaryCard title="Transactions" value={summary.totalTransactions} variant="count" />
      </section>

      <section className="dashboard-recent">
        <h2>Recent transactions</h2>
        <TransactionTable transactions={summary.recentTransactions} readOnly />
      </section>
    </div>
  );
}
