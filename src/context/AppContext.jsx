import { createContext, useState, useEffect, useContext } from 'react';
import { getSession } from '../auth/authUtils';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem("citypilot_theme") || "dark");

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("citypilot_theme", next);
  };

  useEffect(() => {
    document.body.style.background = theme === "dark" ? "#0c0c14" : "#f5f0e8";
    document.body.style.transition = "background 0.4s ease";
  }, [theme]);

  useEffect(() => {
    const session = getSession();
    if (session) setUser(session);

    const loadData = async () => {
      try {
        const [placesRes, transportRes, foodRes, hotelsRes, busstopsRes] = await Promise.all([
          fetch('/data/places.json'),
          fetch('/data/transport.json'),
          fetch('/data/food.json'),
          fetch('/data/hotels.json'),
          fetch('/data/busstops.json')
        ]);

        setData({
          places: await placesRes.json(),
          transport: await transportRes.json(),
          food: await foodRes.json(),
          hotels: await hotelsRes.json(),
          busstops: await busstopsRes.json()
        });
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <AppContext.Provider value={{ data, user, setUser, itinerary, setItinerary, loading, theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
