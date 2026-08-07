import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiTrendingUp, FiDollarSign, FiInbox, FiActivity, FiStar, FiCheck, FiChevronRight } from 'react-icons/fi';

const FreelancerDashboard = () => {
  const [data, setData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Demo fallback for UI
    api.get('/dashboard/freelancer')
      .then(res => setData(res.data.data))
      .catch(err => {
        console.error(err);
        setData({
          gigs: [{ id: 1 }, { id: 2 }, { id: 3 }],
          wallet: { balance: 850.75 },
          incoming_orders: [
            { id: 1, title: 'React App Dev', client: 'TechCorp', amount: 1200, status: 'Pending' },
            { id: 2, title: 'Logo Design', client: 'Startup Inc', amount: 300, status: 'Active' }
          ],
          stats: { views: 124, completion_rate: 98, rating: 4.9 }
        });
      });
  }, []);

  if (!data) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  const { gigs = [], wallet = { balance: 0 }, incoming_orders = [], stats = { views: 0, completion_rate: 100, rating: 5.0 } } = data;

  return (
    <div className="container-fluid pb-5">
      
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 gap-3">
        <div>
          <div className="d-flex align-items-center gap-3 mb-1">
            <h1 className="fw-bold mb-0">
              Hello, <span style={{ color: 'var(--secondary-color)' }}>{user?.name || 'Freelancer'}</span>! 🚀
            </h1>
            <span className="badge rounded-pill bg-success bg-opacity-10 text-success fw-bold d-flex align-items-center gap-1">
              <span className="rounded-circle bg-success" style={{ width: '8px', height: '8px' }}></span> Available
            </span>
          </div>
          <p className="text-muted mb-0">Track your earnings and manage your gigs efficiently.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-sh d-flex align-items-center gap-2">
            Create Gig
          </button>
          <button className="btn btn-secondary-sh d-flex align-items-center gap-2">
            Withdraw Funds
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="sh-card p-4 d-flex flex-column justify-content-between h-100" style={{ borderTop: '4px solid var(--secondary-color)' }}>
            <div className="d-flex justify-content-between align-items-start mb-4">
              <p className="text-muted fw-medium mb-0" style={{ fontSize: '0.9rem' }}>Available Earnings</p>
              <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary-color)' }}>
                <FiDollarSign size={18} />
              </div>
            </div>
            <div>
              <h3 className="fw-bold mb-0">${wallet.balance?.toFixed(2) || '0.00'}</h3>
              <p className="text-success mt-2 mb-0 fw-semibold d-flex align-items-center gap-1" style={{ fontSize: '0.8rem' }}>
                <FiTrendingUp /> +12% this month
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="sh-card p-4 d-flex flex-column justify-content-between h-100">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <p className="text-muted fw-medium mb-0" style={{ fontSize: '0.9rem' }}>Active Gigs</p>
              <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary-color)' }}>
                <FiActivity size={18} />
              </div>
            </div>
            <div>
              <h3 className="fw-bold mb-0">{gigs.length}</h3>
              <p className="text-muted mt-2 mb-0 fw-medium" style={{ fontSize: '0.8rem' }}>
                3 gigs need update
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="sh-card p-4 d-flex flex-column justify-content-between h-100">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <p className="text-muted fw-medium mb-0" style={{ fontSize: '0.9rem' }}>Incoming Orders</p>
              <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)' }}>
                <FiInbox size={18} />
              </div>
            </div>
            <div>
              <h3 className="fw-bold mb-0">{incoming_orders.length}</h3>
              <p className="text-warning mt-2 mb-0 fw-medium" style={{ fontSize: '0.8rem' }}>
                1 pending response
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="sh-card p-4 d-flex flex-column justify-content-between h-100">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <p className="text-muted fw-medium mb-0" style={{ fontSize: '0.9rem' }}>Profile Stats</p>
              <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                <FiStar size={18} />
              </div>
            </div>
            <div className="d-flex align-items-end justify-content-between">
              <div>
                <h3 className="fw-bold mb-0 d-flex align-items-center gap-1">
                  {stats.rating || '5.0'}
                </h3>
                <p className="text-muted mt-2 mb-0 fw-medium" style={{ fontSize: '0.8rem' }}>
                  {stats.completion_rate}% Job Success
                </p>
              </div>
              <div className="text-end">
                <p className="text-muted fw-semibold mb-1" style={{ fontSize: '0.8rem' }}>Views</p>
                <p className="fw-bold fs-5 mb-0">{stats.views || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="row g-4">
        
        {/* Active Orders / Messages List */}
        <div className="col-12 col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">Current Orders</h4>
            <div className="d-flex gap-2">
              <button className="btn rounded-pill fw-semibold px-3 py-1" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', fontSize: '0.85rem' }}>Active</button>
              <button className="btn rounded-pill fw-semibold text-muted px-3 py-1" style={{ fontSize: '0.85rem' }}>Completed</button>
            </div>
          </div>
          
          <div className="d-flex flex-column gap-3">
            {incoming_orders.length > 0 ? (
              incoming_orders.map((order, idx) => (
                <div key={idx} className="sh-card p-4 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3" style={{ transition: 'all 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--secondary-color)'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}>
                  <div className="d-flex align-items-start gap-3">
                    <div className="rounded-3 d-flex align-items-center justify-content-center fw-bold fs-5 text-secondary flex-shrink-0" style={{ width: '48px', height: '48px', backgroundColor: 'var(--bg-color)' }}>
                      {order.client?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1">{order.title || `Order #${order.id || idx}`}</h5>
                      <p className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>Client: {order.client || 'Unknown'} &bull; Due in 3 days</p>
                      <div className="d-flex gap-2">
                        <span className={`badge rounded px-2 py-1 ${
                          order.status === 'Active' ? 'bg-primary bg-opacity-10 text-primary' :
                          'bg-warning bg-opacity-10 text-warning'
                        }`}>
                          {order.status}
                        </span>
                        <span className="badge rounded px-2 py-1 text-dark" style={{ backgroundColor: 'var(--border-color)' }}>Milestone 1/3</span>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-sm-end justify-content-between h-100 gap-2 mt-2 mt-sm-0">
                    <p className="fs-5 fw-bold mb-0" style={{ color: 'var(--secondary-color)' }}>${order.amount || 0}</p>
                    <button className="btn btn-link p-0 text-decoration-none fw-semibold d-flex align-items-center gap-1" style={{ fontSize: '0.85rem', color: 'var(--primary-color)' }}>
                      View Details <FiChevronRight />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="sh-card p-5 text-center text-muted d-flex flex-column align-items-center">
                <FiInbox size={48} className="mb-3 opacity-50" />
                <p className="mb-1">No active orders right now.</p>
                <p className="small">Share your gigs to get more clients!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-12 col-lg-4">
          <div className="d-flex flex-column gap-4">
            {/* Progress / Next Steps */}
            <div className="sh-card p-4">
              <h5 className="fw-bold mb-3">Level Up</h5>
              <p className="text-muted mb-4" style={{ fontSize: '0.85rem' }}>Complete these steps to increase your visibility and reach Level 2 seller status.</p>
              
              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-center gap-3">
                  <FiCheck className="text-success" size={18} />
                  <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.9rem' }}>Complete Profile Details</span>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <FiCheck className="text-success" size={18} />
                  <span className="text-muted text-decoration-line-through" style={{ fontSize: '0.9rem' }}>Create 3 Gigs</span>
                </div>
                <div className="d-flex align-items-center gap-3 fw-medium">
                  <div className="rounded-circle border border-2" style={{ width: '18px', height: '18px', borderColor: 'var(--border-color)' }}></div>
                  <span style={{ fontSize: '0.9rem' }}>Earn your first $500</span>
                  <span className="ms-auto text-success fw-bold" style={{ fontSize: '0.75rem' }}>$350/$500</span>
                </div>
                <div className="d-flex align-items-center gap-3 fw-medium">
                  <div className="rounded-circle border border-2" style={{ width: '18px', height: '18px', borderColor: 'var(--border-color)' }}></div>
                  <span style={{ fontSize: '0.9rem' }}>Maintain 4.8+ rating</span>
                </div>
              </div>
              
              <div className="pt-4 border-top">
                <div className="d-flex justify-content-between align-items-center mb-2 fw-semibold" style={{ fontSize: '0.85rem' }}>
                  <span>Progress to Level 2</span>
                  <span>75%</span>
                </div>
                <div className="progress" style={{ height: '8px', backgroundColor: 'var(--border-color)' }}>
                  <div className="progress-bar" role="progressbar" style={{ width: '75%', backgroundColor: 'var(--secondary-color)' }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="sh-card p-4 border-0 text-white" style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)' }}>
              <h5 className="fw-bold mb-2">Need more clients?</h5>
              <p className="mb-4 text-white-50" style={{ fontSize: '0.85rem' }}>Promote your gigs using our new tools and get up to 3x more visibility.</p>
              <button className="btn w-100 fw-bold" style={{ backgroundColor: 'white', color: 'var(--primary-color)', fontSize: '0.9rem' }}>
                Explore Promo Tools
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
