import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

const Dashboard = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWalletName, setNewWalletName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const response = await client.get('/wallets');
      setWallets(response.data.wallets);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch wallets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWallet = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      await client.post('/wallets', {
        name: newWalletName,
        initialBalance: parseFloat(initialBalance) || 0,
      });
      setShowCreateModal(false);
      setNewWalletName('');
      setInitialBalance('');
      fetchWallets();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create wallet');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteWallet = async (walletId) => {
    if (!confirm('Are you sure you want to delete this wallet?')) return;

    try {
      await client.delete(`/wallets/${walletId}`);
      fetchWallets();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete wallet');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading wallets...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Your Wallets</h1>
        <button
          className="btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          + Create Wallet
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {wallets.length === 0 ? (
        <div className="empty-state">
          <h3>No wallets yet</h3>
          <p>Create your first wallet to start tracking your finances.</p>
          <button
            className="btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            Create Your First Wallet
          </button>
        </div>
      ) : (
        <div className="wallets-grid">
          {wallets.map((wallet) => (
            <div key={wallet._id} className="wallet-card">
              <div className="wallet-header">
                <h3>{wallet.name}</h3>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteWallet(wallet._id)}
                  title="Delete wallet"
                >
                  🗑️
                </button>
              </div>
              <p className="wallet-balance">{formatCurrency(wallet.currentBalance)}</p>
              <p className="wallet-date">
                Created {new Date(wallet.createdAt).toLocaleDateString()}
              </p>
              <Link to={`/wallet/${wallet._id}`} className="btn-secondary">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Wallet</h2>
            <form onSubmit={handleCreateWallet}>
              <div className="form-group">
                <label htmlFor="walletName">Wallet Name</label>
                <input
                  type="text"
                  id="walletName"
                  value={newWalletName}
                  onChange={(e) => setNewWalletName(e.target.value)}
                  placeholder="e.g., Marketing Budget"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="initialBalance">Initial Balance (optional)</label>
                <input
                  type="number"
                  id="initialBalance"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Wallet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
