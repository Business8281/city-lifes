const Logo = ({ className = "w-14 h-14", color = "white" }: { className?: string; color?: string }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left building wing */}
      <rect x="8" y="16" width="12" height="40" stroke={color} strokeWidth="3" fill="none" rx="2" />
      
      {/* Right building wing */}
      <rect x="44" y="16" width="12" height="40" stroke={color} strokeWidth="3" fill="none" rx="2" />
      
      {/* Center main building */}
      <rect x="20" y="8" width="24" height="48" stroke={color} strokeWidth="3" fill="none" rx="2" />
      
      {/* Horizontal lines in center (floors) */}
      <line x1="24" y1="20" x2="40" y2="20" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="24" y1="32" x2="40" y2="32" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="24" y1="44" x2="40" y2="44" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

export default Logo;
