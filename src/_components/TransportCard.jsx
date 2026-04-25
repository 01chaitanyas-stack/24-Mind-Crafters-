import React from 'react';
import { useAppContext } from '../context/AppContext';

const MODE_COLORS_DARK = {
  CAB:      { bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.35)', color: '#a78bfa', emoji: '🚕' },
  RICKSHAW: { bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.30)',  color: '#fbbf24', emoji: '🛺' },
  BUS:      { bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.30)',  color: '#34d399', emoji: '🚌' },
  BIKE:     { bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.30)',  color: '#60a5fa', emoji: '🏍️' },
};
const MODE_COLORS_LIGHT = {
  CAB:      { bg: 'rgba(109,40,217,0.10)',  border: 'rgba(109,40,217,0.25)',  color: '#6d28d9', emoji: '🚕' },
  RICKSHAW: { bg: 'rgba(180,83,9,0.10)',    border: 'rgba(180,83,9,0.25)',    color: '#b45309', emoji: '🛺' },
  BUS:      { bg: 'rgba(13,122,78,0.10)',   border: 'rgba(13,122,78,0.25)',   color: '#0d7a4e', emoji: '🚌' },
  BIKE:     { bg: 'rgba(29,78,216,0.10)',   border: 'rgba(29,78,216,0.25)',   color: '#1d4ed8', emoji: '🏍️' },
};

export default function TransportCard({ transport }) {
  const { theme } = useAppContext();
  const isLight = theme === 'light';
  if (!transport) return null;

  const modeKey = (transport.mode || '').toUpperCase();
  const modeColors = isLight ? MODE_COLORS_LIGHT : MODE_COLORS_DARK;
  const modeStyle = modeColors[modeKey] || {
    bg: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
    border: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)',
    color: isLight ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.6)',
    emoji: '',
  };

  return (
    <div style={{
      background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.02)',
      border: isLight ? '1px dashed rgba(0,0,0,0.12)' : '1px dashed rgba(255,255,255,0.1)',
      borderRadius: 14,
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap',
      transition: 'background 0.4s ease, border-color 0.4s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 15 }}>🚗</span>
        <span style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 10,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: isLight ? 'rgba(180,83,9,0.8)' : 'rgba(245,158,11,0.7)',
        }}>
          TRAVEL TO NEXT STOP
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{
          background: modeStyle.bg, border: `1px solid ${modeStyle.border}`, color: modeStyle.color,
          borderRadius: 999, padding: '3px 12px',
          fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.12em',
        }}>
          {modeStyle.emoji} {transport.mode?.toUpperCase() || 'TRAVEL'}
        </span>
        <span style={{ color: isLight ? '#0d7a4e' : '#10b981', fontWeight: 600, fontSize: 13 }}>
          🛣️ {(transport.distanceKm ?? transport.dist)?.toFixed(1)}km
        </span>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: isLight ? '#b45309' : '#f59e0b', fontSize: 14 }}>
          ₹{transport.cost}
        </span>
      </div>
    </div>
  );
}
