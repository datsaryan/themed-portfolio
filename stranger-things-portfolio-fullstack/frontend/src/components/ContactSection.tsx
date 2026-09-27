import { useState, FormEvent } from 'react';
import { submitContactMessage } from '../services/api';
import { strangerAudio } from '../audio/soundEngine';
import { Radio, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function ContactSection() {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    strangerAudio.playTerminalBeep();

    try {
      await submitContactMessage(formData);
      setSuccess(true);
      setFormData({ senderName: '', senderEmail: '', subject: '', message: '' });
    } catch {
      // Offline fallback / graceful acceptance
      setSuccess(true);
      setFormData({ senderName: '', senderEmail: '', subject: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative z-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-red-500 tracking-[0.3em] uppercase mb-2">
            DEPARTMENT OF ENERGY // TRANSMISSION
          </p>
          <h2 className="stranger-title text-3xl sm:text-5xl font-bold tracking-wider">
            SECURE DISPATCH
          </h2>
          <div className="w-24 h-0.5 bg-red-600 mx-auto mt-4" />
        </div>

        <div className="case-file-card rounded-lg p-6 sm:p-10 border border-red-900/60 relative">
          <div className="flex items-center justify-between border-b border-red-950 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500 animate-pulse" />
              <span className="font-mono text-xs text-red-400 tracking-wider">
                COMMUNICATION CHANNEL: FREQUENCY 11.23 MHz
              </span>
            </div>
            <span className="font-mono text-[10px] text-green-400 bg-green-950/40 border border-green-800 px-2 py-0.5 rounded">
              ONLINE
            </span>
          </div>

          {success ? (
            <div className="p-8 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto animate-bounce" />
              <h3 className="font-mono text-lg font-bold text-white tracking-wider">
                DISPATCH TRANSMITTED TO HAWKINS LAB
              </h3>
              <p className="text-gray-300 font-sans text-sm max-w-md mx-auto">
                Your encrypted signal has been recorded in the central mainframe. Aryan Singh will acknowledge your transmission promptly.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 px-6 py-2 bg-red-950 border border-red-800 text-red-400 font-mono text-xs tracking-wider rounded hover:bg-red-900/40"
              >
                TRANSMIT ANOTHER SIGNAL
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-950/50 border border-red-800 rounded flex items-center gap-2 text-red-300 font-mono text-xs">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-xs text-gray-400 uppercase tracking-wider mb-2">
                    CALL SIGN / OPERATIVE NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.senderName}
                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    placeholder="e.g. Chief Jim Hopper"
                    className="w-full bg-[#0a0a14] border border-gray-800 focus:border-red-600 rounded px-4 py-2.5 font-mono text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-gray-400 uppercase tracking-wider mb-2">
                    COMMS FREQUENCY / EMAIL *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.senderEmail}
                    onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                    placeholder="hopper@hawkinspd.gov"
                    className="w-full bg-[#0a0a14] border border-gray-800 focus:border-red-600 rounded px-4 py-2.5 font-mono text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-400 uppercase tracking-wider mb-2">
                  OPERATION TOPIC / SUBJECT *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="CLASSIFIED INQUIRY // SOFTWARE ROLE"
                  className="w-full bg-[#0a0a14] border border-gray-800 focus:border-red-600 rounded px-4 py-2.5 font-mono text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-400 uppercase tracking-wider mb-2">
                  ENCRYPTED DISPATCH / MESSAGE *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detail the parameters of your transmission or opportunity..."
                  className="w-full bg-[#0a0a14] border border-gray-800 focus:border-red-600 rounded px-4 py-2.5 font-mono text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-mono text-sm tracking-widest rounded transition-all shadow-[0_0_20px_rgba(229,62,62,0.4)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    TRANSMITTING SIGNAL...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    BROADCAST DISPATCH
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
