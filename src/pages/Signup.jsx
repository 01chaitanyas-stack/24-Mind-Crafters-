import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../auth/authUtils';
import { useAppContext } from '../context/AppContext';

const STYLE_ID = '__signup-keyframes';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
@keyframes floatUp{0%{transform:translateY(0) scale(1);opacity:0}10%{opacity:1}90%{opacity:0.6}100%{transform:translateY(-120px) scale(0.4);opacity:0}}
@keyframes slideIn{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse-ring{0%,100%{transform:scale(0.92);opacity:0.8}50%{transform:scale(1.06);opacity:0.3}}
@keyframes glow-pulse{0%,100%{box-shadow:0 0 20px rgba(245,158,11,0.3),0 0 60px rgba(245,158,11,0.1)}50%{box-shadow:0 0 35px rgba(245,158,11,0.5),0 0 80px rgba(245,158,11,0.2)}}
@keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
input[type="text"]:-webkit-autofill,
input[type="text"]:-webkit-autofill:hover,
input[type="text"]:-webkit-autofill:focus { -webkit-box-shadow:0 0 0px 1000px rgba(255,255,255,0.04) inset !important; -webkit-text-fill-color:#f1f1f1 !important; border-color:rgba(255,255,255,0.1) !important; }
input::-webkit-contacts-auto-fill-button,
input::-webkit-credentials-auto-fill-button { display:none !important; visibility:hidden !important; pointer-events:none !important; width:0 !important; height:0 !important; }
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
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: isLight ? 0.15 : 0.07, pointerEvents: 'none', transition: 'opacity 0.4s ease' }}
      xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 840">
      {hLines.map(y => <line key={`h${y}`} x1="0" y1={y} x2="1200" y2={y} stroke={isLight ? 'rgba(193,127,36,1)' : '#fff'} strokeWidth="1" strokeDasharray="8 12" />)}
      {vLines.map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="840" stroke={isLight ? 'rgba(193,127,36,1)' : '#fff'} strokeWidth="1" strokeDasharray="8 12" />)}
      <line x1="50" y1="800" x2="1150" y2="40" stroke="#10b981" strokeWidth="2.5" strokeDasharray="16 10" />
      <line x1="0" y1="600" x2="900" y2="0" stroke="#10b981" strokeWidth="2" strokeDasharray="14 12" />
      {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r="2.5" fill="#f59e0b" />)}
    </svg>
  );
}

function getStrength(pw) {
  if (!pw) return null;
  if (pw.length < 6) return { pct: 33, color: '#ef4444', label: 'Weak' };
  if (pw.length < 10) return { pct: 66, color: '#f59e0b', label: 'Good' };
  return { pct: 100, color: '#10b981', label: 'Strong' };
}

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { theme } = useAppContext();
  const isLight = theme === 'light';

  const handleSignup = (e) => {
    e.preventDefault();
    const res = createUser(email, password, name);
    if (res.error) {
      setError(res.error);
    } else {
      navigate('/');
    }
  };

  const [mounted, setMounted] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const particles = useMemo(() => makeParticles(18), []);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const filledAll = name && email && password;
  const strength = getStrength(password);

  const inputBase = {
    width: '100%', boxSizing: 'border-box',
    background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)',
    border: isLight ? '1.5px solid rgba(0,0,0,0.12)' : '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: 14, color: isLight ? '#1a1a2e' : '#fff', fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    padding: '14px 16px', outline: 'none',
    transition: 'border-color 0.25s, box-shadow 0.25s, background 0.4s ease, color 0.3s ease',
  };

  const labelStyle = {
    display: 'flex', alignItems: 'center', gap: 7,
    fontSize: 10, fontWeight: 600, letterSpacing: '0.14em',
    textTransform: 'uppercase', color: isLight ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.35)',
    marginBottom: 8, fontFamily: "'Syne', sans-serif",
    transition: 'color 0.3s ease',
  };

  const focusStyle = (color = '#f59e0b') => ({
    onFocus: e => { e.target.style.borderColor = `${color}80`; e.target.style.boxShadow = `0 0 0 3px ${color}1e`; },
    onBlur: e => { e.target.style.borderColor = isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; },
  });

  return (
    <div style={{ minHeight: '100vh', background: isLight ? '#f5f0e8' : '#0c0c14', position: 'relative', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 20px 80px', transition: 'background 0.4s ease, color 0.3s ease' }}>
      <RoadMapSVG isLight={isLight} />

      <div style={{ position: 'absolute', top: -120, left: -120, width: 500, height: 500, borderRadius: '50%', background: isLight ? 'radial-gradient(circle, rgba(193,127,36,0.12), transparent 70%)' : 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', pointerEvents: 'none', transition: 'background 0.4s ease' }} />
      <div style={{ position: 'absolute', bottom: -160, right: -120, width: 600, height: 600, borderRadius: '50%', background: isLight ? 'radial-gradient(circle, rgba(13,122,78,0.10), transparent 70%)' : 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)', pointerEvents: 'none', transition: 'background 0.4s ease' }} />

      {particles.map(p => (
        <div key={p.id} style={{ position: 'absolute', left: `${p.left}%`, bottom: `${p.bottom}%`, width: p.size, height: p.size, borderRadius: '50%', background: '#f59e0b', opacity: 0, animation: `floatUp ${p.dur}s ${p.delay}s infinite ease-out`, pointerEvents: 'none' }} />
      ))}

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginBottom: 36, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(28px)', transition: 'opacity 0.7s, transform 0.7s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(16,185,129,0.15))', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            🗺️
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 22, letterSpacing: '-0.5px' }}>
            <span style={{ color: '#f59e0b' }}>City</span>
            <span style={{ color: isLight ? '#1a1a2e' : '#fff', transition: 'color 0.3s ease' }}>Pilot</span>
            <span style={{ color: '#10b981', fontSize: 16, marginLeft: 3 }}>AI</span>
          </div>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.08)', border: isLight ? '1px solid rgba(193,127,36,0.30)' : '1px solid rgba(245,158,11,0.18)', borderRadius: 999, padding: '6px 18px 6px 12px', marginBottom: 28 }}>
          <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: isLight ? '#c17f24' : '#f59e0b', animation: 'pulse-ring 2s ease-in-out infinite' }} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: isLight ? '#c17f24' : '#f59e0b', textTransform: 'uppercase' }}>
            Nashik Smart Travel Planner
          </span>
        </div>

        <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 42, letterSpacing: '-1px', margin: '0 0 12px', lineHeight: 1.1, background: 'linear-gradient(90deg, #f59e0b, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Start Your Journey
        </h1>
        <p style={{ color: isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.35)', fontSize: 15, margin: 0, lineHeight: 1.6, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto', transition: 'color 0.3s ease' }}>
          Create your account and explore Nashik like never before
        </p>
      </div>

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 460, background: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.03)', border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)', borderRadius: 28, padding: 36, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: isLight ? '0 20px 60px rgba(0,0,0,0.12)' : '0 40px 80px rgba(0,0,0,0.5)', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(28px)', transition: 'opacity 0.7s 0.2s, transform 0.7s 0.2s, background 0.4s ease, border-color 0.4s ease' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            🧭
          </div>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: isLight ? '#1a1a2e' : '#fff', fontSize: 16, transition: 'color 0.3s ease' }}>Create Account</div>
            <div style={{ color: isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 2, transition: 'color 0.3s ease' }}>Join the CityPilot community</div>
          </div>
        </div>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div style={{ animation: 'slideIn 0.5s 0.3s both' }}>
            <div style={labelStyle}><span style={{ color: isLight ? '#0d7a4e' : '#10b981' }}>👤</span> Full Name</div>
            <input type="text" placeholder="Your full name" value={name} onChange={e => { setName(e.target.value); setError(''); }} required style={inputBase} {...focusStyle('#10b981')} />
          </div>

          <div style={{ animation: 'slideIn 0.5s 0.4s both' }}>
            <div style={labelStyle}><span style={{ color: isLight ? '#c17f24' : '#f59e0b' }}>✉️</span> Email Address</div>
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <input
                type="text"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                required
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  color: '#f1f1f1',
                  fontSize: '15px',
                  outline: 'none',
                  fontFamily: "'DM Sans', sans-serif",
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                }}
                {...focusStyle('#f59e0b')}
              />
            </div>
          </div>

          <div style={{ animation: 'slideIn 0.5s 0.5s both' }}>
            <div style={labelStyle}><span style={{ color: '#a78bfa' }}>🔒</span> Password</div>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} required style={{ ...inputBase, paddingRight: 48 }} {...focusStyle('#a78bfa')} />
              <button type="button" onClick={() => setShowPass(v => !v)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)', fontSize: 13, padding: 0, lineHeight: 1, fontFamily: "'DM Sans', sans-serif" }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {strength && (
              <div style={{ marginTop: 10 }}>
                <div style={{ height: 4, borderRadius: 4, background: isLight ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${strength.pct}%`, borderRadius: 4, background: strength.color, transition: 'width 0.35s ease, background 0.35s ease' }} />
                </div>
                <div style={{ marginTop: 5, fontSize: 11, color: strength.color, fontFamily: "'Syne', sans-serif", fontWeight: 600, letterSpacing: '0.1em' }}>
                  {strength.label}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 999, padding: '10px 18px', color: '#f87171', fontSize: 13, textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div style={{ height: 1, background: isLight ? 'linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent)' : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />

          <div style={{ position: 'relative' }}>
            <button
              type="submit"
              style={{
                position: 'relative', width: '100%', padding: 17, borderRadius: 16, border: 'none',
                fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.16em',
                textTransform: 'uppercase', cursor: filledAll ? 'pointer' : 'default', overflow: 'hidden',
                transition: 'all 0.3s',
                ...(filledAll
                  ? { background: 'linear-gradient(135deg, #f59e0b, #d97706, #10b981)', color: isLight ? '#1a1a2e' : '#0c0c14', animation: 'glow-pulse 3s ease-in-out infinite' }
                  : { background: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)', color: isLight ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)' }),
              }}
            >
              {filledAll && (
                <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)', height: '30%', animation: 'scanline 3s linear infinite', pointerEvents: 'none' }} />
              )}
              <span style={{ position: 'relative', zIndex: 1 }}>CREATE ACCOUNT</span>
            </button>
            {!filledAll && (
              <p style={{ textAlign: 'center', color: isLight ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 10, transition: 'color 0.3s ease' }}>
                Fill all fields to create your account
              </p>
            )}
          </div>
        </form>

        <p style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.3)', fontFamily: "'DM Sans', sans-serif", transition: 'color 0.3s ease' }}>
          Already have an account?{' '}
          <Link to="/" style={{ color: isLight ? '#c17f24' : '#f59e0b', fontWeight: 700, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 80, background: isLight ? 'rgba(245,240,232,0.95)' : 'rgba(12,12,20,0.9)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderTop: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.06)', padding: '12px 0', transition: 'background 0.4s ease, border-color 0.4s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {[
            { value: 'Secure', label: 'Signup', emoji: '🔐' },
            { value: 'No', label: 'Backend', emoji: '☁️' },
            { value: 'Works', label: 'Offline', emoji: '📱' },
            { value: 'Instant', label: 'Access', emoji: '⚡' },
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
