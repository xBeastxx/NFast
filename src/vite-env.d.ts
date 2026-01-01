/// <reference types="vite/client" />

interface CrocAPI {
    sendFiles: (files: string[], code?: string, relayAddress?: string) => Promise<void>;
    receiveFile: (code: string, relayAddress?: string) => Promise<{ success: boolean, error?: string }>;
    cancel: () => Promise<void>;
    onCodeGenerated: (callback: (e: any, code: string) => void) => () => void;
    onProgress: (callback: (e: any, flow: string) => void) => () => void;
    onLog: (callback: (e: any, log: string) => void) => () => void;
    onFinished: (callback: (e: any, code: number) => void) => () => void;
    onHashing: (callback: (e: any, flow: string) => void) => () => void;
}

interface Window {
    ipcRenderer: {
        croc: CrocAPI;
        openExternal: (url: string) => Promise<void>;
        invoke: (channel: string, ...args: any[]) => Promise<any>;
        on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
        window: {
            minimize: () => Promise<void>;
            maximize: () => Promise<void>;
            close: () => Promise<void>;
        };
    }
}
