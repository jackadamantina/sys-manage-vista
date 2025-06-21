
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo = ({ size = 'md', className = '' }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-10 w-auto',
    lg: 'h-12 w-auto'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        {/* Logo Icon - Stylized shield/lock representing Identity Management */}
        <svg 
          className={`${sizeClasses[size]}`}
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield background */}
          <path
            d="M20 2L32 8V18C32 26.5 26.5 34 20 38C13.5 34 8 26.5 8 18V8L20 2Z"
            fill="#c505f2"
            className="opacity-90"
          />
          {/* Inner circle representing user/identity */}
          <circle
            cx="20"
            cy="16"
            r="4"
            fill="white"
            className="opacity-95"
          />
          {/* Connection lines representing experience/integration */}
          <path
            d="M20 22L16 26M20 22L24 26M20 22V30"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            className="opacity-95"
          />
        </svg>
      </div>
      <div className="ml-3">
        <div className="font-bold text-gray-800 text-lg leading-tight">
          IDM-Experience
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Gerenciamento de usuários e sistemas
        </div>
      </div>
    </div>
  );
};

export default Logo;
