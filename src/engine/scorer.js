import { haversine } from "./haversine.js";

export function scorePlaces(places, userLat, userLng) {
  return places
    .map(place => {
      const distance = haversine(userLat, userLng, place.lat, place.lng);
      const score = (place.priority || 5) - (distance / 5);
      return { ...place, distance, score };
    })
    .sort((a, b) => b.score - a.score);
}
