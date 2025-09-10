import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView({ ride }) {
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    if (!ride) return;

    // Simulate driver acceptance after 3s
    setTimeout(() => {
      setDriver({ name: "Raju", lat: 13.63, lng: 79.42 });
      ride.status = "Driver assigned 🚖";
      ride.driver = { name: "Raju" };
    }, 3000);

    // Simulate driver moving every 2s
    let step = 0;
    const interval = setInterval(() => {
      if (driver && step < 5) {
        setDriver((prev) => ({
          ...prev,
          lat: prev.lat + 0.001,
          lng: prev.lng + 0.001,
        }));
        step++;
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [ride]);

  return (
    <MapContainer center={[13.63, 79.42]} zoom={14} className="h-[80vh] rounded-2xl shadow-lg">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {driver && (
        <Marker position={[driver.lat, driver.lng]}>
          <Popup>Driver: {driver.name}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
