import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';
import { app, BrowserWindow } from 'electron';

export class CrocHandler {
    private crocPath: string;
    private currentProcess: any | null = null; // Use any to bypass strict spawn type mismatch
    private mainWindow: BrowserWindow | null = null;
    private outputBuffer: string = '';

    private isKilledManually: boolean = false;
    private codeDetected: boolean = false; // Guard against multiple events

    constructor(window: BrowserWindow) {
        this.mainWindow = window;
        const isDev = !app.isPackaged;
        this.crocPath = isDev
            ? path.join(process.cwd(), 'resources', 'croc.exe')
            : path.join(process.resourcesPath, 'croc.exe');

        this.mainWindow?.webContents.send('croc-log', `Croc Binary Path: ${this.crocPath}`);
    }

    public sendFile(files: string[], code?: string, relayAddress?: string) {
        if (this.currentProcess) {
            this.mainWindow?.webContents.send('croc-log', 'Process already running');
            return;
        }

        const args = ['send'];
        if (code) {
            args.push('--code', code);
        }
        if (relayAddress) {
            args.push('--relay', relayAddress);
        }
        args.push(...files);

        this.mainWindow?.webContents.send('croc-log', `>>> EXECUTING: croc ${args.join(' ')}`);
        this.spawnCroc(args, 'send');
    }

    public receiveFile(code: string, relayAddress?: string) {
        if (this.currentProcess) {
            this.kill();
        }
        const args = ['--yes', code];
        if (relayAddress) {
            args.push('--relay', relayAddress);
        }
        this.mainWindow?.webContents.send('croc-log', `>>> EXECUTING: croc receive ${code} ${relayAddress ? `(Relay: ${relayAddress})` : ''}`);
        this.spawnCroc(args, 'receive');
    }

    public kill() {
        if (this.currentProcess) {
            this.isKilledManually = true;
            this.currentProcess.kill();
            this.currentProcess = null;
            this.mainWindow?.webContents.send('croc-log', `Process killed.`);
            // No need to send 'croc-finished' here, the frontend handles its own reset synchronously
            // or the close handler will fire with the flag set
        }
    }

    private spawnCroc(args: string[], mode: 'send' | 'receive') {
        try {
            this.isKilledManually = false;
            this.codeDetected = false; // Reset code detection state
            console.log(`[CrocHandler] Spawning: ${this.crocPath} ${args.join(' ')}`);
            this.outputBuffer = '';

            const downloadPath = app.getPath('downloads');
            this.currentProcess = spawn(this.crocPath, args, {
                cwd: downloadPath, // Ensure files are saved to Downloads
                stdio: ['ignore', 'pipe', 'pipe'], // Close stdin immediately
                windowsHide: true
            });

            const pid = this.currentProcess.pid;
            this.mainWindow?.webContents.send('croc-log', `Process spawned (PID: ${pid})`);

            // NO MORE TIMEOUT - Let croc run normally

            this.currentProcess.on('error', (err) => {
                const msg = `!!! SPAWN ERROR: ${err.message}`;
                console.error(msg);
                this.mainWindow?.webContents.send('croc-log', msg);
                this.mainWindow?.webContents.send('croc-code-generated', 'ERROR: Cannot start croc');
            });

            this.currentProcess.stdout.on('data', (data) => {
                const output = data.toString();
                this.outputBuffer += output;
                console.log(`[STDOUT CHUNK] ${output}`);
                this.mainWindow?.webContents.send('croc-log', `[OUT] ${output}`);
                this.tryParseCode(output, mode);
            });

            this.currentProcess.stderr.on('data', (data) => {
                const output = data.toString();
                this.outputBuffer += output;
                console.error(`[STDERR CHUNK] ${output}`);
                this.mainWindow?.webContents.send('croc-log', `[ERR] ${output}`);
                this.tryParseCode(output, mode);
            });

            this.currentProcess.on('close', (code) => {
                const msg = `Process exited (code: ${code})${this.isKilledManually ? ' [MANUAL KILL]' : ''}`;
                console.log(msg);
                this.mainWindow?.webContents.send('croc-log', msg);

                // Parse full buffer on exit
                console.log('[FULL BUFFER]', this.outputBuffer);
                this.mainWindow?.webContents.send('croc-log', `[FULL OUTPUT] ${this.outputBuffer}`);
                this.tryParseCode(this.outputBuffer, mode);

                if (this.isKilledManually) {
                    // Send -1 to indicate manual cancellation
                    this.mainWindow?.webContents.send('croc-finished', -1);
                } else {
                    this.mainWindow?.webContents.send('croc-finished', code || 0);
                }

                this.currentProcess = null;
            });

        } catch (e: any) {
            const msg = `!!! EXCEPTION: ${e.message}`;
            console.error(msg);
            this.mainWindow?.webContents.send('croc-log', msg);
            this.mainWindow?.webContents.send('croc-code-generated', 'ERROR');
        }
    }

    private tryParseCode(output: string, mode: 'send' | 'receive') {
        if (mode !== 'send') return;
        if (this.codeDetected) return; // Already detected, don't emit again

        // Try "Code is: xxxx-xxxx-xxxx"
        let match = output.match(/Code is:\s*([^\s\n]+)/);
        if (!match) {
            // Try just the pattern
            match = output.match(/(\d+-[a-z]+-[a-z]+(-[a-z]+)*)/);
        }

        if (match) {
            const code = match[1];
            console.log(`[CODE DETECTED] ${code}`);
            this.codeDetected = true; // Mark as detected
            this.mainWindow?.webContents.send('croc-code-generated', code);
        }
    }
}
