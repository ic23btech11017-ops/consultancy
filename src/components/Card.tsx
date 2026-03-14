import React from 'react';

export type ShadowColor = 'blue' | 'emerald' | 'indigo' | 'purple' | 'amber' | 'rose' | 'teal' | 'cyan' | 'violet' | 'green' | 'red' | 'orange' | 'pink';

const SHADOW_MAP: Record<ShadowColor, string> = {
  blue:    'shadow-blue-200/40 hover:shadow-blue-300/50 dark:shadow-blue-500/10 dark:hover:shadow-blue-500/20',
  emerald: 'shadow-emerald-200/40 hover:shadow-emerald-300/50 dark:shadow-emerald-500/10 dark:hover:shadow-emerald-500/20',
  indigo:  'shadow-indigo-200/40 hover:shadow-indigo-300/50 dark:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20',
  purple:  'shadow-purple-200/40 hover:shadow-purple-300/50 dark:shadow-purple-500/10 dark:hover:shadow-purple-500/20',
  amber:   'shadow-amber-200/40 hover:shadow-amber-300/50 dark:shadow-amber-500/10 dark:hover:shadow-amber-500/20',
  rose:    'shadow-rose-200/40 hover:shadow-rose-300/50 dark:shadow-rose-500/10 dark:hover:shadow-rose-500/20',
  teal:    'shadow-teal-200/40 hover:shadow-teal-300/50 dark:shadow-teal-500/10 dark:hover:shadow-teal-500/20',
  cyan:    'shadow-cyan-200/40 hover:shadow-cyan-300/50 dark:shadow-cyan-500/10 dark:hover:shadow-cyan-500/20',
  violet:  'shadow-violet-200/40 hover:shadow-violet-300/50 dark:shadow-violet-500/10 dark:hover:shadow-violet-500/20',
  green:   'shadow-green-200/40 hover:shadow-green-300/50 dark:shadow-green-500/10 dark:hover:shadow-green-500/20',
  red:     'shadow-red-200/40 hover:shadow-red-300/50 dark:shadow-red-500/10 dark:hover:shadow-red-500/20',
  orange:  'shadow-orange-200/40 hover:shadow-orange-300/50 dark:shadow-orange-500/10 dark:hover:shadow-orange-500/20',
  pink:    'shadow-pink-200/40 hover:shadow-pink-300/50 dark:shadow-pink-500/10 dark:hover:shadow-pink-500/20',
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  shadowColor?: ShadowColor;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false, shadowColor, ...props }) => {
  const shadowClasses = shadowColor
    ? `shadow-md ${SHADOW_MAP[shadowColor]} hover:shadow-lg`
    : 'shadow-sm hover:shadow-md';

  const hoverClasses = hoverable 
    ? 'cursor-pointer hover:-translate-y-0.5 hover:border-gray-300 dark:hover:border-gray-600' 
    : 'hover:border-gray-300 dark:hover:border-gray-600';

  return (
    <div 
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${shadowClasses} rounded-xl p-6 transition-all duration-200 ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
