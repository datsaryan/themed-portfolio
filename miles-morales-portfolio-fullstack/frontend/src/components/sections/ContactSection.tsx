import React, { useState } from 'react';
import { Radio, Send, CheckCircle2, AlertTriangle, Mail, Github, Linkedin, Code2, Phone } from 'lucide-react';
import { ProfileData, WorldMode } from '../../types/portfolio';
import { submitContactMessage } from '../../services/api';
import { strangerAudio } from '../../audio/soundEngine';

interface ContactSectionProps {
  personal: ProfileData;
  world: WorldMode;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ personal, world }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'transmitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    strangerAudio.playClickSound();
    setStatus('transmitting');
    setStatusMessage('Transmitting message through Hawkins RF relay...');

    const res = await submitContactMessage(formData);
    if (res.success) {
      setStatus('success');
      setStatusMessage(res.message);
      setFormData({ name: '', email: '', message: '' });
    } else {
      setStatus('error');
      setStatusMessage(res.message);
    }
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-hawkins-border">
          <div>
            <div className="text-xs font-mono tracking-widest text-hawkins-red uppercase font-semibold mb-1 flex items-center gap-2">
              <Radio className="w-4 h-4 animate-pulse" />
              SECTION 05 // OPEN THE GATE
            </div>
            <h2 className="text-3xl sm:text-4xl font-title text-hawkins-text tracking-wide">
              TRANSMIT A MESSAGE
            </h2>
          </div>
          <div className="mt-3 sm:mt-0 text-xs font-mono text-hawkins-crt">
            FREQUENCY: 86.4 MHz // ENCRYPTED
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Transmission Console Form */}
          <div className="md:col-span-3 case-file-border rounded-lg p-6 sm:p-8 bg-hawkins-card/90">
            <h3 className="text-lg font-title text-hawkins-text mb-2">
              SEND DIRECT TELECOMMUNICATION
            </h3>
            <p className="text-xs text-hawkins-text-muted font-sans mb-6">
              Transmissions are routed through the Spring Boot API, stored securely in SQL archives, and dispatched immediately.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-hawkins-amber uppercase tracking-wider mb-1.5">
                  OPERATIVE NAME / RECRUITER
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Martin Brenner"
                  className="w-full px-3.5 py-2.5 rounded bg-hawkins-surface border border-hawkins-border text-hawkins-text placeholder-hawkins-text-dim text-sm font-mono focus:outline-none focus:border-hawkins-red transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-hawkins-amber uppercase tracking-wider mb-1.5">
                  COMMUNICATION FREQUENCY (EMAIL)
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. brenner@hawkinslab.gov"
                  className="w-full px-3.5 py-2.5 rounded bg-hawkins-surface border border-hawkins-border text-hawkins-text placeholder-hawkins-text-dim text-sm font-mono focus:outline-none focus:border-hawkins-red transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-hawkins-amber uppercase tracking-wider mb-1.5">
                  TRANSMISSION DISPATCH
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="State project details, engineering roles, or collaboration opportunities..."
                  className="w-full px-3.5 py-2.5 rounded bg-hawkins-surface border border-hawkins-border text-hawkins-text placeholder-hawkins-text-dim text-sm font-mono focus:outline-none focus:border-hawkins-red transition-colors resize-none"
                />
              </div>

              {/* Status Display */}
              {status !== 'idle' && (
                <div
                  className={`p-3 rounded text-xs font-mono flex items-center gap-2 ${
                    status === 'transmitting'
                      ? 'bg-hawkins-surface border border-hawkins-amber text-hawkins-amber'
                      : status === 'success'
                      ? 'bg-hawkins-surface border border-hawkins-crt text-hawkins-crt'
                      : 'bg-hawkins-surface border border-hawkins-red text-hawkins-red'
                  }`}
                >
                  {status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : status === 'error' ? (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  ) : (
                    <Radio className="w-4 h-4 shrink-0 animate-spin" />
                  )}
                  <span>{statusMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'transmitting'}
                className="w-full py-3 rounded bg-hawkins-red hover:bg-red-700 disabled:opacity-50 text-white font-mono text-xs sm:text-sm font-semibold tracking-wider transition-all shadow-hawkins-glow flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {status === 'transmitting' ? 'BROADCASTING...' : 'BROADCAST TRANSMISSION'}
              </button>
            </form>
          </div>

          {/* Direct Channels & Terminal Info */}
          <div className="md:col-span-2 flex flex-col justify-between space-y-6">
            <div className="case-file-border rounded-lg p-6 bg-hawkins-card/80">
              <span className="text-xs font-mono text-hawkins-amber uppercase tracking-wider block mb-4">
                DIRECT SECURE CHANNELS:
              </span>

              <div className="space-y-4">
                <a
                  href={`mailto:${personal.email}`}
                  className="flex items-center gap-3 text-xs font-mono text-hawkins-text-muted hover:text-hawkins-red transition-colors group"
                >
                  <div className="p-2 rounded bg-hawkins-surface border border-hawkins-border group-hover:border-hawkins-red">
                    <Mail className="w-4 h-4 text-hawkins-red" />
                  </div>
                  <div>
                    <span className="text-[10px] text-hawkins-text-dim block">ELECTRONIC MAIL</span>
                    <span className="text-hawkins-text font-semibold">{personal.email}</span>
                  </div>
                </a>

                <div className="flex items-center gap-3 text-xs font-mono text-hawkins-text-muted">
                  <div className="p-2 rounded bg-hawkins-surface border border-hawkins-border">
                    <Phone className="w-4 h-4 text-hawkins-crt" />
                  </div>
                  <div>
                    <span className="text-[10px] text-hawkins-text-dim block">VOICE TELECOMMUNICATION</span>
                    <span className="text-hawkins-text font-semibold">{personal.phone}</span>
                  </div>
                </div>

                <a
                  href={personal.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-xs font-mono text-hawkins-text-muted hover:text-hawkins-amber transition-colors group"
                >
                  <div className="p-2 rounded bg-hawkins-surface border border-hawkins-border group-hover:border-hawkins-amber">
                    <Linkedin className="w-4 h-4 text-hawkins-amber" />
                  </div>
                  <div>
                    <span className="text-[10px] text-hawkins-text-dim block">PROFESSIONAL NETWORK</span>
                    <span className="text-hawkins-text font-semibold">Aryan Singh // LinkedIn</span>
                  </div>
                </a>

                <a
                  href={personal.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-xs font-mono text-hawkins-text-muted hover:text-hawkins-text transition-colors group"
                >
                  <div className="p-2 rounded bg-hawkins-surface border border-hawkins-border group-hover:border-hawkins-text">
                    <Github className="w-4 h-4 text-hawkins-text" />
                  </div>
                  <div>
                    <span className="text-[10px] text-hawkins-text-dim block">CODE REPOSITORIES</span>
                    <span className="text-hawkins-text font-semibold">@datsaryan</span>
                  </div>
                </a>

                <a
                  href={personal.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-xs font-mono text-hawkins-text-muted hover:text-hawkins-crt transition-colors group"
                >
                  <div className="p-2 rounded bg-hawkins-surface border border-hawkins-border group-hover:border-hawkins-crt">
                    <Code2 className="w-4 h-4 text-hawkins-crt" />
                  </div>
                  <div>
                    <span className="text-[10px] text-hawkins-text-dim block">ALGORITHMIC PROBLEMS</span>
                    <span className="text-hawkins-text font-semibold">leetcode.com/u/datsaryan</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-4 rounded border border-hawkins-border bg-hawkins-surface/40 text-[11px] font-mono text-hawkins-text-dim leading-relaxed">
              &gt; NOTICE: All communications submitted through this portal are archived directly into the SQL persistent layer. No credentials or private tokens are exposed.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
