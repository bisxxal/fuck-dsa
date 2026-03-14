import React, { useState, useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"

// import { LanguageSelector } from "../shared/LanguageSelector"
import { COMMAND_KEY } from "../../utils/platform"
import { toastError, toastSuccess } from "@/provider/toast"
import SettingsKeyshortCut from "../settingsKeyshortCut"

interface QueueCommandsProps {
  onTooltipVisibilityChange: (visible: boolean, height: number) => void
  screenshotCount?: number
  currentLanguage: string
  setLanguage: (language: string) => void
}

const QueueCommands: React.FC<QueueCommandsProps> = ({
  onTooltipVisibilityChange,
  screenshotCount = 0,
  currentLanguage,
  setLanguage
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  // Extract the repeated language selection logic into a separate function
  const extractLanguagesAndUpdate = (direction?: 'next' | 'prev') => {
    // Create a hidden instance of LanguageSelector to extract languages
    const hiddenRenderContainer = document.createElement('div');
    hiddenRenderContainer.style.position = 'absolute';
    hiddenRenderContainer.style.left = '-9999px';
    document.body.appendChild(hiddenRenderContainer);

    // Create a root and render the LanguageSelector temporarily
    const root = createRoot(hiddenRenderContainer);
    // root.render(
    //   <LanguageSelector
    //     currentLanguage={currentLanguage}
    //     setLanguage={() => { }}
    //   />
    // );

    // Use a small delay to ensure the component has rendered
    // 50ms is generally enough for React to complete a render cycle
    setTimeout(() => {
      // Extract options from the rendered select element
      const selectElement = hiddenRenderContainer.querySelector('select');
      if (selectElement) {
        const options = Array.from(selectElement.options);
        const values = options.map(opt => opt.value);

        // Find current language index
        const currentIndex = values.indexOf(currentLanguage);
        let newIndex = currentIndex;

        if (direction === 'prev') {
          // Go to previous language
          newIndex = (currentIndex - 1 + values.length) % values.length;
        } else {
          // Default to next language
          newIndex = (currentIndex + 1) % values.length;
        }

        if (newIndex !== currentIndex) {
          setLanguage(values[newIndex]);
          window.electronAPI.updateConfig({ language: values[newIndex] });
        }
      }

      // Clean up
      root.unmount();
      document.body.removeChild(hiddenRenderContainer);
    }, 50);
  };

  useEffect(() => {
    let tooltipHeight = 0
    if (tooltipRef.current && isTooltipVisible) {
      tooltipHeight = tooltipRef.current.offsetHeight + 10
    }
    onTooltipVisibilityChange(isTooltipVisible, tooltipHeight)
  }, [isTooltipVisible])

  const handleSignOut = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      await window.electronAPI.updateConfig({
        apiKey: '',
      });
      toastSuccess('Logged out successfully');

      // Reload the app after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Error logging out:", err);
      toastError('Failed to log out');
    }
  }

  const handleMouseEnter = () => {
    setIsTooltipVisible(true)
  }

  const handleMouseLeave = () => {
    setIsTooltipVisible(false)
  }

  return (
    <div>
      <div className="pt-2 w-fit">
        <div className="text-xs text-white/90  bg-black/60 rounded-3xl h-10 pr-4 border border-orange-500/30 flex items-center justify-center gap-4">
          {/* Screenshot */}
          <div
            className="flex items-center gap-2 cursor-pointer rounded px-2 py-1.5 hover:bg-white/10 transition-colors"
            onClick={async () => {
              try {
                const result = await window.electronAPI.triggerScreenshot()
                if (!result.success) {
                  console.error("Failed to take screenshot:", result.error)
                  toastError("Failed to take screenshot")
                }
              } catch (error) {
                console.error("Error taking screenshot:", error)
                toastError("Failed to take screenshot")
              }
            }}
          >
            <div className=" rounded-full bg-orange-500 text-white  h-7 center text-[8px] px-1 leading-none truncate">
              F**k DSA
            </div>
            <span className="text-[11px] leading-none truncate">
              {screenshotCount === 0
                ? "Take 1st screenshot"
                : screenshotCount === 1
                  ? "Take second screenshot"
                  : screenshotCount === 2
                    ? "Take third screenshot"
                    : screenshotCount === 3
                      ? "Take fourth screenshot"
                      : screenshotCount === 4
                        ? "Take fifth screenshot"
                        : "Next will replace first screenshot"}
            </span>
            <div className="flex gap-1">
              <button className="buttonbg2 rounded-md px-1.5 py-1 text-[11px] leading-none text-white/70">
                {COMMAND_KEY}
              </button>
              <button className="buttonbg2 rounded-md px-1.5 py-1 text-[11px] leading-none text-white/70">
                H
              </button>
            </div>

            <div className=" center gap-2 ml-3">
              Show/Hide
              <button className="buttonbg2 rounded-md px-1.5 py-1 text-[11px] leading-none text-white/70">
                {COMMAND_KEY}
              </button>
              <button className="buttonbg2 rounded-md px-1.5 py-1 text-[11px] leading-none text-white/70">
                B
              </button>
            </div>

          </div>

          {/* Solve Command */}
          {screenshotCount > 0 && (
            <div
              className={`flex flex-col cursor-pointer rounded px-2 py-1.5 hover:bg-white/10 transition-colors ${credits <= 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              onClick={async () => {

                try {
                  const result =
                    await window.electronAPI.triggerProcessScreenshots()
                  if (!result.success) {
                    console.error(
                      "Failed to process screenshots:",
                      result.error
                    )
                    toastError("Failed to process screenshots")
                  }
                } catch (error) {
                  console.error("Error processing screenshots:", error)
                  toastError("Failed to process screenshots")
                }
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] leading-none">Solve </span>
                <div className="flex gap-1 ml-2">
                  <button className="buttonbg2 rounded-md px-1.5 py-1 text-[11px] leading-none text-white/70">
                    {COMMAND_KEY}
                  </button>
                  <button className="buttonbg2 rounded-md px-1.5 py-1 text-[11px] leading-none text-white/70">
                    ↵
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Separator */}
          <div className=" h-4 w-px bg-white/20" />

          {/* Settings with Tooltip */}
          <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Gear icon */}
            <div className="w-4 h-4 flex items-center justify-center cursor-pointer text-white/70 hover:text-white/90 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>

            {/* Tooltip Content */}
            {
              isTooltipVisible && 
              (
                <div ref={tooltipRef} className="absolute top-full left-0 mt-3 w-50 transform -translate-x-[calc(50%-12px)]" style={{ zIndex: 100 }} >
                  {/* Add transparent bridge */}

                  <div className="absolute -top-2 right-0 w-full h-2" />
                  <div className="p-3 text-xs bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-white/90 shadow-lg">
                    <div className="space-y-4">
                      <h3 className="font-medium truncate"> Settings </h3>

                      <SettingsKeyshortCut extractLanguagesAndUpdate={extractLanguagesAndUpdate} currentLanguage={currentLanguage} screenshotCount={screenshotCount} />

                      {/* Separator and Log Out */}
                      <div className="pt-3 mt-3 border-t border-white/10">
                        {/* API Key Settings */}
                        <div className="mb-3 px-2 space-y-1">
                          <div className="flex items-center justify-between text-[13px] font-medium text-white/90">
                            <span> API Settings</span>
                            <button
                              className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-[11px]"
                              onClick={() => window.electronAPI.openSettingsPortal()}
                            >
                              Settings
                            </button>
                          </div>
                        </div>


                        <div className="  flex   gap-2">
                          <button
                            onClick={handleSignOut}
                            className="flex bg-red-500/30 rounded-xl py-1.5 px-1 border border-red-500/30  items-center gap-2 text-[11px] text-red-400 hover:text-red-300 transition-colors w-1/2"
                          >
                            <div className="w-4 h-4 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-3 h-3"
                              >
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                              </svg>
                            </div>
                            Log Out
                          </button>

                          <button className=" bg-white/30 rounded-xl py-1.5 px-1 border border-white-500/20  w-1/2">Quit</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QueueCommands
