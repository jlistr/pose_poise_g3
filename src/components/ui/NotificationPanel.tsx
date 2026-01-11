import React from 'react';
import { Bell, X } from 'lucide-react';

// Define the type for a single notification
export interface Notification {
  id: string;
  message: string;
  createdAt: any; // Firestore timestamp
  type: 'info' | 'warning' | 'success' | 'error';
}

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onRemoveNotification: (id: string) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClose, onRemoveNotification }) => {
  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right z-50">
      <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
        <h3 className="font-bold text-sm">Notifications</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-100">
          <X size={16} className="text-zinc-500" />
        </button>
      </div>

      <div className="p-2 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={24} className="mx-auto text-zinc-300" />
            <p className="text-sm text-zinc-400 mt-2">No new notifications</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {notifications.map((notification) => (
              <li key={notification.id} className="p-3 rounded-lg hover:bg-zinc-50 group">
                <div className="flex items-start justify-between">
                    <p className="text-sm text-zinc-700">{notification.message}</p>
                    <button 
                        onClick={() => onRemoveNotification(notification.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-zinc-200"
                        aria-label="Remove notification"
                    >
                        <X size={14} className="text-zinc-500" />
                    </button>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  {/* We will format this nicely later */}
                  {new Date(notification.createdAt?.toDate()).toLocaleTimeString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-2 border-t border-zinc-50 bg-zinc-50/50 text-center">
          <button className="text-xs font-semibold text-zinc-500 hover:text-black">
              Mark all as read
          </button>
      </div>
    </div>
  );
};
