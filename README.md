# 🌸 Florecer — Tu compañera inteligente en cada etapa del cambio

Aplicación web de bienestar emocional para mujeres en etapa de perimenopausia y menopausia. Diseñada como un refugio digital, no como una herramienta médica.

## ✨ ¿Qué hace?

- **Check-in emocional diario** — Registrá cómo te sentís con un toque, o con tus propias palabras
- **Flora — Coach emocional con IA real** — Respuestas únicas y personalizadas generadas por Claude (Anthropic) según tu estado, historial y etapa
- **Micro-acciones personalizadas** — 3 acciones simples y sostenibles según tu estado del día
- **Detección de patrones** — La app aprende y devuelve insights sobre tu bienestar
- **Dashboard vivo** — Métricas reales, historial y logros
- **Modo noche emocional** — Ritual de cierre del día con reflexión personalizada
- **Persistencia real** — Todo se guarda en localStorage: tu perfil, historial, badges

## 🚀 Instalación y uso

```bash
# Clonar el repo
git clone https://github.com/tuimagenstudios/florecer-app.git
cd florecer-app

# Instalar dependencias
npm install

# Iniciar en desarrollo
npm start

# Construir para producción
npm run build
```

La app abre en `http://localhost:3000`

## 🔑 API Key de Claude

La app llama a la API de Anthropic para generar respuestas personalizadas desde Flora, el coach emocional IA.

**En desarrollo local:** La llamada sale directamente desde el navegador (solo para desarrollo/demo). Para producción, mover la API call a un backend o proxy seguro — nunca exponer la API key en el cliente en producción.

Para configurar con tu propia key, en `App.js` la función `fetchAICoach` hace el fetch a `https://api.anthropic.com/v1/messages`. Podés agregar un proxy o serverless function en Netlify/Vercel que maneje la key por vos.

## 🏗️ Estructura del proyecto

```
florecer-app/
├── public/
│   └── index.html
├── src/
│   ├── App.js                    # Estado global + localStorage + llamada a Claude API
│   ├── styles.css                # Sistema de diseño completo
│   ├── index.js                  # Entry point
│   └── components/
│       ├── Onboarding.js         # Registro inicial (etapa + síntomas) + seed de demo
│       ├── CheckIn.js            # Check-in emocional diario con estado inteligente
│       ├── CoachResponse.js      # Respuestas reales de IA + fallback offline
│       ├── Dashboard.js          # Dashboard con datos reales del historial
│       ├── NightMode.js          # Ritual de cierre nocturno
│       └── BottomNav.js          # Navegación inferior
├── package.json
├── .gitignore
└── README.md
```

## 🎨 Sistema de diseño

- **Tipografía**: Playfair Display (serif elegante) + DM Sans (sans limpia)
- **Paleta**: fucsia `#E91E8C` como acento, fondos rose pale y warm white
- **Sensación**: Un espacio que abraza, no que empuja
- **Animaciones**: Orgánicas, tipo respiración y flow

## 🧠 Motor emocional (Flora IA)

El `App.js` contiene la función `fetchAICoach` que llama a Claude:
- **Contexto real** — envía etapa, síntomas más difíciles, historial reciente de la usuaria
- **Respuestas únicas** — nunca genéricas, siempre personalizadas al momento
- **JSON estructurado** — título, mensaje, 3 acciones, insight de patrón
- **Fallback offline** — si la API falla, muestra respuestas de calidad predefinidas
- **7 estados emocionales** mapeados en el fallback

## 💾 Persistencia

Todo se guarda automáticamente en `localStorage` bajo la key `florecer_v2`:
- Perfil de usuario (etapa, síntomas)
- Historial completo de check-ins
- Badges desbloqueados
- Estado del modo noche

## 📱 Próximas versiones

- [ ] Backend proxy para la API key (Netlify Functions o Vercel Edge)
- [ ] Notificaciones push (check-in diario)
- [ ] Exportar historial como PDF
- [ ] Versión PWA instalable
- [ ] Sincronización con cuenta de usuario

## 💗 Filosofía

> Esta app no dice "Tenés sofocos".
> Dice "Tu cuerpo está atravesando un cambio, y lo estamos entendiendo juntas."

No compite por features. Compite por conexión.

---

Desarrollado con 💗 por [Tuimagen Studio](https://tuimagen.studio) — TuimagenIA
