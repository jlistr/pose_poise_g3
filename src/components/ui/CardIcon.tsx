import React from 'react';

interface CardIconProps {
  size?: number;
  className?: string;
  color?: string;
}

export const CardIcon: React.FC<CardIconProps> = ({ size = 32, className = "", color }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    style={color ? { color } : undefined}
  >
    {/* The Card Frame */}
    <rect x="4" y="2" width="16" height="20" rx="1" />
    
    {/* The Main Photo Area (Front) */}
    <path d="M4 13h16" />
    
    {/* Grid / Details Area (Back metaphor) */}
    <path d="M9 13v9" />
    <path d="M15 13v9" />
    <path d="M4 17.5h16" />
    
    {/* Stylized Figure Suggestion in the main area (matching Brand style) */}
    <circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" />
    <path d="M12 8.5c-0.5 0-1 0.2-1.5 0.8s-0.5 1.2-0.5 1.2" opacity="0.6" />
    <path d="M12 8.5c0.4 1.2 0 2.5-0.8 3.5" opacity="0.6" />
  </svg>
);
