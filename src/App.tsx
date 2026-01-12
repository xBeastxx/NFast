import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';

interface HistoryItem {
  id: string;
  type: 'send' | 'receive';
  code: string;
  status: 'pending' | 'completed' | 'failed' | 'success' | 'cancelled';
  timestamp: number;
  fileName?: string;
  isContact?: boolean; // Track if this was a contact transfer
}

interface Contact {
  id: string;
  name: string;
  code: string;
  avatarColor: string;
}

function App() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');
  const [log, setLog] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [inputCode, setInputCode] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // New States for Dashboard
  const [deviceId, setDeviceId] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  // New States for Contact Flow logic
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactSettingsId, setContactSettingsId] = useState<string | null>(null); // ID of contact being edited in modal

  // Global App Settings (Legal & Credits)
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [settingsView, setSettingsView] = useState<'main' | 'privacy' | 'terms' | 'credits'>('main');
  const [relayAddress, setRelayAddress] = useState('');
  const [showRelayHelp, setShowRelayHelp] = useState(false);

  // Enhanced UI State
  const [showConsole, setShowConsole] = useState(false);
  const [transferDetails, setTransferDetails] = useState<{
    stage: 'idle' | 'connecting' | 'transferring' | 'finished' | 'error';
    percent: number;
    speed: string;
    sizeInfo: string;
    eta: string;
    fileName: string;
  }>({ stage: 'idle', percent: 0, speed: '', sizeInfo: '', eta: '', fileName: '' });
  const [hashingPercent, setHashingPercent] = useState(0);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('nfast_language', lng);
  };

  // Reset view when closing
  useEffect(() => {
    if (!showGlobalSettings) setSettingsView('main');
  }, [showGlobalSettings]);

  // Ref for file input
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const logsEndRef = React.useRef<HTMLDivElement>(null);

  // Track active transfer ID for precise cancellation
  const currentTransferIdRef = React.useRef<string | null>(null);
  // Track filename for history
  const currentFileNameRef = React.useRef<string | null>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  const processFiles = async (rawFiles: any[]) => {
    // @ts-ignore
    const filePaths = rawFiles.map(f => f.path).filter(Boolean);

    if (filePaths.length > 0) {
      // Extract filename for history
      const fileName = filePaths[0].split('\\').pop()?.split('/').pop();
      currentFileNameRef.current = fileName || null;
      // Check if we are "locked" to a contact
      const codeToUse = selectedContact ? selectedContact.code : (contacts.find(c => c.code === generatedCode)?.code);

      if (!selectedContact && !codeToUse) setGeneratedCode('LOADING');

      try {
        await window.ipcRenderer.croc.sendFiles(filePaths, codeToUse, relayAddress);
      } catch (err) {
        console.error('IPC Error:', err);
        setGeneratedCode('ERROR');
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // @ts-ignore
      const rawFiles = Array.from(e.target.files);
      processFiles(rawFiles);
      // Reset input so same file can be selected again if needed
      e.target.value = '';
    }
  }

  // Effect handles device ID, History, Contacts etc.
  // ... (Lines 87-126 skipped for brevity in diff, logic remains same)

  // ... (Lines 128-190 skipped)





  // Effect to sync contact code
  useEffect(() => {
    if (selectedContact) {
      // Auto-populate codes for both directions
      setGeneratedCode(selectedContact.code);
      setInputCode(selectedContact.code);
    }
  }, [selectedContact]);

  // Request notification permission on startup
  useEffect(() => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    // 1. Load or Generate Device ID
    const savedId = localStorage.getItem('nfast_device_id');
    if (savedId) {
      setDeviceId(savedId);
    } else {
      const newId = 'PC-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      localStorage.setItem('nfast_device_id', newId);
      setDeviceId(newId);
    }

    // 2. Load History & Contacts
    const savedHistory = localStorage.getItem('nfast_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedContacts = localStorage.getItem('nfast_contacts');
    if (savedContacts) setContacts(JSON.parse(savedContacts));

    const savedRelay = localStorage.getItem('nfast_relay');
    if (savedRelay) setRelayAddress(savedRelay);

    // Listeners
    // Listeners
    const removeLog = window.ipcRenderer.croc.onLog((_e, msg) => {
      setLog(prev => [...prev.slice(-50), msg]);

      // Heuristic for connection
      if (msg.includes('connected') || msg.includes('handshake')) {
        setTransferDetails(prev => ({ ...prev, stage: 'connecting' }));
      }
    });

    const removeCode = window.ipcRenderer.croc.onCodeGenerated((_e, code) => {
      if (code && code !== 'ERROR' && !code.includes('Generating')) {
        setGeneratedCode(code);
        addToHistory('send', code, currentFileNameRef.current || undefined);
        setTransferDetails(prev => ({ ...prev, stage: 'connecting' }));
      }
    });

    const removeHashing = window.ipcRenderer.croc.onHashing((_e, flow) => {
      const match = flow.match(/(\d+)%/);
      if (match) setHashingPercent(parseInt(match[1]));
    });

    const removeProgress = window.ipcRenderer.croc.onProgress((_e, flow) => {
      setHashingPercent(100); // Clear hashing when real transfer starts
      // Example flow: " 100% |████| (1.5/1.5 GB, 23 MB/s) [2s:0s]"


      // Parse flow for Rich UI
      // Regex to capture: Percentage, Size Info (between paren and comma), Speed (between comma and paren)
      const percentMatch = flow.match(/(\d+)%/);
      const sizeMatch = flow.match(/\(([^,]+),/);
      const speedMatch = flow.match(/, ([^)]+)\)/);

      setTransferDetails(prev => ({
        ...prev,
        stage: 'transferring',
        percent: percentMatch ? parseInt(percentMatch[1]) : prev.percent,
        sizeInfo: sizeMatch ? sizeMatch[1] : prev.sizeInfo,
        speed: speedMatch ? speedMatch[1] : prev.speed,
        eta: ''
      }));
    });

    // We need to access the LATEST currentTransferId here.
    // Since this callback is created in useEffect, it might catch a stale closure if we just used `currentTransferId`
    // But we are using setHistory(prev => ...) which is good.
    // To know WHICH ID to remove, we can rely on a ref if we wanted to be 100% sure, 
    // but typically the "pending" item at the top is the one. 
    // Let's use a simpler heuristic for now: IF we have a currentTransferId pending, use that if possible, 
    // or just assume the most recent pending item is the one to kill.
    // Actually, `currentTransferId` state won't be updated inside this closure effectively without a Ref.

    // NEW STRATEGY: We will just look for the most recent Pending item.

    const removeFinished = window.ipcRenderer.croc.onFinished((_e, code) => {
      let finalStatus: 'success' | 'failed' | 'cancelled' = 'failed';
      if (code === 0) finalStatus = 'success';
      else if (code === -1) finalStatus = 'cancelled';

      if (finalStatus === 'success') {

        setTransferDetails(prev => ({ ...prev, stage: 'finished', percent: 100 }));
      } else if (finalStatus === 'cancelled') {

        setTransferDetails(prev => ({ ...prev, stage: 'idle', percent: 0 }));
      } else {

        setTransferDetails(prev => ({ ...prev, stage: 'error' }));
      }

      // Capture the ID *before* the state update to ensure consistency
      // and prevent issues with React Strict Mode running the updater twice.
      const activeTransferId = currentTransferIdRef.current;
      currentTransferIdRef.current = null; // Reset Ref immediately since transfer is finished.

      setHistory(prevHistory => {
        if (prevHistory.length === 0) return prevHistory;

        // 1. If Cancelled: Remove the specific item tracked by Ref
        if (finalStatus === 'cancelled') {
          // Priority 1: Use the tracked ID
          if (activeTransferId) {
            const newHistory = prevHistory.filter(h => h.id !== activeTransferId);
            localStorage.setItem('nfast_history', JSON.stringify(newHistory));
            return newHistory;
          }

          // Priority 2: Fallback to removing the first 'pending' item
          if (prevHistory[0].status === 'pending') {
            const newHistory = prevHistory.slice(1);
            localStorage.setItem('nfast_history', JSON.stringify(newHistory));
            return newHistory;
          }
          return prevHistory;
        }

        // 2. If Success/Fail: Update the pending item
        if (activeTransferId) {
          const newHistory = prevHistory.map(h =>
            h.id === activeTransferId ? { ...h, status: finalStatus } : h
          );
          localStorage.setItem('nfast_history', JSON.stringify(newHistory));
          return newHistory;
        }

        // Fallback for success/fail update
        if (prevHistory[0].status === 'pending') {
          const newHistory = [...prevHistory];
          newHistory[0] = { ...newHistory[0], status: finalStatus };
          localStorage.setItem('nfast_history', JSON.stringify(newHistory));
          return newHistory;
        }

        return prevHistory;
      });

      const resetDelay = code === -1 ? 500 : 3000;
      setTimeout(() => {
        // Notification at the exact moment of UI reset (3s timing)
        if (finalStatus !== 'cancelled') {
          new Notification(t('app.title'), {
            body: finalStatus === 'success' ? t('status.completed') : t('status.failed'),
            silent: false
          });
        }

        setLog([]);
        setGeneratedCode('');
        setInputCode('');
        // setCopySuccess(false); // Can keep copy status
        setTransferDetails({ stage: 'idle', percent: 0, speed: '', sizeInfo: '', eta: '', fileName: '' });
      }, resetDelay);
    });

    // Cleanup function to remove listeners
    return () => {
      removeLog();
      removeCode();
      removeProgress();
      removeFinished();
      removeHashing();
    };
  }, [t]);

  const addToHistory = (type: 'send' | 'receive', code: string, fileName?: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      type,
      code,
      status: 'pending',
      timestamp: Date.now(),
      fileName
    };

    // Track this ID for potential cancellation/completion updates
    currentTransferIdRef.current = newItem.id;

    // Use functional update to ensure we have latest history
    setHistory(prev => {
      const newHistory = [newItem, ...prev].slice(0, 10);
      localStorage.setItem('nfast_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const addContact = (name: string, code: string) => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name,
      code,
      avatarColor: ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'][Math.floor(Math.random() * 6)]
    };
    const newContacts = [...contacts, newContact];
    setContacts(newContacts);
    localStorage.setItem('nfast_contacts', JSON.stringify(newContacts));
  };

  const deleteContact = (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    localStorage.setItem('nfast_contacts', JSON.stringify(updated));
    if (selectedContact?.id === id) setSelectedContact(null);
  }

  // History Management & Privacy
  const [revealedHistoryId, setRevealedHistoryId] = useState<string | null>(null);

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem('nfast_history', JSON.stringify(updated));
  }

  const clearHistory = () => {
    if (window.confirm(t('dashboard.confirm_clear'))) {
      setHistory([]);
      localStorage.setItem('nfast_history', JSON.stringify([]));
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);

    // @ts-ignore
    const rawFiles = Array.from(e.dataTransfer.files);
    processFiles(rawFiles);
  };

  const handleReceive = async () => {
    if (!inputCode) return;
    addToHistory('receive', inputCode);

    await window.ipcRenderer.croc.receiveFile(inputCode, relayAddress);
  };

  const copyToClipboard = (text: string) => {
    if (text && text !== 'LOADING') {
      navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleCancel = async () => {
    await window.ipcRenderer.croc.cancel();
    setGeneratedCode('');
    setInputCode('');

    setTransferDetails({ stage: 'idle', percent: 0, speed: '', sizeInfo: '', eta: '', fileName: '' });
    setLog([]);
    // Do NOT clear currentTransferIdRef here, let onFinished handle it using the ID to delete the history item.
  };

  const isLoading = generatedCode === 'LOADING';
  const hasCode = generatedCode && !isLoading;

  const isTransferActive = transferDetails.stage === 'connecting' || transferDetails.stage === 'transferring';

  return (
    <div className="h-screen w-full flex flex-col select-none bg-background text-white overflow-hidden">

      {/* Custom Title Bar with Window Controls */}
      <div className="flex-none w-full h-8 flex items-center justify-between bg-black/40 border-b border-white/30 px-2" style={{ WebkitAppRegion: 'drag' } as any}>
        <div className="flex items-center gap-2 text-[10px] text-white/70 uppercase tracking-widest">
          <span>{t('app.title')}</span>
        </div>

        {/* Window Controls */}
        <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <button
            onClick={() => window.ipcRenderer.window.minimize()}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors text-white/80 hover:text-white"
            title="Minimizar"
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M 0,5 10,5" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
          <button
            onClick={() => window.ipcRenderer.window.maximize()}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/10 transition-colors text-white/80 hover:text-white"
            title="Maximizar/Restaurar"
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z" fill="currentColor" />
            </svg>
          </button>
          <button
            onClick={() => window.ipcRenderer.window.close()}
            className="w-8 h-8 flex items-center justify-center hover:bg-red-500 transition-colors text-white/80 hover:text-white"
            title="Cerrar"
          >
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M 0,0 10,10 M 10,0 0,10" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex-none w-full h-16 flex justify-between items-center mb-6 px-6 pt-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-pulse">
              {t('app.title')} <span className="text-xs text-white/80 font-normal align-top border border-white/30 rounded px-1">{t('app.pro')}</span>
            </h1>
            <span className="text-[10px] text-white/70 tracking-widest uppercase ml-1">{t('app.subtitle')}</span>
          </div>
          {/* Branding moved here */}
          <div className="h-8 w-[1px] bg-white/10 mx-2"></div> {/* Separator */}
          <div className="flex flex-col">
            <div className="text-[10px] text-white/80 font-bold tracking-widest">{t('app.footer.by')}</div>
            <div className="text-[8px] text-white/10">{t('app.footer.version')}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-xl bg-white/5 border-2 border-white/20 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
              <span className="text-xs font-mono text-white/80">{t('app.id')}: <span className="text-white font-bold">{deviceId}</span></span>
              <button
                onClick={() => copyToClipboard(deviceId)}
                className="hover:text-cyan-400 transition-colors ml-1"
                title={t('send.copy_tooltip')}
              >📋</button>
            </div>
            {/* Global Settings Button */}
            <button
              onClick={() => setShowGlobalSettings(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border-2 border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition-all hover:rotate-90"
              title={t('app.settings_button')}
            >
              ⚙️
            </button>
          </div>
        </div>
      </div>

      {/* --- GLOBAL SETTINGS MODAL --- */}
      {showGlobalSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] rounded-3xl shadow-2xl flex flex-col h-[600px] max-h-[85vh] transition-all duration-300">

            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 flex-none relative overflow-hidden">
              {/* Decorative Header Line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

              <div className="flex items-center gap-3 relative z-10">
                {settingsView !== 'main' && (
                  <button
                    onClick={() => setSettingsView('main')}
                    className="w-8 h-8 rounded-lg border border-white/20 hover:border-cyan-500/50 hover:bg-cyan-500/10 flex items-center justify-center text-white/80 hover:text-cyan-400 transition-all active:scale-95"
                  >
                    ←
                  </button>
                )}
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-wider">
                    {settingsView === 'main' ? (
                      <>
                        <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">{t('settings.header.main')}</span>
                        <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 px-1.5 rounded text-cyan-500">SYS</span>
                      </>
                    ) : settingsView === 'privacy' ? (
                      <span className="text-cyan-400">{t('settings.header.privacy')}</span>
                    ) : settingsView === 'terms' ? (
                      <span className="text-purple-400">{t('settings.header.terms')}</span>
                    ) : (
                      <span className="text-green-400">{t('settings.header.credits')}</span>
                    )}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.ipcRenderer.openExternal('https://ko-fi.com/nauticgames')}
                  className="h-8 px-3 rounded-lg border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-bold tracking-wider flex items-center gap-2 transition-all hover:shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                  title={t('settings.main.btn_donate')}
                >
                  <span>☕</span>
                  <span className="hidden sm:inline">DONATE</span>
                </button>
                <button
                  onClick={() => setShowGlobalSettings(false)}
                  className="w-8 h-8 rounded-lg border border-white/20 hover:border-red-500/50 hover:bg-red-500/10 flex items-center justify-center text-white/80 hover:text-red-400 transition-all active:scale-95 group"
                >
                  <span className="group-hover:rotate-90 transition-transform">✕</span>
                </button>
              </div>
            </div>

            {/* Modal Content - Dynamic View */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">

              {/* --- MAIN VIEW --- */}
              {settingsView === 'main' && (
                <div className="flex flex-col h-full">
                  {/* Language Settings */}
                  <div className="flex flex-col gap-4 mb-6">
                    <h3 className="text-[10px] uppercase tracking-widest text-white/80 font-bold border-b border-white/20 pb-2">{t('settings.main.general_title')}</h3>

                    {/* Language Settings */}
                    <div className="flex items-center justify-between bg-black/20 p-4 relative group overflow-hidden">
                      {/* Tactical Corners */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20"></div>
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20"></div>
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20"></div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20"></div>

                      <div className="flex flex-col relative z-10">
                        <span className="text-sm font-bold text-white/90 tracking-wider">LANGUAGE PROTOCOL</span>
                        <span className="text-[10px] text-white/50 uppercase tracking-widest">Interface Localization</span>
                      </div>

                      <div className="flex items-center gap-2 relative z-10">
                        <button
                          onClick={() => changeLanguage('en')}
                          className={`px-4 py-2 text-[10px] font-bold tracking-widest transition-all skew-x-[10deg] border ${i18n.language.startsWith('en') ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'}`}
                        >
                          <span className="-skew-x-[10deg] block">ENG</span>
                        </button>
                        <button
                          onClick={() => changeLanguage('es')}
                          className={`px-4 py-2 text-[10px] font-bold tracking-widest transition-all skew-x-[10deg] border ${i18n.language.startsWith('es') ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'}`}
                        >
                          <span className="-skew-x-[10deg] block">ESP</span>
                        </button>
                      </div>
                    </div>

                    {/* Network / Relay Settings */}
                    <div className="flex flex-col gap-3 bg-black/20 p-4 relative group">
                      {/* Tactical Corners */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20"></div>
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20"></div>
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20"></div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20"></div>

                      <div className="flex flex-col mb-1 relative z-10">
                        <span className="text-sm font-bold text-white/90 tracking-wider">RELAY NODE</span>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-white/50 uppercase tracking-widest">{t('settings.main.relay_input_note')}</span>
                          <button
                            onClick={() => setShowRelayHelp(!showRelayHelp)}
                            className="text-[9px] text-cyan-500 hover:text-cyan-400 uppercase tracking-widest border border-cyan-500/30 px-2 py-0.5"
                          >
                            {t('settings.main.relay_help_btn')}
                          </button>
                        </div>
                      </div>

                      {/* Help Text Block */}
                      {showRelayHelp && (
                        <div className="bg-cyan-900/20 border-l-2 border-cyan-500 p-2 text-[10px] text-cyan-100/80 font-mono mb-2 animate-in slide-in-from-top-2">
                          {t('settings.main.relay_help_text')}
                        </div>
                      )}

                      <div className="relative group/input">
                        <div className={`absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded opacity-0 group-focus-within/input:opacity-100 transition-opacity blur`}></div>
                        <input
                          type="text"
                          value={relayAddress}
                          onChange={(e) => {
                            setRelayAddress(e.target.value);
                            localStorage.setItem('nfast_relay', e.target.value);
                          }}
                          placeholder="DEFAULT (PUBLIC)"
                          className="relative w-full bg-black/60 border border-white/10 p-3 text-white focus:border-cyan-500/50 outline-none text-xs font-mono tracking-wider shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] placeholder:text-white/20"
                        />
                      </div>

                      <p className="text-[9px] text-white/40 italic flex items-center gap-2">
                        <span className="w-1 h-1 bg-orange-500 rounded-full animate-pulse"></span>
                        {t('settings.main.relay_disclaimer')}
                      </p>
                    </div>
                  </div>

                  {/* Placeholder for Future Settings */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 border border-dashed border-white/30 rounded-2xl mb-6 min-h-[100px]">
                    <span className="text-4xl mb-4">⚙️</span>
                    <p className="text-[10px] mt-1">{t('settings.main.coming_soon')}</p>
                  </div>

                  {/* Bottom Navigation Buttons */}
                  <div className="flex-none pt-4 border-t border-white/10">
                    <h3 className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold mb-4">{t('settings.main.about_legal')}</h3>
                    <div className="grid grid-cols-4 gap-3">
                      <button
                        onClick={() => setSettingsView('privacy')}
                        className="bg-black/20 hover:bg-cyan-900/10 border border-white/10 hover:border-cyan-500/50 p-2 transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_5px_cyan]"></div>
                        </div>
                        <span className="block text-xl mb-1 grayscale group-hover:grayscale-0 transition-all">🔒</span>
                        <span className="text-[9px] font-bold text-white/70 group-hover:text-cyan-400 tracking-wider block">{t('settings.main.btn_privacy')}</span>
                      </button>

                      <button
                        onClick={() => setSettingsView('terms')}
                        className="bg-black/20 hover:bg-purple-900/10 border border-white/10 hover:border-purple-500/50 p-2 transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shadow-[0_0_5px_purple]"></div>
                        </div>
                        <span className="block text-xl mb-1 grayscale group-hover:grayscale-0 transition-all">📄</span>
                        <span className="text-[9px] font-bold text-white/70 group-hover:text-purple-400 tracking-wider block">{t('settings.main.btn_terms')}</span>
                      </button>

                      <button
                        onClick={() => setSettingsView('credits')}
                        className="bg-black/20 hover:bg-green-900/10 border border-white/10 hover:border-green-500/50 p-2 transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_green]"></div>
                        </div>
                        <span className="block text-xl mb-1 grayscale group-hover:grayscale-0 transition-all">⚡</span>
                        <span className="text-[9px] font-bold text-white/70 group-hover:text-green-400 tracking-wider block">{t('settings.main.btn_credits')}</span>
                      </button>

                      <button
                        onClick={() => window.ipcRenderer.openExternal('https://ko-fi.com/nauticgames')}
                        className="bg-black/20 hover:bg-pink-900/10 border border-white/10 hover:border-pink-500/50 p-2 transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-1.5 h-1.5 bg-pink-500 rounded-full shadow-[0_0_5px_pink]"></div>
                        </div>
                        <span className="block text-xl mb-1 grayscale group-hover:grayscale-0 transition-all">☕</span>
                        <span className="text-[9px] font-bold text-white/70 group-hover:text-pink-400 tracking-wider block">{t('settings.main.btn_donate')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- PRIVACY VIEW --- */}
              {settingsView === 'privacy' && (
                <div className="space-y-4 animate-in slide-in-from-right duration-300">
                  <div className="text-right text-[10px] text-white/80 italic mr-2">{t('settings.privacy.last_updated')}</div>
                  <div className="space-y-4 text-xs text-white leading-relaxed text-justify p-4 bg-white/5 rounded-xl max-h-[400px] overflow-y-auto custom-scrollbar">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i}>
                        <strong className="text-white block mb-1">{t(`settings.privacy.p${i}_title`)}</strong>
                        {/* Render with newlines */}
                        <div className="whitespace-pre-line">{t(`settings.privacy.p${i}_text`)}</div>
                        {i < 5 && <div className="h-[1px] bg-white/5 my-3"></div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- TERMS VIEW --- */}
              {settingsView === 'terms' && (
                <div className="space-y-4 animate-in slide-in-from-right duration-300">
                  <div className="text-right text-[10px] text-white/80 italic mr-2">{t('settings.terms.last_updated')}</div>
                  <div className="space-y-4 text-xs text-white leading-relaxed text-justify p-4 bg-white/5 rounded-xl max-h-[400px] overflow-y-auto custom-scrollbar">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                      <div key={i}>
                        <strong className="text-white block mb-1">{t(`settings.terms.p${i}_title`)}</strong>
                        <div className="whitespace-pre-line">{t(`settings.terms.p${i}_text`)}</div>
                        {i < 6 && <div className="h-[1px] bg-white/5 my-3"></div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- CREDITS VIEW --- */}
              {settingsView === 'credits' && (
                <div className="space-y-4 animate-in slide-in-from-right duration-300">
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-900/10 rounded-xl p-6 border border-green-500/20 text-center mb-6">
                    <div className="text-3xl mb-2">🐊</div>
                    <h3 className="text-xl font-bold text-white mb-1">{t('settings.credits.powered')}</h3>
                    <p className="text-xs text-green-400 font-mono">{t('settings.credits.powered_sub')}</p>
                    <p className="text-[10px] text-white/80 mt-2">{t('settings.credits.core_protocol')} <strong>schollz</strong> (MIT License)</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/20">
                      <h4 className="text-xs font-bold text-white mb-2">{t('settings.credits.frontend')}</h4>
                      <ul className="text-[10px] text-white/90 space-y-1">
                        <li>• React + TypeScript</li>
                        <li>• Tailwind CSS</li>
                        <li>• Vite</li>
                      </ul>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/20">
                      <h4 className="text-xs font-bold text-white mb-2">{t('settings.credits.backend')}</h4>
                      <ul className="text-[10px] text-white/90 space-y-1">
                        <li>• Electron</li>
                        <li>• Go (Croc Binary)</li>
                        <li>• Node.js Integration</li>
                      </ul>
                    </div>
                  </div>

                  {/* Strategic Collaborator */}
                  <div className="mt-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-white/20 p-3 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">{t('settings.credits.collaborator')}</span>
                    <span className="text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full shadow-inner">{t('settings.credits.collaborator_name')}</span>
                  </div>

                  <div className="text-center mt-8 p-4 border-t border-white/20">
                    <p className="text-xs text-white/80 font-bold mb-1">{t('settings.credits.dev_by')}</p>
                    <p className="text-sm text-cyan-400 font-bold tracking-widest">NauticGames™</p>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer (Copyright) - Fixed at bottom */}
            {settingsView === 'main' && (
              <div className="p-4 border-t border-white/20 bg-black/20 text-center flex-none">
                <p className="text-[10px] text-white/70">{t('app.footer.copyright')}</p>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 px-6 pb-6">

        {/* Left Column: Transfer Area (66%) */}
        <div className="col-span-8 flex flex-col min-h-0 relative">
          {/* Tabs */}
          {/* Tabs - Redesigned: Segmented Glass Switch (Full Width) */}
          <div className="flex-none flex mb-6">
            <div className="flex-1 flex p-1 bg-black/40 backdrop-blur-md rounded-full border border-white/30 relative">
              {/* Tab 1: Send */}
              <button
                onClick={() => setActiveTab('send')}
                className={`flex-1 py-2 px-6 rounded-full text-sm font-bold transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${activeTab === 'send'
                  ? 'text-black shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                  : 'text-white/70 hover:text-white'
                  }`}
              >
                <span>📤</span> {t('tabs.send')}
              </button>

              {/* Tab 2: Receive */}
              <button
                onClick={() => setActiveTab('receive')}
                className={`flex-1 py-2 px-6 rounded-full text-sm font-bold transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${activeTab === 'receive'
                  ? 'text-black shadow-[0_0_20px_rgba(255,0,255,0.4)]'
                  : 'text-white/70 hover:text-white'
                  }`}
              >
                <span>📥</span> {t('tabs.receive')}
              </button>

              {/* White Sliding Indicator */}
              <div
                className={`absolute top-1 bottom-1 bg-gray-300 rounded-full shadow-lg transition-all duration-300 ease-out z-0 left-1 ${activeTab === 'send' ? 'translate-x-0' : 'translate-x-full'
                  }`}
                style={{ width: 'calc(50% - 0.25rem)' }}
              ></div>
            </div>
          </div>

          {/* Action Area CONTAINER */}
          <div className="flex-1 relative mb-2 overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] border border-white/20 min-h-0">

            {/* --- SEND VIEW --- */}
            <div className={`absolute inset-0 p-1 transition-all duration-500 ease-out flex flex-col ${activeTab === 'send' ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 -translate-x-10 pointer-events-none z-0'}`}>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
              />

              {/* --- STEALTH / NORMAL MODE DROPZONE --- */}
              {(!hasCode || selectedContact) && !isLoading ? (
                <div
                  className={`flex-1 flex flex-col items-center justify-center relative transition-all duration-300 p-2 cursor-pointer group overflow-hidden ${isHovering ? 'bg-cyan-500/5' : 'hover:bg-white/5'
                    } ${isTransferActive ? 'opacity-50 pointer-events-none grayscale' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
                  onDragLeave={() => setIsHovering(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {/* --- TACTICAL CORNERS (Targeting System) --- */}
                  {/* Top Left */}
                  <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-lg transition-all duration-500 ${isHovering || selectedContact ? 'border-cyan-500 w-16 h-16 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-white/20'}`}></div>
                  {/* Top Right */}
                  <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg transition-all duration-500 ${isHovering || selectedContact ? 'border-cyan-500 w-16 h-16 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-white/20'}`}></div>
                  {/* Bottom Left */}
                  <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg transition-all duration-500 ${isHovering || selectedContact ? 'border-cyan-500 w-16 h-16 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-white/20'}`}></div>
                  {/* Bottom Right */}
                  <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-lg transition-all duration-500 ${isHovering || selectedContact ? 'border-cyan-500 w-16 h-16 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-white/20'}`}></div>

                  {/* Stealth Indicator - Compact & Fluid */}
                  {selectedContact && (
                    <div className="w-full max-w-[200px] mb-4 flex justify-center animate-in slide-in-from-top fade-in duration-500 z-10">
                      <div className="bg-cyan-500/10 border border-cyan-500/20 px-4 py-1 rounded-full flex items-center gap-3 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                        <div className={`w-2 h-2 rounded-full ${selectedContact.avatarColor} animate-pulse shadow-[0_0_10px_currentColor]`}></div>
                        <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">{t('send.linked', { name: selectedContact.name })}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedContact(null);
                            setGeneratedCode('');
                            setInputCode('');
                          }}
                          className="ml-1 text-cyan-500/50 hover:text-white flex items-center justify-center w-4 h-4 rounded-full hover:bg-white/10 transition-colors"
                          title={t('send.disconnect')}
                        >✕</button>
                      </div>
                    </div>
                  )}

                  <div className="text-center pointer-events-none transition-all duration-500 flex flex-col items-center justify-center z-10">
                    <div className={`transition-all duration-500 relative ${isHovering ? 'scale-110 drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]' : 'scale-100 opacity-80'}`}>
                      <div className="text-6xl mb-4 filter drop-shadow-lg">{selectedContact ? '🤝' : (isHovering ? '📂' : '📡')}</div>
                      {/* Pulse Ring */}
                      {!selectedContact && !isHovering && (
                        <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-20"></div>
                      )}
                    </div>

                    <h3 className={`text-lg font-bold tracking-widest uppercase mb-1 transition-colors duration-300 ${isHovering ? 'text-cyan-400' : 'text-white/70'}`}>
                      {selectedContact ? 'SECURE LINK ESTABLISHED' : (isHovering ? 'READY FOR UPLOAD' : 'AWAITING PAYLOAD')}
                    </h3>

                    <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase">
                      {selectedContact ? t('send.drop_subtext_linked') : t('send.drop_subtext')}
                    </p>
                  </div>
                </div>
              ) : isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center relative">
                  {/* Tactical Spinner / Processor */}
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 border-t-2 border-b-2 border-cyan-500/50 rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-l-2 border-r-2 border-purple-500/50 rounded-full animate-spin-slow reverse"></div>
                    <div className="text-3xl animate-pulse grayscale">💠</div>
                  </div>

                  <div className="mt-4 flex flex-col items-center gap-1">
                    <p className="text-cyan-400 text-xs font-bold tracking-[0.2em] animate-pulse">ENCRYPTING PAYLOAD</p>
                    <div className="w-32 h-0.5 bg-white/10 overflow-hidden rounded-full">
                      <div className="h-full bg-cyan-500 animate-[progress-indeterminate_1.5s_infinite_linear]"></div>
                    </div>
                  </div>
                </div>
              ) : (
                // SHOW GENERATED CODE - TACTICAL HUD STYLE
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 w-full max-w-lg animate-in fade-in zoom-in duration-500 p-2 relative mx-auto">

                  <div className="flex flex-col items-center gap-2">
                    <p className="text-white/40 uppercase tracking-[0.4em] text-[8px] font-bold">{t('send.channel_id')}</p>

                    {/* HUD Code container */}
                    <div className="relative group p-6">
                      {/* Tactical Corners */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-500/50"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-cyan-500/50"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan-500/50"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-500/50"></div>

                      <div className="text-3xl md:text-4xl font-mono text-cyan-400 font-bold tracking-widest select-text drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                        {generatedCode}
                      </div>

                      {/* Floating Copy Action */}
                      <button
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(generatedCode); }}
                        className="absolute -right-6 top-1/2 -translate-y-1/2 p-2 text-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-all"
                        title={t('send.copy_tooltip')}
                      >
                        {copySuccess ? '✓' : '📋'}
                      </button>
                    </div>
                  </div>

                  {/* Social Share Buttons */}
                  <div className="flex gap-3 justify-center mb-2">
                    <button
                      onClick={() => window.ipcRenderer.openExternal(`https://wa.me/?text=${encodeURIComponent(`NFast Code: ${generatedCode}`)}`)}
                      className="p-2 rounded-full bg-[#25D366]/20 border border-[#25D366]/50 hover:bg-[#25D366] hover:text-black hover:scale-110 transition-all group"
                      title="Share on WhatsApp"
                    >
                      {/* WhatsApp Icon */}
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#25D366] group-hover:text-black">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => window.ipcRenderer.openExternal(`https://t.me/share/url?url=${encodeURIComponent('https://nauticgames.com/nfast')}&text=${encodeURIComponent(`NFast Code: ${generatedCode}`)}`)}
                      className="p-2 rounded-full bg-[#0088cc]/20 border border-[#0088cc]/50 hover:bg-[#0088cc] hover:text-white hover:scale-110 transition-all group"
                      title="Share on Telegram"
                    >
                      {/* Telegram Icon */}
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#0088cc] group-hover:text-white">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => {
                        copyToClipboard(generatedCode);
                        window.ipcRenderer.openExternal('https://discord.com/channels/@me');
                      }}
                      className="p-2 rounded-full bg-[#5865F2]/20 border border-[#5865F2]/50 hover:bg-[#5865F2] hover:text-white hover:scale-110 transition-all group"
                      title="Copy Code & Open Discord"
                    >
                      {/* Discord Icon */}
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#5865F2] group-hover:text-white">
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1892.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.1023.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
                      </svg>
                    </button>
                  </div>
                  <div className="bg-cyan-900/10 p-3 rounded-lg border border-cyan-500/10">
                    <p className="text-cyan-200/60 text-[10px] animate-pulse">{t('send.waiting')}</p>
                    <button onClick={handleCancel} className="mt-2 text-[10px] text-white/80 hover:text-white underline">{t('send.cancel')}</button>
                  </div>
                </div>
              )}
            </div>

            {/* --- RECEIVE VIEW --- */}
            {/* --- RECEIVE VIEW --- */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 transition-all duration-500 ease-out ${activeTab === 'receive' ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-10 pointer-events-none z-0'}`}>
              <div className="w-full max-w-sm flex flex-col gap-6 justify-center h-full max-h-[400px]">

                {/* Header */}
                <div className="text-center space-y-2 mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-2xl mb-2 animate-pulse">
                    📡
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-widest uppercase">INPUT COORDINATES</h3>
                  <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase">{t('receive.target_coordinates')}</p>
                </div>

                <div className="relative group">
                  {/* Tactical Corners for Input */}
                  <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 transition-all duration-300 ${inputCode ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'border-white/50 group-hover:border-cyan-500/50'}`}></div>
                  <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 transition-all duration-300 ${inputCode ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'border-white/50 group-hover:border-cyan-500/50'}`}></div>
                  <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 transition-all duration-300 ${inputCode ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'border-white/50 group-hover:border-cyan-500/50'}`}></div>
                  <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 transition-all duration-300 ${inputCode ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'border-white/50 group-hover:border-cyan-500/50'}`}></div>

                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder={t('receive.placeholder')}
                    disabled={!!selectedContact}
                    className={`w-full h-14 bg-black/40 backdrop-blur-md border-0 text-center text-2xl font-mono tracking-widest outline-none transition-all placeholder:text-white/10 placeholder:text-sm ${selectedContact ? 'text-green-400' : 'text-cyan-400'}`}
                    style={{ clipPath: 'polygon(5% 0, 95% 0, 100% 20%, 100% 80%, 95% 100%, 5% 100%, 0% 80%, 0% 20%)' }}
                  />

                  {selectedContact && (
                    <div className="absolute inset-x-0 -bottom-8 text-center animate-in slide-in-from-bottom-2 fade-in">
                      <span className="text-[9px] text-green-400 uppercase tracking-widest bg-green-900/20 px-3 py-1 rounded border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                        ● {t('receive.linked_label', { name: selectedContact.name })}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleReceive}
                  disabled={!inputCode || isTransferActive}
                  className="w-full h-12 mt-4 relative overflow-hidden group disabled:opacity-80 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors border border-cyan-500/30 group-hover:border-cyan-500/60 skew-x-[-10deg]"></div>
                  <div className="relative flex items-center justify-center gap-2 text-cyan-400 font-bold tracking-[0.2em] text-xs uppercase group-hover:text-cyan-300 transition-colors">
                    {isTransferActive ? (
                      <div className="flex items-center gap-3 animate-pulse">
                        <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                        <span>INITIALIZING...</span>
                      </div>
                    ) : (
                      <>
                        <span>{t('receive.initiate')}</span>
                        <span className="text-lg">➔</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* --- TRUSTED LINKS (AVATAR BAR) --- */}
          <div className={`flex-none mt-2 transition-all duration-500 ${contacts.length > 0 ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/80 font-bold mb-2 flex items-center justify-between">
              <span>{t('contacts.title')}</span>
              <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-white/70">{t('contacts.active_count', { count: contacts.length })}</span>
            </h3>
            <div className="flex items-center gap-4 overflow-x-auto pt-3 pb-4 custom-scrollbar">
              {contacts.map(contact => {
                const isSelected = selectedContact?.id === contact.id;
                return (
                  <div key={contact.id} className="relative group">
                    <button
                      onClick={() => {
                        // Toggle Selection
                        if (isSelected) {
                          setSelectedContact(null);
                          // Clear everything on deselect
                          setGeneratedCode('');
                          setInputCode('');
                        } else {
                          setSelectedContact(contact);
                          // Code sync is now handled by the useEffect above
                        }
                      }}
                      className="flex flex-col items-center gap-2 min-w-[60px]"
                    >
                      <div className={`w-12 h-12 rounded-full ${contact.avatarColor} flex items-center justify-center text-lg font-bold text-white shadow-lg border-2 transition-all duration-300 ${isSelected
                        ? 'border-cyan-400 scale-110 shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                        : 'border-white/30 hover:border-white/30 hover:scale-105'
                        }`}>
                        {contact.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className={`text-[10px] font-medium transition-colors ${isSelected ? 'text-cyan-400' : 'text-white/70 group-hover:text-white'
                        }`}>
                        {contact.name}
                      </span>
                      {isSelected && (
                        <div className="absolute top-0 right-1 w-3 h-3 bg-green-500 border-2 border-[#0a0a1a] rounded-full animate-pulse"></div>
                      )}
                    </button>

                    {/* Settings Gear - Only visible on hover */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setContactSettingsId(contact.id); }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-black/80 border border-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 text-[10px] text-white"
                      title={t('contacts.settings_tooltip')}
                    >
                      ⚙️
                    </button>
                  </div>
                )
              })}


            </div>
          </div>


        </div >

        {/* Right Column: Dashboard (33%) */}
        {/* Changed: Container is now transparent and handles spacing between child cards */}
        <div className="col-span-4 flex flex-col min-h-0 gap-4">

          {/* Card 1: Live Status */}
          <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] animate-breathing relative overflow-hidden group">
            {/* Tactical Grid Background (Subtle) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

            <div className="flex justify-between items-center mb-4 relative z-10 border-b border-white/10 pb-2">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-bold flex items-center gap-2">
                <span className={`w-2 h-2 rounded-sm ${transferDetails.stage === 'idle' ? 'bg-white/20' : transferDetails.stage === 'error' ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-cyan-500 animate-pulse shadow-[0_0_10px_cyan]'}`}></span>
                {t('dashboard.live_status')}
              </h3>

              <div className="flex items-center gap-2">
                {/* Force Reset Button */}
                <button
                  onClick={handleCancel}
                  className="w-6 h-6 flex items-center justify-center rounded border border-white/10 text-white/40 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-all active:scale-95"
                  title="Refresh Live Status"
                >
                  ↻
                </button>
                <button
                  onClick={() => setShowConsole(!showConsole)}
                  className={`text-[8px] px-2 py-0.5 rounded border uppercase tracking-wider transition-all ${showConsole ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-black/40 border-white/10 text-white/50 hover:text-white'}`}
                  title="Toggle Console View"
                >
                  {showConsole ? '>_ CONSOLE' : '👁️ PRETTY'}
                </button>
              </div>
            </div>

            <div className="relative z-10 min-h-[180px] flex flex-col">

              {/* --- PRETTY VIEW (Default) --- */}
              {!showConsole && (
                <div className="flex-1 flex flex-col justify-between animate-in fade-in duration-300 gap-4">

                  {/* Step 1: Connection */}
                  <div className={`flex items-start gap-4 transition-all duration-300 ${transferDetails.stage !== 'idle' ? 'opacity-100 translate-x-0' : 'opacity-40 translate-x-[-5px]'}`}>
                    <div className={`w-6 h-6 flex-none flex items-center justify-center border font-mono text-[10px] font-bold mt-0.5 rounded-sm ${['connecting', 'transferring', 'finished'].includes(transferDetails.stage) ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'bg-black/30 border-white/10 text-white/30'}`}>
                      01
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-white tracking-wide block mb-1">{transferDetails.stage === 'idle' ? t('status.step1_idle') : t('status.connecting')}</span>
                      {/* Hashing UI */}
                      {hashingPercent > 0 && hashingPercent < 100 && transferDetails.stage === 'connecting' ? (
                        <div className="w-full max-w-[150px] bg-black/40 h-1 mt-1 overflow-hidden relative">
                          <div className="absolute inset-0 bg-cyan-500/20"></div>
                          <div className="h-full bg-cyan-400 w-full animate-[progress-indeterminate_1s_infinite_linear]"></div>
                          <div className="absolute top-[-15px] right-0 text-[8px] font-mono text-cyan-400">{hashingPercent}%</div>
                        </div>
                      ) : (
                        <span className="text-[9px] text-white/40 uppercase tracking-widest">{transferDetails.stage === 'idle' ? t('dashboard.system_idle') : (transferDetails.stage === 'connecting' ? 'Handshake Protocol...' : 'Secure Channel Established')}</span>
                      )}
                    </div>
                  </div>

                  {/* Step 2: Transfer */}
                  <div className={`flex items-start gap-4 transition-all duration-300 ${['transferring', 'finished'].includes(transferDetails.stage) ? 'opacity-100 translate-x-0' : 'opacity-40 translate-x-[-5px]'}`}>
                    <div className={`w-6 h-6 flex-none flex items-center justify-center border font-mono text-[10px] font-bold mt-0.5 rounded-sm ${['transferring', 'finished'].includes(transferDetails.stage) ? 'bg-purple-500/20 border-purple-500 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-black/30 border-white/10 text-white/30'}`}>
                      02
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-bold text-white tracking-wide">DATA TRANSFER</span>
                        <span className="text-[9px] font-mono text-cyan-400 bg-cyan-900/20 px-1 border border-cyan-500/30 rounded-sm">{transferDetails.speed || '0 KB/s'}</span>
                      </div>

                      {/* Tactical Progress Bar */}
                      <div className="h-2 w-full bg-black/50 border border-white/10 relative overflow-hidden group/bar">
                        {/* Grid lines on bar */}
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_2px,rgba(0,0,0,0.8)_2px)] bg-[size:10px_100%] z-10 pointer-events-none opacity-50"></div>
                        <div
                          className="h-full bg-cyan-500 shadow-[0_0_15px_cyan] transition-all duration-300 ease-out relative z-0"
                          style={{ width: `${transferDetails.percent}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[8px] text-white/50 font-mono mt-1">
                        <span>{transferDetails.sizeInfo || '0.0 / 0.0 MB'}</span>
                        <span className="text-cyan-400 font-bold">{transferDetails.percent}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Finished */}
                  <div className={`flex items-start gap-4 transition-all duration-300 ${transferDetails.stage === 'finished' ? 'opacity-100 translate-x-0' : 'opacity-40 translate-x-[-5px]'}`}>
                    <div className={`w-6 h-6 flex-none flex items-center justify-center border font-mono text-[10px] font-bold mt-0.5 rounded-sm ${transferDetails.stage === 'finished' ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-black/30 border-white/10 text-white/30'}`}>
                      03
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white tracking-wide">COMPLETED</span>
                      <span className="text-[9px] text-white/40 uppercase tracking-widest">Payload Securely Stored</span>
                    </div>
                  </div>

                </div>
              )}

              {/* --- CONSOLE VIEW (Optional) --- */}
              {showConsole && (
                <div className="flex-1 overflow-y-auto max-h-[150px] custom-scrollbar font-mono text-[10px] space-y-1 animate-in fade-in zoom-in-95 duration-200">
                  {log.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-white/70 italic">
                      {t('dashboard.system_idle')}
                    </div>
                  ) : (
                    log.map((l, i) => {
                      const isError = l.includes('!!!') || l.toLowerCase().includes('error') || l.includes('❌');
                      return (
                        <div key={i} className={`break-all pl-2 border-l-2 ${isError ? 'text-red-400 border-red-500/50' : 'text-white/80 border-white/30'}`}>
                          {l.replace('[OUT]', '').replace('[ERR]', '')}
                        </div>
                      );
                    })
                  )}
                  <div ref={logsEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Card 2: History */}
          <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] animate-breathing">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm bg-purple-500 shadow-[0_0_8px_purple]"></span> {t('dashboard.recent_uplinks')}
              </h3>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-sm text-red-500/30 hover:text-red-400 hover:bg-red-500/10 w-6 h-6 flex items-center justify-center rounded transition-all hover:scale-110"
                  title={t('dashboard.clear_history')}
                >
                  🗑️
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
              {history.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-white/30 border-2 border-dashed border-white/5 rounded-xl">
                  <span className="text-2xl mb-2 opacity-50">📂</span>
                  <span className="text-[10px] uppercase tracking-wider">{t('dashboard.no_history')}</span>
                </div>
              )}
              {history.map((item) => (
                <div key={item.id} className="relative bg-black/40 p-3 group border-l-2 border-l-transparent hover:border-l-cyan-500 transition-all">

                  {/* Tactical Decorations */}
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10 group-hover:border-cyan-500/50"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/10 group-hover:border-cyan-500/50"></div>

                  {/* Delete Item Button (Visible on Hover) */}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item.id); }}
                    className="absolute top-2 right-2 text-white/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all font-bold text-xs p-1 z-20"
                    title={t('dashboard.remove_history')}
                  >
                    ✕
                  </button>

                  <div className="flex justify-between items-start mb-2 pr-6">
                    <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded-sm border ${item.type === 'send' ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' : 'bg-purple-500/10 text-purple-300 border-purple-500/30'}`}>
                      {item.type}
                    </span>
                    <span className="text-[8px] text-white/40 font-mono">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {/* Code or Contact Name Display */}
                  <div
                    className="font-mono text-xs text-white truncate mb-1 cursor-pointer select-none pl-1"
                    title={t('dashboard.reveal_tooltip')}
                    onDoubleClick={(e) => { e.stopPropagation(); setRevealedHistoryId(revealedHistoryId === item.id ? null : item.id); }}
                  >
                    {(() => {
                      const knownContact = contacts.find(c => c.code === item.code);
                      if (knownContact) {
                        return (
                          <span className="flex items-center gap-1.5 text-cyan-400 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                            <span className="text-[10px]">🔒</span> {knownContact.name}
                          </span>
                        );
                      }
                      // Obfuscation Logic for unknown codes
                      if (revealedHistoryId === item.id) {
                        return <span className="text-cyan-300 tracking-wider">{item.code}</span>;
                      }
                      return <span className="text-white/60 tracking-[0.2em] opacity-80">•••• •••• ••••</span>;
                    })()}
                  </div>

                  {item.fileName && (
                    <div className="text-[10px] text-white/50 truncate flex items-center gap-1 pl-1">
                      <span className="opacity-50">FILE:</span> {item.fileName}
                    </div>
                  )}

                  {/* Add to Contacts Action */}
                  {!contacts.some(c => c.code === item.code) && item.status !== 'failed' && (
                    <div className="mt-3 w-full">
                      {editingContactId === item.id ? (
                        <div className="relative group/edit">
                          <div className="absolute inset-0 bg-cyan-500/20 blur-sm"></div>
                          <input
                            autoFocus
                            type="text"
                            placeholder={t('dashboard.name_peer_placeholder')}
                            className="relative w-full py-1 px-2 text-[10px] bg-black border border-cyan-500 text-cyan-300 placeholder:text-cyan-500/30 outline-none uppercase font-mono tracking-wider"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const target = e.target as HTMLInputElement;
                                if (target.value.trim()) {
                                  addContact(target.value.trim(), item.code);
                                  setEditingContactId(null);
                                }
                              }
                              if (e.key === 'Escape') setEditingContactId(null);
                            }}
                            onBlur={() => setEditingContactId(null)}
                          />
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingContactId(item.id);
                          }}
                          className="w-full py-1 text-[9px] uppercase tracking-[0.2em] font-bold text-white/40 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/50 bg-transparent hover:bg-cyan-500/5 transition-all flex items-center justify-center gap-1 group/btn"
                        >
                          <span>{t('dashboard.add_link')}</span>
                          <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity text-xs">+</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div >



      {/* CONTACT SETTINGS MODAL */}
      {
        contactSettingsId && (() => {
          const contact = contacts.find(c => c.id === contactSettingsId);
          if (!contact) return null;
          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setContactSettingsId(null)}>
              <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">Link Settings</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-white/70 uppercase tracking-widest font-bold">NAME</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        defaultValue={contact.name}
                        className="bg-black/20 border border-white/20 rounded px-3 py-2 text-white w-full focus:border-cyan-500 outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value;
                            const updated = contacts.map(c => c.id === contact.id ? { ...c, name: val } : c);
                            setContacts(updated);
                            localStorage.setItem('nfast_contacts', JSON.stringify(updated));
                            setContactSettingsId(null);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-white/70 uppercase tracking-widest font-bold">SECRET KEY</label>
                    <div className="flex gap-2 relative group">
                      <div className="p-3 bg-black/20 rounded border border-white/20 font-mono text-xs text-white/90 break-all w-full select-all">
                        {contact.code}
                      </div>
                      <button
                        onClick={() => copyToClipboard(contact.code)}
                        className="absolute right-2 top-2 p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white"
                      >📋</button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/20 flex justify-between items-center">
                    <button
                      onClick={() => {
                        if (confirm('Delete this trusted link?')) {
                          deleteContact(contact.id);
                          setContactSettingsId(null);
                          if (selectedContact?.id === contact.id) setSelectedContact(null);
                        }
                      }}
                      className="text-red-400 text-xs hover:text-red-300 hover:underline"
                    >Delete Link</button>

                    <button
                      onClick={() => setContactSettingsId(null)}
                      className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 text-white"
                    >Close</button>
                  </div>
                </div>
              </div>
            </div>
          )
        })()
      }

      <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { bg: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            @keyframes progress-indeterminate {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(100%); width: 50%; }
                100% { transform: translateX(200%); }
            }
            .animate-progress-indeterminate {
                animation: progress-indeterminate 2s infinite linear;
            }
        `}</style>
    </div >
  )
}

export default App
