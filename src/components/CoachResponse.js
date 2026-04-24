import React, { useEffect } from 'react';
import { useApp } from '../App';

// Fallback responses if API fails
const FALLBACK = {
  '😴': {
    titlePlain: 'Tu cuerpo está pidiendo',
    titleAccent: 'descanso y suavidad',
    message: 'El cansancio que sentís hoy no es una señal de que algo está mal. Es tu sistema nervioso ajustándose a niveles hormonales que cambian. Vamos a acompañarlo juntas, sin forzar nada.',
    actions: [
      { icon: '💤', text: 'Una siesta de 20 minutos antes de las 15h puede restaurar sin alterar el sueño nocturno.' },
      { icon: '📵', text: 'Reducí la luz azul 1 hora antes de dormir. Tu melatonina lo va a agradecer.' },
      { icon: '🤍', text: 'Permítite hacer menos hoy. Lo que hagas es suficiente.' },
    ],
    pattern: '"Dormís mejor los días en que tomás una pausa real al mediodía."',
  },
  '😣': {
    titlePlain: 'La irritabilidad de hoy tiene una',
    titleAccent: 'explicación clara',
    message: 'La fluctuación estrogénica afecta directamente los receptores de serotonina, bajando el umbral emocional. No perdiste la paciencia — tu biología la volvió más sensible.',
    actions: [
      { icon: '🌿', text: 'Magnesio en la cena puede marcar diferencia real con la irritabilidad hormonal.' },
      { icon: '🌬️', text: 'Antes de responder algo que te enoja, tres respiraciones lentas.' },
      { icon: '✅', text: 'Identificá UNA cosa que depende de vos hoy y hacela. El resto puede esperar.' },
    ],
    pattern: '"Los días más intensos emocionalmente suelen tener un patrón semanal."',
  },
  '🌡': {
    titlePlain: 'Los sofocos son señales,',
    titleAccent: 'no enemigos',
    message: 'Tu sistema termorregulador está respondiendo a la falta de estrógeno. No perdiste el control — tu cuerpo activó un mecanismo de protección que aprendió a funcionar diferente.',
    actions: [
      { icon: '💧', text: 'Tené agua fría siempre cerca. Muñecas y cuello bajo el agua fresca en el momento.' },
      { icon: '☕', text: 'Evitá alcohol, café y comidas muy picantes las próximas 24 horas.' },
      { icon: '🧥', text: 'Ropa en capas: poder sacarte algo en un instante cambia la experiencia.' },
    ],
    pattern: '"Tus sofocos tienden a ser más intensos los días de menor descanso."',
  },
  '😔': {
    titlePlain: 'Este bajón de ánimo',
    titleAccent: 'tiene sentido',
    message: 'La progesterona y el estrógeno influyen directamente sobre la dopamina y la serotonina. Cuando esos niveles fluctúan, el estado de ánimo también lo hace. Esto no es permanente.',
    actions: [
      { icon: '☀️', text: 'Cinco minutos al sol de la mañana tienen impacto real en el ánimo hormonal.' },
      { icon: '💬', text: 'Contactá con alguien que te hace sentir segura, aunque sea un mensaje corto.' },
      { icon: '🔕', text: 'No tomés decisiones importantes hoy. Dejá que pase el día.' },
    ],
    pattern: '"Tu ánimo bajo suele durar 1-2 días y luego se estabiliza."',
  },
  '😌': {
    titlePlain: 'Hoy estás en un momento',
    titleAccent: 'de equilibrio',
    message: 'La tranquilidad que sentís es un regalo, y también es información: tu sistema está encontrando su nuevo punto de equilibrio. Estos días construyen el banco emocional para los más difíciles.',
    actions: [
      { icon: '🌸', text: 'Hoy es un buen día para hacer algo que te guste y que no hayas podido hacer.' },
      { icon: '📓', text: 'Anotá qué hiciste ayer — puede haber algo que te ayudó a llegar acá.' },
      { icon: '🤝', text: 'Compartí este estado con alguien. La tranquilidad también merece ser nombrada.' },
    ],
    pattern: '"Los días de tranquilidad ocurren después de períodos de mayor movimiento."',
  },
  '⚡': {
    titlePlain: 'Hoy tenés energía.',
    titleAccent: 'Usala con intención',
    message: 'Días como hoy son oro. En esta etapa, la energía puede ser variable, así que cuando aparece tan clara, vale la pena canalizarla en algo que importe de verdad.',
    actions: [
      { icon: '🏃', text: 'Hoy es ideal para ejercicio más intenso, si te apetece. Tu cuerpo puede.' },
      { icon: '📋', text: 'Avanzá en algo que tenías pendiente. La energía de hoy puede cerrar un ciclo.' },
      { icon: '💧', text: 'Hidratate bien: con más actividad, más necesitás.' },
    ],
    pattern: '"Tu energía alta aparece con más frecuencia los días que tomaste sol y caminaste."',
  },
  '✍️': {
    titlePlain: 'Gracias por querer',
    titleAccent: 'expresarlo con tus palabras',
    message: 'Poner en palabras lo que sentís ya es un acto de cuidado. No todas las emociones caben en un emoji, y está bien. Escribirlo, nombrarlo, es el primer paso para entenderlo.',
    actions: [
      { icon: '✏️', text: 'Escribí 5 minutos sin censura. No tiene que ser coherente ni bonito.' },
      { icon: '🔍', text: 'Identificá si es una sensación física, emocional, o los dos juntos.' },
      { icon: '🔄', text: 'Después de escribir, volvé acá. Podemos encontrar juntas el patrón.' },
    ],
    pattern: '"Los días que escribís sobre tu estado, tu consciencia de tu propio cuerpo aumenta."',
  },
};

export default function CoachResponse() {
  const { navigate, todayMood, aiResponse, aiLoading } = useApp();

  const emoji = todayMood?.emoji || '😴';
  const fallback = FALLBACK[emoji] || FALLBACK['😴'];
  const data = aiResponse || (!aiLoading ? fallback : null);

  return (
    <div className="coach-wrap">
      <div className="coach-header">
        <div className="coach-avatar">🌿</div>
        <p className="coach-label">Flora · Tu guía emocional IA</p>
        <h2 className="coach-title animate-in">
          {aiLoading && !data
            ? 'Analizando tu estado...'
            : <>{data?.titlePlain || fallback.titlePlain}{' '}<span>{data?.titleAccent || fallback.titleAccent}</span></>
          }
        </h2>
      </div>

      <div className="coach-body">
        <div className="card animate-in" style={{ marginBottom: 20 }}>
          {aiLoading && !data ? (
            <>
              <div className="loading-dots">
                <div className="dot-pulse" />
                <div className="dot-pulse" />
                <div className="dot-pulse" />
              </div>
              <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-hint)', fontStyle: 'italic', marginTop: 4 }}>
                Flora está pensando en vos...
              </p>
            </>
          ) : (
            <p className="coach-msg">{data?.message}</p>
          )}
        </div>

        {data && (
          <>
            <p className="section-label animate-in-delay-1">Para hoy, pequeños pasos</p>
            <div className="actions-list animate-in-delay-1">
              {data.actions.map((a, i) => (
                <div key={i} className="action-item">
                  <div className="action-dot" />
                  <p className="action-text">{a.icon} {a.text}</p>
                </div>
              ))}
            </div>

            <div className="pattern-card animate-in-delay-2">
              <p className="pattern-label">✨ Patrón detectado</p>
              <p className="pattern-text">{data.pattern}</p>
            </div>

            <button
              className="btn-primary animate-in-delay-3"
              onClick={() => navigate('dashboard')}
            >
              Ver mi progreso →
            </button>
            <button
              onClick={() => navigate('checkin')}
              style={{
                width: '100%', background: 'none', border: 'none',
                color: 'var(--text-hint)', fontSize: 13, cursor: 'pointer',
                marginTop: 12, padding: '8px', fontFamily: 'DM Sans, sans-serif'
              }}
            >
              ← Cambiar mi estado
            </button>
          </>
        )}
      </div>
    </div>
  );
}
