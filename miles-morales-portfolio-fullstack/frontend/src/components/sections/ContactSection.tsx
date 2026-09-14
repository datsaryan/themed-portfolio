import React, { useState } from 'react';
import { useResumeData } from '../../data/useResumeData';
import { Mail, Phone, Linkedin, Github, Send, Copy, Check, Terminal, ExternalLink, FileDown } from 'lucide-react';
import { sound } from '../../audio/soundEngine';
import { submitContactMessage } from '../../services/api';

export const ContactSection: React.FC = () => {
  const { personal } = useResumeData();
  const [copied, setCopied] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const copyEmail = () => {
    sound.playThwip();
    navigator.clipboard.writeText(personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playThwip();
    setFormSent(true);

    // Persist server-side if a backend is configured (fire-and-forget — the
    // mailto fallback below is what actually guarantees delivery either way).
    void submitContactMessage(formData);

    // Open mailto link as practical fallback
    const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
    const body = encodeURIComponent(`${formData.message}\n\nFrom: ${formData.name} (${formData.email})`);
    window.open(`mailto:${personal.email}?subject=${subject}&body=${body}`, '_blank');
    setTimeout(() => {
      setFormSent(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-widest text-spider font-bold">
          <Send className="w-4 h-4" />
          <span>COMMS // 05</span>
          <span className="text-borderDark">————</span>
          <span className="text-subtext">DIRECT TRANSMISSION LINK</span>
        </div>
        <h2 className="font-display text-4xl sm:text-6xl text-white uppercase tracking-tight flex items-center gap-3">
          <span>SEND A</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-spider to-venom-purple">
            WEB SIGNAL
          </span>
        </h2>
        <p className="text-sm sm:text-base text-subtext mt-2 font-mono">
          // DISPATCH SECURE COMMUNIQUE DIRECTLY TO ARYAN SINGH'S TERMINAL
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Direct Transmission Channels */}
        <div className="lg:col-span-5 space-y-6">
          {/* Email Direct Access Box */}
          <div className="bg-surface/90 border border-borderDark comic-border p-6 relative">
            <div className="flex items-center justify-between border-b border-borderDark/80 pb-3 mb-4">
              <span className="font-mono text-xs text-spider font-bold uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4" />
                PRIMARY COMMS FREQUENCY
              </span>
              <button
                onClick={copyEmail}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-subtext hover:text-white bg-ink px-2 py-1 border border-borderDark transition-colors"
                title="Copy Email Address"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>

            <a
              href={`mailto:${personal.email}`}
              onClick={() => sound.playClick()}
              className="text-lg sm:text-xl font-mono text-white hover:text-spider transition-colors font-bold break-all block"
            >
              {personal.email}
            </a>

            <div className="mt-4 pt-3 border-t border-borderDark/60 flex items-center gap-2 text-xs font-mono text-subtext">
              <Phone className="w-3.5 h-3.5 text-spider" />
              <span>{personal.phone}</span>
            </div>
          </div>

          {/* Social / Professional Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={personal.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="bg-ink hover:bg-surface border border-borderDark hover:border-spider p-4 transition-all comic-border group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Linkedin className="w-5 h-5 text-spider group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-mono text-xs font-bold text-white uppercase">LinkedIn</div>
                  <div className="font-mono text-[10px] text-subtext">/aryan-singh</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-subtext group-hover:text-white transition-colors" />
            </a>

            <a
              href={personal.links.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="bg-ink hover:bg-surface border border-borderDark hover:border-spider p-4 transition-all comic-border group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5 text-spider group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-mono text-xs font-bold text-white uppercase">GitHub</div>
                  <div className="font-mono text-[10px] text-subtext">/datsaryan</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-subtext group-hover:text-white transition-colors" />
            </a>

            <a
              href={personal.links.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="bg-ink hover:bg-surface border border-borderDark hover:border-spider p-4 transition-all comic-border group flex items-center justify-between sm:col-span-2"
            >
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-graffiti-yellow group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-mono text-xs font-bold text-white uppercase">LeetCode Engineering Profile</div>
                  <div className="font-mono text-[10px] text-subtext">Active algorithmic practice & challenges</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-subtext group-hover:text-white transition-colors" />
            </a>
          </div>

          {/* Download Resume Banner */}
          <div className="bg-surface/60 border border-spider/60 p-4 flex items-center justify-between">
            <div className="font-mono text-xs text-paper">
              <span className="font-bold text-spider uppercase">OFFICIAL DOSSIER:</span> Full Resume PDF
            </div>
            <a
              href="/Aryan_FullStack_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-spider hover:bg-spider-bright text-white font-mono text-xs uppercase font-bold tracking-wider transition-colors shadow-comic-black"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>DOWNLOAD</span>
            </a>
          </div>
        </div>

        {/* Right Column: Web Message Terminal Form */}
        <div className="lg:col-span-7 bg-surface/90 border border-borderDark comic-border p-6 sm:p-8 relative">
          <div className="flex items-center justify-between border-b border-borderDark/80 pb-3 mb-6">
            <span className="font-mono text-xs text-graffiti-yellow font-bold uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-spider" />
              ENCRYPTED COMMUNIQUE DISPATCH
            </span>
            <span className="text-[10px] font-mono text-subtext">
              PORT: 443 // SECURE
            </span>
          </div>

          {formSent ? (
            <div className="p-8 text-center bg-ink border border-spider animate-web-burst">
              <div className="w-12 h-12 mx-auto bg-spider text-white flex items-center justify-center font-comic text-2xl shadow-comic-black rotate-6 mb-4">
                THWIP!
              </div>
              <h3 className="font-display text-2xl text-white uppercase tracking-wide">
                SIGNAL TRANSMITTED!
              </h3>
              <p className="text-xs sm:text-sm font-mono text-subtext mt-2 max-w-md mx-auto">
                Opening direct email client transmission to {personal.email}. Your message packet is on the wire.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-subtext uppercase tracking-wider mb-1.5">
                  OPERATIVE NAME / CALLSIGN
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Peter Parker / Hiring Manager"
                  className="w-full bg-ink border border-borderDark focus:border-spider text-white font-mono text-sm px-4 py-2.5 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-subtext uppercase tracking-wider mb-1.5">
                  RETURN FREQUENCY / EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full bg-ink border border-borderDark focus:border-spider text-white font-mono text-sm px-4 py-2.5 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-subtext uppercase tracking-wider mb-1.5">
                  TRANSMISSION PACKET / MESSAGE
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detail your mission objective, job opportunity, or collaboration inquiry..."
                  className="w-full bg-ink border border-borderDark focus:border-spider text-white font-mono text-sm px-4 py-2.5 outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-spider hover:bg-spider-bright text-white font-mono text-xs uppercase font-bold tracking-widest transition-all shadow-comic-black border border-white/20 mt-4"
              >
                <Send className="w-4 h-4" />
                <span>SLING WEB MESSAGE // TRANSMIT</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
