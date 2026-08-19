import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light dark:bg-dark p-4">
          <div className="card border-0 shadow-lg rounded-4 p-5 text-center" style={{ maxWidth: '540px', backgroundColor: 'var(--card-bg)' }}>
            <div className="bg-danger bg-opacity-10 text-danger rounded-circle p-3 d-inline-flex mx-auto mb-3">
              <FiAlertTriangle size={48} />
            </div>
            <h4 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>Terjadi Kesalahan Tampilan</h4>
            <p className="text-muted small mb-4">
              Aplikasi mengalami kendala saat memuat halaman ini. Silakan refresh halaman atau hubungi dukungan SkillHub jika kendala berlanjut.
            </p>

            {this.state.error && (
              <div className="bg-dark text-danger p-3 rounded-3 text-start small font-monospace mb-4 overflow-auto" style={{ maxHeight: '150px' }}>
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="btn btn-primary rounded-3 fw-bold py-2.5 px-4 d-inline-flex align-items-center justify-content-center gap-2"
            >
              <FiRefreshCw /> Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
