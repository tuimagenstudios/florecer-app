import React from 'react';
import { useApp } from '../App';

const DAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function formatDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return `${d.getDate()} ${['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'][d.getMonth()]}`;
}

function getInsight(history) {
  if (!history.length) return 'Empezá a registrar para descubrir tus patrones.';
  const avg = Math.round(history.reduce((a, h) => a + h.wellbeing, 0) / history.length);
  const last = history[history.length - 1];
  const prev = history[history.length - 2];
  if (prev && last.wellbeing > prev.wellbeing) return 'Tu balance está mejorando 🌿';
  if (avg >= 60) return 'Tu bienestar general es bueno esta semana 💖';
  if (avg >= 40) return 'Tu cuerpo está encontrando su ritmo 🌸';
  return 'Estás atravesando días difíciles — eso también es válido 🤍';
}

export default function Dashboard() {
  const { navigate, history, todayMood, badges, userProfile } = useApp();

  const last7 = history.slice(-7);
  const maxWell = Math.max(...last7.map(h => h.wellbeing), 1);
  const avgStability = last7.length
    ? Math.round(last7.reduce((a, h) => a + h.wellbeing, 0) / last7.length)
    : 0;
  const sofocos = last7.filter(h => h.mood === '🌡').length;
  const streak = history.length;
  const insight = getInsight(last7);
  const todayDate = new Date().toISOString().split('T')[0];
  const todayLabel = todayMood ? `${todayMood.emoji} ${todayMood.label}` : 'Sin registrar aún';

  return (
    <div className="dash-wrap">
      <div className="dash-top">
        <p className="dash-greeting">Tu bienestar esta semana</p>
        <h2 className="dash-title">{insight}</h2>
        <div className="today-card" onClick={() => navigate('checkin')}>
          <span className="today-emoji-big">{todayMood?.emoji || '🌸'}</span>
          <div className="today-info">
            <p className="ti-label">Estado de hoy</p>
            <p className="ti-state">{todayLabel}</p>
            <p className="ti-phase">{userProfile?.stage || 'Perimenopausia'} · Fase 12</p>
          </div>
          <span className="today-arrow">›</span>
        </div>
      </div>

      <div className="dash-body">
        <p className="section-label">Esta semana</p>
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-icon">😴</span>
            <div className="metric-value">6.4h</div>
            <div className="metric-label">Descanso promedio</div>
            <span className="metric-trend trend-up">↑ +0.3h</span>
          </div>
          <div className="metric-card">
            <span className="metric-icon">😌</span>
            <div className="metric-value">{avgStability}%</div>
            <div className="metric-label">Estabilidad emocional</div>
            <span className="metric-trend trend-neutral">↗ en curso</span>
          </div>
          <div className="metric-card">
            <span className="metric-icon">🌡</span>
            <div className="metric-value">{sofocos}</div>
            <div className="metric-label">Sofocos esta semana</div>
            <span className="metric-trend trend-up">{sofocos === 0 ? '✓ sin registro' : '↓ observado'}</span>
          </div>
          <div className="metric-card">
            <span className="metric-icon">🔥</span>
            <div className="metric-value">{streak}</div>
            <div className="metric-label">Días registrando</div>
            <span className="metric-trend trend-up">✓ racha activa</span>
          </div>
        </div>

        <div className="week-chart">
          <p className="section-label">Bienestar por día</p>
          <div className="week-bars">
            {last7.map((h, i) => {
              const d = new Date(h.date + 'T12:00:00');
              const dayName = DAYS_SHORT[d.getDay()];
              const isToday = h.date === todayDate;
              const barH = Math.round((h.wellbeing / maxWell) * 56) + 4;
              return (
                <div key={i} className="week-bar-col">
                  <div
                    className={`week-bar ${isToday ? 'today' : ''}`}
                    style={{ height: barH }}
                    title={`${dayName}: ${h.wellbeing}% bienestar`}
                  />
                  <span className={`week-day ${isToday ? 'today' : ''}`}>{dayName}</span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="section-label">Tus logros</p>
        <div className="badges-scroll">
          {badges.map(b => (
            <div key={b.id} className={`badge-item ${b.earned ? 'earned' : ''}`}>
              <span className="badge-icon">{b.icon}</span>
              <span className="badge-text">{b.label}</span>
            </div>
          ))}
        </div>

        <p className="section-label">Historial reciente</p>
        <div className="history-list">
          {[...history].reverse().slice(0, 5).map((h, i) => (
            <div key={i} className="history-item">
              <span className="history-emoji">{h.mood}</span>
              <div className="history-info">
                <p className="history-label">{h.label}</p>
                <p className="history-date">{formatDate(h.date)}</p>
              </div>
              <div className="history-bar-wrap">
                <div className="history-bar-bg">
                  <div className="history-bar-fill" style={{ width: `${h.wellbeing}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
