import { useState, useEffect, FormEvent } from 'react';
import { adminLogin, fetchAdminStats, fetchAdminTransmissions, markTransmissionRead } from '../services/api';
import { AdminStats, ContactMessage } from '../types/portfolio';
import { strangerAudio } from '../audio/soundEngine';
import { X, Lock, Key, Terminal, BarChart2, Mail, Check, LogOut, Loader2 } from 'lucide-react';

interface AdminTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminTerminalModal({ isOpen, onClose }: AdminTerminalModalProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [transmissions, setTransmissions] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'stats' | 'messages'>('stats');

  useEffect(() => {
    const savedToken = localStorage.getItem('stranger_token');
    if (savedToken) {
      setToken(savedToken);
      loadDashboardData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const loadDashboardData = async () => {
    try {
      const [statsData, msgsData] = await Promise.all([
        fetchAdminStats().catch(() => null),
        fetchAdminTransmissions().catch(() => [])
      ]);
      if (statsData) setStats(statsData);
      if (msgsData) setTransmissions(msgsData);
    } catch {
      // offline or token expired
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    strangerAudio.playTerminalBeep();

    try {
      const auth = await adminLogin(username, password);
      setToken(auth.token);
      await loadDashboardData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('stranger_token');
    setToken(null);
    setStats(null);
    setTransmissions([]);
  };

  const handleMarkRead = async (id: number) => {
    try {
      await markTransmissionRead(id);
      setTransmissions((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
      );
      if (stats) {
        setStats({ ...stats, unreadMessages: Math.max(0, stats.unreadMessages - 1) });
      }
    } catch {
      // local mark
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="case-file-card rounded-lg border-2 border-red-700 bg-[#080811] max-w-3xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto font-mono">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-red-950 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-red-500" />
            <h3 className="text-sm sm:text-base font-bold text-white tracking-widest uppercase">
              HAWKINS NATIONAL LAB // MAINFRAME TERMINAL
            </h3>
          </div>
          <button
            onClick={() => {
              strangerAudio.playClick();
              onClose();
            }}
            className="p-1 rounded text-gray-400 hover:text-red-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!token ? (
          /* Login Form */
          <div className="max-w-md mx-auto py-6">
            <div className="text-center mb-6">
              <Lock className="w-10 h-10 text-red-500 mx-auto mb-2" />
              <h4 className="text-base font-bold text-white">
                SECURITY LEVEL 4 AUTHORIZATION
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Enter Hawkins Department of Energy administrator credentials.
              </p>
            </div>

            {error && (
              <div className="p-3 mb-4 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded">
                [ACCESS DENIED]: {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  OPERATOR IDENTIFIER:
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#030308] border border-gray-800 focus:border-red-600 rounded px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  ENCRYPTION PASSPHRASE:
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Hint: hawkins1983"
                  className="w-full bg-[#030308] border border-gray-800 focus:border-red-600 rounded px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-red-700 hover:bg-red-600 text-white text-xs tracking-widest rounded flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                AUTHENTICATE WITH JWT
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setTab('stats')}
                  className={`text-xs tracking-wider flex items-center gap-1.5 pb-1 ${
                    tab === 'stats' ? 'text-red-400 border-b-2 border-red-500' : 'text-gray-400'
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5" /> LAB METRICS
                </button>
                <button
                  onClick={() => setTab('messages')}
                  className={`text-xs tracking-wider flex items-center gap-1.5 pb-1 ${
                    tab === 'messages' ? 'text-red-400 border-b-2 border-red-500' : 'text-gray-400'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> TRANSMISSIONS ({transmissions.length})
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
              >
                <LogOut className="w-3.5 h-3.5" /> LOGOUT
              </button>
            </div>

            {tab === 'stats' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-[#0d0d18] border border-red-950 rounded text-center">
                    <span className="text-2xl font-bold text-red-400 block">
                      {stats?.totalProjects ?? 4}
                    </span>
                    <span className="text-[11px] text-gray-400">PROJECTS</span>
                  </div>
                  <div className="p-4 bg-[#0d0d18] border border-red-950 rounded text-center">
                    <span className="text-2xl font-bold text-amber-400 block">
                      {stats?.totalSkillCategories ?? 7}
                    </span>
                    <span className="text-[11px] text-gray-400">SKILL TIERS</span>
                  </div>
                  <div className="p-4 bg-[#0d0d18] border border-red-950 rounded text-center">
                    <span className="text-2xl font-bold text-blue-400 block">
                      {stats?.totalCertifications ?? 5}
                    </span>
                    <span className="text-[11px] text-gray-400">CERTS</span>
                  </div>
                  <div className="p-4 bg-[#0d0d18] border border-red-950 rounded text-center">
                    <span className="text-2xl font-bold text-green-400 block">
                      {stats?.totalMessages ?? transmissions.length}
                    </span>
                    <span className="text-[11px] text-gray-400">MESSAGES</span>
                  </div>
                </div>

                <div className="p-4 bg-[#05050c] border border-gray-800 rounded text-xs space-y-2">
                  <div className="text-red-400 font-bold">&gt; JWT TOKEN VERIFIED</div>
                  <div className="text-gray-400 break-all">
                    Bearer {token.slice(0, 32)}...[CLASSIFIED]
                  </div>
                  <div className="text-gray-500">
                    Spring Security Session: Stateless &bull; Role: ROLE_ADMIN
                  </div>
                </div>
              </div>
            )}

            {tab === 'messages' && (
              <div className="space-y-4">
                {transmissions.length === 0 ? (
                  <p className="text-gray-500 text-xs text-center py-6">
                    NO ACTIVE DISPATCHES RECORDED.
                  </p>
                ) : (
                  transmissions.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 bg-[#0c0c18] border border-red-950 rounded space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-red-400 font-bold">
                          FROM: {msg.senderName} ({msg.senderEmail})
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-[10px]">
                            {msg.submittedAt ? new Date(msg.submittedAt).toLocaleDateString() : 'RECENT'}
                          </span>
                          {!msg.isRead && msg.id && (
                            <button
                              onClick={() => handleMarkRead(msg.id!)}
                              className="px-2 py-0.5 bg-green-950 border border-green-800 text-green-400 text-[10px] rounded flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" /> MARK READ
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-amber-300 font-semibold">
                        SUBJ: {msg.subject}
                      </div>
                      <p className="text-xs text-gray-300 font-sans leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
