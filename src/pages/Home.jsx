import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../_components/Navbar';
import { useAppContext } from '../context/AppContext';
import { generateItinerary } from '../engine/planner';

const STYLE_ID = '__home-keyframes';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
@keyframes floatUp{0%{transform:translateY(0) scale(1);opacity:0}10%{opacity:1}90%{opacity:0.6}100%{transform:translateY(-120px) scale(0.4);opacity:0}}
@keyframes slideIn{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse-ring{0%,100%{transform:scale(0.92);opacity:0.8}50%{transform:scale(1.06);opacity:0.3}}
@keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
@keyframes glow-pulse{0%,100%{box-shadow:0 0 20px rgba(245,158,11,0.3),0 0 60px rgba(245,158,11,0.1)}50%{box-shadow:0 0 35px rgba(245,158,11,0.5),0 0 80px rgba(245,158,11,0.2)}}
@keyframes launch{0%{transform:scale(1)}30%{transform:scale(0.96)}60%{transform:scale(1.03)}100%{transform:scale(1)}}
  `;
  document.head.appendChild(s);
}

function makeParticles(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    bottom: Math.random() * 30,
    size: 2 + Math.random() * 3,
    dur: 6 + Math.random() * 8,
    delay: Math.random() * 10,
  }));
}

function RoadMapSVG({ theme }) {
  const hLines = [80, 160, 280, 380, 500, 600, 680, 760];
  const vLines = [100, 220, 360, 480, 600, 720, 860, 1000, 1100];
  const dots = [];
  hLines.forEach(y => vLines.forEach(x => dots.push({ x, y })));
  const isLight = theme === 'light';

  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: isLight ? 0.15 : 0.07, pointerEvents: 'none', transition: 'opacity 0.4s ease' }}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      viewBox="0 0 1200 840"
    >
      {hLines.map(y => (
        <line key={`h${y}`} x1="0" y1={y} x2="1200" y2={y} stroke={isLight ? 'rgba(193,127,36,1)' : '#fff'} strokeWidth="1" strokeDasharray="8 12" />
      ))}
      {vLines.map(x => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="840" stroke={isLight ? 'rgba(193,127,36,1)' : '#fff'} strokeWidth="1" strokeDasharray="8 12" />
      ))}
      <line x1="50" y1="800" x2="1150" y2="40" stroke="#10b981" strokeWidth="2.5" strokeDasharray="16 10" />
      <line x1="0" y1="600" x2="900" y2="0" stroke="#10b981" strokeWidth="2" strokeDasharray="14 12" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="2.5" fill="#f59e0b" />
      ))}
    </svg>
  );
}

export default function Home() {
  const { data, setItinerary, loading, theme } = useAppContext();
  const navigate = useNavigate();
  const isLight = theme === 'light';

  const [startLocation, setStartLocation] = useState('Panchavati');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [availableHours, setAvailableHours] = useState('');
  const [mounted, setMounted] = useState(false);
  const [launching, setLaunching] = useState(false);

  const particles = useMemo(() => makeParticles(18), []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!data) return;

    setLaunching(true);
    const hours = availableHours ? Number(availableHours) : 8;
    const budget = budgetAmount ? Number(budgetAmount) : 1000;
    const derivedTier = budget < 500 ? 'low' : budget < 1500 ? 'medium' : 'high';

    const result = await generateItinerary({ startLocation, budgetTier: derivedTier, availableHours: hours }, data);
    setItinerary({ ...result, budgetTier: derivedTier, budgetAmount: budgetAmount ? Number(budgetAmount) : null });
    navigate('/itinerary');
  };

  const budgetNum = budgetAmount ? Number(budgetAmount) : null;
  const hoursNum = availableHours ? Number(availableHours) : null;
  const filledAll = startLocation && budgetAmount && availableHours;
  const progressPct = hoursNum ? Math.min(100, (hoursNum / 12) * 100) : 0;

  const budgetTierBadge = budgetNum !== null
    ? budgetNum < 500
      ? { label: 'Budget Explorer', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', color: isLight ? '#0d7a4e' : '#34d399' }
      : budgetNum <= 1500
        ? { label: 'Comfortable Traveller', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', color: isLight ? '#c17f24' : '#fbbf24' }
        : { label: 'Premium Experience', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.25)', color: '#c084fc' }
    : null;

  if (loading)
    return (
      <div
        style={{
          minHeight: '100vh',
          background: isLight ? '#f5f0e8' : '#0c0c14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f59e0b',
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          transition: 'background 0.4s ease',
        }}
      >
        Initializing Engine...
      </div>
    );

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: isLight ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.35)',
    marginBottom: 8,
    fontFamily: "'DM Sans', sans-serif",
    transition: 'color 0.3s ease',
  };

  const inputBase = {
    width: '100%',
    background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)',
    border: isLight ? '1px solid rgba(0,0,0,0.12)' : '1px solid rgba(255,255,255,0.1)',
    borderRadius: 14,
    color: isLight ? '#1a1a2e' : '#f1f1f1',
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'border-color 0.25s, box-shadow 0.25s, background 0.4s ease, color 0.3s ease',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: isLight ? '#f5f0e8' : '#0c0c14', position: 'relative', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif", transition: 'background 0.4s ease, color 0.3s ease' }}>
      <RoadMapSVG theme={theme} />

      <div style={{ position: 'absolute', top: -120, left: -120, width: 500, height: 500, borderRadius: '50%', background: isLight ? 'radial-gradient(circle, rgba(193,127,36,0.12), transparent 70%)' : 'radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)', pointerEvents: 'none', transition: 'background 0.4s ease' }} />
      <div style={{ position: 'absolute', bottom: -160, right: -120, width: 600, height: 600, borderRadius: '50%', background: isLight ? 'radial-gradient(circle, rgba(13,122,78,0.10), transparent 70%)' : 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', pointerEvents: 'none', transition: 'background 0.4s ease' }} />

      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: '#f59e0b',
            opacity: 0,
            animation: `floatUp ${p.dur}s ${p.delay}s infinite ease-out`,
            pointerEvents: 'none',
          }}
        />
      ))}

      <Navbar />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 600, margin: '0 auto', padding: '48px 20px 140px' }}>
        <div
          style={{
            textAlign: 'center',
            marginBottom: 40,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.08)', border: isLight ? '1px solid rgba(193,127,36,0.30)' : '1px solid rgba(245,158,11,0.18)', borderRadius: 999, padding: '6px 18px 6px 12px', marginBottom: 24 }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: isLight ? '#c17f24' : '#f59e0b', animation: 'pulse-ring 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: isLight ? '#c17f24' : '#f59e0b', textTransform: 'uppercase' }}>
              Nashik Smart Travel Planner
            </span>
          </div>

          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(32px, 6vw, 52px)', lineHeight: 1.1, margin: '0 0 16px', color: isLight ? '#1a1a2e' : '#fff', transition: 'color 0.3s ease' }}>
            Configure Your
            <br />
            <span style={{ background: 'linear-gradient(90deg, #f59e0b, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Perfect Journey
            </span>
          </h1>

          <p style={{ color: isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.35)', fontSize: 15, maxWidth: 380, margin: '0 auto', lineHeight: 1.6, transition: 'color 0.3s ease' }}>
            AI-optimized route calculation tailored to your budget, time, and starting point.
          </p>
        </div>

        <div
          style={{
            maxWidth: 520,
            margin: '0 auto',
            background: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.03)',
            border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
            borderRadius: 28,
            padding: 36,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: isLight ? '0 20px 60px rgba(0,0,0,0.12)' : '0 40px 80px rgba(0,0,0,0.5)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s 0.2s cubic-bezier(.4,0,.2,1), transform 0.7s 0.2s cubic-bezier(.4,0,.2,1), background 0.4s ease, border-color 0.4s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              ⚙️
            </div>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: isLight ? '#1a1a2e' : '#fff', fontSize: 16, transition: 'color 0.3s ease' }}>Route Parameters</div>
              <div style={{ color: isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 2, transition: 'color 0.3s ease' }}>3 inputs · AI-optimized output</div>
            </div>
          </div>

          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div>
              <div style={labelStyle}><span style={{ color: isLight ? '#c17f24' : '#f59e0b' }}>📍</span> DEPLOYMENT ORIGIN</div>
              <div style={{ position: 'relative' }}>
                <select
                  value={startLocation}
                  onChange={e => setStartLocation(e.target.value)}
                  style={{ ...inputBase, padding: '14px 44px 14px 16px', appearance: 'none', cursor: 'pointer' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(245,158,11,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                >
                  {Object.keys(data.transport.locations).map(loc => (
                    <option key={loc} value={loc} style={{ background: isLight ? '#f5f0e8' : '#1a1a28', color: isLight ? '#1a1a2e' : '#fff' }}>
                      {loc}
                    </option>
                  ))}
                </select>
                <svg style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isLight ? '#c17f24' : '#f59e0b'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            <div>
              <div style={labelStyle}><span style={{ color: isLight ? '#0d7a4e' : '#10b981', fontWeight: 800, fontSize: 13 }}>Rs</span> BUDGET ALLOCATION</div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.25)', fontWeight: 500, fontSize: 15, pointerEvents: 'none' }}>Rs</span>
                <input
                  type="number" min="100" step="50" placeholder="e.g. 2000"
                  value={budgetAmount} onChange={e => setBudgetAmount(e.target.value)} required
                  style={{ ...inputBase, padding: '14px 16px 14px 34px' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(245,158,11,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              {budgetTierBadge && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: budgetTierBadge.bg, border: `1px solid ${budgetTierBadge.border}`, color: budgetTierBadge.color, transition: 'all 0.3s' }}>
                  {budgetTierBadge.label}
                </div>
              )}
            </div>

            <div>
              <div style={labelStyle}><span style={{ color: '#a855f7' }}>⏱</span> TIME CONSTRAINT</div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.25)', fontWeight: 500, fontSize: 13, pointerEvents: 'none' }}>hrs</span>
                <input
                  type="number" min="0.5" max="24" step="0.5" placeholder="e.g. 4.5"
                  value={availableHours} onChange={e => setAvailableHours(e.target.value)} required
                  style={{ ...inputBase, padding: '14px 16px 14px 44px' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(168,85,247,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(168,85,247,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              {hoursNum > 0 && (
                <div style={{ marginTop: 10, height: 4, borderRadius: 4, background: isLight ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progressPct}%`, borderRadius: 4, background: 'linear-gradient(90deg, #a855f7, #7c3aed)', transition: 'width 0.4s ease' }} />
                </div>
              )}
            </div>

            <div style={{ height: 1, background: isLight ? 'linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent)' : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />

            {(startLocation || budgetAmount || availableHours) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {startLocation && (
                  <span style={{ padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: 'rgba(245,158,11,0.10)', border: isLight ? '1px solid rgba(193,127,36,0.25)' : '1px solid rgba(245,158,11,0.20)', color: isLight ? '#c17f24' : '#fbbf24' }}>
                    📍 {startLocation}
                  </span>
                )}
                {budgetAmount && (
                  <span style={{ padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: 'rgba(16,185,129,0.10)', border: isLight ? '1px solid rgba(13,122,78,0.25)' : '1px solid rgba(16,185,129,0.20)', color: isLight ? '#0d7a4e' : '#34d399' }}>
                    Rs{Number(budgetAmount).toLocaleString('en-IN')}
                  </span>
                )}
                {availableHours && (
                  <span style={{ padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: 'rgba(168,85,247,0.10)', border: '1px solid rgba(168,85,247,0.20)', color: '#c084fc' }}>
                    ⏱ {availableHours} hrs
                  </span>
                )}
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <button
                type="submit"
                disabled={!filledAll || launching}
                style={{
                  position: 'relative', width: '100%', padding: 17, borderRadius: 16, border: 'none',
                  fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.16em',
                  textTransform: 'uppercase', cursor: filledAll && !launching ? 'pointer' : 'default',
                  overflow: 'hidden', transition: 'all 0.3s',
                  ...(filledAll && !launching
                    ? { background: 'linear-gradient(135deg, #f59e0b, #d97706, #10b981)', color: isLight ? '#1a1a2e' : '#0c0c14', animation: 'glow-pulse 3s ease-in-out infinite' }
                    : { background: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)', color: isLight ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)' }),
                  ...(launching ? { animation: 'launch 0.6s ease-out' } : {}),
                }}
              >
                {filledAll && !launching && (
                  <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)', height: '30%', animation: 'scanline 3s linear infinite', pointerEvents: 'none' }} />
                )}
                <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  {launching ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                        <circle cx="12" cy="12" r="10" strokeDasharray="50 20" />
                      </svg>
                      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                      CALCULATING ROUTE...
                    </>
                  ) : (
                    <>EXECUTE GENERATION ⚙️</>
                  )}
                </span>
              </button>
              {!filledAll && (
                <p style={{ textAlign: 'center', color: isLight ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 10 }}>
                  Enter budget and time to unlock route generation
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 80,
        background: isLight ? 'rgba(245,240,232,0.95)' : 'rgba(12,12,20,0.9)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderTop: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)',
        padding: '12px 0', transition: 'background 0.4s ease, border-color 0.4s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {[
            { value: '34', label: 'Places', emoji: '📍' },
            { value: '50+', label: 'Food Spots', emoji: '🍽️' },
            { value: '20+', label: 'Stay Options', emoji: '🏨' },
            { value: '< 3s', label: 'Generation', emoji: '⚡' },
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
