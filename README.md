<div align="center">

<img src="./src/assets/NFastIcon.png" alt="NFast Logo" width="128" height="128" />

# ⚡ NFast PRO

### Secure Peer-to-Peer File Transfer Protocol

[![Version](https://img.shields.io/badge/version-1.0.1-cyan.svg)](https://github.com/xBeastxx/NFast/releases)
[![Platform](https://img.shields.io/badge/platform-Windows-blue.svg)](https://github.com/xBeastxx/NFast)
[![License](https://img.shields.io/badge/license-Proprietary-purple.svg)](./LICENSE)
[![Electron](https://img.shields.io/badge/Electron-30+-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Croc](https://img.shields.io/badge/Powered%20by-Croc%20🐊-green.svg)](https://github.com/schollz/croc)

**Ultra-fast, end-to-end encrypted file transfers. No servers. No limits. No compromises.**

[Download](#-installation) • [Features](#-features) • [Quick Start](#-quick-start) • [How It Works](#-how-it-works) • [FAQ](#-faq)

---

</div>

## 🚀 What is NFast?

**NFast PRO** is a premium desktop application for secure, high-speed file transfers using peer-to-peer (P2P) technology. Built on the battle-tested [croc](https://github.com/schollz/croc) protocol, NFast provides military-grade encryption with a stunning modern interface.

Unlike cloud-based services (WeTransfer, Google Drive), your files **never touch any server**. They travel directly from your device to the recipient, encrypted with PAKE (Password Authenticated Key Exchange) cryptography.

<div align="center">

![NFast Screenshot](https://via.placeholder.com/800x500/0a0a1a/00d4ff?text=NFast+PRO+Interface)

*Modern, intuitive interface with real-time transfer monitoring*

</div>

---

## ✨ Features

### 🔐 **Military-Grade Security**

| Feature | Description |
|---------|-------------|
| **End-to-End Encryption** | PAKE (Password Authenticated Key Exchange) ensures only sender and receiver can access files |
| **Zero Knowledge** | No servers, no logs, no metadata collection |
| **Direct P2P Transfer** | Files travel directly between devices - nothing stored in the cloud |
| **Encrypted Relay Fallback** | If direct connection fails, encrypted data routes through relay (unreadable to relay) |

### ⚡ **Blazing Fast Transfers**

- **No File Size Limits** — Transfer gigabytes without restrictions
- **Multi-Connection Architecture** — Utilizes your full bandwidth
- **Resume Interrupted Transfers** — Pick up where you left off
- **Real-Time Progress** — Live speed, ETA, and percentage tracking

### 🎨 **Premium User Experience**

- **Drag & Drop Interface** — Simply drop files to send
- **One-Click Code Sharing** — WhatsApp, Telegram, Discord integration
- **Trusted Links System** — Save contacts for instant future transfers
- **Live Transfer Dashboard** — Monitor all transfers in real-time
- **Transfer History** — Track past uploads with privacy obfuscation
- **Multi-Language Support** — English & Spanish built-in

### 🔧 **Advanced Features**

- **Custom Relay Servers** — Use your own private relay for corporate networks
- **Stealth/Tunnel Mode** — Auto-connect with trusted contacts
- **Console View** — Raw logs for power users
- **Auto-Updates** — Always stay on the latest version

---

## 📦 Installation

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **OS** | Windows 10 (64-bit) | Windows 11 |
| **RAM** | 2 GB | 4 GB+ |
| **Storage** | 100 MB | 200 MB |
| **Network** | Any internet connection | Stable broadband |

### Download & Install

1. **Download the latest release:**

   [![Download for Windows](https://img.shields.io/badge/Download-Windows%20Installer-cyan?style=for-the-badge&logo=windows)](https://github.com/xBeastxx/NFast/releases/latest)

2. **Run the installer** (`NFast PRO Setup x.x.x.exe`)

3. **Follow the installation wizard**
   - Accept the license agreement (EULA)
   - Choose installation directory
   - Create desktop shortcut

4. **Launch NFast PRO** from your Start Menu or Desktop

---

## 🚀 Quick Start

### Sending Files

1. **Launch NFast PRO**
2. **Drag files** onto the drop zone (or click to browse)
3. **Share the generated code** with the recipient via:
   - 📋 Copy to clipboard
   - 💬 WhatsApp
   - ✈️ Telegram
   - 🎮 Discord
4. **Wait for connection** — transfer starts automatically when recipient enters code

### Receiving Files

1. **Switch to "Receive Files" tab**
2. **Enter the code** shared by the sender
3. **Click "INITIATE DOWNLOAD"**
4. **Files save to your Downloads folder** automatically

### Using Trusted Links

For frequent contacts, save them as **Trusted Links**:

1. After a successful transfer, click **"+ Add Trusted Link"** in the history
2. Name the contact
3. Next time, simply **click their avatar** to auto-fill codes for instant transfers

---

## 🔧 How It Works

```
┌──────────────┐                                    ┌──────────────┐
│    SENDER    │                                    │   RECEIVER   │
│              │                                    │              │
│  Drop Files  │                                    │  Enter Code  │
│      ↓       │                                    │      ↓       │
│  Generate    │──── Secure Code (PAKE) ──────────▶│   Connect    │
│  Unique Code │                                    │              │
│      ↓       │◀═══════════════════════════════════│      ↓       │
│              │     Direct P2P Connection          │              │
│  Transfer    │     (End-to-End Encrypted)         │   Receive    │
│   Files      │═══════════════════════════════════▶│    Files     │
└──────────────┘                                    └──────────────┘
```

### The Croc Protocol

NFast uses the **croc** protocol, which provides:

1. **PAKE Key Exchange** — Generates shared encryption key from a simple code phrase
2. **Automatic NAT Traversal** — Works behind firewalls and routers
3. **Relay Fallback** — If direct P2P fails, uses encrypted relay (relay cannot decrypt)
4. **Data Integrity** — SHA256 hash verification ensures files arrive intact

---

## ⚙️ Configuration

### Custom Relay Server

For enterprise use or enhanced privacy, you can use your own relay:

1. **Host a croc relay** on your server:
   ```bash
   croc relay --ports 9009,9010-9013
   ```

2. **In NFast**, go to **Settings** → **Custom Relay Address**

3. **Enter your server address**: `your.server.ip:9009`

> ⚠️ **Note**: NauticGames™ does not provide support for custom relay configurations.

### Language Settings

Switch between **English** and **Spanish** in **Settings** → **Language**

---

## 🔄 Auto-Updates

NFast PRO includes automatic updates from GitHub Releases:

1. On launch, the app checks for new versions
2. If available, you'll be notified
3. Updates download and install automatically on next restart

### Manual Update

Download the latest version from our [Releases Page](https://github.com/xBeastxx/NFast/releases).

---

## ❓ FAQ

<details>
<summary><b>Is NFast truly private?</b></summary>

**Yes.** NFast operates on a zero-knowledge architecture:
- Files are **never uploaded to any server**
- All transfers are **end-to-end encrypted**
- We collect **no logs, metadata, or analytics**
- Your data stays **only on your device** (LocalStorage)

</details>

<details>
<summary><b>What's the maximum file size?</b></summary>

**Unlimited.** NFast has no file size restrictions. Transfer 1KB or 100GB — it's all P2P.

</details>

<details>
<summary><b>Does the recipient need NFast installed?</b></summary>

**For the best experience, yes.** However, technically they could use the raw `croc` CLI if they know the protocol. NFast just makes it beautiful and easy.

</details>

<details>
<summary><b>What happens if my connection drops?</b></summary>

The transfer will pause. When you reconnect and retry with the same code, the transfer **resumes from where it left off** (if the sender is still online).

</details>

<details>
<summary><b>Can I use NFast for commercial purposes?</b></summary>

NFast PRO is licensed for personal and internal commercial use. See our [Terms of Service](./eula.txt) for full details.

</details>

<details>
<summary><b>Why does Windows Defender flag the installer?</b></summary>

This is a **false positive** common with unsigned Electron apps. NFast is safe. You can:
1. Click "More info" → "Run anyway"
2. Or submit the file to [VirusTotal](https://www.virustotal.com) for verification

</details>

---

## 💻 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Electron 30+ |
| **Frontend** | React 18 + TypeScript |
| **Styling** | Tailwind CSS |
| **Build Tool** | Vite |
| **Core Protocol** | Croc (Go binary) |
| **i18n** | i18next |
| **Installer** | electron-builder (NSIS) |

---

## 🛡️ Security & Privacy

### What We DON'T Collect

- ❌ File contents
- ❌ File names
- ❌ Transfer codes
- ❌ IP addresses
- ❌ Usage analytics
- ❌ Any personal data

### What Stays on YOUR Device

- ✅ Contact list (LocalStorage)
- ✅ Transfer history (LocalStorage)
- ✅ Device ID (locally generated)
- ✅ App preferences

**Uninstalling NFast deletes all local data permanently.**

---

## 📜 Legal

### License

NFast PRO is proprietary software. Copyright © 2025 **Manuel Ernesto Perez Rodriguez** (NauticGames™).

See [LICENSE / EULA](./eula.txt) for terms.

### Third-Party Attribution

NFast is powered by **croc**, an open-source file transfer tool by [schollz](https://github.com/schollz/croc), licensed under MIT.

Additional open-source components:
- React (MIT)
- Electron (MIT)
- Tailwind CSS (MIT)
- i18next (MIT)

---

## 🤝 Support & Contact

### Community

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/xBeastxx/NFast/issues)
- 💬 **Discord:** [Join our server](https://discord.gg/nauticgames)

### Contact

- 📧 **Email:** nauticgamesstudios@gmail.com
- 🌐 **Website:** [nauticgames.com](https://nauticgames.com)

---

## 🗺️ Roadmap

### ✅ v1.0.1 (Current)
- Secure P2P file transfer
- Trusted Links system
- Multi-language support
- Auto-updates

### 🔜 v1.1.0 (Planned)
- [ ] Folder transfer support
- [ ] Transfer queue
- [ ] Dark/Light theme toggle
- [ ] Sound notifications

### 🔮 Future
- [ ] macOS & Linux builds
- [ ] Mobile companion app
- [ ] QR code pairing
- [ ] LAN discovery mode

---

<div align="center">

## ⭐ Star this repo if NFast helped you!

---

**Made with ❤️ by NauticGames™**

[![GitHub](https://img.shields.io/badge/GitHub-xBeastxx-181717?logo=github)](https://github.com/xBeastxx)
[![Discord](https://img.shields.io/badge/Discord-Join%20Us-5865F2?logo=discord&logoColor=white)](https://discord.gg/nauticgames)

*NFast PRO — Because your files deserve better.*

</div>
