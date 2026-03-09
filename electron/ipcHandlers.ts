import { IIpcHandlerDeps } from "./constants";
import { ipcMain as ip, shell  } from "electron"
import { configHelper } from "./configHelper"

export function initializeIpcHandlers(deps: IIpcHandlerDeps): void {

    //confuguration hander
    ip.handle("get-config", async () => {
        console.log("calling ->>>>>>")
        return configHelper.loadConfig()
    })

    ip.handle("set-config", async (_event, updates) => {
        return configHelper.updateConfig(updates)
    })

    ip.handle("check-api-key", async () => {
        return configHelper.hasApiKey()
    })

    ip.handle("validate-api-key", async (_event, apiKey) => {
        // First check the format
        if (!configHelper.isValidApiKeyFormat(apiKey)) {
            return {
                valid: false,
                error: "Invalid API key format. OpenAI API keys start with 'sk-'"
            };
        }
        //test the api key
        const result = await configHelper.testApiKey(apiKey);
        return result;
    })

    // Screenshot queue handlers
    ip.handle("get-screenshot-queue", () => {
        return deps.getScreenshotQueue()
    })

    ip.handle("get-extra-screenshot-queue", () => {
        return deps.getExtraScreenshotQueue()
    })

    ip.handle("delete-screenshot", async (event, path: string) => {
        return deps.deleteScreenshot(path)
    })

    ip.handle("get-image-preview", async (event, path: string) => {
        return deps.getImagePreview(path)
    })

    // Screenshot processing handlers
    ip.handle("process-screenshots", async () => {
        // Check for API key before processing
        if (!configHelper.hasApiKey()) {
            const mainWindow = deps.getMainWindow();
            if (mainWindow) {
                mainWindow.webContents.send(deps.PROCESSING_EVENTS.API_KEY_INVALID);
            }
            return;
        }

        await deps.processingHelper?.processScreenshots()
    })

    ip.handle("update-content-dimensions", async (event, { width, height }) => {
        if (width && height)
            deps.setWindowDimensions(width, height);
    })

    ip.handle("set-window-dimensions", async (event, width: number, height: number) => {
        deps.setWindowDimensions(width, height)
    })
    ip.handle("get-window-dimensions", async () => {
        try {
            let previews = []
            const currentView = deps.getView();

            if (currentView === 'queue') {
                const queue = deps.getScreenshotQueue();
                previews = await Promise.all(
                    queue.map(async (path) => ({
                        path,
                        preview: await deps.getImagePreview(path)
                    }))
                )
            }
            else {
                const extraQueue = deps.getExtraScreenshotQueue();
                previews = await Promise.all(
                    extraQueue.map(async (path) => ({
                        path,
                        preview: await deps.getImagePreview(path)
                    }))
                )
            }

            return previews;

        } catch (error) {
            console.error("Error getting window dimensions:", error);
            return null;
        }
    })
    ip.handle("trigger-screenshot", async () => {
        const mainWindow = deps.getMainWindow();

        if (mainWindow) {
            try {
                const screenshotPath = await deps.takeScreenshot();
                const preview = await deps.getImagePreview(screenshotPath);
                mainWindow.webContents.send("screenshot-taken", { path: screenshotPath, preview })

                return { success: true }
            } catch (error) {
                console.log("Error triggering screenshot:", error);
                return { error: "Error triggering screenshot" }
            }
        }

        return { error: "No main window avaliable" }
    })
    ip.handle("take-screenshot", async () => {
        try {
            const screenshotPath = await deps.takeScreenshot()
            const preview = await deps.getImagePreview(screenshotPath)
            return { path: screenshotPath, preview }
        } catch (error) {
            console.log("Error taking screenshot:", error);
            return { error: "Error taking screenshot" }
        }
    })

    // Open external URL handler
    ip.handle("openLink", (event, url: string) => {
        try {
            console.log(`Opening external URL: ${url}`);
            shell.openExternal(url);
            return { success: true };
        } catch (error) {
            console.error(`Error opening URL ${url}:`, error);
            return { success: false, error: `Failed to open URL: ${error}` };
        }
    })

    // Settings portal handler
    ip.handle("open-settings-portal", () => {
        const mainWindow = deps.getMainWindow();
        if (mainWindow) {
            mainWindow.webContents.send("show-settings-dialog");
            return { success: true };
        }
        return { success: false, error: "Main window not available" };
    })

    ip.handle("toggle-window", () => {
        try {
            deps.toggleMainWindow();
            return { success: true };
        } catch (error) {
            console.log("error toggling Window", error);
            return { error: "Failed toggling window" };
        }
    })

    ip.handle("reset-queues", async () => {
        try {
            deps.clearQueues();
            return { success: true };
        } catch (error) {
            console.error("Error toggling window:", error)
            return { error: "Failed to toggle window" }
        }
    })

    ip.handle("trigger-process-screenshot", async () => {
        try {
            // Check for API key  
            if (!configHelper.hasApiKey()) {
                const mainWindow = deps.getMainWindow();
                if (mainWindow) {
                    mainWindow.webContents.send(deps.PROCESSING_EVENTS.API_KEY_INVALID);
                }
                return { success: false, error: "API key required" };
            }

            await deps.processingHelper?.processScreenshots();
            return { success: true }
        } catch (error) {
            console.error("Error processing screenshots:", error)
            return { error: "Failed to process screenshots" }
        }
    });

    // Reset handlers
    ip.handle("trigger-reset", () => {
        try {
            // First cancel any ongoing requests
            deps.processingHelper?.cancelOngoingRequests();

            deps.clearQueues();
            deps.setView('queue');

            const mainWindow = deps.getMainWindow();
            if (mainWindow && !mainWindow.isDestroyed()) {
                // Send reset events in sequence
                mainWindow.webContents.send("reset-view")
                mainWindow.webContents.send("reset")
            }
            return { success: true };

        } catch (error) {
            console.log("Error triggering reset", error);
            return { error: "Failed to trigger reset" };
        }
    })

    // Window movement handlers
    ip.handle("trigger-move-left", () => {
        try {
            deps.moveWindowLeft()
            return { success: true }
        } catch (error) {
            console.error("Error moving window left:", error)
            return { error: "Failed to move window left" }
        }
    })

    ip.handle("trigger-move-right", () => {
        try {
            deps.moveWindowRight()
            return { success: true }
        } catch (error) {
            console.error("Error moving window right:", error)
            return { error: "Failed to move window right" }
        }
    })

    ip.handle("trigger-move-up", () => {
        try {
            deps.moveWindowUp()
            return { success: true }
        } catch (error) {
            console.error("Error moving window up:", error)
            return { error: "Failed to move window up" }
        }
    })

    ip.handle("trigger-move-down", () => {
        try {
            deps.moveWindowDown()
            return { success: true }
        } catch (error) {
            console.error("Error moving window down:", error)
            return { error: "Failed to move window down" }
        }
    })

    ip.handle("delete-last-screenshot", async () => {
        try {
            const queue = deps.getView() === 'queue' ? deps.getScreenshotQueue() : deps.getExtraScreenshotQueue();
            if (queue.length === 0) {
                return { success: false, error: "No screenshots to delete" }
            }

            const lastScreenshot = queue[queue.length - 1];
            // Delete it
            const result = await deps.deleteScreenshot(lastScreenshot)

            // Notify the renderer about the change
            const mainWindow = deps.getMainWindow()
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send("screenshot-deleted", { path: lastScreenshot })
            }
            return result;
        } catch (error) {
            console.error("Error deleting last screenshot:", error)
            return { error: "Failed to delete last screenshot" }
        }
    })

}