import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../_components/Navbar';
import { useAppContext } from '../context/AppContext';
import PlaceCard from '../_components/PlaceCard';
import TransportCard from '../_components/TransportCard';
import FoodCard from '../_components/FoodCard';
import CostBreakdown from '../_components/CostBreakdown';
import MapWrapper from '../_components/MapWrapper';

const STYLE_ID = '__itinerary-keyframes';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
@keyframes floatUp{0%{transform:translateY(0) scale(1);opacity:0}10%{opacity:1}90%{opacity:0.6}100%{transform:translateY(-120px) scale(0.4);opacity:0}}
  `;
  document.head.appendChild(s);
}

function makeParticles(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: i, left: Math.random() * 100, bottom: Math.random() * 30,
    size: 2 + Math.random() * 3, dur: 6 + Math.random() * 8, delay: Math.random() * 10,
  }));
}

function RoadMapSVG({ isLight }) {
  const hLines = [80, 160, 280, 380, 500, 600, 680, 760];
  const vLines = [100, 220, 360, 480, 600, 720, 860, 1000, 1100];
  const dots = [];
  hLines.forEach(y => vLines.forEach(x => dots.push({ x, y })));
  return (
    <svg style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', opacity: isLight ? 0.15 : 0.07, pointerEvents: 'none', zIndex: 0, transition: 'opacity 0.4s ease' }}
      xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 840">
      {hLines.map(y => <line key={`h${y}`} x1="0" y1={y} x2="1200" y2={y} stroke={isLight ? 'rgba(193,127,36,1)' : '#fff'} strokeWidth="1" strokeDasharray="8 12" />)}
      {vLines.map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="840" stroke={isLight ? 'rgba(193,127,36,1)' : '#fff'} strokeWidth="1" strokeDasharray="8 12" />)}
      <line x1="50" y1="800" x2="1150" y2="40" stroke="#10b981" strokeWidth="2.5" strokeDasharray="16 10" />
      <line x1="0" y1="600" x2="900" y2="0" stroke="#10b981" strokeWidth="2" strokeDasharray="14 12" />
      {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r="2.5" fill="#f59e0b" />)}
    </svg>
  );
}

export default function Itinerary() {
  const { itinerary, theme } = useAppContext();
  const navigate = useNavigate();
  const particles = useMemo(() => makeParticles(14), []);
  const [mounted, setMounted] = useState(false);
  const isLight = theme === 'light';

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const scrollTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  if (!itinerary) {
    return (
      <div style={{ minHeight: '100vh', background: isLight ? '#f5f0e8' : '#0c0c14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", transition: 'background 0.4s ease' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: isLight ? '#c17f24' : '#f59e0b', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 24 }}>No Path Calculated</h2>
        <button onClick={() => navigate('/home')}
          style={{ border: `1px solid ${isLight ? '#c17f24' : '#f59e0b'}`, color: isLight ? '#c17f24' : '#f59e0b', background: 'rgba(245,158,11,0.08)', fontFamily: "'Syne', sans-serif", fontWeight: 700, padding: '10px 28px', borderRadius: 999, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontSize: 13 }}>
          Return to Base
        </button>
      </div>
    );
  }

  const totalPlaces = itinerary.sequence?.length || 0;
  const freePlaces = itinerary.sequence?.filter(p => !p.entry_cost_inr || p.entry_cost_inr === 0).length || 0;
  const totalCost = itinerary.totalCost || 0;
  const userBudget = itinerary.budgetAmount || (itinerary.budgetTier === 'low' ? 500 : itinerary.budgetTier === 'medium' ? 1500 : 5000);
  const remaining = userBudget - totalCost;

  const pillBtn = (onClick, bg, border, color, label) => (
    <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: bg, border: `1px solid ${border}`, color, borderRadius: 999, padding: '8px 22px', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: '0.13em', textTransform: 'uppercase', cursor: 'pointer' }}>
      {label}
    </button>
  );

  const cardBase = {
    background: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.03)',
    border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
    transition: 'background 0.4s ease, border-color 0.4s ease',
  };

  return (
    <div style={{ minHeight: '100vh', background: isLight ? '#f5f0e8' : '#0c0c14', position: 'relative', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif", paddingBottom: 80, transition: 'background 0.4s ease, color 0.3s ease' }}>
      <RoadMapSVG isLight={isLight} />
      <div style={{ position: 'fixed', top: -120, left: -120, width: 500, height: 500, borderRadius: '50%', background: isLight ? 'radial-gradient(circle, rgba(193,127,36,0.12), transparent 70%)' : 'radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0, transition: 'background 0.4s ease' }} />
      <div style={{ position: 'fixed', bottom: -160, right: -120, width: 600, height: 600, borderRadius: '50%', background: isLight ? 'radial-gradient(circle, rgba(13,122,78,0.10), transparent 70%)' : 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0, transition: 'background 0.4s ease' }} />
      {particles.map(p => (
        <div key={p.id} style={{ position: 'fixed', left: `${p.left}%`, bottom: `${p.bottom}%`, width: p.size, height: p.size, borderRadius: '50%', background: '#f59e0b', opacity: 0, animation: `floatUp ${p.dur}s ${p.delay}s infinite ease-out`, pointerEvents: 'none', zIndex: 0 }} />
      ))}

      <div style={{ position: 'relative', zIndex: 10 }}><Navbar /></div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 860, margin: '0 auto', padding: '32px 20px 60px' }}>
        <button onClick={() => navigate('/home')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: isLight ? 'rgba(245,240,232,0.85)' : 'rgba(12,12,20,0.7)', border: isLight ? '1px solid rgba(193,127,36,0.35)' : '1px solid rgba(245,158,11,0.35)', color: isLight ? '#c17f24' : '#f59e0b', borderRadius: 999, padding: '8px 20px', fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: 32, backdropFilter: 'blur(10px)', transition: 'background 0.4s ease, border-color 0.4s ease, color 0.3s ease' }}>
          ← Back to Configure
        </button>

        <div style={{ textAlign: 'center', marginBottom: 32, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.7s, transform 0.7s' }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '0.08em', margin: '0 0 20px', background: isLight ? 'linear-gradient(90deg, #c17f24, #0d7a4e)' : 'linear-gradient(90deg, #f59e0b, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            CALCULATED ROUTE
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            {pillBtn(() => scrollTo('waypoints-section'), 'rgba(245,158,11,0.08)', 'rgba(245,158,11,0.25)', isLight ? '#c17f24' : '#f59e0b', '📍 WAYPOINTS')}
            {pillBtn(() => scrollTo('analysis-section'), 'rgba(16,185,129,0.08)', 'rgba(16,185,129,0.25)', isLight ? '#0d7a4e' : '#10b981', '📊 ANALYSIS')}
          </div>
        </div>

        <div style={{
          width: '100%',
          height: '420px',
          marginBottom: '32px',
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
          border: isLight ? '1px solid rgba(0,0,0,0.10)' : '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
          <MapWrapper sequence={itinerary.sequence} startLoc={itinerary.startLoc} />
        </div>

        <div id="waypoints-section" style={{ marginTop: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 3, height: 24, background: isLight ? '#c17f24' : '#f59e0b', borderRadius: 2 }} />
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: isLight ? '#1a1a2e' : '#fff', fontSize: 18, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, transition: 'color 0.3s ease' }}>Waypoints</h2>
          </div>
          {itinerary.sequence.map((place, idx) => {
            const nextPlace = itinerary.sequence[idx + 1];
            return (
              <React.Fragment key={place.id}>
                <PlaceCard place={place} step={idx + 1} />
                {nextPlace && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '4px 0' }}>
                    <div style={{ color: isLight ? 'rgba(193,127,36,0.5)' : 'rgba(245,158,11,0.5)', fontSize: 18, lineHeight: 1, margin: '4px 0' }}>↓</div>
                    <div style={{ width: '100%' }}><TransportCard transport={nextPlace.travelTo} /></div>
                    <div style={{ color: isLight ? 'rgba(193,127,36,0.5)' : 'rgba(245,158,11,0.5)', fontSize: 18, lineHeight: 1, margin: '4px 0' }}>↓</div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <FoodCard foodData={itinerary.foodSuggestions} title="Eat Near Your Starting Point" />

        {itinerary.hotels && itinerary.hotels.length > 0 && (
          <div style={{ ...cardBase, borderRadius: 20, padding: 24, marginTop: 24, backdropFilter: 'blur(16px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 3, height: 20, background: '#a78bfa', borderRadius: 2 }} />
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: isLight ? '#1a1a2e' : '#fff', fontSize: 14, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, transition: 'color 0.3s ease' }}>Suggested Accommodations</h3>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {itinerary.hotels.map((h, idx) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 12, background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.02)', border: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.06)', transition: 'background 0.4s ease' }}>
                  <span style={{ color: isLight ? 'rgba(26,26,46,0.8)' : 'rgba(255,255,255,0.8)', fontSize: 14, transition: 'color 0.3s ease' }}>• {h.name}</span>
                  <span style={{ fontWeight: 700, color: isLight ? '#0d7a4e' : '#10b981', fontSize: 14 }}>{h.price}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div id="analysis-section" style={{ marginTop: 40 }}>
          <CostBreakdown itinerary={itinerary} />
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 80, background: isLight ? 'rgba(245,240,232,0.95)' : 'rgba(12,12,20,0.9)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderTop: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)', padding: '12px 0', transition: 'background 0.4s ease, border-color 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 36, flexWrap: 'wrap', padding: '0 16px' }}>
          {[
            { value: String(totalPlaces), label: 'Places', emoji: '📍' },
            { value: `Rs${totalCost}`, label: 'Total Cost', emoji: '💰' },
            { value: remaining >= 0 ? `Rs${remaining}` : `-Rs${Math.abs(remaining)}`, label: 'Remaining', emoji: '💚' },
            { value: String(freePlaces), label: 'Free Places', emoji: '🎟️' },
          ].map(st => (
            <div key={st.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15 }}>{st.emoji}</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: isLight ? '#c17f24' : '#f59e0b', fontSize: 14, transition: 'color 0.3s ease' }}>{st.value}</span>
              <span style={{ color: isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.3)', fontSize: 12, transition: 'color 0.3s ease' }}>{st.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
