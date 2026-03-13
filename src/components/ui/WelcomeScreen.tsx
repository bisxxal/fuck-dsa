
import { COMMAND_KEY } from '@/utils/platform';
import React from 'react';

interface WelcomeScreenProps {
  onOpenSettings: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onOpenSettings }) => {
  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-black border border-white/10 rounded-xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>F**k DSA</span>
        </h1>
        
        <div className="mb-8">
          <h2 className="text-lg font-medium text-white mb-3">Welcome to Fuck DSA</h2>
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
            <h3 className="text-white/90 font-medium mb-2">Global Shortcuts</h3>
            <ul className="space-y-2">
              <li className="flex justify-between text-sm">
                <span className="text-white/70">Toggle Visibility</span>
                <span className="text-white/90">{COMMAND_KEY}+B </span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-white/70">Take Screenshot</span>
                <span className="text-white/90">{COMMAND_KEY}+H  </span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-white/70">Delete Last Screenshot</span>
                <span className="text-white/90">{COMMAND_KEY}+L  </span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-white/70">Process Screenshots</span>
                <span className="text-white/90">{COMMAND_KEY}+ Enter </span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-white/70">Reset View</span>
                <span className="text-white/90"> {COMMAND_KEY} +R </span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-white/70">Quit App</span>
                <span className="text-white/90">{COMMAND_KEY}+Q  </span>
              </li>
                <li className="flex justify-between text-sm">
                <span className="text-white/70">Increse Opacity</span>
                <span className="text-white/90">{COMMAND_KEY}+] </span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="text-white/70">Decrease Opacity</span>
                <span className="text-white/90">{COMMAND_KEY}+[ </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="card p-4 mb-6">
          <h3 className="text-white/90 font-medium mb-2">Getting Started</h3>
          <p className="text-white/70 text-sm mb-3">
            Before using the application, you need to configure your OpenAI API key.
          </p>
          <button 
            className="w-full px-4 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            onClick={onOpenSettings}
          >
            Open Settings
          </button>
        </div>
        
        <div className="text-white/40 text-xs text-center">
          Start by taking screenshots of your coding problem ({COMMAND_KEY}+H )
        </div>
      </div>
    </div>
  );
};