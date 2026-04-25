interface BrandLogoProps {
  collapsed?: boolean;
  className?: string;
}

export function BrandLogo({ collapsed = false, className = "" }: BrandLogoProps) {
  if (collapsed) {
    return (
      <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <linearGradient id="g1-collapsed" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c3aed"/>
            <stop offset="100%" stopColor="#06b6d4"/>
          </linearGradient>
          <linearGradient id="g2-collapsed" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6"/>
            <stop offset="100%" stopColor="#22d3ee"/>
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="22" fill="none" stroke="url(#g1-collapsed)" strokeWidth="1.5" opacity="0.3"/>
        <circle cx="24" cy="24" r="6" fill="url(#g1-collapsed)"/>
        <line x1="24" y1="18" x2="24" y2="6" stroke="url(#g1-collapsed)" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="29" y1="26.8" x2="38.5" y2="32.3" stroke="url(#g1-collapsed)" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="19" y1="26.8" x2="9.5" y2="32.3" stroke="url(#g1-collapsed)" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="24" cy="5" r="3.5" fill="url(#g2-collapsed)"/>
        <circle cx="40" cy="33.5" r="3.5" fill="url(#g2-collapsed)"/>
        <circle cx="8" cy="33.5" r="3.5" fill="url(#g2-collapsed)"/>
      </svg>
    );
  }

  return (
    <svg width="160" height="40" viewBox="0 0 280 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="g1-full" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed"/>
          <stop offset="100%" stopColor="#06b6d4"/>
        </linearGradient>
        <linearGradient id="g2-full" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b5cf6"/>
          <stop offset="100%" stopColor="#22d3ee"/>
        </linearGradient>
      </defs>
      <g transform="translate(6, 8)">
        <circle cx="24" cy="24" r="22" fill="none" stroke="url(#g1-full)" strokeWidth="1.5" opacity="0.3"/>
        <circle cx="24" cy="24" r="6" fill="url(#g1-full)"/>
        <line x1="24" y1="18" x2="24" y2="6" stroke="url(#g1-full)" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="29" y1="26.8" x2="38.5" y2="32.3" stroke="url(#g1-full)" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="19" y1="26.8" x2="9.5" y2="32.3" stroke="url(#g1-full)" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="24" cy="5" r="3.5" fill="url(#g2-full)"/>
        <circle cx="40" cy="33.5" r="3.5" fill="url(#g2-full)"/>
        <circle cx="8" cy="33.5" r="3.5" fill="url(#g2-full)"/>
        <line x1="27.2" y1="6.8" x2="37.2" y2="31" stroke="url(#g1-full)" strokeWidth="0.75" strokeLinecap="round" opacity="0.3"/>
        <line x1="20.8" y1="6.8" x2="10.8" y2="31" stroke="url(#g1-full)" strokeWidth="0.75" strokeLinecap="round" opacity="0.3"/>
        <line x1="10" y1="35.5" x2="38" y2="35.5" stroke="url(#g1-full)" strokeWidth="0.75" strokeLinecap="round" opacity="0.3"/>
      </g>
      <text x="64" y="30" fontFamily="Inter, -apple-system, sans-serif" fontSize="26" fontWeight="700" fill="url(#g2-full)" letterSpacing="-0.5">Nexus</text>
      <text x="160" y="30" fontFamily="Inter, -apple-system, sans-serif" fontSize="26" fontWeight="300" fill="#a3a3a3" letterSpacing="2">CRM</text>
      <text x="64" y="48" fontFamily="Inter, -apple-system, sans-serif" fontSize="10" fontWeight="400" fill="#444444" letterSpacing="2">PERSONAL DASHBOARD</text>
    </svg>
  );
}
