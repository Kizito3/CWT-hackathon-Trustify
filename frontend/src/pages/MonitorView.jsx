import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';

const MonitorView = () => {
  const { token } = useParams();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [walletRes, transactionsRes] = await Promise.all([
          client.get(`/monitor/${token}`),
          client.get(`/monitor/${token}/transactions`),
        ]);
        setWallet(walletRes.data.wallet);
        setTransactions(transactionsRes.data.transactions);
      } catch (err) {
        setError(err.response?.data?.error || 'Invalid or expired monitor link');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [token]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading wallet data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="monitor-view error-view">
        <div className="error-card">
          <h2>⚠️ Access Denied</h2>
          <p>{error}</p>
          <p className="error-hint">The monitor link may have been revoked or doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="monitor-view">
      <div className="monitor-header">
        <span className="read-only-badge">👁️ Read-Only View</span>
        <h1>💰 {wallet.name}</h1>
        <p className="monitor-subtitle">Accountability Tracker - Public Monitor</p>
      </div>

      <div className="monitor-balance-card">
        <h2>Current Balance</h2>
        <p className="monitor-balance">{formatCurrency(wallet.currentBalance)}</p>
        <p className="monitor-meta">Wallet created: {formatDate(wallet.createdAt)}</p>
      </div>

      <div className="monitor-transactions">
        <h2>📜 Transaction History</h2>
        {transactions.length === 0 ? (
          <p className="empty-transactions">No transactions recorded yet.</p>
        ) : (
          <div className="transactions-list">
            {transactions.map((tx) => (
              <div key={tx._id} className={`transaction-item ${tx.type}`}>
                <div className="transaction-info">
                  <span className={`transaction-type ${tx.type}`}>
                    {tx.type === 'inflow' ? '⬆️' : '⬇️'} {tx.type.toUpperCase()}
                  </span>
                  <span className="transaction-description">{tx.description}</span>
                  <span className="transaction-date">{formatDate(tx.createdAt)}</span>
                </div>
                <div className="transaction-amounts">
                  <span className={`transaction-amount ${tx.type}`}>
                    {tx.type === 'inflow' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                  <span className="balance-after">
                    Balance: {formatCurrency(tx.balanceAfter)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="monitor-footer">
        <p>This is a read-only view. You cannot make any changes to this wallet.</p>
        <p className="powered-by">Powered by Accountability Tracker</p>
      </div>
    </div>
  );
};

export default MonitorView;
