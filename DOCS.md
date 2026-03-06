
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









<!--   preload.ts file to give you a detailed explanation. -->
 

The Full Picture: How preload.ts Connects Everything
This is the 3-layer architecture of Electron. Here's exactly what each layer does:

┌─────────────────────────────────────────────┐
│          LAYER 3: React UI                  │
│  (renderer process - browser-like env)      │
│                                             │
│  window.electronAPI.triggerScreenshot()     │
│         ↑ calls a plain JS function         │
└────────────────────┬────────────────────────┘
                     │
┌────────────────────▼────────────────────────┐
│          LAYER 2: preload.ts                │
│  (bridge - runs BEFORE the page loads)      │
│                                             │  
│  ipcRenderer.invoke("trigger-screenshot")  │
│         ↑ sends IPC message to main         │
└────────────────────┬────────────────────────┘
                     │
┌────────────────────▼────────────────────────┐
│          LAYER 1: ipcHandlers.ts            │
│  (main process - full Node.js access)       │
│                                             │
│  ipcMain.handle("trigger-screenshot", ...)  │
│         ↑ listens and does the work         │
└─────────────────────────────────────────────┘
Why React Can't Call ipcRenderer Directly
React runs in the renderer process — essentially a sandboxed browser. For security, Electron blocks direct access to Node.js APIs like ipcRenderer from the renderer process.

If you tried in React:

ts
// ❌ This would CRASH — ipcRenderer is not available in the renderer!
import { ipcRenderer } from "electron"
ipcRenderer.invoke("take-screenshot")
This is why 

preload.ts
 exists.

What 

preload.ts
 Does

preload.ts
 runs in a special in-between context — it has access to both ipcRenderer (Electron) AND the browser window object. It uses contextBridge to safely inject functions onto window:
 
// preload.ts
const electronAPI = {
  triggerScreenshot: () => ipcRenderer.invoke("trigger-screenshot"),
  getScreenshots:    () => ipcRenderer.invoke("get-screenshots"),
  // ... all other methods
}
// 👇 This is the key line — it puts `electronAPI` onto `window`
contextBridge.exposeInMainWorld("electronAPI", electronAPI)
After this runs, every page in the app has access to window.electronAPI.

How React Uses It
React doesn't call ipcRenderer at all — it calls window.electronAPI, which looks like a normal JS object:

ts
// In any React component or hook:
// Take a screenshot
await window.electronAPI.triggerScreenshot()
// Get config/API key
const config = await window.electronAPI.getConfig()
// Listen for events from main process
const cleanup = window.electronAPI.onSolutionSuccess((data) => {
  setSolution(data)
})
// Cleanup when component unmounts
return () => cleanup()
React has no idea it's talking to Electron internally — it just calls functions on a plain object.

Two Types of Communication
There are two patterns used in 

preload.ts
:

1. Request → Response (using invoke)
React asks for something, waits for a result:

ts
// preload.ts wraps it:
validateApiKey: (apiKey) => ipcRenderer.invoke("validate-api-key", apiKey)
// React calls:
const result = await window.electronAPI.validateApiKey("sk-...")
// result = { valid: true } or { valid: false, error: "..." }
2. Event Listening (using ipcRenderer.on)
Main process pushes events to React (no request needed):

ts
// preload.ts wraps it:
onSolutionSuccess: (callback) => {
  ipcRenderer.on("solution-success", (_event, data) => callback(data))
  return () => ipcRenderer.removeListener(...) // cleanup function
}
// React uses it like this:
useEffect(() => {
  const cleanup = window.electronAPI.onSolutionSuccess((data) => {
    setSolution(data)
  })
  return cleanup // React calls this on unmount
}, [])
Summary Flow for One Full Example
Let's trace "user presses a key → screenshot is taken":

1. [Keyboard shortcut] captured in main.ts
       ↓
2. main.ts calls deps.takeScreenshot()
       ↓
3. Screenshot saved to disk, path returned
       ↓
4. mainWindow.webContents.send("screenshot-taken", { path, preview })
       ↓ (IPC event sent to renderer)
5. preload.ts listener: ipcRenderer.on("screenshot-taken", ...)
       ↓ (calls the React callback)
6. React: window.electronAPI.onScreenshotTaken(callback)
       ↓ (updates state)
7. React re-renders to show the new screenshot
In Short
File	Role	Can access

ipcHandlers.ts
Main process API — does the real work	Node.js, filesystem, OS

preload.ts
Bridge — wraps IPC in safe functions	ipcRenderer + window
React components	UI — calls window.electronAPI	Only what preload exposes

preload.ts
 is the security-safe translator between the privileged main process and the sandboxed React UI.

