import { useId } from 'react';

interface BrandLogoProps {
  collapsed?: boolean;
  className?: string;
}

interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className = 'h-8 w-8 shrink-0' }: BrandMarkProps) {
  const primaryGradientId = `${useId()}-primary`;
  const accentGradientId = `${useId()}-accent`;

  return (
    <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id={primaryGradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed"/>
          <stop offset="100%" stopColor="#06b6d4"/>
        </linearGradient>
        <linearGradient id={accentGradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b5cf6"/>
          <stop offset="100%" stopColor="#22d3ee"/>
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="none" stroke={`url(#${primaryGradientId})`} strokeWidth="1.5" opacity="0.3"/>
      <circle cx="24" cy="24" r="6" fill={`url(#${primaryGradientId})`}/>
      <line x1="24" y1="18" x2="24" y2="6" stroke={`url(#${primaryGradientId})`} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="29" y1="26.8" x2="38.5" y2="32.3" stroke={`url(#${primaryGradientId})`} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="19" y1="26.8" x2="9.5" y2="32.3" stroke={`url(#${primaryGradientId})`} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="24" cy="5" r="3.5" fill={`url(#${accentGradientId})`}/>
      <circle cx="40" cy="33.5" r="3.5" fill={`url(#${accentGradientId})`}/>
      <circle cx="8" cy="33.5" r="3.5" fill={`url(#${accentGradientId})`}/>
    </svg>
  );
}

export function BrandLogo({ collapsed = false, className = "" }: BrandLogoProps) {

  if (collapsed) {
    return <BrandMark className={className} />;
  }

  return (
    <div className={`flex min-w-0 items-center gap-3 ${className}`}>
      <BrandMark />
      <div className="min-w-0">
        <div className="flex min-w-0 items-baseline gap-1">
          <span className="truncate bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-lg font-bold tracking-tight text-transparent md:text-[1.625rem]">
            Nexus
          </span>
          <span className="truncate text-lg font-light tracking-[0.14em] text-zinc-400 md:text-[1.625rem]">
            CRM
          </span>
        </div>
        <p className="truncate text-[0.5rem] font-medium tracking-[0.22em] text-zinc-500 md:text-[0.58rem]">
          PERSONAL DASHBOARD
        </p>
      </div>
    </div>
  );
}
