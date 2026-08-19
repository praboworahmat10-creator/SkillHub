import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getEarningsApi, requestWithdrawalApi } from '../../services/walletService';
import { getVerificationStatusApi } from '../../services/verificationService';
import { FiDollarSign, FiTrendingUp, FiClock, FiArrowUpRight, FiX, FiShield, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const WalletPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null);

  // Withdrawal Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bankName, setBankName] = useState('BCA');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const [earningsRes, verRes] = await Promise.all([
        getEarningsApi(),
        getVerificationStatusApi().catch(() => null),
      ]);
      setData(earningsRes.data);
      if (verRes) setVerificationStatus(verRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const handleOpenWithdrawalModal = () => {
    const isVerified = verificationStatus?.identity_status === 'VERIFIED';

    if (!isVerified) {
      Swal.fire({
        icon: 'warning',
        title: 'Verifikasi Identitas Diperlukan',
        text: 'Penarikan dana (withdrawal) hanya dapat dilakukan oleh freelancer yang telah terverifikasi resmi oleh tim SkillHub.',
        confirmButtonText: 'Verifikasi Sekarang',
        showCancelButton: true,
        cancelButtonText: 'Tutup',
      });
      return;
    }

    setIsModalOpen(true);
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) < 50000) {
      Swal.fire('Peringatan', 'Minimal penarikan dana adalah Rp 50.000', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await requestWithdrawalApi({
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName,
        amount: parseFloat(amount),
      });

      await Swal.fire({
        icon: 'success',
        title: 'Permohonan Dikirim!',
        text: 'Penarikan dana berhasil diproses.',
      });

      setIsModalOpen(false);
      fetchEarnings();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Penarikan',
        text: err.response?.data?.message || 'Terjadi kesalahan saat menarik dana.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  const { balance = 0, pending_balance = 0, total_earnings = 0, this_month = 0, last_month = 0, transactions = [] } = data || {};
  const isVerified = verificationStatus?.identity_status === 'VERIFIED';

  return (
    <div className="container-fluid pb-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>💰 Dompet &amp; Pendapatan (Earnings)</h2>
          <p className="text-muted mb-0">Kelola penghasilan, saldo tertahan, dan tarik dana ke rekening bank Anda.</p>
        </div>

        <button
          onClick={handleOpenWithdrawalModal}
          className="btn btn-primary fw-bold rounded-3 px-4 py-2.5 d-flex align-items-center gap-2 shadow-sm"
        >
          <FiArrowUpRight size={18} /> Tarik Dana (Withdrawal)
        </button>
      </div>

      {/* Cards Grid */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: 'var(--card-bg)', borderTop: '4px solid #2563eb' }}>
            <p className="text-muted small fw-semibold mb-2">Saldo Aktif Ditarik</p>
            <h3 className="fw-extrabold text-primary mb-1">Rp {balance.toLocaleString('id-ID')}</h3>
            <p className="text-success text-xs fw-semibold mb-0 d-flex align-items-center gap-1">
              <FiTrendingUp /> Siap dicairkan
            </p>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
            <p className="text-muted small fw-semibold mb-2">Saldo Tertahan (Escrow)</p>
            <h3 className="fw-bold mb-1">Rp {pending_balance.toLocaleString('id-ID')}</h3>
            <p className="text-warning text-xs mb-0">Dalam pengerjaan proyek</p>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
            <p className="text-muted small fw-semibold mb-2">Pendapatan Bulan Ini</p>
            <h3 className="fw-bold mb-1">Rp {this_month.toLocaleString('id-ID')}</h3>
            <p className="text-muted text-xs mb-0">Bulan lalu: Rp {last_month.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
            <p className="text-muted small fw-semibold mb-2">Total Seluruh Akumulasi</p>
            <h3 className="fw-bold mb-1">Rp {total_earnings.toLocaleString('id-ID')}</h3>
            <p className="text-success text-xs mb-0">✓ Rekam jejak tercatat</p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: 'var(--card-bg)' }}>
        <h4 className="fw-bold mb-4" style={{ color: 'var(--text-main)' }}>Riwayat Transaksi</h4>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr className="text-muted small border-bottom">
                <th>TANGGAL</th>
                <th>TIPE</th>
                <th>DESKRIPSI</th>
                <th>JUMLAH</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="small text-muted">{tx.date}</td>
                  <td>
                    <span className={`badge rounded-pill px-3 py-1 ${tx.type === 'income' ? 'bg-success bg-opacity-10 text-success' : 'bg-primary bg-opacity-10 text-primary'}`}>
                      {tx.type === 'income' ? 'Pemasukan' : 'Penarikan'}
                    </span>
                  </td>
                  <td className="fw-semibold">{tx.description}</td>
                  <td className={`fw-bold ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                    {tx.type === 'income' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                  </td>
                  <td>
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2.5 py-1 text-xs">
                      Selesai
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {isModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1080 }}>
          <div className="bg-white dark:bg-dark shadow-2xl rounded-4 p-4 p-md-5 w-100" style={{ maxWidth: '520px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">Form Penarikan Dana (Payout)</h4>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-light rounded-circle border-0"><FiX /></button>
            </div>

            <form onSubmit={handleWithdrawSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Pilih Bank / E-Wallet</label>
                <select className="form-select bg-light" value={bankName} onChange={(e) => setBankName(e.target.value)}>
                  <option value="BCA">Bank BCA</option>
                  <option value="Mandiri">Bank Mandiri</option>
                  <option value="BNI">Bank BNI</option>
                  <option value="BRI">Bank BRI</option>
                  <option value="QRIS">QRIS / E-Wallet (OVO/DANA/Gopay)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Nomor Rekening / HP E-Wallet</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  required
                  placeholder="8820xxxxxx"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Nama Pemilik Rekening</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  required
                  placeholder="Nama Sesuai KTP & Buku Tabungan"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold small">Jumlah Penarikan (Rp)</label>
                <input
                  type="number"
                  className="form-control bg-light"
                  required
                  min="50000"
                  placeholder="Minimal Rp 50.000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="form-text text-xs">Saldo Tersedia: Rp {balance.toLocaleString('id-ID')}</div>
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary w-100 fw-bold py-2.5 rounded-3">
                {submitting ? 'Memproses...' : 'Konfirmasi Penarikan Dana'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
