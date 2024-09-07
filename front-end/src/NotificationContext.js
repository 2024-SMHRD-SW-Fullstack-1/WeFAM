import React, { createContext, useState, useEffect } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:8089/wefam/notifications');

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();

      setTimeout(() => {
        const newEventSource = new EventSource('http://localhost:8089/wefam/notifications');
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
