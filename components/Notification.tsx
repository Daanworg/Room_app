
import React from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  const baseClasses = 'fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg text-white';
  const typeClasses = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`${baseClasses} ${typeClasses} animate-[fadeIn_0.3s,fadeOut_0.3s_2.7s]`}>
      {message}
    </div>
  );
};

export default Notification;
