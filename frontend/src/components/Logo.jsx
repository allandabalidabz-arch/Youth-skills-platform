import React from 'react';

// Full logo with image
export function LogoIcon({ size = 120 }) {
  return (
    <img
      src="/logo.png"
      alt="YouthSkills Program Logo"
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  );
}

// Inline logo for navbar/sidebar
export default function Logo({ size = 'md', white = false }) {
  const sizes = {
    sm: { icon: 36, title: 'text-sm', sub: 'text-xs' },
    md: { icon: 44, title: 'text-base', sub: 'text-xs' },
    lg: { icon: 56, title: 'text-xl', sub: 'text-sm' },
    xl: { icon: 80, title: 'text-2xl', sub: 'text-sm' },
  };
  const s = sizes[size] || sizes.md;
  const textColor = white ? 'text-white' : 'text-slate-800';
  const subColor = white ? 'text-orange-300' : 'text-orange-500';

  return (
    <div className="flex items-center gap-2">
      <img
        src="/logo.png"
        alt="YouthSkills Program"
        width={s.icon}
        height={s.icon}
        style={{ objectFit: 'contain' }}
      />
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
