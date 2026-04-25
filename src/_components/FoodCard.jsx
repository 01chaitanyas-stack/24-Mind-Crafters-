import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function FoodCard({ foodData, title = "Recommended Food" }) {
  const { theme } = useAppContext();
  const isLight = theme === 'light';
  if (!foodData || foodData.length === 0) return null;

  return (
    <div style={{ marginTop: 32 }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 3, height: 24, background: isLight ? '#b45309' : '#f59e0b', borderRadius: 2 }} />
        <h3 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 700,
          color: isLight ? '#1a1a2e' : '#fff',
          fontSize: 16, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0,
          transition: 'color 0.3s ease',
        }}>
          🍽️ {title.toUpperCase()}
        </h3>
      </div>

      {/* Restaurant rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {foodData.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.03)',
              border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12,
              padding: '14px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'background 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={e => e.currentTarget.style.background = isLight ? 'rgba(180,83,9,0.06)' : 'rgba(245,158,11,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = isLight ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.03)'}
          >
            <span style={{ color: isLight ? '#1a1a2e' : '#fff', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14, transition: 'color 0.3s ease' }}>
              <span style={{ color: isLight ? '#b45309' : '#f59e0b', marginRight: 8 }}>•</span>{item.name}
            </span>
            <span style={{ color: isLight ? '#0d7a4e' : '#10b981', fontWeight: 700, fontSize: 14, fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', paddingLeft: 12 }}>
              {item.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
