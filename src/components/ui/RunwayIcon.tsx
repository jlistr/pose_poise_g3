import React from 'react';

interface RunwayIconProps {
  size?: number;
  className?: string;
  color?: string;
}

export const RunwayIcon: React.FC<RunwayIconProps> = ({ size = 32, className = "", color }) => (
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
    {/* The Runway / Catwalk in Perspective */}
    <path d="M4 22L10 6h4l6 16" />
    
    {/* Vanishing Point / Stage Edge */}
    <path d="M10 6L12 3l2 3" opacity="0.4" />
    
    {/* The Figure at the end of the runway (matching BrandIcon style) */}
    <circle cx="12" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
    <path d="M12 9c-0.8 0-1.5 0.5-2 1.5s-0.5 2.5-0.5 2.5" opacity="0.8" />
    <path d="M12 9c.5 2 0 4.5-1 6" opacity="0.8" />
    
    {/* Stage Lighting / Spotlight hints */}
    <path d="M2 4l4 2" opacity="0.3" />
    <path d="M22 4l-4 2" opacity="0.3" />
  </svg>
);
