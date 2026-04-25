import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { clearSession } from '../auth/authUtils';

export default function Navbar() {
  const { user, setUser, theme, toggleTheme } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    setUser(null);
    navigate('/');
  };

  const isLight = theme === 'light';

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        height: 64,
        background: isLight ? 'rgba(245,240,232,0.9)' : 'rgba(12,12,20,0.70)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.05)',
        fontFamily: "'DM Sans', sans-serif",
        transition: 'background 0.4s ease, border-color 0.4s ease',
      }}
    >
      <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 34,
            height: 34,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            fontSize: 16,
            boxShadow: '0 0 12px rgba(245,158,11,0.25)',
          }}
        >
          🗺️
        </span>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em' }}>
          <span style={{ color: '#f59e0b' }}>City</span>
          <span style={{ color: isLight ? '#1a1a2e' : '#ffffff' }}>Pilot</span>
          <span
            style={{
              color: '#10b981',
              fontSize: 11,
              fontWeight: 600,
              marginLeft: 4,
              letterSpacing: '0.08em',
              verticalAlign: 'super',
            }}
          >
            AI
          </span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <a href="#how"
          style={{ color: isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none', fontWeight: 400, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = isLight ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.7)'}
          onMouseLeave={e => e.currentTarget.style.color = isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)'}
        >
          How it works
        </a>
        <a href="#about"
          style={{ color: isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)', fontSize: 13, textDecoration: 'none', fontWeight: 400, transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = isLight ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.7)'}
          onMouseLeave={e => e.currentTarget.style.color = isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)'}
        >
          About Nashik
        </a>

        <button
          onClick={toggleTheme}
          title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          style={{
            background: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)',
            border: isLight ? '1px solid rgba(0,0,0,0.15)' : '1px solid rgba(255,255,255,0.12)',
            borderRadius: 20,
            padding: '6px 14px',
            cursor: 'pointer',
            fontSize: 16,
            transition: 'all 0.3s',
            lineHeight: 1,
          }}
        >
          {isLight ? 'Dark' : 'Light'}
        </button>

        {user ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
              border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 999,
              padding: '5px 14px 5px 6px',
              transition: 'background 0.4s ease, border-color 0.4s ease',
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(16,185,129,0.18))',
                border: '1px solid rgba(245,158,11,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                marginRight: 8,
              }}
            >
              👤
            </div>
            <span style={{ color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 400 }}>
              Hi,{' '}
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>{user.name}</span>
            </span>

            <div
              style={{
                width: 1,
                height: 18,
                background: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                margin: '0 12px',
              }}
            />

            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)',
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                padding: 0,
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = isLight ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.7)'}
              onMouseLeave={e => e.currentTarget.style.color = isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)'}
            >
              Logout →
            </button>
          </div>
        ) : (
          <Link
            to="/"
            style={{
              background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
              border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 999,
              padding: '6px 18px',
              color: isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)',
              fontSize: 13,
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
