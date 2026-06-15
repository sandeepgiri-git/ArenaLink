"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix missing marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface StaticLocationMapProps {
  lat: number;
  lng: number;
}

export default function StaticLocationMap({ lat, lng }: StaticLocationMapProps) {
  return (
    <div className="h-48 sm:h-64 w-full rounded-xl overflow-hidden border border-border relative z-0">
      <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} dragging={false} zoomControl={true} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}></Marker>
      </MapContainer>
    </div>
  );
}
