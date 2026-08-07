import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiStar, FiMapPin, FiMessageCircle, FiActivity, FiClock, FiTrendingUp } from 'react-icons/fi';

const myTeamData = [
  {
    id: 1,
    name: 'Diana Putri',
    avatar: 'DP',
    color: '#8b5cf6',
    title: 'UI/UX Designer',
    location: 'Jakarta, Indonesia',
    rating: 4.9,
    reviews: 47,
    status: 'Online',
    activeProject: 'UI Redesign Dashboard',
    totalHoursThisMonth: 62,
    completedProjects: 3,
    ongoingContracts: 1,
    joinedAt: '1 bulan lalu',
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    performance: 92,
  },
  {
    id: 2,
    name: 'Rizky Pratama',
    avatar: 'RP',
    color: '#3b82f6',
    title: 'Full Stack Developer',
    location: 'Bandung, Indonesia',
    rating: 4.8,
    reviews: 62,
    status: 'Online',
    activeProject: 'Backend API Development',
    totalHoursThisMonth: 88,
    completedProjects: 5,
    ongoingContracts: 1,
    joinedAt: '3 minggu lalu',
    skills: ['React', 'Node.js', 'PostgreSQL'],
    performance: 88,
  },
  {
    id: 3,
    name: 'Andi Wijaya',
    avatar: 'AW',
    color: '#f59e0b',
    title: 'Mobile Developer',
    location: 'Yogyakarta, Indonesia',
    rating: 4.9,
    reviews: 28,
    status: 'Offline',
    activeProject: 'Mobile App Flutter',
    totalHoursThisMonth: 45,
    completedProjects: 2,
    ongoingContracts: 1,
    joinedAt: '2 bulan lalu',
    skills: ['Flutter', 'React Native', 'Kotlin'],
    performance: 95,
  },
];

const performanceColor = (val) => {
  if (val >= 90) return { bar: '#22c55e', label: 'Sangat Baik' };
  if (val >= 75) return { bar: '#3b82f6', label: 'Baik' };
  if (val >= 60) return { bar: '#f59e0b', label: 'Cukup' };
  return { bar: '#ef4444', label: 'Perlu Perhatian' };
};

const MyTeamPage = () => {
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
            <FiUsers className="me-2 text-primary" />
            Tim Saya
          </h2>
          <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Freelancer yang sedang aktif bekerja dengan Anda
          </p>
        </div>
        <Link
          to="/dashboard/talent"
          className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
          style={{ borderRadius: '10px', fontWeight: '600', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', border: 'none' }}
        >
          + Tambah Anggota Tim
        </Link>
      </div>

      {/* Summary */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Anggota Tim', value: myTeamData.length, icon: <FiUsers size={20} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
          { label: 'Total Jam Bulan Ini', value: `${myTeamData.reduce((a, m) => a + m.totalHoursThisMonth, 0)} jam`, icon: <FiClock size={20} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
          { label: 'Proyek Selesai', value: myTeamData.reduce((a, m) => a + m.completedProjects, 0), icon: <FiActivity size={20} />, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
          { label: 'Rata-rata Performa', value: `${Math.round(myTeamData.reduce((a, m) => a + m.performance, 0) / myTeamData.length)}%`, icon: <FiTrendingUp size={20} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        ].map((s, i) => (
          <div key={i} className="col-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-4 p-3">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{ width: '44px', height: '44px', backgroundColor: s.bg, color: s.color, flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-muted fw-semibold mb-1" style={{ fontSize: '0.78rem' }}>{s.label}</p>
                  <h5 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>{s.value}</h5>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Team Member Cards */}
      <div className="row g-4">
        {myTeamData.map(member => {
          const perf = performanceColor(member.performance);
          return (
            <div key={member.id} className="col-12 col-md-6 col-xl-4">
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
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="position-relative">
                    <div
                      className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: '52px', height: '52px', backgroundColor: member.color, fontSize: '1rem', flexShrink: 0 }}
                    >
                      {member.avatar}
                    </div>
                    <span
                      className="position-absolute bottom-0 end-0 rounded-circle border border-2"
                      style={{
                        width: '14px', height: '14px',
                        backgroundColor: member.status === 'Online' ? '#22c55e' : '#94a3b8',
                      }}
                    />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0" style={{ color: 'var(--text-main)' }}>{member.name}</h6>
                    <small style={{ color: 'var(--text-muted)' }}>{member.title}</small>
                    <div className="d-flex align-items-center gap-1 mt-1">
                      <FiMapPin size={11} style={{ color: 'var(--text-muted)' }} />
                      <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{member.location}</small>
                    </div>
                  </div>
                </div>

                {/* Rating & Status */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="d-flex align-items-center gap-1 fw-bold" style={{ color: '#f59e0b', fontSize: '0.85rem' }}>
                    <FiStar size={13} /> {member.rating}
                    <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({member.reviews})</span>
                  </span>
                  <span
                    className="badge rounded-pill px-3"
                    style={{
                      backgroundColor: member.status === 'Online' ? 'rgba(34,197,94,0.1)' : 'rgba(148,163,184,0.15)',
                      color: member.status === 'Online' ? '#16a34a' : '#64748b',
                      fontSize: '0.75rem', fontWeight: '600',
                    }}
                  >
                    ● {member.status}
                  </span>
                </div>

                {/* Performance */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: '500' }}>Performa</span>
                    <span className="fw-bold" style={{ color: perf.bar, fontSize: '0.82rem' }}>{member.performance}% · {perf.label}</span>
                  </div>
                  <div className="progress rounded-pill" style={{ height: '6px', backgroundColor: 'var(--border-color)' }}>
                    <div className="progress-bar rounded-pill" style={{ width: `${member.performance}%`, backgroundColor: perf.bar }} />
                  </div>
                </div>

                {/* Stats */}
                <div className="row g-2 mb-3">
                  {[
                    { label: 'Jam/Bulan', value: `${member.totalHoursThisMonth}j` },
                    { label: 'Selesai', value: member.completedProjects },
                    { label: 'Bergabung', value: member.joinedAt },
                  ].map((stat, i) => (
                    <div key={i} className="col-4">
                      <div className="text-center p-2 rounded-3" style={{ backgroundColor: 'var(--bg-color)' }}>
                        <div className="fw-bold" style={{ color: 'var(--text-main)', fontSize: '0.88rem' }}>{stat.value}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active Project */}
                <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: 'var(--primary-light)' }}>
                  <p className="mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Proyek Aktif</p>
                  <p className="mb-0 fw-semibold" style={{ color: 'var(--primary-color)', fontSize: '0.85rem' }}>{member.activeProject}</p>
                </div>

                {/* Skills */}
                <div className="d-flex flex-wrap gap-1 mb-4">
                  {member.skills.map(skill => (
                    <span key={skill} className="badge rounded-pill"
                      style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: '500' }}>
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="d-flex gap-2">
                  <Link
                    to="/dashboard/messages"
                    className="btn flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                    style={{ borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', border: 'none' }}
                  >
                    <FiMessageCircle size={14} /> Pesan
                  </Link>
                  <Link
                    to="/dashboard/client/contracts"
                    className="btn border d-flex align-items-center justify-content-center"
                    style={{ borderRadius: '10px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}
                  >
                    <FiActivity size={14} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyTeamPage;
