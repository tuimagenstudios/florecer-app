import React, { useState } from 'react';
import { useApp } from '../App';

const NIGHT_OPTIONS = [
  { icon: '😮‍💨', label: 'Fue un día pesado, necesitaba que terminara' },
  { icon: '😌', label: 'Tuve momentos difíciles pero me mantuve' },
  { icon: '🌿', label: 'Fue un día tranquilo, me cuidé bien' },
  { icon: '✨', label: 'Me sentí bien, con energía y claridad' },
];

const NIGHT_REFLECTIONS = [
  'Los días pesados también forman parte del camino. No tenés que haberlo hecho "bien". Mañana tu cuerpo tendrá otra oportunidad, y vos también. Descansá sin culpa.',
  'Mantenerte en días difíciles ya es mucho. Más de lo que parece desde adentro. Tu resiliencia no necesita ser visible para ser real. Que el sueño sea reparador.',
  'Un día tranquilo es un regalo. Notarlo también lo es. Cerrá los ojos sabiendo que hiciste lo suficiente, y que eso es real.',
  'Qué hermoso cuando el cuerpo y la mente se alinean así. Ese bienestar que sentiste hoy es tuyo, no fue suerte. Que descanses desde ese lugar de plenitud.',
];

function Stars() {
  const stars = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 4,
    size: Math.random() < 0.3 ? 3 : 2,
  }));

  return (
    <div className="stars-layer">
      {stars.map(s => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.7)',
            animation: `twinkle ${2.5 + s.delay}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function NightMode() {
  const { navigate, setNightClosed } = useApp();
  const [chosen, setChosen] = useState(null);
  const [reflectionVisible, setReflectionVisible] = useState(false);

  const handleChoose = (idx) => {
    setChosen(idx);
    setTimeout(() => setReflectionVisible(true), 200);
  };

  const handleClose = () => {
    setNightClosed(true);
    navigate('checkin');
  };

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour >= 21 ? 'Buenas noches' : hour >= 18 ? 'Buenas tardes' : 'Cerrá el día';

  return (
    <div className="night-wrap">
      <Stars />
      <div className="moon-orb">🌙</div>
      <h2 className="night-title">{greeting},<br />¿cómo cerrás tu día?</h2>
      <p className="night-subtitle">
        Este momento es solo tuyo.<br />No hay respuestas correctas.
      </p>

      <div className="night-options">
        {NIGHT_OPTIONS.map((opt, i) => (
          <button
            key={i}
            className={`night-opt ${chosen === i ? 'chosen' : ''}`}
            onClick={() => handleChoose(i)}
          >
            <span className="night-opt-icon">{opt.icon}</span>
            {opt.label}
          </button>
        ))}
      </div>

      {reflectionVisible && chosen !== null && (
        <div className="night-reflection">
          <p className="night-reflect-msg">{NIGHT_REFLECTIONS[chosen]}</p>
        </div>
      )}

      {reflectionVisible && (
        <button className="btn-night" onClick={handleClose}>
          Cerrar el día con paz 🌙
        </button>
      )}
    </div>
  );
}
