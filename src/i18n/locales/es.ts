export const es = {
    translation: {
        app: {
            title: "NFast",
            pro: "PRO",
            subtitle: "Protocolo de Transferencia Seguro",
            footer: {
                by: "POR NauticGames™",
                version: "v1.0.1 Estable",
                copyright: "© 2025 NauticGames™. Todos los derechos reservados."
            },
            id: "ID",
            settings_button: "Ajustes de App y Legal"
        },
        tabs: {
            send: "Enviar Archivos",
            receive: "Recibir Archivos"
        },
        send: {
            drop_text: "Arrastra archivos o Clic",
            drop_subtext: "Túnel P2P Seguro Listo",
            drop_text_linked: "Enviar a {{name}}",
            drop_subtext_linked: "Túnel Seguro Activo",
            linked: "VINCULADO: {{name}}",
            disconnect: "Desconectar",
            loading: "ESTABLECIENDO ENLACE...",
            channel_id: "ID DE CANAL SEGURO",
            waiting: "Esperando conexión del receptor...",
            cancel: "Cancelar",
            copy_tooltip: "Copiar",
            copy_success: "✓"
        },
        receive: {
            target_coordinates: "Coordenadas de Destino",
            placeholder: "0000-palabra-codigo",
            initiate: "INICIAR DESCARGA",
            linked_label: "Vinculado: {{name}}"
        },
        contacts: {
            title: "Enlaces Seguros Confiables",
            active_count: "{{count}} ENLACES ACTIVOS",
            add_tooltip: "Añadir amigos del Historial tras una transferencia",
            settings_tooltip: "Ajustes"
        },
        dashboard: {
            live_status: "Estado en Vivo",
            system_idle: "Sistema Inactivo",
            recent_uplinks: "Transferencias Recientes",
            clear_history: "Borrar Historial",
            no_history: "Sin transferencias recientes",
            remove_history: "Eliminar del historial",
            reveal_tooltip: "Doble clic para revelar código",
            add_link: "+ Añadir Enlace Seguro",
            name_peer_placeholder: "Nombrar este par...",
            confirm_clear: "¿Estás seguro de que quieres borrar todo el historial?"
        },
        status: {
            completed: "¡Transferencia Completada! ✅",
            failed: "Transferencia Fallida ❌",
            connecting: "Estableciendo Conexión...",
            step1_idle: "Listo para Conectar",
            starting: "Iniciando descarga..."
        },
        logs: {
            hide: "Ocultar Consola",
            show: "Mostrar Consola",
            header: "NÚCLEO DEL SISTEMA // LOGS"
        },
        settings: {
            header: {
                main: "Ajustes",
                privacy: "Política de Privacidad",
                terms: "Términos de Servicio",
                credits: "Créditos",
                main_subtitle: "Preferencias NFast PRO",
                legal_subtitle: "Legal y Atribución"
            },
            main: {
                general_title: "Ajustes Generales",
                coming_soon: "Opciones de configuración pronto",
                language: "Idioma",
                relay_disclaimer: "Función Avanzada: Los Relays personalizados son para usuarios que alojan su propio servidor o usan un servicio de terceros. NauticGames™ no controla, soporta ni garantiza la conectividad de configuraciones personalizadas.",
                relay_input_note: "Introduce la dirección de tu servidor privado (IP:Puerto), ej. 192.168.1.50:9009",
                relay_help_btn: "¿Cómo funciona esto?",
                relay_help_text: "Para usar un relay privado, debes alojar el software 'croc' en un servidor (o alquilar uno). Esto proporciona un túnel de conexión dedicado. Una vez activo, introduce aquí la IP Pública y el Puerto de ese servidor. Si no tienes un servidor, deja esto vacío para usar la red pública gratuita.",
                about_legal: "Sobre y Legal",
                btn_privacy: "Privacidad",
                btn_terms: "Términos",
                btn_credits: "Créditos"
            },
            privacy: {
                last_updated: "Última Actualización: Diciembre 2025",
                p1_title: "1. RESPONSABLE DE DATOS",
                p1_text: "El responsable de cualquier dato personal relacionado con NFast PRO es: Manuel Ernesto Pérez Rodríguez e Ivan Manso (NauticGames™). Contacto: nauticgamesstudios@gmail.com",
                p2_title: "2. SOBERANÍA DE DATOS Y ARQUITECTURA P2P",
                p2_text: "NFast PRO se basa en el principio de privacidad por diseño.\n\nTransferencia de Archivos: NO almacenamos, vemos ni procesamos sus archivos en ningún servidor central. Los archivos se transfieren directamente entre el remitente y el receptor (Peer-to-Peer) utilizando encriptación PAKE (Intercambio de Claves Autenticado por Contraseña).\n\nServidores Relay: Si no es posible una conexión directa, los datos encriptados se enrutan a través de servidores \"Relay\". Estos servidores solo ven \"ruido\" encriptado y no tienen la capacidad técnica para desencriptar sus archivos.",
                p3_title: "3. INFORMACIÓN QUE RECOPILAMOS",
                p3_text: "NFast PRO recopila la cantidad mínima absoluta de datos requeridos para funcionar:\n\nDatos Locales: Su lista de contactos, historial de transferencias, ID personal y preferencias se almacenan exclusivamente en su dispositivo (LocalStorage/JSON). Si desinstala la aplicación, estos datos se eliminan permanentemente.\n\nDatos de Diagnóstico (Opcional): Podemos recopilar registros de errores anónimos solo si elige enviárnoslos manualmente para soporte técnico.",
                p4_title: "4. INFORMACIÓN DE PAGO",
                p4_text: "No procesamos ni almacenamos su información financiera (tarjetas de crédito, cuentas bancarias). Todas las transacciones para la licencia de NFast PRO son procesadas por plataformas de terceros (p. ej., Stripe, PayPal, App Store) bajo sus propias políticas de seguridad y privacidad.",
                p5_title: "5. COMPARTIR CON TERCEROS",
                p5_text: "No vendemos, alquilamos ni compartimos sus datos personales con anunciantes o terceros.",
                p6_title: "6. CAMBIOS EN ESTA POLÍTICA",
                p6_text: "Nos reservamos el derecho de modificar esta política. Cualquier cambio significativo se notificará a través de una actualización de la aplicación."
            },
            terms: {
                last_updated: "Última Actualización: Diciembre 2025",
                p1_title: "1. ACUERDO LEGAL",
                p1_text: "Estos Términos de Servicio (\"Términos\") rigen su acceso y uso del software NFast PRO (\"Software\"), desarrollado y operado por Manuel Ernesto Pérez Rodríguez e Ivan Manso, operando comercialmente como NauticGames™ (\"Desarrollador\", \"nosotros\", \"nos\"). Al descargar, instalar o utilizar el Software, usted acepta estar legalmente obligado por estos Términos.",
                p2_title: "2. CONCESIÓN DE LICENCIA",
                p2_text: "Le otorgamos una licencia revocable, no exclusiva, intransferible y limitada para descargar, instalar y utilizar el Software estrictamente para su uso personal o comercial interno. Está estrictamente prohibido: a) Realizar ingeniería inversa, descompilar o desensamblar el Software. b) Alquilar, arrendar, prestar o sublicenciar el Software a terceros sin consentimiento previo por escrito. c) Utilizar el Software para cualquier actividad ilegal o para la transferencia de material ilícito.",
                p3_title: "3. PROPIEDAD INTELECTUAL",
                p3_text: "El Software, incluido su diseño gráfico, interfaz de usuario (UI) y código fuente propietario (excluyendo bibliotecas de terceros mencionadas en los Créditos), es propiedad intelectual exclusiva de Manuel Ernesto Pérez Rodríguez e Ivan Manso.\n\nComponentes de Terceros: Este Software utiliza el protocolo central croc (Licencia MIT) y otras bibliotecas de código abierto. Sus respectivas licencias y atribuciones están disponibles en la sección \"Créditos\" del Software.",
                p4_title: "4. RENUNCIA DE GARANTÍAS",
                p4_text: "EL SOFTWARE SE PROPORCIONA \"TAL CUAL\" Y \"SEGÚN DISPONIBILIDAD\", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O IMPLÍCITA. NO GARANTIZAMOS QUE: A) EL SOFTWARE ESTÉ LIBRE DE ERRORES U OPERE SIN INTERRUPCIONES. B) EL SOFTWARE SEA COMPATIBLE CON TODO EL HARDWARE O SISTEMAS OPERATIVOS. C) LOS DATOS TRANSFERIDOS ESTÉN COMPLETAMENTE SEGUROS DE ATAQUES SOFISTICADOS DE TERCEROS, A PESAR DEL USO DE ENCRIPTACIÓN PAKE.",
                p5_title: "5. LIMITACIÓN DE RESPONSABILIDAD",
                p5_text: "EN LA MEDIDA MÁXIMA PERMITIDA POR LA LEY APLICABLE, EN NINGÚN CASO MANUEL ERNESTO PÉREZ RODRÍGUEZ E IVAN MANSO O NAUTICGAMES™ SERÁN RESPONSABLES DE NINGÚN DAÑO INDIRECTO, INCIDENTAL, ESPECIAL, CONSECUENTE O PUNITIVO, INCLUYENDO PERO NO LIMITADO A: PÉRDIDA DE DATOS, PÉRDIDA DE INGRESOS, INTERRUPCIÓN DEL NEGOCIO O FALLO INFORMÁTICO, QUE SURJA DEL USO O LA IMPOSIBILIDAD DE USO DEL SOFTWARE.",
                p6_title: "6. NATURALEZA P2P Y RELAYS",
                p6_text: "Usted reconoce que NFast PRO utiliza una arquitectura Peer-to-Peer. Las velocidades de transferencia y la estabilidad dependen de su conexión a Internet y la del receptor. El Software puede utilizar servidores \"Relay\" (públicos o privados) para establecer conexiones. Si bien el contenido está Encriptado de Extremo a Extremo (E2EE), los metadatos de conexión (direcciones IP) pueden ser visibles para el servidor Relay para facilitar el apretón de manos.\n\nLos Relays personalizados son estrictamente para usuarios avanzados que utilizan infraestructura propia o de terceros. NauticGames™ no es responsable del rendimiento, seguridad o disponibilidad de ninguna dirección de relay personalizada introducida. No proporcionamos soporte técnico para problemas de conexión derivados del uso de relays personalizados.",
                p7_title: "7. REEMBOLSOS",
                p7_text: "Como producto de software digital descargable, todas las ventas son finales, a menos que se especifique lo contrario en las políticas de protección al consumidor de la plataforma de distribución (p. ej., Steam, Microsoft Store, App Store)."
            },
            credits: {
                powered: "Impulsado por croc",
                powered_sub: "Transferencia de archivos segura de alto rendimiento",
                core_protocol: "Protocolo central por",
                frontend: "Pila Frontend",
                backend: "Núcleo Backend",
                dev_by: "Diseñado y Desarrollado por"
            }
        }
    }
};
