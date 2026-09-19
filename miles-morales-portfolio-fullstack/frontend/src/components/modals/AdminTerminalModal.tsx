import React, { useState, useEffect } from 'react';
import { X, Terminal, Shield, Lock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { adminLogin, fetchAdminTransmissions, fetchAdminStats } from '../../services/api';
import { ContactMessage, AdminStats, AuthResponse } from '../../types/portfolio';
import { strangerAudio } from '../../audio/soundEngine';

interface AdminTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminTerminalModal: React.FC<AdminTerminalModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('HawkinsLab1986!');
  const [authData, setAuthData] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transmissions, setTransmissions] = useState<ContactMessage[] | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    strangerAudio.playClickSound();
    setLoading(true);
    setError(null);

    const res = await adminLogin(username, password);
    setLoading(false);

    if (res && res.token) {
      setAuthData(res);
      loadAdminData(res.token);
    } else {
      setError('AUTHENTICATION FAILED: Invalid security credentials.');
    }
  };

  const loadAdminData = async (token: string) => {
    const [messages, telemetry] = await Promise.all([
      fetchAdminTransmissions(token),
      fetchAdminStats(token),
    ]);
    if (messages) setTransmissions(messages);
    if (telemetry) setStats(telemetry);
  };

  const handleLogout = () => {
    strangerAudio.playClickSound();
    setAuthData(null);
    setTransmissions(null);
    setStats(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0a0f0d] border-2 border-hawkins-crt/60 rounded-lg shadow-2xl p-6 font-mono text-hawkins-crt"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-hawkins-crt/40 mb-5">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-hawkins-crt" />
            <span className="text-sm font-bold tracking-widest uppercase">
              HAWKINS LAB // CLASSIFIED SECURITY TERMINAL
            </span>
          </div>
          <button
            onClick={() => {
              strangerAudio.playClickSound();
              onClose();
            }}
            className="text-hawkins-crt/70 hover:text-hawkins-red p-1"
            aria-label="Close Terminal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Terminal Body */}
        {!authData ? (
          <div>
            <div className="p-3 mb-5 rounded bg-black/60 border border-hawkins-crt/30 text-xs text-hawkins-crt/90 leading-relaxed">
              &gt; SYSTEM PROTOCOL: RESTRICTED ACCESS.<br />
              &gt; This terminal authenticates directly with the Spring Boot JWT filter.<br />
              &gt; Demo Credentials pre-filled: <strong className="text-hawkins-amber">admin / HawkinsLab1986!</strong>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto py-2">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 text-hawkins-crt/80">
                  LOGIN USERNAME:
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-hawkins-crt/50 rounded text-hawkins-crt text-sm focus:outline-none focus:border-hawkins-crt"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-1 text-hawkins-crt/80">
                  SECURITY KEY / PASSWORD:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-black border border-hawkins-crt/50 rounded text-hawkins-crt text-sm focus:outline-none focus:border-hawkins-crt"
                />
              </div>

              {error && (
                <div className="text-xs text-hawkins-red flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-hawkins-crt/20 hover:bg-hawkins-crt/30 border border-hawkins-crt text-hawkins-crt rounded text-xs tracking-widest font-bold transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {loading ? 'AUTHENTICATING TOKEN...' : 'AUTHENTICATE VIA JWT'}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Authenticated Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-hawkins-crt/30 gap-2">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-hawkins-crt" />
                <span>AUTHENTICATED: {authData.username} ({authData.role})</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs px-3 py-1 border border-hawkins-red text-hawkins-red hover:bg-hawkins-red/20 rounded"
              >
                TERMINATE SESSION
              </button>
            </div>

            {/* JWT Token Display */}
            <div className="p-3 bg-black/80 rounded border border-hawkins-crt/40 text-xs">
              <span className="text-[10px] text-hawkins-amber uppercase tracking-wider block mb-1">
                VALID JWT BEARER TOKEN (HMAC-SHA256):
              </span>
              <p className="break-all text-[11px] text-hawkins-crt/80 font-mono">
                {authData.token}
              </p>
            </div>

            {/* Telemetry Stats */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-black/60 rounded border border-hawkins-crt/30 text-center">
                  <span className="text-[10px] block text-hawkins-text-dim">TOTAL TRANSMISSIONS</span>
                  <span className="text-lg font-bold text-hawkins-crt">{stats.totalMessages}</span>
                </div>
                <div className="p-3 bg-black/60 rounded border border-hawkins-crt/30 text-center">
                  <span className="text-[10px] block text-hawkins-text-dim">PROJECTS</span>
                  <span className="text-lg font-bold text-hawkins-amber">{stats.totalProjects}</span>
                </div>
                <div className="p-3 bg-black/60 rounded border border-hawkins-crt/30 text-center">
                  <span className="text-[10px] block text-hawkins-text-dim">SKILL NODES</span>
                  <span className="text-lg font-bold text-hawkins-crt">{stats.totalSkills}</span>
                </div>
                <div className="p-3 bg-black/60 rounded border border-hawkins-crt/30 text-center">
                  <span className="text-[10px] block text-hawkins-text-dim">DATABASE ENGINE</span>
                  <span className="text-xs font-bold text-hawkins-crt block mt-1">{stats.databaseEngine}</span>
                </div>
              </div>
            )}

            {/* Received Transmissions */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block mb-2 text-hawkins-amber">
                ARCHIVED CONTACT TRANSMISSIONS (/api/admin/messages):
              </span>
              {transmissions && transmissions.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {transmissions.map((t) => (
                    <div key={t.id} className="p-3 bg-black/60 rounded border border-hawkins-crt/30 text-xs">
                      <div className="flex items-center justify-between text-hawkins-text-dim mb-1 text-[10px]">
                        <span>FROM: {t.name} ({t.email})</span>
                        <span>{t.submittedAt ? new Date(t.submittedAt).toLocaleString() : 'N/A'}</span>
                      </div>
                      <p className="text-hawkins-crt/90 text-xs font-sans">{t.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-hawkins-text-dim p-3 bg-black/40 rounded border border-hawkins-crt/20">
                  No transmissions currently logged in SQL archive.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
