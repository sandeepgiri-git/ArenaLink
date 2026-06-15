"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix missing marker icons in leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface LocationPickerMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  defaultLat?: number;
  defaultLng?: number;
}

function LocationMarker({ onSelect, defaultLat, defaultLng }: { onSelect: (lat: number, lng: number) => void, defaultLat?: number, defaultLng?: number }) {
  const [position, setPosition] = useState<[number, number] | null>(
    defaultLat && defaultLng ? [defaultLat, defaultLng] : null
  );

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function LocationPickerMap({ onLocationSelect, defaultLat, defaultLng }: LocationPickerMapProps) {
  // Center map on user's location if possible, otherwise default to a city
  const [center, setCenter] = useState<[number, number]>([51.505, -0.09]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (defaultLat && defaultLng) {
      setCenter([defaultLat, defaultLng]);
      setLoading(false);
    } else if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
          setLoading(false);
        },
        () => {
          setLoading(false); // Fallback to default
        }
      );
    } else {
      setLoading(false);
    }
  }, [defaultLat, defaultLng]);

  if (loading) return <div className="h-64 bg-surface-hover rounded-xl animate-pulse"></div>;

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border border-border relative z-0">
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onSelect={onLocationSelect} defaultLat={defaultLat} defaultLng={defaultLng} />
      </MapContainer>
    </div>
  );
}
