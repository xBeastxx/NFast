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
                main_subtitle: "Preferencias NFast",
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
                btn_credits: "Créditos",
                btn_donate: "Donar"
            },
            privacy: {
                last_updated: "Última Actualización: Diciembre 2025",
                p1_title: "1. RESPONSABLES DE DATOS",
                p1_text: "Los responsables de cualquier dato personal relacionado con NFast son: Manuel P. Rodríguez e Iván Manso (NauticGames™). Contacto: nauticgamesstudios@gmail.com",
                p2_title: "2. SOBERANÍA DE DATOS Y ARQUITECTURA P2P",
                p2_text: "NFast se basa en el principio de privacidad por diseño.\n\nTransferencia de Archivos: NO almacenamos, vemos ni procesamos sus archivos en ningún servidor central. Los archivos se transfieren directamente entre el remitente y el receptor (Peer-to-Peer) utilizando encriptación PAKE (Intercambio de Claves Autenticado por Contraseña).\n\nServidores Relay: Si no es posible una conexión directa, los datos encriptados se enrutan a través de servidores \"Relay\". Estos servidores solo ven \"ruido\" encriptado y no tienen la capacidad técnica para desencriptar sus archivos.",
                p3_title: "3. INFORMACIÓN QUE RECOPILAMOS",
                p3_text: "NFast recopila la cantidad mínima absoluta de datos requeridos para funcionar:\n\nDatos Locales: Su lista de contactos, historial de transferencias, ID personal y preferencias se almacenan exclusivamente en su dispositivo (LocalStorage/JSON). Si desinstala la aplicación, estos datos se eliminan permanentemente.\n\nDatos de Diagnóstico (Opcional): Podemos recopilar registros de errores anónimos solo si elige enviárnoslos manualmente para soporte técnico.",
                p4_title: "4. COMPARTIR CON TERCEROS",
                p4_text: "No vendemos, alquilamos ni compartimos sus datos personales con anunciantes o terceros.",
                p5_title: "5. CAMBIOS EN ESTA POLÍTICA",
                p5_text: "Nos reservamos el derecho de modificar esta política. Cualquier cambio significativo se notificará a través de una actualización de la aplicación.",

            },
            terms: {
                last_updated: "Última Actualización: Diciembre 2025",
                p1_title: "1. ACUERDO LEGAL",
                p1_text: "Estos Términos de Servicio (\"Términos\") rigen su acceso y uso del software NFast (\"Software\"), desarrollado y operado por Manuel P. Rodríguez e Iván Manso, operando comercialmente como NauticGames™ (\"Desarrolladores\", \"nosotros\", \"nos\"). Al descargar, instalar o utilizar el Software, usted acepta estar legalmente obligado por estos Términos.",
                p2_title: "2. CONCESIÓN DE LICENCIA (LICENCIADO, NO VENDIDO)",
                p2_text: "El Software se licencia, no se vende. Le otorgamos una licencia revocable, no exclusiva, intransferible y limitada para usar el Software únicamente para fines personales o internos. Usted acepta estrictamente NO: a) Reempaquetar, redistribuir, vender o sublicenciar el Software o cualquier versión modificada del mismo. b) Realizar ingeniería inversa, descompilar o desensamblar el Software. c) Usar el Software para cualquier propósito ilegal.",
                p3_title: "3. INDEMNIZACIÓN (IMPORTANTE)",
                p3_text: "Usted acepta indemnizar, defender y eximir de responsabilidad a NauticGames™ y sus desarrolladores de cualquier reclamo, responsabilidad, daño, pérdida o gasto (incluidos los honorarios legales) que surjan de su uso o mal uso del Software, violación de estos Términos o infracción de derechos de terceros. Si usa esta herramienta para actividades ilegales, usted asume toda la responsabilidad.",
                p4_title: "4. ACTIVIDADES DE ALTO RIESGO",
                p4_text: "El Software no es tolerante a fallos y no está diseñado ni destinado para su uso en entornos peligrosos que requieran un rendimiento a prueba de fallos, como instalaciones nucleares, navegación aérea o sistemas de soporte vital. Renunciamos expresamente a cualquier garantía de idoneidad para Actividades de Alto Riesgo.",
                p5_title: "5. PROPIEDAD INTELECTUAL",
                p5_text: "Todos los derechos, títulos e intereses sobre el Software (UI, diseño, código propietario) permanecen exclusivamente con Manuel P. Rodríguez e Iván Manso. Este Acuerdo no le otorga ningún derecho de propiedad.",
                p6_title: "6. RENUNCIA DE GARANTÍAS",
                p6_text: "EL SOFTWARE SE PROPORCIONA \"TAL CUAL\", SIN GARANTÍA DE NINGÚN TIPO. RENUNCIAMOS A TODAS LAS GARANTÍAS, EXPRESAS O IMPLÍCITAS, INCLUYENDO COMERCIABILIDAD E IDONEIDAD PARA UN PROPÓSITO PARTICULAR. NO GARANTIZAMOS QUE EL SOFTWARE ESTÉ LIBRE DE ERRORES O SEA SEGURO.",
                p7_title: "7. LIMITACIÓN DE RESPONSABILIDAD",
                p7_text: "EN NINGÚN CASO MANUEL P.R, IVÁN MANSO O NAUTICGAMES™ SERÁN RESPONSABLES DE NINGÚN DAÑO INDIRECTO, ESPECIAL, INCIDENTAL O CONSECUENTE (INCLUYENDO PÉRDIDA DE DATOS O BENEFICIOS) QUE SURJA DEL USO DE ESTE SOFTWARE, INCLUSO SI SE HA ADVERTIDO DE LA POSIBILIDAD DE TALES DAÑOS.",
                p8_title: "8. TERMINACIÓN",
                p8_text: "Nos reservamos el derecho de terminar esta licencia en cualquier momento, por cualquier motivo, sin previo aviso. Tras la terminación, debe cesar todo uso y destruir todas las copias del Software.",
                p9_title: "9. NATURALEZA P2P",
                p9_text: "NFast utiliza una arquitectura Peer-to-Peer. Usted reconoce que los riesgos de transferencia dependen de su entorno de red. Los metadatos de conexión pueden ser visibles para los servidores relay si falla la conexión directa.",

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
