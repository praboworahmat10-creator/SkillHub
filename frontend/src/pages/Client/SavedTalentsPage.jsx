import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiTrash2, FiMessageCircle, FiBriefcase, FiSearch, FiBookmark, FiUser } from 'react-icons/fi';

const savedTalentsData = [
  {
    id: 1,
    name: 'Diana Putri',
    title: 'UI/UX Designer',
    location: 'Jakarta, Indonesia',
    rating: 4.9,
    reviews: 47,
    rate: 'Rp 350.000/jam',
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    avatar: 'DP',
    color: '#8b5cf6',
    savedAt: '2 hari lalu',
    status: 'Online',
  },
  {
    id: 2,
    name: 'Rizky Pratama',
    title: 'Full Stack Developer',
    location: 'Bandung, Indonesia',
    rating: 4.8,
    reviews: 62,
    rate: 'Rp 500.000/jam',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    avatar: 'RP',
    color: '#3b82f6',
    savedAt: '5 hari lalu',
    status: 'Online',
  },
  {
    id: 3,
    name: 'Siti Rahayu',
    title: 'Content Writer & SEO',
    location: 'Surabaya, Indonesia',
    rating: 4.7,
    reviews: 34,
    rate: 'Rp 150.000/jam',
    skills: ['SEO', 'Copywriting', 'WordPress'],
    avatar: 'SR',
    color: '#10b981',
    savedAt: '1 minggu lalu',
    status: 'Offline',
  },
  {
    id: 4,
    name: 'Andi Wijaya',
    title: 'Mobile Developer',
    location: 'Yogyakarta, Indonesia',
    rating: 4.9,
    reviews: 28,
    rate: 'Rp 450.000/jam',
    skills: ['Flutter', 'React Native', 'Kotlin'],
    avatar: 'AW',
    color: '#f59e0b',
    savedAt: '2 minggu lalu',
    status: 'Online',
  },
  {
    id: 5,
    name: 'Budi Santoso',
    title: 'Graphic Designer',
    location: 'Medan, Indonesia',
    rating: 4.6,
    reviews: 51,
    rate: 'Rp 200.000/jam',
    skills: ['Illustrator', 'Photoshop', 'Canva'],
    avatar: 'BS',
    color: '#ef4444',
    savedAt: '3 minggu lalu',
    status: 'Offline',
  },
];

const SavedTalentsPage = () => {
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(savedTalentsData);

  const handleRemove = (id) => {
    setSaved(prev => prev.filter(t => t.id !== id));
  };

  const filtered = saved.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container-fluid pb-5">
      {/* Page Header */}
      <div
        className="d-flex justify-content-between align-items-center mb-4 pt-4 pb-3 px-4 rounded-4 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--card-bg) 100%)',
          border: '1px solid var(--border-color)',
        }}
      >
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>
            <FiBookmark className="me-2 text-primary" />
            Talent Tersimpan
          </h2>
          <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Daftar freelancer favorit yang sudah Anda simpan
          </p>
        </div>
        <Link
          to="/dashboard/talent"
          className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
          style={{ borderRadius: '10px', fontWeight: '600', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', border: 'none' }}
        >
          <FiSearch size={16} /> Cari Talent Baru
        </Link>
      </div>

      {/* Search & Stats */}
      <div className="row g-3 mb-4 align-items-center">
        <div className="col-12 col-md-6">
          <div className="input-group">
            <span className="input-group-text border-0 shadow-sm" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-muted)' }}>
              <FiSearch />
            </span>
            <input
              type="text"
              className="form-control border-0 shadow-sm"
              placeholder="Cari talent tersimpan..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-main)' }}
            />
          </div>
        </div>
        <div className="col-12 col-md-6 d-flex align-items-center gap-3">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <FiUser className="me-1" />
            {filtered.length} talent tersimpan
          </span>
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-5">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
            style={{ width: '80px', height: '80px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)' }}
          >
            <FiBookmark size={36} />
          </div>
          <h5 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>
            {search ? 'Tidak ada hasil' : 'Belum ada talent tersimpan'}
          </h5>
          <p style={{ color: 'var(--text-muted)' }}>
            {search ? 'Coba kata kunci lain.' : 'Mulai simpan talent favorit Anda dari halaman pencarian.'}
          </p>
          {!search && (
            <Link to="/dashboard/talent" className="btn btn-primary mt-2" style={{ borderRadius: '10px' }}>
              Jelajahi Talent
            </Link>
          )}
        </div>
      )}

      {/* Talent Cards */}
      <div className="row g-4">
        {filtered.map(talent => (
          <div key={talent.id} className="col-12 col-md-6 col-xl-4">
            <div
              className="card border-0 shadow-sm rounded-4 h-100 p-4"
              style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(59,130,246,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              {/* Header */}
              <div className="d-flex align-items-start justify-content-between mb-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="position-relative">
                    <div
                      className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                      style={{ width: '52px', height: '52px', backgroundColor: talent.color, fontSize: '1rem' }}
                    >
                      {talent.avatar}
                    </div>
                    <span
                      className="position-absolute bottom-0 end-0 rounded-circle border border-2"
                      style={{
                        width: '14px', height: '14px',
                        backgroundColor: talent.status === 'Online' ? '#22c55e' : '#94a3b8',
                        borderColor: 'var(--card-bg) !important',
                      }}
                    />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>{talent.name}</h6>
                    <small style={{ color: 'var(--text-muted)' }}>{talent.title}</small>
                  </div>
                </div>
                <button
                  className="btn btn-sm border-0 p-1 rounded-3"
                  style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.08)' }}
                  title="Hapus dari tersimpan"
                  onClick={() => handleRemove(talent.id)}
                >
                  <FiTrash2 size={15} />
                </button>
              </div>

              {/* Location & Rating */}
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="d-flex align-items-center gap-1" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  <FiMapPin size={13} /> {talent.location}
                </span>
                <span className="d-flex align-items-center gap-1 fw-bold" style={{ color: '#f59e0b', fontSize: '0.85rem' }}>
                  <FiStar size={13} /> {talent.rating}
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({talent.reviews})</span>
                </span>
              </div>

              {/* Skills */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                {talent.skills.map(skill => (
                  <span
                    key={skill}
                    className="badge rounded-pill"
                    style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: '500' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Rate & Saved date */}
              <div className="d-flex align-items-center justify-content-between mb-4">
                <span className="fw-bold" style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>{talent.rate}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Disimpan {talent.savedAt}</span>
              </div>

              {/* Actions */}
              <div className="d-flex gap-2">
                <Link
                  to="/dashboard/messages"
                  className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                  style={{ borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', border: 'none' }}
                >
                  <FiMessageCircle size={14} /> Hubungi
                </Link>
                <Link
                  to="/dashboard/client/post-job"
                  className="btn border d-flex align-items-center justify-content-center gap-2"
                  style={{ borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}
                >
                  <FiBriefcase size={14} /> Hire
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedTalentsPage;
