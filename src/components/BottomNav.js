import React from 'react';
import { useApp } from '../App';

const NAV_ITEMS = [
  { screen: 'checkin', icon: '🏠', label: 'Inicio', activeOn: ['checkin'] },
  { screen: 'checkin', icon: '🌸', label: 'Check-in', activeOn: ['checkin', 'coach'] },
  { screen: 'dashboard', icon: '📊', label: 'Progreso', activeOn: ['dashboard'] },
  { screen: 'night', icon: '🌙', label: 'Noche', activeOn: ['night'] },
  { action: 'reset', icon: '🔄', label: 'Limpiar', activeOn: [] },
];

export default function BottomNav() {
  const { screen, navigate, resetHistoryOnly } = useApp();
  const isNight = screen === 'night';

  const handleReset = () => {
    if (window.confirm('¿Segura que querés limpiar el historial? Tu perfil se mantendrá.')) {
      resetHistoryOnly();
    }
  };

  return (
    <div className={`bottom-nav ${isNight ? 'dark' : ''}`}>
      {NAV_ITEMS.map((item, i) => {
        const active = item.activeOn ? item.activeOn.includes(screen) : false;
        const isReset = item.action === 'reset';
        return (
          <button
            key={i}
            className={`nav-btn ${active ? 'active' : ''}`}
            onClick={() => isReset ? handleReset() : navigate(item.screen)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
