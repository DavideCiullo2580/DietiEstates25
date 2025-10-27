"use client";
import dynamic from "next/dynamic";
import React from "react";
import L from "leaflet"; // <--- importa Leaflet qui
import "leaflet/dist/leaflet.css";

// 👇 FIX per far comparire le icone classiche dei marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// --- Dynamic imports (Next.js) ---
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

export default function MappaImmobili({
  immobili,
  immobileSelezionato,
  onSelectImmobile,
}) {
  return (
    <MapContainer
      center={[41.9028, 12.4964]}
      zoom={6}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {immobili.map((immobile) =>
        immobile.lat && immobile.lng ? (
          <Marker
            key={immobile.id}
            position={[immobile.lat, immobile.lng]}
            eventHandlers={{
              click: () => onSelectImmobile(immobile),
            }}
          >
            <Popup>
              <strong>{immobile.tipo_immobile}</strong>
              <br />
              {immobile.prezzo} €
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}
