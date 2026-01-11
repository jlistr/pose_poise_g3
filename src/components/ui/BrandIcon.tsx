import React from 'react';

interface BrandIconProps {
  size?: number;
  className?: string;
  color?: string; // Add color prop
}

export const BrandIcon: React.FC<BrandIconProps> = ({ size = 32, className = "", color }) => (
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
    style={color ? { color } : undefined} // Apply color via style
  >
    <circle cx="13" cy="3" r="1.2" fill="currentColor" stroke="none" />
    <path d="M13 4.5c-1 0-2.5.5-3.5 2s-1 3-1 3" />
    <path d="M13 4.5c.8 3 0 7-2 9" />
    <path d="M11 13.5c-2 3-5 5-6 9.5h14c-1-5-4-7-6-9.5" />
    <path d="M11 15l1 7" opacity="0.3" strokeWidth="0.8" />
    <path d="M11 7.5l3.5 1.5-1 4" />
  </svg>
);
