"use client"
import { createContext, useContext, useState } from 'react';

const LoggerContext = createContext();

export const useLogger = () => useContext(LoggerContext);

export const LoggerProvider = ({ children }) => {
  const [terminalLogs, setTerminalLogs] = useState([]);

  const addLog = (message) => {
    setTerminalLogs(prevLogs => [message, ...prevLogs].slice(0, 4)); 
  };

  return (
    <LoggerContext.Provider value={{ terminalLogs, addLog }}>
      {children}
    </LoggerContext.Provider>
  );
};
