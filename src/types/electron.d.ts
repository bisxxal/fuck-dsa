export { };

declare global {
    interface Window {
        electronAPI: {
            platform: NodeJS.Platform;
            send: (channel: string, data?: unknown) => void;
            on: (channel: string, func: (...args: unknown[]) => void) => void;
        };
    }
}
