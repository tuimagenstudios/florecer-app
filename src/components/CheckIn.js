import React, { useState } from 'react';
import { useApp } from '../App';

const MOODS = [
  { emoji: '😴', label: 'Cansada' },
  { emoji: '😣', label: 'Irritable' },
  { emoji: '🌡', label: 'Con sofocos' },
  { emoji: '😔', label: 'Baja de ánimo' },
  { emoji: '😌', label: 'Tranquila' },
  { emoji: '⚡', label: 'Con energía' },
];

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

export default function CheckIn() {
  const { navigate, submitCheckin, history, todayMood } = useApp();
  const [chosen, setChosen] = useState(null);
  const [showWrite, setShowWrite] = useState(false);
  const [text, setText] = useState('');

  const now = new Date();
  const dateStr = `${DAYS[now.getDay()]}, ${now.getDate()} de ${MONTHS[now.getMonth()]}`;
  const todayDate = now.toISOString().split('T')[0];
  const alreadyDone = history.find(h => h.date === todayDate);

  const handleMood = (m) => {
    setChosen(m);
    setShowWrite(false);
  };

  const handleWriteToggle = () => {
    setChosen({ emoji: '✍️', label: 'Con mis palabras' });
    setShowWrite(true);
  };

  const canContinue = chosen !== null && (chosen.emoji !== '✍️' || text.trim().length > 2);

  const handleContinue = () => {
    submitCheckin(chosen.emoji, chosen.label, text);
  };

  const currentEmoji = chosen ? chosen.emoji : (todayMood?.emoji || '🌸');

  return (
    <div className="ci-wrap">
      <p className="ci-date">{dateStr}</p>
      <h2 className="ci-title">¿Cómo te sentís<br />hoy?</h2>
      <p className="ci-subtitle">
        {alreadyDone
          ? `Ya registraste: ${alreadyDone.mood} ${alreadyDone.label}. ¿Querés actualizarlo?`
          : 'Sin juicio. Solo tu verdad de este momento.'}
      </p>

      <div className="orb-container">
        <div
          className="mood-orb"
          style={{
            transform: chosen ? 'scale(1.08)' : 'scale(1)',
            background: chosen
              ? 'radial-gradient(circle at 35% 35%, #FDF0F7, #F8B4D9 55%, #C9B8E8)'
              : undefined
          }}
        >
          {currentEmoji}
        </div>
      </div>

      <div className="mood-grid">
        {MOODS.map(m => (
          <button
            key={m.emoji}
            className={`mood-btn ${chosen?.emoji === m.emoji ? 'chosen' : ''}`}
            onClick={() => handleMood(m)}
          >
            <span className="m-emoji">{m.emoji}</span>
            <span className="m-label">{m.label}</span>
          </button>
        ))}
      </div>

      <button
        className={`write-btn ${chosen?.emoji === '✍️' ? 'chosen' : ''}`}
        onClick={handleWriteToggle}
        style={chosen?.emoji === '✍️' ? {
          background: 'var(--fuchsia-pale)',
          borderColor: 'var(--fuchsia)'
        } : {}}
      >
        ✍️ Quiero escribirlo con mis palabras...
      </button>

      {showWrite && (
        <div className="write-area-wrap">
          <textarea
            className="write-area"
            rows={3}
            autoFocus
            placeholder="Contame cómo estás... no hay forma incorrecta de hacerlo."
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </div>
      )}

      {chosen && !showWrite && (
        <div style={{
          background: 'var(--blush)',
          borderRadius: 14,
          padding: '12px 16px',
          marginBottom: 16,
          fontSize: 14,
          color: 'var(--text-mid)',
          fontStyle: 'italic',
          animation: 'fadeSlideUp 0.3s ease forwards'
        }}>
          Registrado: <strong style={{ color: 'var(--fuchsia)', fontStyle: 'normal' }}>
            {chosen.emoji} {chosen.label}
          </strong> — vamos a trabajar con esto.
        </div>
      )}

      <button
        className="btn-primary"
        disabled={!canContinue}
        onClick={handleContinue}
      >
        Ver mi guía personalizada →
      </button>

      <button
        onClick={() => navigate('dashboard')}
        style={{
          width: '100%', background: 'none', border: 'none',
          color: 'var(--text-hint)', fontSize: 13, cursor: 'pointer',
          marginTop: 12, padding: '8px', fontFamily: 'DM Sans, sans-serif'
        }}
      >
        {alreadyDone ? 'Ver mi progreso →' : 'Saltar por hoy →'}
      </button>
    </div>
  );
}
