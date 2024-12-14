import React from 'react';
import {LoggerProvider} from './context/LoggerContext';
import {OutputProvider} from './context/OutputContext';

export const metadata = {
  title: 'My Voice-Controlled IDE',
  description: 'An IDE that can be controlled with voice commands',
};


export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground scrollbar-hidden">
        <main className="flex min-h-screen">
          <div className="flex flex-col w-full">
            <div className="wrapper flex-1">
              <OutputProvider>
              <LoggerProvider>
              {children}
              </LoggerProvider>
              </OutputProvider>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
