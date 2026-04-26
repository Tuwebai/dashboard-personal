import { useId } from 'react';

interface BrandLogoProps {
  collapsed?: boolean;
  className?: string;
  variant?: 'default' | 'sidebar';
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
          <stop offset="0%" style={{ stopColor: 'var(--brand-primary-start)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--brand-primary-end)' }} />
        </linearGradient>
        <linearGradient id={accentGradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--brand-accent-start)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--brand-accent-end)' }} />
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

export function BrandLogo({
  collapsed = false,
  className = '',
  variant = 'default',
}: BrandLogoProps) {
  const isSidebar = variant === 'sidebar';
  const markClassName = isSidebar ? 'h-7 w-7 shrink-0' : 'h-8 w-8 shrink-0';
  const nameTextClassName = isSidebar
    ? 'text-[1.05rem] md:text-[1.05rem]'
    : 'text-lg md:text-[1.625rem]';
  const subtitleTextClassName = isSidebar
    ? 'text-[0.42rem] tracking-[0.18em] md:text-[0.42rem]'
    : 'text-[0.5rem] tracking-[0.22em] md:text-[0.58rem]';

  if (collapsed) {
    return <BrandMark className={className} />;
  }

  return (
    <div className={`flex min-w-0 items-center ${isSidebar ? 'gap-2' : 'gap-3'} ${className}`}>
      <BrandMark className={markClassName} />
      <div className="min-w-0">
        <div className="flex min-w-0 items-baseline gap-1">
          <span
            className={`truncate bg-clip-text font-bold tracking-tight text-transparent ${nameTextClassName}`}
            style={{ backgroundImage: 'linear-gradient(135deg, var(--brand-primary-start), var(--brand-primary-end))' }}
          >
            Nexus
          </span>
          <span className={`truncate font-light tracking-[0.12em] text-zinc-400 ${nameTextClassName}`}>
            CRM
          </span>
        </div>
        <p className={`truncate font-medium text-zinc-500 ${subtitleTextClassName}`}>
          PERSONAL DASHBOARD
        </p>
      </div>
    </div>
  );
}
