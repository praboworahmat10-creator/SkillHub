import React, { useState } from 'react';
import { 
  FiCreditCard, FiArrowUpRight, FiArrowDownLeft, 
  FiFileText, FiDownload, FiPlus, FiMoreVertical, FiCheckCircle, FiClock 
} from 'react-icons/fi';
import { FaCcVisa, FaCcMastercard, FaPaypal } from 'react-icons/fa';

const transactionsData = [
  { id: 1, type: 'Keluar', title: 'Pembayaran Milestone 1', to: 'Rizky Pratama', amount: 'Rp 2.500.000', date: '6 Ags 2026', status: 'Berhasil' },
  { id: 2, type: 'Keluar', title: 'Pembayaran DP Proyek', to: 'Diana Putri', amount: 'Rp 1.000.000', date: '4 Ags 2026', status: 'Berhasil' },
  { id: 3, type: 'Masuk', title: 'Top Up Saldo', to: 'Bank Transfer (BCA)', amount: 'Rp 10.000.000', date: '1 Ags 2026', status: 'Berhasil' },
  { id: 4, type: 'Keluar', title: 'Pembayaran Milestone 2', to: 'Budi Santoso', amount: 'Rp 3.000.000', date: '28 Jul 2026', status: 'Berhasil' },
];

const invoicesData = [
  { id: 'INV-20260806-01', project: 'Redesign UI/UX Dashboard', amount: 'Rp 2.500.000', date: '6 Ags 2026', status: 'Lunas' },
  { id: 'INV-20260804-02', project: 'Pembuatan Logo Startup', amount: 'Rp 1.000.000', date: '4 Ags 2026', status: 'Lunas' },
  { id: 'INV-20260810-03', project: 'Pengembangan API Laravel', amount: 'Rp 7.500.000', date: '10 Ags 2026', status: 'Belum Dibayar' },
];

const paymentMethodsData = [
  { id: 1, type: 'Visa', number: '**** **** **** 4242', expiry: '12/28', isDefault: true, icon: <FaCcVisa size={32} color="#1a1f71" /> },
  { id: 2, type: 'Mastercard', number: '**** **** **** 5555', expiry: '08/27', isDefault: false, icon: <FaCcMastercard size={32} color="#eb001b" /> },
  { id: 3, type: 'Paypal', email: 'user@example.com', isDefault: false, icon: <FaPaypal size={32} color="#003087" /> },
];

const BillingPage = () => {
  const [activeTab, setActiveTab] = useState('transactions');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'transactions':
        return (
          <div className="animation-fade-in">
            <h5 className="fw-bold mb-4" style={{ color: 'var(--text-main)' }}>Riwayat Transaksi</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle" style={{ color: 'var(--text-main)', borderColor: 'var(--border-color)' }}>
                <thead style={{ backgroundColor: 'var(--bg-color)' }}>
                  <tr>
                    <th className="py-3 border-0 rounded-start-3">Transaksi</th>
                    <th className="py-3 border-0">Ke/Dari</th>
                    <th className="py-3 border-0">Tanggal</th>
                    <th className="py-3 border-0">Status</th>
                    <th className="py-3 border-0 text-end rounded-end-3">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionsData.map((trx) => (
                    <tr key={trx.id}>
                      <td className="py-3" style={{ borderBottomColor: 'var(--border-color)' }}>
                        <div className="d-flex align-items-center gap-3">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{ 
                              width: '40px', height: '40px', 
                              backgroundColor: trx.type === 'Masuk' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                              color: trx.type === 'Masuk' ? '#22c55e' : '#ef4444' 
                            }}
                          >
                            {trx.type === 'Masuk' ? <FiArrowDownLeft size={20} /> : <FiArrowUpRight size={20} />}
                          </div>
                          <div>
                            <div className="fw-semibold">{trx.title}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{trx.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3" style={{ borderBottomColor: 'var(--border-color)' }}>{trx.to}</td>
                      <td className="py-3" style={{ borderBottomColor: 'var(--border-color)' }}>{trx.date}</td>
                      <td className="py-3" style={{ borderBottomColor: 'var(--border-color)' }}>
                        <span className="badge rounded-pill d-inline-flex align-items-center gap-1" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', fontWeight: '500' }}>
                          <FiCheckCircle /> {trx.status}
                        </span>
                      </td>
                      <td className="py-3 text-end fw-bold" style={{ borderBottomColor: 'var(--border-color)', color: trx.type === 'Masuk' ? '#22c55e' : 'var(--text-main)' }}>
                        {trx.type === 'Masuk' ? '+' : '-'}{trx.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      
      case 'invoices':
        return (
          <div className="animation-fade-in">
            <h5 className="fw-bold mb-4" style={{ color: 'var(--text-main)' }}>Tagihan & Invoice</h5>
            <div className="d-flex flex-column gap-3">
              {invoicesData.map((inv) => (
                <div key={inv.id} className="d-flex flex-wrap justify-content-between align-items-center p-4 rounded-4" style={{ border: '1px solid var(--border-color)' }}>
                  <div className="d-flex gap-3 align-items-center">
                    <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '48px', backgroundColor: 'var(--bg-color)', color: 'var(--primary-color)' }}>
                      <FiFileText size={24} />
                    </div>
                    <div>
                      <div className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{inv.project}</div>
                      <div className="d-flex align-items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <span>{inv.id}</span>
                        <span>•</span>
                        <span>{inv.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-4 mt-3 mt-md-0">
                    <div className="text-end">
                      <div className="fw-bold" style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{inv.amount}</div>
                      {inv.status === 'Lunas' ? (
                        <span className="text-success fw-semibold" style={{ fontSize: '0.85rem' }}>Lunas</span>
                      ) : (
                        <span className="text-warning fw-semibold" style={{ fontSize: '0.85rem' }}>Belum Dibayar</span>
                      )}
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                        <FiDownload />
                      </button>
                      {inv.status !== 'Lunas' && (
                        <button className="btn btn-sm btn-primary fw-semibold px-3 shadow-sm" style={{ borderRadius: '8px' }}>
                          Bayar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'payment-methods':
        return (
          <div className="animation-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>Metode Pembayaran Tersimpan</h5>
              <button className="btn btn-sm btn-primary d-flex align-items-center gap-2 fw-semibold px-3 shadow-sm" style={{ borderRadius: '8px' }}>
                <FiPlus /> Tambah Baru
              </button>
            </div>
            
            <div className="row g-4">
              {paymentMethodsData.map((pm) => (
                <div key={pm.id} className="col-12 col-md-6 col-lg-4">
                  <div className="p-4 rounded-4 h-100 position-relative" style={{ border: pm.isDefault ? '2px solid var(--primary-color)' : '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
                    {pm.isDefault && (
                      <span className="position-absolute badge bg-primary" style={{ top: '-10px', right: '20px' }}>Default</span>
                    )}
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      {pm.icon}
                      <button className="btn btn-sm p-0 text-muted shadow-none border-0">
                        <FiMoreVertical size={20} />
                      </button>
                    </div>
                    {pm.number ? (
                      <>
                        <div className="fw-bold mb-1" style={{ color: 'var(--text-main)', fontSize: '1.1rem', letterSpacing: '2px' }}>{pm.number}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Berlaku hingga: {pm.expiry}</div>
                      </>
                    ) : (
                      <>
                        <div className="fw-bold mb-1" style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{pm.email}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Akun PayPal</div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container-fluid pb-5">
      {/* ── Page Header ── */}
      <div
        className="d-flex flex-wrap justify-content-between align-items-center mb-4 mt-2 px-4 py-4 rounded-4 shadow-sm gap-3"
        style={{
          background: 'linear-gradient(135deg, var(--primary-color) 0%, #1e40af 100%)',
          color: 'white',
        }}
      >
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <FiCreditCard size={28} />
            Keuangan & Tagihan
          </h2>
          <p className="mb-0" style={{ opacity: 0.9, fontSize: '0.95rem' }}>
            Kelola saldo, riwayat transaksi, dan invoice Anda
          </p>
        </div>
        
        <div className="d-flex gap-4">
          <div>
            <div style={{ opacity: 0.8, fontSize: '0.85rem', marginBottom: '2px' }}>Total Saldo</div>
            <div className="fw-bold" style={{ fontSize: '1.5rem', letterSpacing: '0.5px' }}>Rp 6.500.000</div>
          </div>
          <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
          <div>
            <div style={{ opacity: 0.8, fontSize: '0.85rem', marginBottom: '2px' }}>Pengeluaran Bulan Ini</div>
            <div className="fw-bold" style={{ fontSize: '1.5rem', letterSpacing: '0.5px' }}>Rp 3.500.000</div>
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="mb-4 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
        <ul className="nav nav-pills gap-2 pb-2">
          <li className="nav-item">
            <button
              className={`nav-link fw-semibold px-4 ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
              style={{
                borderRadius: '10px',
                backgroundColor: activeTab === 'transactions' ? 'var(--primary-color)' : 'transparent',
                color: activeTab === 'transactions' ? 'white' : 'var(--text-muted)'
              }}
            >
              Riwayat Transaksi
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link fw-semibold px-4 ${activeTab === 'invoices' ? 'active' : ''}`}
              onClick={() => setActiveTab('invoices')}
              style={{
                borderRadius: '10px',
                backgroundColor: activeTab === 'invoices' ? 'var(--primary-color)' : 'transparent',
                color: activeTab === 'invoices' ? 'white' : 'var(--text-muted)'
              }}
            >
              Tagihan & Invoice
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link fw-semibold px-4 ${activeTab === 'payment-methods' ? 'active' : ''}`}
              onClick={() => setActiveTab('payment-methods')}
              style={{
                borderRadius: '10px',
                backgroundColor: activeTab === 'payment-methods' ? 'var(--primary-color)' : 'transparent',
                color: activeTab === 'payment-methods' ? 'white' : 'var(--text-muted)'
              }}
            >
              Metode Pembayaran
            </button>
          </li>
        </ul>
      </div>

      {/* ── Tab Content ── */}
      <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: 'var(--card-bg)', minHeight: '400px' }}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default BillingPage;
