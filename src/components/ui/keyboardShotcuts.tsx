import { COMMAND_KEY } from '@/utils/platform'
const KeyboardShotcuts = () => {
  return (
     <div className="space-y-2 mt-4">
            <label className="text-sm font-medium text-white mb-2 block">Keyboard Shortcuts</label>
            <div className="bg-black/30 border border-white/10 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div className="text-white/70">Toggle Visibility</div>
                <div className="text-white/90 font-mono"> <span className=' mr-1.5 buttonbg2 pl-1.5 rounded py-[1px] '> {COMMAND_KEY} </span> <span className='px-1 rounded py-[1px] buttonbg2 '> B</span> </div>
                
                <div className="text-white/70">Take Screenshot</div>
                <div className="text-white/90 font-mono"> <span className=' mr-1.5 buttonbg2 pl-1.5 rounded py-[1px] '> {COMMAND_KEY} </span> <span className='px-1 rounded py-[1px] buttonbg2 '> H</span> </div>
                
                <div className="text-white/70">Process Screenshots</div>
                <div className="text-white/90 font-mono"> <span className=' mr-1.5 buttonbg2 pl-1.5 rounded py-[1px] '> {COMMAND_KEY} </span> <span className='px-1 rounded py-[1px] buttonbg2 '> ↵ </span> </div>
                
                <div className="text-white/70">Delete Last Screenshot</div>
                <div className="text-white/90 font-mono"> <span className=' mr-1.5 buttonbg2 pl-1.5 rounded py-[1px] '> {COMMAND_KEY} </span> <span className='px-1 rounded py-[1px] buttonbg2 '> L</span> </div>
                
                <div className="text-white/70">Reset View</div>
                <div className="text-white/90 font-mono"> <span className=' mr-1.5 buttonbg2 pl-1.5 rounded py-[1px] '> {COMMAND_KEY} </span> <span className='px-1 rounded py-[1px] buttonbg2 '> R</span>  </div>
                
                <div className="text-white/70">Quit Application</div>
                <div className="text-white/90 font-mono"> <span className=' mr-1.5 buttonbg2 pl-1.5 rounded py-[1px] '> {COMMAND_KEY} </span> <span className='px-1 rounded py-[1px] buttonbg2 '>Q</span>  </div>
                
                <div className="text-white/70">Move Window</div>
                <div className="text-white/90 font-mono"> <span className=' mr-1.5 buttonbg2 pl-1.5 rounded py-[1px] '> {COMMAND_KEY} </span> <span className='px-1 rounded py-[1px] buttonbg2 '> Arrow Keys</span></div>
                
                <div className="text-white/70">Decrease Opacity</div>
                <div className="text-white/90 font-mono"> <span className=' mr-1.5 buttonbg2 pl-1.5 rounded py-[1px] '> {COMMAND_KEY} </span> <span className='px-1 rounded py-[1px] buttonbg2 '> [</span>  </div>
                
                <div className="text-white/70">Increase Opacity</div>
                <div className="text-white/90 font-mono"> <span className=' mr-1.5 buttonbg2 pl-1.5 rounded py-[1px] '> {COMMAND_KEY} </span> <span className='px-1 rounded py-[1px] buttonbg2 '> ]</span>  </div>
                
                <div className="text-white/70">Zoom Out</div>
                <div className="text-white/90 font-mono"> <span className=' mr-1.5 buttonbg2 pl-1.5 rounded py-[1px] '> {COMMAND_KEY} </span> <span className='px-1 rounded py-[1px] buttonbg2 '> -</span>  </div>
                
                <div className="text-white/70">Reset Zoom</div>
                <div className="text-white/90 font-mono"> <span className=' mr-1.5 buttonbg2 pl-1.5 rounded py-[1px] '> {COMMAND_KEY} </span> <span className='px-1 rounded py-[1px] buttonbg2 '> 0</span>  </div>
                
                <div className="text-white/70">Zoom In</div>
                <div className="text-white/90 font-mono"> <span className=' mr-1.5 buttonbg2 pl-1.5 rounded py-[1px] '> {COMMAND_KEY} </span> <span className='px-1 rounded py-[1px] buttonbg2 '> =</span>  </div>
              </div>
            </div>
          </div>
  )
}

export default KeyboardShotcuts