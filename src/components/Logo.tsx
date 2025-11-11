const Logo = ({ className = "w-14 h-14", color = "white" }: { className?: string; color?: string }) => {
  return (
    <svg
      viewBox="0 0 140 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left building (shorter) */}
      <rect 
        x="15" 
        y="35" 
        width="28" 
        height="70" 
        rx="8" 
        stroke={color} 
        strokeWidth="7" 
        fill="none"
      />
      
      {/* Right building (medium height) */}
      <rect 
        x="97" 
        y="25" 
        width="28" 
        height="80" 
        rx="8" 
        stroke={color} 
        strokeWidth="7" 
        fill="none"
      />
      
      {/* Center main building (tallest) */}
      <rect 
        x="50" 
        y="15" 
        width="40" 
        height="90" 
        rx="10" 
        stroke={color} 
        strokeWidth="7" 
        fill="none"
      />
      
      {/* Horizontal lines (windows/floors) in center building */}
      <line x1="60" y1="32" x2="80" y2="32" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <line x1="60" y1="50" x2="80" y2="50" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <line x1="60" y1="68" x2="80" y2="68" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <line x1="60" y1="86" x2="80" y2="86" stroke={color} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
};

export default Logo;
