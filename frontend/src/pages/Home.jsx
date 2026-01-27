import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <div className="hero">
        <h1>💰 Accountability Tracker</h1>
        <p className="hero-subtitle">
          Track your funds transparently. Share read-only access with stakeholders.
        </p>
        
        <div className="features">
          <div className="feature">
            <span className="feature-icon">🔐</span>
            <h3>Secure Admin Access</h3>
            <p>Only admins can create wallets and record transactions.</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📊</span>
            <h3>Immutable Transaction Logs</h3>
            <p>Every transaction is permanently recorded for accountability.</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🔗</span>
            <h3>Shareable Monitor Links</h3>
            <p>Generate links to share read-only access to wallet balance and history.</p>
          </div>
        </div>

        <div className="cta-buttons">
          {user ? (
            <Link to="/dashboard" className="btn-primary btn-large">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary btn-large">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary btn-large">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <span className="step-number">1</span>
            <h4>Create an Account</h4>
            <p>Register as an admin to manage wallets.</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <h4>Create Wallets</h4>
            <p>Set up wallets to track different funds.</p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <h4>Record Transactions</h4>
            <p>Log all inflows and outflows with descriptions.</p>
          </div>
          <div className="step">
            <span className="step-number">4</span>
            <h4>Share Monitor Links</h4>
            <p>Generate links for stakeholders to view balances and transaction history.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
