import React from 'react';
import { useAppContext } from '../context/AppContext';

const visitDuration = {
  "Sula Vineyards": { "minTime": 2.5, "maxTime": 3.5, "avgTime": 3 },
  "Soma Vine Village": { "minTime": 2, "maxTime": 3, "avgTime": 2.5 },
  "York Winery & Tasting Room": { "minTime": 1.5, "maxTime": 2.5, "avgTime": 2 },
  "Saptashringi Devi Temple": { "minTime": 3, "maxTime": 5, "avgTime": 4 },
  "Muktidham Temple": { "minTime": 0.75, "maxTime": 1, "avgTime": 1 },
  "Kalaram Temple": { "minTime": 0.75, "maxTime": 1, "avgTime": 1 },
  "Shree Navshya Ganapati Temple": { "minTime": 0.5, "maxTime": 0.75, "avgTime": 0.6 },
  "Kapaleshwar Mahadev Mandir": { "minTime": 0.5, "maxTime": 0.75, "avgTime": 0.6 },
  "Someshwar Temple": { "minTime": 0.75, "maxTime": 1, "avgTime": 1 },
  "ISKCON Nashik": { "minTime": 1, "maxTime": 1.5, "avgTime": 1.25 },
  "Trimbakeshwar Temple": { "minTime": 1.5, "maxTime": 2.5, "avgTime": 2 },
  "Chandreshwar Temple (Chandwad)": { "minTime": 0.75, "maxTime": 1, "avgTime": 1 },
  "Renuka Mata Temple (Chandwad)": { "minTime": 0.75, "maxTime": 1, "avgTime": 1 },
  "Ichhapurti Ganesh Mandir (Chandwad)": { "minTime": 0.5, "maxTime": 0.75, "avgTime": 0.6 },
  "Anjneri Hill": { "minTime": 3, "maxTime": 4, "avgTime": 3.5 },
  "Brahmagiri Hill": { "minTime": 3, "maxTime": 4, "avgTime": 3.5 },
  "Harihar Fort": { "minTime": 4, "maxTime": 6, "avgTime": 5 },
  "Mangi Tungi": { "minTime": 5, "maxTime": 7, "avgTime": 6 },
  "Tringalwadi Lake": { "minTime": 1.5, "maxTime": 2, "avgTime": 1.75 },
  "Dugarwadi Waterfall": { "minTime": 2.5, "maxTime": 3.5, "avgTime": 3 },
  "Someshwar Waterfall": { "minTime": 1, "maxTime": 1.5, "avgTime": 1.25 },
  "Gangapur Dam": { "minTime": 1, "maxTime": 2, "avgTime": 1.5 },
  "Pandav Leni (Nashik Caves)": { "minTime": 1.5, "maxTime": 2.5, "avgTime": 2 },
  "Coin Museum": { "minTime": 1, "maxTime": 1.5, "avgTime": 1.25 },
  "Kumaramangalam Artillery Museum": { "minTime": 1, "maxTime": 1.5, "avgTime": 1.25 },
  "Jain Mandir Nashik": { "minTime": 0.5, "maxTime": 0.75, "avgTime": 0.6 },
  "Rangmahal (Chandwad)": { "minTime": 0.75, "maxTime": 1, "avgTime": 1 },
  "Deolali Camp": { "minTime": 1, "maxTime": 2, "avgTime": 1.5 },
  "Sita Gumpha": { "minTime": 0.3, "maxTime": 0.5, "avgTime": 0.4 },
  "Ramkund": { "minTime": 0.75, "maxTime": 1, "avgTime": 1 },
  "Ganga Ghat": { "minTime": 0.75, "maxTime": 1, "avgTime": 1 },
  "Nashik City Centre Mall": { "minTime": 1.5, "maxTime": 3, "avgTime": 2 },
  "Shrine of Infant Jesus": { "minTime": 0.5, "maxTime": 0.75, "avgTime": 0.6 },
  "Nandur Madhyameshwar Bird Sanctuary": { "minTime": 2, "maxTime": 4, "avgTime": 3 }
};

const formatTime = (hrs) => {
  if (hrs < 1) return `${Math.round(hrs * 60)} mins`;
  if (hrs === 1) return `1 hr`;
  const h = Math.floor(hrs);
  const m = Math.round((hrs - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h} hrs`;
};

export default function PlaceCard({ place, step }) {
  const { data, itinerary, theme } = useAppContext();
  const isLight = theme === 'light';
  const budgetTier = itinerary?.budgetTier || 'medium';
  let placeFood = [];
  if (data?.food?.byPlace && place?.id) {
    placeFood = data.food.byPlace[place.id]?.[budgetTier] || [];
  }
  const duration = visitDuration[place.name];
  const isFree = !place.entry_cost_inr || place.entry_cost_inr === 0;

  return (
    <div
      style={{
        background: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.03)',
        border: isLight ? '1px solid rgba(0,0,0,0.10)' : '1px solid rgba(255,255,255,0.08)',
        borderLeft: isLight ? '3px solid #b45309' : '3px solid #f59e0b',
        borderRadius: 20,
        padding: 24,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        marginBottom: 4,
        transition: 'box-shadow 0.25s, background 0.4s ease, border-color 0.4s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = isLight ? '0 0 30px rgba(180,83,9,0.10)' : '0 0 30px rgba(245,158,11,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        {/* Left: step badge + name */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
            background: isLight ? 'rgba(180,83,9,0.12)' : 'rgba(245,158,11,0.15)',
            border: isLight ? '1.5px solid rgba(180,83,9,0.35)' : '1.5px solid rgba(245,158,11,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14,
            color: isLight ? '#b45309' : '#f59e0b',
            marginTop: 2,
          }}>
            {step}
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 20,
              color: isLight ? '#1a1a2e' : '#fff',
              margin: '0 0 6px', lineHeight: 1.2, transition: 'color 0.3s ease',
            }}>
              {place.name}
            </h3>
            {place.description && (
              <p style={{
                color: isLight ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.45)',
                fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                margin: '0 0 10px', lineHeight: 1.5, transition: 'color 0.3s ease',
              }}>
                {place.description}
              </p>
            )}
            {/* Bottom row: category + duration */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              {place.category && (
                <span style={{
                  background: isLight ? 'rgba(180,83,9,0.10)' : 'rgba(245,158,11,0.10)',
                  border: isLight ? '1px solid rgba(180,83,9,0.25)' : '1px solid rgba(245,158,11,0.25)',
                  color: isLight ? '#b45309' : '#f59e0b',
                  borderRadius: 999, padding: '3px 12px',
                  fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 10,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>
                  {place.category === 'temple' ? '🛕' : place.category === 'heritage' ? '🏛️' : place.category === 'nature' ? '🌿' : place.category === 'vineyard' ? '🍇' : place.category === 'museum' ? '🏛️' : place.category === 'ghat' ? '🌊' : place.category === 'leisure' ? '🛍️' : ''} {place.category}
                </span>
              )}
              {duration ? (
                <span style={{ color: isLight ? '#6d28d9' : 'rgba(167,139,250,0.8)', fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
                  🕐 {formatTime(duration.minTime)} – {formatTime(duration.maxTime)}
                </span>
              ) : (
                place.visit_duration_hrs && (
                  <span style={{ color: isLight ? '#6d28d9' : 'rgba(167,139,250,0.8)', fontSize: 12 }}>
                    🕐 {place.visit_duration_hrs} hrs visit
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* Right: entry cost */}
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          {isFree ? (
            <span style={{
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
              color: isLight ? '#0d7a4e' : '#10b981', borderRadius: 999, padding: '4px 14px',
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12,
              letterSpacing: '0.1em',
            }}>
              FREE
            </span>
          ) : (
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: isLight ? '#0d7a4e' : '#10b981' }}>
              ₹{place.entry_cost_inr}
            </span>
          )}
        </div>
      </div>

      {/* Food near this place */}
      {placeFood && placeFood.length > 0 && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: isLight ? '1px solid rgba(0,0,0,0.07)' : '1px solid rgba(255,255,255,0.06)' }}>
          <h4 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
            color: isLight ? '#b45309' : 'rgba(245,158,11,0.8)',
            fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 10px',
          }}>
            🍽️ Eat Near This Place
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
            {placeFood.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '6px 10px', borderRadius: 8,
                background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.02)',
              }}>
                <span style={{ color: isLight ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.6)', fontSize: 13 }}>• {item.name}</span>
                <span style={{ color: isLight ? '#b45309' : '#f59e0b', fontWeight: 700, fontSize: 13 }}>{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
