
electron/main.ts
 that are responsible for hiding the app from screen recording:

🛡️ Screen Recording / Screen Capture Hiding — 

electron/main.ts
All the magic happens in 

createWindow()
 and 

showMainWindow()
. Here are the specific techniques used:

1. 🔒 setContentProtection(true) — The Primary Shield
ts
// Line 312 (in createWindow)
state.mainWindow.setContentProtection(true)
// Line 416 (in showMainWindow - re-applied every time window is shown)
state.mainWindow.setContentProtection(true);
This is the most important call. It tells the OS (macOS/Windows) to mark the window as protected content. Screen recorders (OBS, QuickTime, macOS screenshots, etc.) will see a black/blank area where the app window is.

2. 🖥️ setAlwaysOnTop(true, "screen-saver", 1) — Render Above Screen Capture Layer
ts
// Line 317 (in createWindow)
state.mainWindow.setAlwaysOnTop(true, "screen-saver", 1)
// Line 412 (in showMainWindow)
state.mainWindow.setAlwaysOnTop(true, "screen-saver", 1);
The "screen-saver" level places the window above most system overlays. Some screen recorders only capture below this window level, so the app visually doesn't get picked up.

3. 🍎 macOS-Specific Stealth Settings (Lines 320–331)
ts
if (process.platform === "darwin") {
  state.mainWindow.setHiddenInMissionControl(true)   // Hidden from Mission Control
  state.mainWindow.setWindowButtonVisibility(false)  // No traffic light buttons
  state.mainWindow.setBackgroundColor("#00000000")   // Fully transparent background
  state.mainWindow.setSkipTaskbar(true)              // Hidden from Dock/taskbar
  state.mainWindow.setHasShadow(false)               // No shadow (reduces detection)
}
These are macOS-only tricks. setHiddenInMissionControl prevents it showing in ⌘+Tab and Mission Control. Together, these make it very hard for someone to even discover the window exists.

4. 🪟 Window Constructor Options — Stealth by Design (Lines 209–239)
ts
frame: false,           // No window chrome/border
transparent: true,      // Transparent background
hasShadow: false,        // No drop shadow
skipTaskbar: true,       // Hidden from taskbar
type: "panel",          // macOS panel type (floats above normal windows)
titleBarStyle: "hidden",
These make the window behave like an overlay/HUD rather than a regular app window — reducing its detectability.

5. ⚡ Frame Rate & Throttling (Lines 333–335)
ts
state.mainWindow.webContents.setBackgroundThrottling(false)
state.mainWindow.webContents.setFrameRate(60)
Prevents the renderer from being throttled. Comments in the code say this is also for "screen capture resistance" — though this is a minor/supplementary measure.

6. 👁️ setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true }) (Lines 314–316)
ts
state.mainWindow.setVisibleOnAllWorkspaces(true, {
  visibleOnFullScreen: true
})
This ensures the window stays visible even when another app goes fullscreen — so it always appears on top for the real user, even during a screen share of a fullscreen app.

Summary Table
Method	Line	Purpose
setContentProtection(true)	312, 416	✅ Blocks screen capture (black box in recordings)
setAlwaysOnTop("screen-saver")	317, 412	Renders above capture layer
setHiddenInMissionControl(true)	322	macOS: hidden from app switcher
skipTaskbar: true + type: "panel"	233–234	Hidden from taskbar/dock
frame: false, transparent: true	226–227	Invisible window chrome
setVisibleOnAllWorkspaces	314–316	Stays on top in fullscreen
setBackgroundThrottling(false)	334	Supplementary rendering stability
The key line is setContentProtection(true) — that's what actually makes screen recorders show a blank/black area instead of the app content.