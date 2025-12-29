export const en = {
    translation: {
        app: {
            title: "NFast",
            pro: "PRO",
            subtitle: "Secure Transfer Protocol",
            footer: {
                by: "BY NauticGames™",
                version: "v1.0.0 Stable",
                copyright: "© 2025 NauticGames™. All rights reserved."
            },
            id: "ID",
            settings_button: "App Settings & Legal"
        },
        tabs: {
            send: "Send Files",
            receive: "Receive Files"
        },
        send: {
            drop_text: "Drop files or Click",
            drop_subtext: "Secure P2P Tunnel Ready",
            drop_text_linked: "Send to {{name}}",
            drop_subtext_linked: "Secure Tunnel Active",
            linked: "LINKED: {{name}}",
            disconnect: "Disconnect",
            loading: "ESTABLISHING LINK...",
            channel_id: "SECURE CHANNEL ID",
            waiting: "Waiting for receiver to connect...",
            cancel: "Cancel",
            copy_tooltip: "Copy",
            copy_success: "✓"
        },
        receive: {
            target_coordinates: "Target Coordinates",
            placeholder: "0000-code-word-here",
            initiate: "INITIATE DOWNLOAD",
            linked_label: "Linked: {{name}}"
        },
        contacts: {
            title: "Trusted Secure Links",
            active_count: "{{count}} LINKS ACTIVE",
            add_tooltip: "Add friends from History after a transfer",
            settings_tooltip: "Settings"
        },
        dashboard: {
            live_status: "Live Status",
            system_idle: "System Idle",
            recent_uplinks: "Recent Uplinks",
            clear_history: "Clear All History",
            no_history: "No recent transfers",
            remove_history: "Remove from history",
            reveal_tooltip: "Double click to reveal code",
            add_link: "+ Add Trusted Link",
            name_peer_placeholder: "Name this peer...",
            confirm_clear: "Are you sure you want to clear all transfer history?"
        },
        status: {
            completed: "Transfer Completed Successfully! ✅",
            failed: "Transfer Failed ❌",
            connecting: "Establishing Connection...",
            step1_idle: "Ready to Connect",
            starting: "Starting download..."
        },
        logs: {
            hide: "Hide Console",
            show: "Show Console",
            header: "SYSTEM KERNEL // LOGS"
        },
        settings: {
            header: {
                main: "Settings",
                privacy: "Privacy Policy",
                terms: "Terms of Service",
                credits: "Credits",
                main_subtitle: "NFast PRO Preferences",
                legal_subtitle: "Legal & Attribution"
            },
            main: {
                general_title: "General Settings",
                coming_soon: "Configuration options coming soon",
                language: "Language",
                relay_disclaimer: "Advanced Feature: Custom Relays are for users who host their own private server or use a third-party service. NauticGames™ does not control, support, or guarantee connectivity for custom relay configurations.",
                relay_input_note: "Enter your private server address (IP:Port), e.g. 192.168.1.50:9009",
                relay_help_btn: "How does this work?",
                relay_help_text: "To use a private relay, you must host the 'croc' relay software on a server (or rent one). This provides a dedicated connection tunnel. Once running, enter that server's Public IP and Port here. If you don't have a server, leave this empty to use the free public network.",
                about_legal: "About & Legal",
                btn_privacy: "Privacy",
                btn_terms: "Terms",
                btn_credits: "Credits"
            },
            privacy: {
                last_updated: "Last Updated: December 2025",
                p1_title: "1. DATA CONTROLLER",
                p1_text: "The controller for any personal data related to NFast PRO is: Manuel Ernesto Perez Rodriguez & Ivan Manso (NauticGames™). Contact: nauticgamesstudios@gmail.com",
                p2_title: "2. DATA SOVEREIGNTY AND P2P ARCHITECTURE",
                p2_text: "NFast PRO is built on the principle of privacy by design.\n\nFile Transfer: We do NOT store, view, or process your files on any central server. Files are transferred directly between the sender and receiver (Peer-to-Peer) using PAKE (Password Authenticated Key Exchange) encryption.\n\nRelay Servers: If a direct connection is not possible, encrypted data is routed through \"Relay\" servers. These servers only see encrypted \"noise\" and do not have the technical capability to decrypt your files.",
                p3_title: "3. INFORMATION WE COLLECT",
                p3_text: "NFast PRO collects the absolute minimum amount of data required to function:\n\nLocal Data: Your contact list, transfer history, personal ID, and preferences are stored exclusively on your device (LocalStorage/JSON). If you uninstall the application, this data is permanently deleted.\n\nDiagnostic Data (Optional): We may collect anonymous error logs only if you choose to manually send them to us for technical support.",
                p4_title: "4. PAYMENT INFORMATION",
                p4_text: "We do not process or store your financial information (credit cards, bank accounts). All transactions for the NFast PRO license are processed by third-party platforms (e.g., Stripe, PayPal, App Store) under their own security and privacy policies.",
                p5_title: "5. THIRD-PARTY SHARING",
                p5_text: "We do not sell, rent, or share your personal data with advertisers or third parties.",
                p6_title: "6. CHANGES TO THIS POLICY",
                p6_text: "We reserve the right to modify this policy. Any significant changes will be notified through an application update."
            },
            terms: {
                last_updated: "Last Updated: December 2025",
                p1_title: "1. LEGAL AGREEMENT",
                p1_text: "These Terms of Service (\"Terms\") govern your access to and use of the software NFast PRO (\"Software\"), developed and operated by Manuel Ernesto Perez Rodriguez & Ivan Manso, doing business as NauticGames™ (\"Developer\", \"we\", \"us\"). By downloading, installing, or using the Software, you agree to be legally bound by these Terms.",
                p2_title: "2. GRANT OF LICENSE",
                p2_text: "We grant you a revocable, non-exclusive, non-transferable, limited license to download, install, and use the Software strictly for your personal or internal commercial use. You are strictly prohibited from: a) Reverse engineering, decompiling, or disassembling the Software. b) Renting, leasing, lending, or sublicensing the Software to third parties without prior written consent. c) Using the Software for any unlawful activity or for the transfer of illicit material.",
                p3_title: "3. INTELLECTUAL PROPERTY",
                p3_text: "The Software, including its graphic design, user interface (UI), and proprietary source code (excluding third-party libraries mentioned in the Credits), is the exclusive intellectual property of Manuel Ernesto Perez Rodriguez & Ivan Manso.\n\nThird-Party Components: This Software utilizes the croc core protocol (MIT License) and other open-source libraries. Their respective licenses and attributions are available in the \"Credits\" section of the Software.",
                p4_title: "4. DISCLAIMER OF WARRANTIES",
                p4_text: "THE SOFTWARE IS PROVIDED \"AS IS\" AND \"AS AVAILABLE\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT: A) THE SOFTWARE WILL BE ERROR-FREE OR OPERATE WITHOUT INTERRUPTION. B) THE SOFTWARE IS COMPATIBLE WITH ALL HARDWARE OR OPERATING SYSTEMS. C) DATA TRANSFERRED IS COMPLETELY SECURE FROM SOPHISTICATED THIRD-PARTY ATTACKS, DESPITE THE USE OF PAKE ENCRYPTION.",
                p5_title: "5. LIMITATION OF LIABILITY",
                p5_text: "TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL MANUEL ERNESTO PEREZ RODRIGUEZ & IVAN MANSO OR NAUTICGAMES™ BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO: LOSS OF DATA, LOSS OF REVENUE, BUSINESS INTERRUPTION, OR COMPUTER FAILURE, ARISING OUT OF THE USE OR INABILITY TO USE THE SOFTWARE.",
                p6_title: "6. P2P NATURE AND RELAYS",
                p6_text: "You acknowledge that NFast PRO uses a Peer-to-Peer architecture. Transfer speeds and stability depend on your and the receiver's internet connection. The Software may utilize \"Relay\" servers (public or private) to establish connections. While content is End-to-End Encrypted (E2EE), connection metadata (IP addresses) may be visible to the Relay server to facilitate the handshake.\n\nCustom Relays are strictly for advanced users utilizing self-hosted or third-party infrastructure. NauticGames™ is not responsible for the performance, security, or availability of any custom relay address entered. We do not provide technical support for connection issues arising from the use of custom relays.",
                p7_title: "7. REFUNDS",
                p7_text: "As a downloadable digital software product, all sales are final, unless otherwise specified by the distribution platform's (e.g., Steam, Microsoft Store, App Store) consumer protection policies."
            },
            credits: {
                powered: "Powered by croc",
                powered_sub: "High-performance secure file transfer",
                core_protocol: "Core protocol by",
                frontend: "Frontend Stack",
                backend: "Backend Core",
                dev_by: "Designed & Developed by"
            }
        }
    }
};
