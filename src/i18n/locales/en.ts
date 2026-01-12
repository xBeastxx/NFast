export const en = {
    translation: {
        app: {
            title: "NFast",
            pro: "PRO",
            subtitle: "Secure Transfer Protocol",
            footer: {
                by: "BY NauticGames™",
                version: "v1.0.1 Stable",
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
                main_subtitle: "NFast Preferences",
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
                p1_text: "The controllers for any personal data related to NFast are: Manuel P. Rodriguez & Ivan Manso (NauticGames™). Contact: nauticgamesstudios@gmail.com",
                p2_title: "2. DATA SOVEREIGNTY AND P2P ARCHITECTURE",
                p2_text: "NFast is built on the principle of privacy by design.\n\nFile Transfer: We do NOT store, view, or process your files on any central server. Files are transferred directly between the sender and receiver (Peer-to-Peer) using PAKE (Password Authenticated Key Exchange) encryption.\n\nRelay Servers: If a direct connection is not possible, encrypted data is routed through \"Relay\" servers. These servers only see encrypted \"noise\" and do not have the technical capability to decrypt your files.",
                p3_title: "3. INFORMATION WE COLLECT",
                p3_text: "NFast collects the absolute minimum amount of data required to function:\n\nLocal Data: Your contact list, transfer history, personal ID, and preferences are stored exclusively on your device (LocalStorage/JSON). If you uninstall the application, this data is permanently deleted.\n\nDiagnostic Data (Optional): We may collect anonymous error logs only if you choose to manually send them to us for technical support.",
                p4_title: "4. THIRD-PARTY SHARING",
                p4_text: "We do not sell, rent, or share your personal data with advertisers or third parties.",
                p5_title: "5. CHANGES TO THIS POLICY",
                p5_text: "We reserve the right to modify this policy. Any significant changes will be notified through an application update.",

            },
            terms: {
                last_updated: "Last Updated: December 2025",
                p1_title: "1. LEGAL AGREEMENT",
                p1_text: "These Terms of Service (\"Terms\") govern your access to and use of the software NFast (\"Software\"), developed and operated by Manuel P. Rodriguez & Ivan Manso, doing business as NauticGames™ (\"Developers\", \"we\", \"us\"). By downloading, installing, or using the Software, you agree to be legally bound by these Terms.",
                p2_title: "2. GRANT OF LICENSE (LICENSED, NOT SOLD)",
                p2_text: "The Software is licensed, not sold, to you. We grant you a revocable, non-exclusive, non-transferable, limited license to use the Software solely for personal or internal purposes. You strictly agree NOT to: a) Repackage, redistribute, sell, or sub-license the Software or any modified version of it. b) Reverse engineer, decompile, or disassemble the Software. c) Use the Software for any unlawful purpose.",
                p3_title: "3. INDEMNIFICATION (IMPORTANT)",
                p3_text: "You agree to indemnify, defend, and hold harmless NauticGames™ and its developers from any and all claims, liabilities, damages, losses, or expenses (including legal fees) arising from your use or misuse of the Software, violation of these Terms, or infringement of any third-party rights. If you use this tool for illegal activities, you bear sole responsibility.",
                p4_title: "4. HIGH RISK ACTIVITIES",
                p4_text: "The Software is not fault-tolerant and is not designed or intended for use in hazardous environments requiring fail-safe performance, such as nuclear facilities, aircraft navigation, or life support systems. We expressly disclaim any express or implied warranty of fitness for High Risk Activities.",
                p5_title: "5. INTELLECTUAL PROPERTY",
                p5_text: "All rights, title, and interest in the Software (UI, design, proprietary code) remain exclusively with Manuel P. Rodriguez & Ivan Manso. This Agreement does not grant you any ownership rights.",
                p6_title: "6. DISCLAIMER OF WARRANTIES",
                p6_text: "THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. WE DO NOT GUARANTEE THE SOFTWARE WILL BE ERROR-FREE OR SECURE.",
                p7_title: "7. LIMITATION OF LIABILITY",
                p7_text: "IN NO EVENT SHALL MANUEL P.R, IVAN MANSO OR NAUTICGAMES™ BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES (INCLUDING LOSS OF DATA OR PROFIT) ARISING OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
                p8_title: "8. TERMINATION",
                p8_text: "We reserve the right to terminate this license at any time, for any reason, without notice. Upon termination, you must cease all use and destroy all copies of the Software.",
                p9_title: "9. P2P NATURE",
                p9_text: "NFast uses a Peer-to-Peer architecture. You acknowledge that transfer risks depend on your network environment. Connection metadata may be visible to relay servers if direct connection fails.",

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
