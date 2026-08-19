import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrdersApi } from '../../services/orderService';
import { FiInbox, FiClock, FiDollarSign, FiCheckCircle, FiChevronRight } from 'react-icons/fi';

const FreelancerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrdersApi({ status: activeTab });
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const tabs = [
    { key: 'all', label: 'Semua Pesanan' },
    { key: 'active', label: 'Aktif' },
    { key: 'in_progress', label: 'Dalam Pengerjaan' },
    { key: 'revision', label: 'Revisi' },
    { key: 'completed', label: 'Selesai' },
  ];

  return (
    <div className="container-fluid pb-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>💼 Pesanan Pekerjaan (Orders)</h2>
        <p className="text-muted mb-0">Pantau progres pengerjaan dan kelola proyek aktif Anda.</p>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 border-bottom mb-4 overflow-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`btn btn-sm rounded-pill px-3 py-2 fw-semibold transition ${activeTab === tab.key ? 'btn-primary' : 'btn-light text-muted'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : orders.length > 0 ? (
        <div className="d-flex flex-column gap-3">
          {orders.map((ord) => (
            <div key={ord.id} className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: 'var(--card-bg)' }}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1.5 rounded-pill fw-semibold">
                      #{ord.id} &bull; {ord.status?.toUpperCase()}
                    </span>
                  </div>
                  <h5 className="fw-bold mb-1">{ord.service?.title || `Pesanan #${ord.id}`}</h5>
                  <p className="text-muted small mb-0">Client: {ord.client?.name || 'Klien SkillHub'}</p>
                </div>

                <div className="d-flex flex-column align-items-md-end justify-content-between gap-2">
                  <h4 className="fw-bold text-primary mb-0">Rp {(ord.amount || 0).toLocaleString('id-ID')}</h4>
                  <Link to={`/dashboard/freelancer/orders/${ord.id}`} className="btn btn-outline-primary btn-sm rounded-3 fw-bold d-flex align-items-center gap-1">
                    Detail Pesanan <FiChevronRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center text-muted" style={{ backgroundColor: 'var(--card-bg)' }}>
          <FiInbox size={48} className="mb-3 opacity-50 mx-auto" />
          <h5 className="fw-bold mb-1">Belum ada pesanan aktif pada status ini.</h5>
          <p className="small mb-0">Pastikan profil identitas Anda terverifikasi agar klien dapat langsung memesan jasa Anda!</p>
        </div>
      )}
    </div>
  );
};

export default FreelancerOrdersPage;
