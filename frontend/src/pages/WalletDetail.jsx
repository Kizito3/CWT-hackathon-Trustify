import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';

const WalletDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [monitorLinks, setMonitorLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState('inflow');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [processing, setProcessing] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [copiedLink, setCopiedLink] = useState(null);

  const fetchWalletData = useCallback(async () => {
    try {
      const [walletRes, transactionsRes] = await Promise.all([
        client.get(`/wallets/${id}`),
        client.get(`/wallets/${id}/transactions`),
      ]);
      setWallet(walletRes.data.wallet);
      setTransactions(transactionsRes.data.transactions);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchMonitorLinks = useCallback(async () => {
    try {
      const response = await client.get('/monitor/links');
      const walletLinks = response.data.links.filter(link => link.walletId === id);
      setMonitorLinks(walletLinks);
    } catch (error) {
      console.error('Failed to fetch monitor links:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchWalletData();
    fetchMonitorLinks();
  }, [fetchWalletData, fetchMonitorLinks]);

  const handleTransaction = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      await client.post(`/wallets/${id}/${transactionType}`, {
        amount: parseFloat(amount),
        description,
      });
      setShowTransactionModal(false);
      setAmount('');
      setDescription('');
      fetchWalletData();
    } catch (err) {
      setError(err.response?.data?.error || 'Transaction failed');
    } finally {
      setProcessing(false);
    }
  };

  const generateMonitorLink = async () => {
    setGeneratingLink(true);
    setError('');

    try {
      const response = await client.post(`/monitor/generate/${id}`);
      fetchMonitorLinks();
      // Show the link
      alert(`Monitor link generated!\n\nShare this URL:\n${window.location.origin}/monitor/${response.data.token}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate monitor link');
    } finally {
      setGeneratingLink(false);
    }
  };

  const deleteMonitorLink = async (token) => {
    if (!confirm('Are you sure you want to revoke this monitor link?')) return;

    try {
      await client.delete(`/monitor/links/${token}`);
      fetchMonitorLinks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete monitor link');
    }
  };

  const copyToClipboard = async (token) => {
    const url = `${window.location.origin}/monitor/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(token);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedLink(token);
      setTimeout(() => setCopiedLink(null), 2000);
    }
  };

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
        <p>Loading wallet...</p>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="error-container">
        <h2>Wallet not found</h2>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-detail">
      <button className="btn-back" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      {error && <div className="error-message">{error}</div>}

      <div className="wallet-info">
        <h1>{wallet.name}</h1>
        <p className="current-balance">{formatCurrency(wallet.currentBalance)}</p>
        <p className="wallet-meta">Created {formatDate(wallet.createdAt)}</p>
      </div>

      <div className="actions-section">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button
            className="btn-inflow"
            onClick={() => {
              setTransactionType('inflow');
              setShowTransactionModal(true);
            }}
          >
            ➕ Add Inflow
          </button>
          <button
            className="btn-outflow"
            onClick={() => {
              setTransactionType('outflow');
              setShowTransactionModal(true);
            }}
          >
            ➖ Add Outflow
          </button>
        </div>
      </div>

      <div className="monitor-section">
        <h2>🔗 Monitor Links</h2>
        <p className="section-description">
          Generate shareable links to allow others to view (read-only) this wallet's balance and transactions.
        </p>
        
        {monitorLinks.length > 0 ? (
          <div className="monitor-links-list">
            {monitorLinks.map((link) => (
              <div key={link.token} className="monitor-link-item">
                <div className="link-info">
                  <code>{`${window.location.origin}/monitor/${link.token}`}</code>
                  <span className="link-date">Created {formatDate(link.createdAt)}</span>
                </div>
                <div className="link-actions">
                  <button
                    className="btn-copy"
                    onClick={() => copyToClipboard(link.token)}
                  >
                    {copiedLink === link.token ? '✓ Copied!' : '📋 Copy'}
                  </button>
                  <button
                    className="btn-delete-small"
                    onClick={() => deleteMonitorLink(link.token)}
                  >
                    🗑️ Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <button
            className="btn-primary"
            onClick={generateMonitorLink}
            disabled={generatingLink}
          >
            {generatingLink ? 'Generating...' : 'Generate Monitor Link'}
          </button>
        )}
        
        {monitorLinks.length > 0 && (
          <button
            className="btn-secondary mt-2"
            onClick={generateMonitorLink}
            disabled={generatingLink}
          >
            {generatingLink ? 'Generating...' : '+ Generate New Link'}
          </button>
        )}
      </div>

      <div className="transactions-section">
        <h2>📜 Transaction History</h2>
        {transactions.length === 0 ? (
          <p className="empty-transactions">No transactions yet. Add an inflow or outflow to get started.</p>
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

      {showTransactionModal && (
        <div className="modal-overlay" onClick={() => setShowTransactionModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>
              {transactionType === 'inflow' ? '➕ Add Inflow' : '➖ Add Outflow'}
            </h2>
            <form onSubmit={handleTransaction}>
              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={transactionType === 'inflow' ? 'e.g., Monthly budget' : 'e.g., Office supplies'}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowTransactionModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={transactionType === 'inflow' ? 'btn-inflow' : 'btn-outflow'}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : `Add ${transactionType}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletDetail;
