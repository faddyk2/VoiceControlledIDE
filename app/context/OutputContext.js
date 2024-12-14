"use client";
import { createContext, useContext, useState } from 'react';

const OutputContext = createContext();

export const useOutput = () => useContext(OutputContext);

export const OutputProvider = ({ children }) => {
    const [output, setOutput] = useState([]);
    
    const addOutput = (message) => {
        setOutput([message]);
    };
    
    return (
        <OutputContext.Provider value={{ output, addOutput }}>
            {children}
        </OutputContext.Provider>
    );
}
