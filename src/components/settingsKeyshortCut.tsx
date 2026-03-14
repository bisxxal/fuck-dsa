import { toastError } from '@/provider/toast';
import { COMMAND_KEY } from '@/utils/platform';

const SettingsKeyshortCut = ({extractLanguagesAndUpdate,currentLanguage,screenshotCount}:{
    extractLanguagesAndUpdate: (direction: 'next' | 'prev') => void,
    currentLanguage: string,
    screenshotCount: number,
    }) => {
    return (
        <div className=" flex flex-col gap-1 border-t border-white/10   ">

            {/* Code language */}

            <div className="mb-3 ">
                <div
                    className="flex flex-col gap-2 cursor-pointer hover:bg-white/10 rounded  py-1 transition-colors"
                    onClick={() => extractLanguagesAndUpdate('next')}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                            extractLanguagesAndUpdate('prev');
                        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                            extractLanguagesAndUpdate('next');
                        }
                    }}
                >
                    <p className="text-[13px] font-medium ">Code Language</p>
                    <div className="flex border-2 border-white/10 rounded-md px-2 py-1 justify-between items-center gap-2">
                        <span className="text-[11px] text-white/90">{currentLanguage}</span>
                        <div className="text-white/40 text-[8px]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                                <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toggle Command */}
            <div
                className="cursor-pointer rounded  py-1.5 hover:bg-white/10 transition-colors"
                onClick={async () => {
                    try {
                        const result =
                            await window.electronAPI.toggleMainWindow()
                        if (!result.success) {
                            console.error(
                                "Failed to toggle window:",
                                result.error
                            )
                            toastError("Failed to toggle window")
                        }
                    } catch (error) {
                        console.error("Error toggling window:", error)
                        toastError("Failed to toggle window")
                    }
                }}
            >
                <div className="flex items-center justify-between">
                    <span className="truncate">Toggle Window</span>
                    <div className="flex gap-1 flex-shrink-0">
                        <span className="buttonbg2 -white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            {COMMAND_KEY}
                        </span>
                        <span className="buttonbg2 -white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            B
                        </span>
                    </div>
                </div>

            </div>

            {/* Screenshot Command */}
            <div
                className="cursor-pointer rounded  py-1.5 hover:bg-white/10 transition-colors"
                onClick={async () => {
                    try {
                        const result =
                            await window.electronAPI.triggerScreenshot()
                        if (!result.success) {
                            console.error(
                                "Failed to take screenshot:",
                                result.error
                            )
                            toastError("Failed to take screenshot")
                        }
                    } catch (error) {
                        console.error("Error taking screenshot:", error)
                        toastError("Failed to take screenshot")
                    }
                }}
            >
                <div className="flex items-center justify-between">
                    <span className="truncate">Take Screenshot</span>
                    <div className="flex gap-1 flex-shrink-0">
                        <span className="buttonbg2 -white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            {COMMAND_KEY}
                        </span>
                        <span className="buttonbg2 -white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            H
                        </span>
                    </div>
                </div>

            </div>

            {/* Solve Command */}
            <div
                className={`cursor-pointer rounded  py-1.5 hover:bg-white/10 transition-colors ${screenshotCount > 0
                    ? ""
                    : "opacity-50 cursor-not-allowed"
                    }`}
                onClick={async () => {
                    if (screenshotCount === 0) return

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
                        console.error(
                            "Error processing screenshots:",
                            error
                        )
                        toastError(`Failed to process screenshots ${error}`)
                    }
                }}
            >
                <div className="flex items-center justify-between">
                    <span className="truncate">Solve</span>
                    <div className="flex gap-1 flex-shrink-0">
                        <span className="buttonbg2 -white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            {COMMAND_KEY}
                        </span>
                        <span className="buttonbg2 -white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            ↵
                        </span>
                    </div>
                </div>
                <p className="text-[10px] leading-relaxed text-white/70 truncate mt-1">
                    {screenshotCount > 0
                        ? "Generate a solution based on the current problem."
                        : "Take a screenshot first to generate a solution."}
                </p>
            </div>

            {/* Delete Last Screenshot Command */}
            <div
                className={`cursor-pointer rounded  py-1.5 hover:bg-white/10 transition-colors ${screenshotCount > 0
                    ? ""
                    : "opacity-50 cursor-not-allowed"
                    }`}
                onClick={async () => {
                    if (screenshotCount === 0) return

                    try {
                        const result = await window.electronAPI.deleteLastScreenshot()
                        if (!result.success) {
                            console.error(
                                "Failed to delete last screenshot:",
                                result.error
                            )
                            toastError(`Failed to delete last screenshot ${result.error}`)
                        }
                    } catch (error) {
                        console.error("Error deleting screenshot:", error)
                        toastError(`Failed to delete last screenshot ${error}`)
                    }
                }}
            >
                <div className="flex items-center justify-between">
                    <span className="truncate">Delete Last Screenshot</span>
                    <div className="flex gap-1 flex-shrink-0">
                        <span className="buttonbg2 -white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            {COMMAND_KEY}
                        </span>
                        <span className="buttonbg2 -white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            L
                        </span>
                    </div>
                </div>
                <p className="text-[10px] leading-relaxed text-white/70 truncate mt-1">
                    {screenshotCount > 0
                        ? "Remove the most recently taken screenshot."
                        : "No screenshots to delete."}
                </p>
            </div>

            {/* keyboard shortcut start */}
            <div
                className="cursor-pointer rounded  py-1.5 hover:bg-white/10 transition-colors"
                onClick={async () => {
                    try {
                        const result =
                            await window.electronAPI.triggerMoveUp()
                        if (!result.success) {
                            console.error(
                                "Failed to toggle window:",
                                result.error
                            )
                            toastError("Failed to toggle window")
                        }
                    } catch (error) {
                        console.error("Error toggling window:", error)
                        toastError("Failed to toggle window")
                    }
                }}
            >
                <div className="flex items-center justify-between">
                    <span className="truncate">Move Up</span>
                    <div className="flex gap-1 flex-shrink-0">
                        <span className="buttonbg2 -white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            {COMMAND_KEY}
                        </span>
                        <span className="buttonbg2 -white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            Up
                        </span>
                    </div>
                </div>

            </div>

            <div
                className="cursor-pointer rounded  py-1.5 hover:bg-white/10 transition-colors"
                onClick={async () => {
                    try {
                        const result =
                            await window.electronAPI.triggerMoveDown()
                        if (!result.success) {
                            console.error(
                                "Failed to toggle window:",
                                result.error
                            )
                            toastError("Failed to toggle window")
                        }
                    } catch (error) {
                        console.error("Error toggling window:", error)
                        toastError("Failed to toggle window")
                    }
                }}
            >
                <div className="flex items-center justify-between">
                    <span className="truncate">Move Down</span>
                    <div className="flex gap-1 flex-shrink-0">
                        <span className="buttonbg2 -white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            {COMMAND_KEY}
                        </span>
                        <span className="buttonbg2 -white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            Down
                        </span>
                    </div>
                </div>

            </div>


            <div
                className="cursor-pointer rounded  py-1.5 hover:bg-white/10 transition-colors"
                onClick={async () => {
                    try {
                        const result =
                            await window.electronAPI.triggerMoveLeft()
                        if (!result.success) {
                            console.error(
                                "Failed to toggle window:",
                                result.error
                            )
                            toastError("Failed to toggle window")
                        }
                    } catch (error) {
                        console.error("Error toggling window:", error)
                        toastError("Failed to toggle window")
                    }
                }}
            >
                <div className="flex items-center justify-between">
                    <span className="truncate">move Left</span>
                    <div className="flex gap-1 flex-shrink-0">
                        <span className="buttonbg2 -white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            {COMMAND_KEY}
                        </span>
                        <span className="buttonbg2 -white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            Left
                        </span>
                    </div>
                </div>

            </div>

            <div
                className="cursor-pointer rounded  py-1.5 hover:bg-white/10 transition-colors"
                onClick={async () => {
                    try {
                        const result =
                            await window.electronAPI.triggerMoveRight()
                        if (!result.success) {
                            console.error(
                                "Failed to toggle window:",
                                result.error
                            )
                            toastError("Failed to toggle window")
                        }
                    } catch (error) {
                        console.error("Error toggling window:", error)
                        toastError("Failed to toggle window")
                    }
                }}
            >
                <div className="flex items-center justify-between">
                    <span className="truncate">move Right</span>
                    <div className="flex gap-1 flex-shrink-0">
                        <span className="buttonbg2 -white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            {COMMAND_KEY}
                        </span>
                        <span className="buttonbg2 -white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                            B
                        </span>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default SettingsKeyshortCut