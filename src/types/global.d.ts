export {}

declare global {
  interface Window {
    __CREDITS__: number
    __LANGUAGE__: string
    __IS_INITIALIZED__: boolean
    
    electronAPI: {
      // IPC invokers
      getConfig: () => Promise<any>
      updateConfig: (config: { apiKey?: string; model?: string; language?: string; opacity?: number }) => Promise<void>
      checkApiKey: () => Promise<boolean>
      validateApiKey: (apiKey: string) => Promise<boolean>
      getPlatform: () => NodeJS.Platform
      openLink: (url: string) => void
      openExternal: (url: string) => Promise<void>
      removeListener: (eventName: string, callback: (...args: any[]) => void) => void
      triggerScreenshot: () => Promise<void>
      triggerProcessScreenshots: () => Promise<void>
      triggerReset: () => Promise<void>
      triggerMoveLeft: () => Promise<void>
      triggerMoveRight: () => Promise<void>
      triggerMoveUp: () => Promise<void>
      triggerMoveDown: () => Promise<void>
      decrementCredits: () => Promise<void>
      deleteLastScreenshot: () => Promise<void>
      startUpdate: () => Promise<void>
      installUpdate: () => Promise<void>

      // Screenshots
      getScreenshots: () => Promise<any[]>
      deleteScreenshot: (path: string) => Promise<void>
      clearStore: () => Promise<void>
      updateContentDimensions: (dimensions: { width: number; height: number }) => Promise<void>
      toggleMainWindow: () => Promise<void>
      openSettingsPortal: () => Promise<void>

      // Event listeners (return unsubscribe fn)
      onSolutionStart: (callback: () => void) => () => void
      onSolutionSuccess: (callback: (data: any) => void) => () => void
      onSolutionError: (callback: (error: string) => void) => () => void
      onProblemExtracted: (callback: (data: any) => void) => () => void
      onResetView: (callback: () => void) => () => void
      onReset: (callback: () => void) => () => void
      onUnauthorized: (callback: () => void) => () => void
      onOutOfCredits: (callback: () => void) => () => void
      onApiKeyInvalid: (callback: () => void) => () => void
      onShowSettings: (callback: () => void) => () => void
      onScreenshotTaken: (callback: (data: { path: string; preview: string }) => void) => () => void
      onDeleteLastScreenshot: (callback: () => void) => () => void
      onDebugStart: (callback: () => void) => () => void
      onDebugSuccess: (callback: (data: any) => void) => () => void
      onDebugError: (callback: (error: string) => void) => () => void
      onProcessingNoScreenshots: (callback: () => void) => () => void
      onCreditsUpdated: (callback: (credits: number) => void) => () => void
      onUpdateAvailable: (callback: (info: any) => void) => () => void
      onUpdateDownloaded: (callback: (info: any) => void) => () => void
    }
  }
}
