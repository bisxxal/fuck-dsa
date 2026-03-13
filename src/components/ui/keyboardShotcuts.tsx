import React from 'react'

const KeyboardShotcuts = () => {
  return (
     <div className="space-y-2 mt-4">
            <label className="text-sm font-medium text-white mb-2 block">Keyboard Shortcuts</label>
            <div className="bg-black/30 border border-white/10 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div className="text-white/70">Toggle Visibility</div>
                <div className="text-white/90 font-mono">Ctrl+B / Cmd+B</div>
                
                <div className="text-white/70">Take Screenshot</div>
                <div className="text-white/90 font-mono">Ctrl+H / Cmd+H</div>
                
                <div className="text-white/70">Process Screenshots</div>
                <div className="text-white/90 font-mono">Ctrl+Enter / Cmd+Enter</div>
                
                <div className="text-white/70">Delete Last Screenshot</div>
                <div className="text-white/90 font-mono">Ctrl+L / Cmd+L</div>
                
                <div className="text-white/70">Reset View</div>
                <div className="text-white/90 font-mono">Ctrl+R / Cmd+R</div>
                
                <div className="text-white/70">Quit Application</div>
                <div className="text-white/90 font-mono">Ctrl+Q / Cmd+Q</div>
                
                <div className="text-white/70">Move Window</div>
                <div className="text-white/90 font-mono">Ctrl+Arrow Keys</div>
                
                <div className="text-white/70">Decrease Opacity</div>
                <div className="text-white/90 font-mono">Ctrl+[ / Cmd+[</div>
                
                <div className="text-white/70">Increase Opacity</div>
                <div className="text-white/90 font-mono">Ctrl+] / Cmd+]</div>
                
                <div className="text-white/70">Zoom Out</div>
                <div className="text-white/90 font-mono">Ctrl+- / Cmd+-</div>
                
                <div className="text-white/70">Reset Zoom</div>
                <div className="text-white/90 font-mono">Ctrl+0 / Cmd+0</div>
                
                <div className="text-white/70">Zoom In</div>
                <div className="text-white/90 font-mono">Ctrl+= / Cmd+=</div>
              </div>
            </div>
          </div>
  )
}

export default KeyboardShotcuts