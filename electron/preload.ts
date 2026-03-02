import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object.
contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,
    send: (channel: string, data?: unknown) => {
        const validChannels = ['app:minimize', 'app:maximize', 'app:close'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    on: (channel: string, func: (...args: unknown[]) => void) => {
        const validChannels = ['app:update-available', 'app:update-downloaded'];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (_event, ...args) => func(...args));
        }
    },
});
