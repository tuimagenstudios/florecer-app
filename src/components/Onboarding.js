import React, { useState } from 'react';
import { useApp } from '../App';

const STAGES = ['Perimenopausia', 'Menopausia', 'Posmenopausia', 'No estoy segura'];

const HARDEST = [
  { emoji: '😴', label: 'Dormir' },
  { emoji: '🌡', label: 'Los sofocos' },
  { emoji: '😔', label: 'El ánimo' },
  { emoji: '⚡', label: 'La energía' },
  { emoji: '😣', label: 'La irritabilidad' },
  { emoji: '🫀', label: 'Sentirme yo' },
  { emoji: '💭', label: 'La concentración' },
  { emoji: '🫂', label: 'Las relaciones' },
];

const SEED_MOODS = [
  { emoji: '😴', label: 'Cansada', wellbeing: 28 },
  { emoji: '😣', label: 'Irritable', wellbeing: 35 },
  { emoji: '😌', label: 'Tranquila', wellbeing: 62 },
  { emoji: '😔', label: 'Baja de ánimo', wellbeing: 30 },
  { emoji: '⚡', label: 'Con energía', wellbeing: 78 },
  { emoji: '😌', label: 'Tranquila', wellbeing: 52 },
];

export default function Onboarding() {
  const { navigate, setUserProfile, setHistory, setBadges } = useApp();
  const [stage, setStage] = useState(null);
  const [hardest, setHardest] = useState([]);
  const [deepText, setDeepText] = useState('');

  const toggleHardest = (label) => {
    setHardest(prev =>
      prev.includes(label) ? prev.filter(h => h !== label) : [...prev, label]
    );
  };

  const canContinue = stage !== null && hardest.length > 0;

  const handleStart = () => {
    setUserProfile({ stage, hardest, deepText });

    // Seed 6 days of demo history so the dashboard has life immediately
    const today = new Date();
    const seedHistory = SEED_MOODS.map((m, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      return {
        date: d.toISOString().split('T')[0],
        mood: m.emoji,
        label: m.label,
        wellbeing: m.wellbeing,
      };
    });

    setHistory(seedHistory);
    setBadges(prev => prev.map(b =>
      b.id === 3 ? { ...b, earned: true } : b
    ));

    navigate('checkin');
  };

  return (
    <div className="ob-wrap">
      <div className="logo-bloom animate-in">
        <span className="logo-emoji">🌸</span>
      </div>
      <h1 className="app-name animate-in">Florecer</h1>
      <p className="app-tagline animate-in-delay-1">
        Tu compañera inteligente<br />en cada etapa del cambio
      </p>

      <div className="ob-card animate-in-delay-1">
        <p className="ob-step-label">Paso 1 de 2 · Tu etapa</p>
        <p className="ob-question">¿En qué etapa te encontrás?</p>
        <div className="chips-grid">
          {STAGES.map(s => (
            <div
              key={s}
              className={`chip ${stage === s ? 'selected' : ''}`}
              onClick={() => setStage(s)}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="ob-card animate-in-delay-2">
        <p className="ob-step-label">Paso 2 de 2 · Lo más importante</p>
        <p className="ob-question">¿Qué es lo que más te está costando de esta etapa?</p>
        <p className="ob-sub">Podés elegir más de uno. Esto cambia cómo te acompaño.</p>
        <div className="chips-grid">
          {HARDEST.map(h => (
            <div
              key={h.label}
              className={`chip ${hardest.includes(h.label) ? 'selected' : ''}`}
              onClick={() => toggleHardest(h.label)}
            >
              {h.emoji} {h.label}
            </div>
          ))}
        </div>

        {hardest.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <p style={{ fontSize: 13, color: 'var(--text-soft)', marginBottom: 8, fontStyle: 'italic' }}>
              Si querés, contame más con tus palabras (opcional):
            </p>
            <textarea
              className="ob-text-area"
              rows={3}
              placeholder="Ej: Me siento diferente a mí misma, no reconozco mis propias reacciones..."
              value={deepText}
              onChange={e => setDeepText(e.target.value)}
            />
          </div>
        )}
      </div>

      <button
        className="btn-primary animate-in-delay-3"
        disabled={!canContinue}
        onClick={handleStart}
        style={{ marginTop: 4 }}
      >
        Comenzar mi camino →
      </button>
    </div>
  );
}
