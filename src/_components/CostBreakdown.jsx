import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function CostBreakdown({ itinerary }) {
  const { theme } = useAppContext();
  const isLight = theme === 'light';
  if (!itinerary) return null;

  const userBudget = itinerary.budgetAmount || (itinerary.budgetTier === 'low' ? 500 : itinerary.budgetTier === 'medium' ? 1500 : 5000);
  const isOverBudget = itinerary.totalCost > userBudget;
  const difference = Math.abs(userBudget - itinerary.totalCost);

  const rows = [
    { label: '🎫 Entry Costs',     value: itinerary.totalCost - itinerary.travelCost - itinerary.foodTotal },
    { label: '🚗 Travel Costs',    value: itinerary.travelCost },
    { label: '🍽️ Est. Food Costs', value: itinerary.foodTotal },
  ];

  return (
    <div style={{
      background: isLight ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.03)',
      border: isLight ? '1px solid rgba(0,0,0,0.10)' : '1px solid rgba(255,255,255,0.08)',
      borderRadius: 20,
      padding: 28,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      transition: 'background 0.4s ease, border-color 0.4s ease',
    }}>
      {/* Section title */}
      <h2 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 800,
        fontSize: 22, letterSpacing: '0.08em', margin: '0 0 24px',
        background: isLight ? 'linear-gradient(90deg, #b45309, #0d7a4e)' : 'linear-gradient(90deg, #f59e0b, #10b981)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>
        📊 TRIP ANALYSIS
      </h2>

      {/* Cost rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {rows.map((row, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 0',
            borderBottom: isLight ? '1px dotted rgba(0,0,0,0.08)' : '1px dotted rgba(255,255,255,0.06)',
          }}>
            <span style={{ color: isLight ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif", fontSize: 14, transition: 'color 0.3s ease' }}>
              {row.label}
            </span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: isLight ? '#b45309' : '#f59e0b', fontSize: 15 }}>
              ₹{row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Grand total */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 0 12px',
        borderTop: isLight ? '1px solid rgba(180,83,9,0.25)' : '1px solid rgba(245,158,11,0.2)',
        marginTop: 4,
      }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: isLight ? '#1a1a2e' : '#fff', fontSize: 16, letterSpacing: '0.06em', transition: 'color 0.3s ease' }}>
          💰 Total Estimated
        </span>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: isLight ? '#b45309' : '#f59e0b', fontSize: 26 }}>
          ₹{itinerary.totalCost}
        </span>
      </div>

      {/* Budget status badge */}
      {isOverBudget ? (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '12px 20px', borderRadius: 999, marginTop: 12,
          background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)',
          color: '#f87171', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
          letterSpacing: '0.05em',
          boxShadow: '0 0 20px rgba(239,68,68,0.15)',
        }}>
          ⚠️ Exceeds budget by ₹{difference}
        </div>
      ) : (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '12px 20px', borderRadius: 999, marginTop: 12,
          background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.25)',
          color: isLight ? '#0d7a4e' : '#34d399', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
          letterSpacing: '0.05em',
          boxShadow: '0 0 20px rgba(16,185,129,0.2)',
        }}>
          ✅ Within budget — ₹{difference} remaining
        </div>
      )}

      {/* AI insight */}
      {itinerary.insight && (
        <div style={{
          marginTop: 20, padding: '14px 18px', borderRadius: 12,
          border: isLight ? '1px solid rgba(180,83,9,0.18)' : '1px solid rgba(245,158,11,0.15)',
          background: isLight ? 'rgba(180,83,9,0.04)' : 'rgba(245,158,11,0.03)',
          textAlign: 'center',
        }}>
          <p style={{
            color: isLight ? 'rgba(180,83,9,0.75)' : 'rgba(245,158,11,0.65)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontStyle: 'italic', margin: 0, lineHeight: 1.6,
          }}>
            💡 "{itinerary.insight}"
          </p>
        </div>
      )}
    </div>
  );
}
