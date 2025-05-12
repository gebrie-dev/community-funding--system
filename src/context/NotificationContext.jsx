// src/context/NotificationContext.jsx
import { createContext, useState, useContext } from 'react';
import { X } from 'lucide-react';
import './NotificationContext.css';

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    
    setNotifications(prev => [
      ...prev,
      { id, message, type, duration }
    ]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  };
  
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  const value = {
    notifications,
    addNotification,
    removeNotification
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="notifications-container">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification ${notification.type}`}
          >
            <div className="notification-content">
              {notification.message}
            </div>
            <button 
              className="notification-close" 
              onClick={() => removeNotification(notification.id)}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};