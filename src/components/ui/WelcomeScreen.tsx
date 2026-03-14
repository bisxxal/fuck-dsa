import React from 'react';
import KeyboardShotcuts from './keyboardShotcuts';

interface WelcomeScreenProps {
  onOpenSettings: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onOpenSettings }) => {
  return (
    <div className="bg-black min-h-screen w-full flex flex-col items-center justify-center p-6">
      <div className=" !p-6 w-full bg-black border border-white/10 rounded-xl  shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>F**k DSA</span>
        </h1>

        <KeyboardShotcuts />

        <div className="card p-4 my-6">
          <h3 className="text-white/90 font-medium mb-2">Getting Started</h3>
          <p className="text-white/70 text-sm mb-3">
            Before using the application, you need to configure your API key.
          </p>
          <button
            className="w-full px-4 py-3 buttonbg rounded-xl font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            onClick={onOpenSettings}
          >
            Open Settings
          </button>
        </div>


      </div>
    </div>
  );
};