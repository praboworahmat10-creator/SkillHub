import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getOrderDetailApi, updateOrderStatusApi } from '../../services/orderService';
import { FiArrowLeft, FiCheck, FiSend, FiClock, FiDollarSign, FiFileText, FiMessageSquare } from 'react-icons/fi';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await getOrderDetailApi(id);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusChange = (newStatus, actionTitle) => {
    Swal.fire({
      title: `${actionTitle}?`,
      text: `Apakah Anda yakin ingin memperbarui status pesanan menjadi ${newStatus}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Lanjutkan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#2563eb',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateOrderStatusApi(id, newStatus);
          Swal.fire('Berhasil', 'Status pesanan berhasil diperbarui.', 'success');
          fetchOrder();
        } catch (err) {
          Swal.fire('Gagal', err.response?.data?.message || 'Gagal memperbarui status.', 'error');
        }
      }
    });
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (!order) return (
    <div className="container py-5 text-center">
      <h4>Pesanan tidak ditemukan.</h4>
      <Link to="/dashboard/freelancer/orders" className="btn btn-primary mt-3">Kembali ke Pesanan</Link>
    </div>
  );

  return (
    <div className="container-fluid pb-5">
      <Link to="/dashboard/freelancer/orders" className="btn btn-link text-decoration-none p-0 mb-4 d-inline-flex align-items-center gap-2 fw-semibold">
        <FiArrowLeft /> Kembali ke Daftar Pesanan
      </Link>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-1.5 rounded-pill fw-bold">
                ORDER #{order.id} &bull; {order.status?.toUpperCase()}
              </span>
              <span className="text-muted small">
                Tanggal: {new Date(order.created_at).toLocaleDateString('id-ID')}
              </span>
            </div>

            <h3 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>{order.service?.title || `Pesanan Pekerjaan #${order.id}`}</h3>
            <p className="text-muted leading-relaxed mb-4">{order.service?.description || 'Deskripsi detail pekerjaan.'}</p>

            <div className="p-4 rounded-4 bg-light dark:bg-dark-subtle mb-4">
              <div className="row g-3">
                <div className="col-6 col-md-4">
                  <p className="text-muted small mb-1">Nilai Kontrak</p>
                  <h5 className="fw-bold text-primary mb-0">Rp {(order.amount || 0).toLocaleString('id-ID')}</h5>
                </div>
                <div className="col-6 col-md-4">
                  <p className="text-muted small mb-1">Client</p>
                  <h5 className="fw-bold mb-0">{order.client?.name || 'Klien SkillHub'}</h5>
                </div>
                <div className="col-12 col-md-4">
                  <p className="text-muted small mb-1">Status Pembayaran</p>
                  <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-1 fw-semibold">
                    Escrow Terverifikasi
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons based on Status */}
            <div className="d-flex flex-wrap gap-2 pt-3 border-top">
              {['active', 'pending'].includes(order.status) && (
                <button onClick={() => handleStatusChange('in_progress', 'Mulai Pengerjaan')} className="btn btn-primary rounded-3 fw-bold px-4 py-2">
                  <FiCheck /> Mulai Pengerjaan Proyek
                </button>
              )}

              {order.status === 'in_progress' && (
                <button onClick={() => handleStatusChange('submitted', 'Serahkan Hasil Kerja')} className="btn btn-success text-white rounded-3 fw-bold px-4 py-2">
                  <FiSend /> Serahkan Hasil Kerja (Submit Work)
                </button>
              )}

              <Link to="/dashboard/messages" className="btn btn-outline-secondary rounded-3 px-4 py-2 fw-semibold ms-auto">
                <FiMessageSquare /> Chat Client
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4" style={{ backgroundColor: 'var(--card-bg)' }}>
            <h5 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>Kebutuhan Proyek (Requirements)</h5>
            <p className="text-muted small mb-0">
              Klien belum menambahkan file attachment tambahan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
