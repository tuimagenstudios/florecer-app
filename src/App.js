import React, { useState, createContext, useContext, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import CheckIn from './components/CheckIn';
import CoachResponse from './components/CoachResponse';
import Dashboard from './components/Dashboard';
import NightMode from './components/NightMode';
import BottomNav from './components/BottomNav';
import './styles.css';

export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

// ─── PROXY URL (key segura en Render, nunca expuesta) ────────────────────────
const PROXY_URL = 'https://florecer-proxy.onrender.com/coach';
// ─────────────────────────────────────────────────────────────────────────────

const WELLBEING_MAP = {
  '😴': 28, '😣': 35, '🌡': 40, '😔': 30, '😌': 62, '⚡': 78, '✍️': 50
};

const INITIAL_BADGES = [
  { id: 1, icon: '🌸', label: '7 días escuchando tu cuerpo', earned: false },
  { id: 2, icon: '🌿', label: 'Descanso estabilizado', earned: false },
  { id: 3, icon: '💖', label: 'Espacio en días difíciles', earned: false },
  { id: 4, icon: '🦋', label: '21 días juntas', earned: false },
  { id: 5, icon: '⭐', label: 'Primera semana completa', earned: false },
];

function loadFromStorage() {
  try {
    const saved = localStorage.getItem('florecer_v2');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return null;
}

function saveToStorage(data) {
  try {
    localStorage.setItem('florecer_v2', JSON.stringify(data));
  } catch (e) {}
}

export default function App() {
  const saved = loadFromStorage();
  const today = new Date().toISOString().split('T')[0];

  const [screen, setScreen] = useState(() => {
    if (!saved?.profile?.stage) return 'onboarding';
    return 'checkin';
  });

  const [userProfile, setUserProfile] = useState(
    saved?.profile || { stage: null, hardest: [], deepText: '' }
  );

  const [todayMood, setTodayMood] = useState(() => {
    if (!saved?.history) return null;
    const entry = saved.history.find(h => h.date === today);
    return entry ? { emoji: entry.mood, label: entry.label } : null;
  });

  const [moodText, setMoodText] = useState('');
  const [history, setHistory] = useState(saved?.history || []);
  const [nightClosed, setNightClosed] = useState(saved?.nightClosed || false);
  const [badges, setBadges] = useState(saved?.badges || INITIAL_BADGES);
  const [aiResponse, setAiResponse] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    saveToStorage({ profile: userProfile, history, nightClosed, badges });
  }, [userProfile, history, nightClosed, badges]);

  const navigate = (s) => {
    setScreen(s);
    document.querySelector('.screen-container')?.scrollTo(0, 0);
  };

  // ─── RESET COMPLETO ────────────────────────────────────────────────────────
  const resetApp = () => {
    localStorage.removeItem('florecer_v2');
    window.location.reload();
  };
  const resetHistoryOnly = () => {
  setHistory([]);
  setNightClosed(false);
  setBadges(INITIAL_BADGES);
  setTodayMood(null);
  setMoodText('');
  saveToStorage({ profile: userProfile, history: [], nightClosed: false, badges: INITIAL_BADGES });
  navigate('checkin');
};

  const submitCheckin = async (mood, label, text) => {
    const todayDate = new Date().toISOString().split('T')[0];
    setTodayMood({ emoji: mood, label, text });
    setMoodText(text);
    setAiResponse(null);
    setAiLoading(true);

    const entry = {
      date: todayDate,
      mood,
      label,
      wellbeing: WELLBEING_MAP[mood] || 50
    };

    setHistory(prev => {
      const filtered = prev.filter(h => h.date !== todayDate);
      const updated = [...filtered, entry];
      setBadges(prev => prev.map(b => {
        if (b.id === 1 && updated.length >= 7) return { ...b, earned: true };
        if (b.id === 4 && updated.length >= 21) return { ...b, earned: true };
        if (b.id === 5 && updated.length >= 5) return { ...b, earned: true };
        if (b.id === 3 && updated.some(h => h.wellbeing < 35)) return { ...b, earned: true };
        return b;
      }));
      return updated;
    });

    navigate('coach');

    try {
      const response = await fetchGeminiCoach(mood, label, text, userProfile, history);
      setAiResponse(response);
    } catch (e) {
      console.error('Gemini error:', e);
    } finally {
      setAiLoading(false);
    }
  };

  const showNav = screen !== 'onboarding';

  return (
    <AppContext.Provider value={{
      screen, navigate,
      userProfile, setUserProfile,
      todayMood, setTodayMood,
      moodText, setMoodText,
      history, setHistory, submitCheckin,
      nightClosed, setNightClosed,
      badges, setBadges,
      aiResponse, aiLoading,
      resetApp,
    }}>
      <div className="app-shell">
        <div className="phone-frame">
          <div className="screen-container">
            {screen === 'onboarding' && <Onboarding />}
            {screen === 'checkin' && <CheckIn />}
            {screen === 'coach' && <CoachResponse />}
            {screen === 'dashboard' && <Dashboard />}
            {screen === 'night' && <NightMode />}
          </div>
          {showNav && <BottomNav />}
        </div>
      </div>
    </AppContext.Provider>
  );
}

// ─── PROXY CALL (Gemini key segura en Render) ─────────────────────────────────
async function fetchGeminiCoach(mood, label, moodText, profile, history) {
  const recentHistory = history.slice(-7)
    .map(h => `${h.date}: ${h.label} (bienestar ${h.wellbeing}%)`)
    .join(', ');
  const userContext = profile.stage
    ? `Etapa: ${profile.stage}. Lo más difícil: ${profile.hardest.join(', ')}.`
    : '';

  const prompt = `Eres Flora, una coach emocional especializada en acompañar a mujeres en perimenopausia y menopausia. Combinas conocimiento científico-hormonal con una voz profundamente humana, cálida y sin condescendencia.

El estado emocional de hoy: ${label} ${mood}
${moodText ? `Lo que ella escribió: "${moodText}"` : ''}
${userContext}
Historial reciente: ${recentHistory || 'Primera vez usando la app.'}

Responde SOLO con un JSON con esta estructura exacta (sin backticks, sin texto extra):
{
  "titlePlain": "3-5 palabras introductorias",
  "titleAccent": "2-4 palabras que completan el título con énfasis",
  "message": "2-3 oraciones que mezclan explicación hormonal con validación emocional profunda. Tono: como si una amiga sabia y médica te escribiera a las 11pm. Máximo 120 palabras.",
  "actions": [
    {"icon": "emoji", "text": "acción concreta y humana, sin ser prescriptiva"},
    {"icon": "emoji", "text": "acción concreta"},
    {"icon": "emoji", "text": "acción concreta"}
  ],
  "pattern": "insight detectado basado en el historial, o motivación genuina si es la primera vez"
}`;

  const resp = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  const data = await resp.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}
