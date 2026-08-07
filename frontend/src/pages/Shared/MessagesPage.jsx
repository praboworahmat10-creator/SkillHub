import React, { useState } from 'react';
import { 
  FiSearch, FiMoreVertical, FiPaperclip, 
  FiSend, FiSmile, FiPhone, FiVideo, FiInfo
} from 'react-icons/fi';

const contactsData = [
  { id: 1, name: 'Budi Santoso', role: 'Freelancer', avatar: 'BS', color: '#3b82f6', lastMessage: 'Baik, saya akan mulai kerjakan hari ini.', time: '10:42', unread: 2, isOnline: true },
  { id: 2, name: 'Siti Rahayu', role: 'Client', avatar: 'SR', color: '#10b981', lastMessage: 'Apakah desainnya sudah selesai?', time: 'Kemarin', unread: 0, isOnline: false },
  { id: 3, name: 'Andi Wijaya', role: 'Freelancer', avatar: 'AW', color: '#f59e0b', lastMessage: 'Terima kasih atas pembayarannya.', time: 'Senin', unread: 0, isOnline: true },
];

const chatHistory = [
  { id: 1, senderId: 1, text: 'Halo! Saya sudah membaca detail proyeknya.', time: '10:30', isMe: false },
  { id: 2, senderId: 'me', text: 'Halo Budi, terima kasih. Apakah ada yang kurang jelas?', time: '10:32', isMe: true },
  { id: 3, senderId: 1, text: 'Untuk bagian integrasi API pembayaran, apakah menggunakan Midtrans?', time: '10:35', isMe: false },
  { id: 4, senderId: 'me', text: 'Betul, kita akan pakai Midtrans. Nanti saya kirimkan dokumentasi API key-nya.', time: '10:40', isMe: true },
  { id: 5, senderId: 1, text: 'Baik, saya akan mulai kerjakan hari ini.', time: '10:42', isMe: false },
];

const MessagesPage = () => {
  const [activeContactId, setActiveContactId] = useState(1);
  const [messageText, setMessageText] = useState('');

  const activeContact = contactsData.find(c => c.id === activeContactId);

  return (
    <div className="container-fluid px-0" style={{ height: 'calc(100vh - 88px)' }}>

      <div className="card border-0 rounded-0 shadow-sm overflow-hidden h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
        <div className="row g-0 h-100">
          
          {/* ── Left Panel (Contact List) ── */}
          <div className="col-12 col-md-5 col-lg-4 border-end h-100 d-flex flex-column" style={{ borderColor: 'var(--border-color) !important' }}>
            <div className="p-3 border-bottom" style={{ borderColor: 'var(--border-color) !important' }}>
              <div className="position-relative">
                <FiSearch className="position-absolute text-muted" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  className="form-control py-2 shadow-none" 
                  placeholder="Cari obrolan..." 
                  style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '10px', paddingLeft: '40px', fontSize: '0.9rem' }}
                />
              </div>
            </div>
            
            <div className="overflow-auto flex-grow-1" style={{ backgroundColor: 'var(--bg-color)' }}>
              {contactsData.map(contact => (
                <div 
                  key={contact.id}
                  onClick={() => setActiveContactId(contact.id)}
                  className={`p-3 border-bottom d-flex align-items-center gap-3`}
                  style={{ 
                    cursor: 'pointer', borderColor: 'var(--border-color) !important',
                    backgroundColor: activeContactId === contact.id ? 'var(--card-bg)' : 'transparent',
                    borderLeft: activeContactId === contact.id ? '3px solid var(--primary-color)' : '3px solid transparent'
                  }}
                >
                  <div className="position-relative">
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: '48px', height: '48px', backgroundColor: contact.color, fontSize: '1.1rem' }}>
                      {contact.avatar}
                    </div>
                    {contact.isOnline && (
                      <span className="position-absolute" style={{ bottom: '2px', right: '2px', width: '12px', height: '12px', backgroundColor: '#10b981', border: '2px solid var(--card-bg)', borderRadius: '50%' }}></span>
                    )}
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="fw-bold text-truncate" style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{contact.name}</div>
                      <div style={{ color: contact.unread > 0 ? 'var(--primary-color)' : 'var(--text-muted)', fontSize: '0.75rem', fontWeight: contact.unread > 0 ? '600' : 'normal' }}>{contact.time}</div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="text-truncate" style={{ color: contact.unread > 0 ? 'var(--text-main)' : 'var(--text-muted)', fontSize: '0.85rem', fontWeight: contact.unread > 0 ? '600' : 'normal', width: '85%' }}>
                        {contact.lastMessage}
                      </div>
                      {contact.unread > 0 && (
                        <span className="badge rounded-pill bg-primary" style={{ fontSize: '0.65rem' }}>{contact.unread}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Panel (Chat Room) ── */}
          <div className="col-12 col-md-7 col-lg-8 h-100 d-flex flex-column">
            
            {/* Chat Header */}
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center" style={{ borderColor: 'var(--border-color) !important', backgroundColor: 'var(--card-bg)' }}>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: '40px', height: '40px', backgroundColor: activeContact?.color }}>
                  {activeContact?.avatar}
                </div>
                <div>
                  <div className="fw-bold" style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{activeContact?.name}</div>
                  <div style={{ color: activeContact?.isOnline ? '#10b981' : 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '500' }}>
                    {activeContact?.isOnline ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-link text-muted p-2 shadow-none"><FiPhone size={20} /></button>
                <button className="btn btn-link text-muted p-2 shadow-none"><FiVideo size={20} /></button>
                <div className="vr mx-1" style={{ backgroundColor: 'var(--border-color)' }}></div>
                <button className="btn btn-link text-muted p-2 shadow-none"><FiInfo size={20} /></button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-grow-1 p-4 overflow-auto" style={{ backgroundColor: 'var(--bg-color)' }}>
              <div className="text-center mb-4">
                <span className="badge fw-normal" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>Hari Ini</span>
              </div>
              
              <div className="d-flex flex-column gap-3">
                {chatHistory.map(chat => (
                  <div key={chat.id} className={`d-flex flex-column ${chat.isMe ? 'align-items-end' : 'align-items-start'}`}>
                    <div 
                      className="p-3 shadow-sm" 
                      style={{ 
                        maxWidth: '75%', 
                        backgroundColor: chat.isMe ? 'var(--primary-color)' : 'var(--card-bg)',
                        color: chat.isMe ? 'white' : 'var(--text-main)',
                        borderRadius: chat.isMe ? '16px 16px 0 16px' : '16px 16px 16px 0',
                        border: chat.isMe ? 'none' : '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{chat.text}</div>
                    </div>
                    <div className="mt-1 px-1" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{chat.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-3 border-top" style={{ borderColor: 'var(--border-color) !important', backgroundColor: 'var(--card-bg)' }}>
              <div className="d-flex gap-2 align-items-center bg-transparent">
                <button className="btn btn-link text-muted p-2 shadow-none"><FiPaperclip size={20} /></button>
                <div className="flex-grow-1 position-relative">
                  <input 
                    type="text" 
                    className="form-control py-2 shadow-none pe-5" 
                    placeholder="Ketik pesan..." 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter') setMessageText(''); }}
                    style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '20px' }}
                  />
                  <button className="btn btn-link text-muted p-2 shadow-none position-absolute end-0 top-50 translate-middle-y"><FiSmile size={20} /></button>
                </div>
                <button 
                  className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm" 
                  style={{ width: '40px', height: '40px' }}
                  onClick={() => setMessageText('')}
                >
                  <FiSend size={18} style={{ marginLeft: '-2px' }} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
