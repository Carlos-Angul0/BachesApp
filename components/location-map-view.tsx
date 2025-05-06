"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { GeoLocation } from "@/context/reports-context"

type LocationMapViewProps = {
  location: GeoLocation
  title: string
}

export default function LocationMapView({ location, title }: LocationMapViewProps) {
  // Initialize leaflet icons only once client side
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    delete (L.Icon.Default.prototype as any)._getIconUrl

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
  }, [isClient])

  if (!isClient) {
    return <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-md"></div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ubicación del bache</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full rounded-md overflow-hidden">
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[location.lat, location.lng]}>
              <Popup>{title}</Popup>
            </Marker>
          </MapContainer>
        </div>
        <div className="text-sm text-gray-500 mt-2">
          Coordenadas: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
        </div>
      </CardContent>
    </Card>
  )
}
