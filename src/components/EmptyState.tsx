import React from 'react';
import { Inbox } from 'lucide-react';
import { Card } from './Card';

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <Card className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <Inbox className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </Card>
  );
};
