import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false, ...props }) => {
  const hoverClasses = hoverable 
    ? 'cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 hover:-translate-y-0.5' 
    : '';

  return (
    <div 
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl p-6 transition-all duration-200 ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
