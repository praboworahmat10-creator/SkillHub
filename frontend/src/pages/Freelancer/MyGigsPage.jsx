import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { getMyGigsApi, createGigApi, updateGigApi, deleteGigApi } from '../../services/gigService';
import api from '../../services/api';
import { FiPlus, FiEdit, FiTrash2, FiClock, FiDollarSign, FiStar, FiCheck, FiX, FiLayers, FiImage } from 'react-icons/fi';

const MyGigsPage = () => {
  const [gigs, setGigs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGig, setEditingGig] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    description: '',
    price: '',
    delivery_time_days: '',
    revision_count: 3,
    status: 'active',
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const [gigsRes, catRes] = await Promise.all([
        getMyGigsApi(),
        api.get('/categories').catch(() => ({ data: { data: [] } })),
      ]);
      setGigs(gigsRes.data || []);
      setCategories(catRes.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch gigs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  const handleOpenModal = (gig = null) => {
    if (gig) {
      setEditingGig(gig);
      setFormData({
        title: gig.title || '',
        category_id: gig.category_id || '',
        description: gig.description || '',
        price: gig.price || '',
        delivery_time_days: gig.delivery_time_days || '',
        revision_count: gig.revision_count || 3,
        status: gig.status || 'active',
      });
    } else {
      setEditingGig(null);
      setFormData({
        title: '',
        category_id: categories[0]?.id || '',
        description: '',
        price: '',
        delivery_time_days: 5,
        revision_count: 3,
        status: 'active',
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (imageFile) data.append('thumbnail', imageFile);

      if (editingGig) {
        await updateGigApi(editingGig.id, data);
        Swal.fire('Berhasil', 'Layanan berhasil diperbarui.', 'success');
      } else {
        await createGigApi(data);
        Swal.fire('Berhasil', 'Layanan baru berhasil dibuat.', 'success');
      }

      setIsModalOpen(false);
      fetchGigs();
    } catch (err) {
      console.error(err);
      Swal.fire('Gagal', err.response?.data?.message || 'Gagal menyimpan layanan.', 'error');
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Hapus Layanan?',
      text: 'Layanan ini akan dihapus permanen dari marketplace.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#dc2626',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteGigApi(id);
          Swal.fire('Terhapus', 'Layanan telah dihapus.', 'success');
          fetchGigs();
        } catch (err) {
          Swal.fire('Gagal', 'Gagal menghapus layanan.', 'error');
        }
      }
    });
  };

  return (
    <div className="container-fluid pb-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>💼 Layanan Saya (My Gigs)</h2>
          <p className="text-muted mb-0">Kelola paket jasa freelance yang Anda tawarkan kepada client.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary fw-bold rounded-3 px-4 py-2 d-flex align-items-center gap-2">
          <FiPlus /> Buat Layanan Baru
        </button>
      </div>

      {/* Gigs List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : gigs.length > 0 ? (
        <div className="row g-4">
          {gigs.map((gig) => (
            <div key={gig.id} className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
                <div className="position-relative bg-light text-center py-4">
                  <FiLayers size={48} className="text-primary opacity-50" />
                  <span className="position-absolute top-0 start-0 m-3 badge bg-success bg-opacity-20 text-success rounded-pill px-3 py-1 fw-bold">
                    {gig.status?.toUpperCase()}
                  </span>
                </div>

                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="fw-bold mb-2 line-clamp-2" style={{ color: 'var(--text-main)' }}>{gig.title}</h5>
                    <p className="text-muted small line-clamp-2 mb-3">{gig.description}</p>
                  </div>

                  <div>
                    <div className="d-flex justify-content-between align-items-center pt-3 border-top mb-3">
                      <div>
                        <span className="text-muted text-xs">Harga Mulai</span>
                        <h5 className="fw-bold text-primary mb-0">Rp {(gig.price || 0).toLocaleString('id-ID')}</h5>
                      </div>
                      <div className="text-end">
                        <span className="text-muted text-xs">Waktu</span>
                        <p className="fw-semibold text-dark dark:text-light mb-0 small">{gig.delivery_time_days} Hari</p>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button onClick={() => handleOpenModal(gig)} className="btn btn-outline-primary btn-sm rounded-3 fw-bold flex-grow-1 d-flex align-items-center justify-content-center gap-1">
                        <FiEdit /> Edit
                      </button>
                      <button onClick={() => handleDelete(gig.id)} className="btn btn-outline-danger btn-sm rounded-3 px-3">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center text-muted" style={{ backgroundColor: 'var(--card-bg)' }}>
          <FiLayers size={48} className="mb-3 opacity-50 mx-auto" />
          <h5 className="fw-bold mb-1">Belum ada layanan yang dibuat.</h5>
          <p className="small mb-3">Buat paket jasa pertama Anda untuk mulai menerima pesanan dari client!</p>
          <button onClick={() => handleOpenModal()} className="btn btn-primary rounded-3 px-4 mx-auto">
            + Buat Layanan Sekarang
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1080 }}>
          <div className="bg-white dark:bg-dark shadow-2xl rounded-4 p-4 p-md-5 w-100" style={{ maxWidth: '600px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">{editingGig ? 'Edit Layanan' : 'Buat Layanan Baru'}</h4>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-light rounded-circle border-0"><FiX /></button>
            </div>

            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label className="form-label fw-bold small">Judul Layanan</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="Contoh: Pembuatan Website Landing Page React"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold small">Kategori</label>
                <select
                  className="form-select"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label fw-bold small">Harga (Rp)</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    placeholder="500000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fw-bold small">Waktu Pengerjaan (Hari)</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    placeholder="5"
                    value={formData.delivery_time_days}
                    onChange={(e) => setFormData({ ...formData, delivery_time_days: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold small">Deskripsi Layanan</label>
                <textarea
                  className="form-control"
                  rows={4}
                  required
                  placeholder="Jelaskan detail apa saja yang didapat client..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 fw-bold py-2.5 rounded-3">
                Simpan Layanan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGigsPage;
