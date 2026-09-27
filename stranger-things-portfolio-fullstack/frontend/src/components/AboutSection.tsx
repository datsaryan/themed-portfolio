import { ProfileData, Certification } from '../types/portfolio';
import { Shield, MapPin, Mail, Phone, GraduationCap, Award } from 'lucide-react';

interface AboutSectionProps {
  profile: ProfileData;
  certifications: Certification[];
}

export function AboutSection({ profile, certifications }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-red-500 tracking-[0.3em] uppercase mb-2">
            SUBJECT FILE // CLASSIFIED
          </p>
          <h2 className="stranger-title text-3xl sm:text-5xl font-bold tracking-wider">
            DOSSIER &bull; ARYAN SINGH
          </h2>
          <div className="w-24 h-0.5 bg-red-600 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: ID Card / Clearance File */}
          <div className="lg:col-span-5">
            <div className="case-file-card rounded-lg p-6 border border-red-950/80 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-900/40 text-red-400 font-mono text-[10px] tracking-widest px-3 py-1 border-b border-l border-red-900/60 uppercase">
                CLEARANCE LEVEL 4
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded border-2 border-red-600/80 bg-red-950/40 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(229,62,62,0.3)]">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover filter contrast-125"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <Shield className="w-10 h-10 text-red-500" />
                  )}
                </div>
                <div>
                  <h3 className="font-mono text-lg font-bold text-white tracking-wider">
                    {profile.name}
                  </h3>
                  <p className="font-mono text-xs text-red-400">
                    ID: DOE-AS-860287
                  </p>
                  <p className="font-mono text-[11px] text-gray-400 mt-1">
                    DEPT: SOFTWARE &amp; SYSTEMS
                  </p>
                </div>
              </div>

              {/* Subject Parameters */}
              <div className="space-y-3 font-mono text-xs border-t border-b border-gray-800/80 py-4 my-4">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    LOCATION:
                  </span>
                  <span className="text-gray-200">{profile.location}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-red-500" />
                    EMAIL:
                  </span>
                  <a href={`mailto:${profile.email}`} className="text-red-400 hover:underline">
                    {profile.email}
                  </a>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-red-500" />
                    COMMS:
                  </span>
                  <span className="text-gray-200">{profile.phone}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-red-500" />
                    EDUCATION:
                  </span>
                  <span className="text-gray-200">B.Tech CSE (2023-2027)</span>
                </div>
              </div>

              {/* Status Note */}
              <div className="bg-red-950/20 border border-red-900/40 rounded p-3 text-[11px] font-mono text-gray-400">
                <span className="text-red-400 font-bold block mb-1">
                  OBSERVATION REPORT:
                </span>
                Demonstrates high aptitude in end-to-end full-stack architectures. Uniquely skilled at bridging complex backend logic (Spring Boot, Hibernate, JWT) with immersive frontend interfaces.
              </div>
            </div>
          </div>

          {/* Right Column: Bio Details and Certifications */}
          <div className="lg:col-span-7 space-y-6">
            <div className="case-file-card rounded-lg p-6 border border-gray-800/80">
              <h3 className="font-mono text-sm text-red-400 tracking-wider uppercase mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                EXECUTIVE SUMMARY
              </h3>
              <p className="text-gray-300 font-sans text-sm sm:text-base leading-relaxed mb-4">
                {profile.bio}
              </p>
              <p className="text-gray-400 font-sans text-sm leading-relaxed">
                Currently pursuing a Bachelor of Technology in Computer Science &amp; Engineering at <strong className="text-white">OP Jindal University</strong> (CGPA: 7.8/10.0). Driven by hands-on engineering, having completed production internships and published full-stack web applications.
              </p>
            </div>

            {/* Certifications & Badges */}
            <div className="case-file-card rounded-lg p-6 border border-gray-800/80">
              <h3 className="font-mono text-sm text-amber-400 tracking-wider uppercase mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                VERIFIED CLEARANCES &amp; ACCREDITATIONS
              </h3>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div
                    key={cert.title}
                    className="p-3 bg-[#0e0e18] border border-gray-800 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <h4 className="font-mono text-xs font-bold text-gray-200">
                        {cert.title}
                      </h4>
                      <p className="font-mono text-[11px] text-gray-500">
                        ISSUED BY: {cert.issuer} &bull; {cert.issuedDate}
                      </p>
                    </div>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-red-400 hover:text-red-300 underline self-start sm:self-auto"
                      >
                        VERIFY RECORD &rarr;
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
