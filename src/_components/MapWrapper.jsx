import { useEffect, useRef } from "react";

export default function MapWrapper({ sequence, startLoc }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      // Dynamically import Leaflet to avoid Vite SSR/CSS timing issues
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Fix Leaflet default marker icon broken in Vite
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Destroy previous instance before re-creating
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      if (!mapRef.current) return;

      const defaultCenter = [20.0059, 73.7897];
      const startCoords = startLoc
        ? [startLoc.lat, startLoc.lng]
        : defaultCenter;

      // Initialise map
      const map = L.map(mapRef.current, {
        center: startCoords,
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: true,
      });
      mapInstanceRef.current = map;

      // OSM tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // Start location marker (green)
      const startIcon = L.divIcon({
        html: `<div style="
          background:#10b981;color:white;border-radius:50%;
          width:32px;height:32px;display:flex;align-items:center;
          justify-content:center;font-size:16px;
          border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);
        ">📍</div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      L.marker(startCoords, { icon: startIcon })
        .addTo(map)
        .bindPopup(`<b>Start: ${startLoc?.name || "Your Location"}</b>`);

      const allCoords = [startCoords];

      // Place markers (gold numbered)
      if (sequence && sequence.length > 0) {
        sequence.forEach((place, index) => {
          if (!place.lat || !place.lng) return;

          const coords = [place.lat, place.lng];
          allCoords.push(coords);

          const placeIcon = L.divIcon({
            html: `<div style="
              background:#f59e0b;color:#1a1a2e;border-radius:50%;
              width:32px;height:32px;display:flex;align-items:center;
              justify-content:center;font-weight:800;font-size:14px;
              border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);
              font-family:'Syne',sans-serif;
            ">${index + 1}</div>`,
            className: "",
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          L.marker(coords, { icon: placeIcon })
            .addTo(map)
            .bindPopup(`<b>${index + 1}. ${place.name}</b><br/>${place.description || ""}`);
        });

        // Dashed gold polyline connecting all stops
        L.polyline(allCoords, {
          color: "#f59e0b",
          weight: 2.5,
          opacity: 0.8,
          dashArray: "8 6",
        }).addTo(map);

        // Fit bounds to all markers
        const bounds = L.latLngBounds(allCoords);
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [sequence, startLoc]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "20px",
        overflow: "hidden",
        zIndex: 1,
      }}
    />
  );
}
