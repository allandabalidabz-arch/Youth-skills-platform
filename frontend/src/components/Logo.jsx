import React from 'react';

// Full illustrated SVG logo similar to the reference style
export function LogoIcon({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="greenGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* White background circle */}
      <circle cx="100" cy="95" r="82" fill="white" stroke="#e2e8f0" strokeWidth="1"/>

      {/* Blue outer swoosh arc - top */}
      <path d="M 30 60 Q 100 10 170 60" stroke="url(#blueGrad)" strokeWidth="10" fill="none" strokeLinecap="round"/>
      {/* Orange outer swoosh arc - right */}
      <path d="M 168 65 Q 195 100 168 140" stroke="url(#orangeGrad)" strokeWidth="10" fill="none" strokeLinecap="round"/>
      {/* Green outer swoosh arc - bottom */}
      <path d="M 165 142 Q 100 185 35 142" stroke="url(#greenGrad)" strokeWidth="10" fill="none" strokeLinecap="round"/>
      {/* Blue outer swoosh arc - left */}
      <path d="M 32 138 Q 8 100 32 62" stroke="url(#blueGrad)" strokeWidth="10" fill="none" strokeLinecap="round"/>

      {/* Globe circle */}
      <circle cx="100" cy="95" r="38" fill="none" stroke="#2563eb" strokeWidth="2.5" opacity="0.3"/>
      <ellipse cx="100" cy="95" rx="20" ry="38" fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.3"/>
      <line x1="62" y1="95" x2="138" y2="95" stroke="#2563eb" strokeWidth="2" opacity="0.3"/>
      <line x1="62" y1="78" x2="138" y2="78" stroke="#2563eb" strokeWidth="1.5" opacity="0.2"/>
      <line x1="62" y1="112" x2="138" y2="112" stroke="#2563eb" strokeWidth="1.5" opacity="0.2"/>
      {/* Globe fill */}
      <circle cx="100" cy="95" r="37" fill="#dbeafe" opacity="0.5"/>

      {/* Laptop screen */}
      <rect x="72" y="72" width="56" height="36" rx="4" fill="url(#blueGrad)"/>
      <rect x="75" y="75" width="50" height="30" rx="2" fill="#bfdbfe"/>
      {/* Laptop base */}
      <rect x="65" y="108" width="70" height="5" rx="2.5" fill="#1e40af"/>
      <rect x="80" y="113" width="40" height="3" rx="1.5" fill="#1e3a8a"/>

      {/* Graduation cap on screen */}
      <polygon points="100,80 113,86 100,92 87,86" fill="white"/>
      <rect x="111" y="86" width="2.5" height="8" rx="1.25" fill="white" opacity="0.8"/>
      <circle cx="112.25" cy="95" r="2.5" fill="#f59e0b"/>

      {/* WiFi symbol top right */}
      <g transform="translate(148, 38)">
        <path d="M0 12 Q6 6 12 12" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M-3 9 Q6 0 15 9" stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
        <circle cx="6" cy="14" r="2" fill="#22c55e"/>
      </g>

      {/* Colorful pixel dots - top right */}
      <rect x="155" y="25" width="8" height="8" rx="1.5" fill="#f97316"/>
      <rect x="165" y="20" width="7" height="7" rx="1.5" fill="#2563eb"/>
      <rect x="158" y="35" width="6" height="6" rx="1" fill="#22c55e"/>
      <rect x="168" y="32" width="5" height="5" rx="1" fill="#f59e0b"/>
      <rect x="162" y="14" width="5" height="5" rx="1" fill="#a855f7"/>
      <rect x="172" y="22" width="4" height="4" rx="1" fill="#ef4444"/>

      {/* Small gear on bottom left */}
      <g transform="translate(42, 108) scale(0.7)">
        <circle cx="10" cy="10" r="6" fill="none" stroke="#16a34a" strokeWidth="2.5"/>
        <circle cx="10" cy="10" r="2.5" fill="#16a34a"/>
        {[0,45,90,135,180,225,270,315].map((angle, i) => (
          <rect key={i} x="9" y="2" width="2" height="3" rx="1" fill="#16a34a"
            transform={`rotate(${angle} 10 10)`}/>
        ))}
      </g>

      {/* Text: YOUTHSKILLS */}
      <text x="100" y="162" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900" fontSize="18" fill="#16a34a" letterSpacing="1">
        YOUTHSKILLS
      </text>

      {/* Decorative lines + PROGRAM */}
      <line x1="30" y1="172" x2="62" y2="172" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"/>
      <text x="100" y="175" textAnchor="middle" fontFamily="Arial, sans-serif"
        fontWeight="700" fontSize="12" fill="#f97316" letterSpacing="2">
        PROGRAM
      </text>
      <line x1="138" y1="172" x2="170" y2="172" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

// Compact inline logo for navbar/sidebar
export default function Logo({ size = 'md', white = false }) {
  const sizes = {
    sm: { icon: 32, title: 'text-sm', sub: 'text-xs' },
    md: { icon: 40, title: 'text-base', sub: 'text-xs' },
    lg: { icon: 52, title: 'text-xl', sub: 'text-sm' },
    xl: { icon: 80, title: 'text-2xl', sub: 'text-sm' },
  };
  const s = sizes[size] || sizes.md;
  const textColor = white ? 'text-white' : 'text-slate-800';
  const subColor = white ? 'text-orange-300' : 'text-orange-500';

  return (
    <div className="flex items-center gap-2">
      <LogoIcon size={s.icon} />
      <div className="flex flex-col leading-tight">
        <span className={`font-extrabold tracking-tight ${s.title} ${textColor}`}>
          YouthSkills
        </span>
        <span className={`font-bold uppercase tracking-widest ${s.sub} ${subColor}`}>
          Program
        </span>
      </div>
    </div>
  );
}
