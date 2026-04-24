import React from 'react';
import { useApp } from '../App';

const NAV_ITEMS = [
  { screen: 'checkin', icon: '🏠', label: 'Inicio', activeOn: ['checkin'] },
  { screen: 'checkin', icon: '🌸', label: 'Check-in', activeOn: ['checkin', 'coach'] },
  { screen: 'dashboard', icon: '📊', label: 'Progreso', activeOn: ['dashboard'] },
  { screen: 'night', icon: '🌙', label: 'Noche', activeOn: ['night'] },
];

export default function BottomNav() {
  const { screen, navigate } = useApp();
  const isNight = screen === 'night';

  return (
    <div className={`bottom-nav ${isNight ? 'dark' : ''}`}>
      {NAV_ITEMS.map((item, i) => {
        const active = item.activeOn ? item.activeOn.includes(screen) : false;
        return (
          <button
            key={i}
            className={`nav-btn ${active ? 'active' : ''}`}
            onClick={() => navigate(item.screen)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
