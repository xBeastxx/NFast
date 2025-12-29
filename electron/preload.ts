import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // NFast API
  croc: {
    sendFiles: (files: string[], code?: string, relayAddress?: string) => ipcRenderer.invoke('croc-send', files, code, relayAddress),
    receiveFile: (code: string, relayAddress?: string) => ipcRenderer.invoke('croc-receive', code, relayAddress),
    cancel: () => ipcRenderer.invoke('croc-cancel'),
    onCodeGenerated: (callback: (e: any, code: string) => void) => {
      const subscription = (e: any, code: string) => callback(e, code);
      ipcRenderer.on('croc-code-generated', subscription);
      return () => ipcRenderer.removeListener('croc-code-generated', subscription);
    },
    onProgress: (callback: (e: any, flow: string) => void) => {
      const subscription = (e: any, flow: string) => callback(e, flow);
      ipcRenderer.on('croc-progress', subscription);
      return () => ipcRenderer.removeListener('croc-progress', subscription);
    },
    onLog: (callback: (e: any, log: string) => void) => {
      const subscription = (e: any, log: string) => callback(e, log);
      ipcRenderer.on('croc-log', subscription);
      return () => ipcRenderer.removeListener('croc-log', subscription);
    },
    onFinished: (callback: (e: any, code: number) => void) => {
      const subscription = (e: any, code: number) => callback(e, code);
      ipcRenderer.on('croc-finished', subscription);
      return () => ipcRenderer.removeListener('croc-finished', subscription);
    },
  },

  // Utilities
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
})
