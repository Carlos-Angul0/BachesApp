"use client"

import { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Button } from "@/components/ui/button"
import { Navigation, AlertTriangle } from "lucide-react"
import type { Report } from "@/context/reports-context"

// Componente para centrar el mapa en la ubicación actual
function LocationFinder({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) {
  const map = useMap()

  const handleFindLocation = () => {
    map.locate({ setView: true, maxZoom: 16 })
  }

  useEffect(() => {
    const onLocationFound = (e: L.LocationEvent) => {
      const { lat, lng } = e.latlng
      onLocationFound(lat, lng)
    }

    map.on("locationfound", onLocationFound)

    return () => {
      map.off("locationfound", onLocationFound)
    }
  }, [map, onLocationFound])

  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: "60px", marginRight: "10px" }}>
      <div className="leaflet-control leaflet-bar">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-md bg-white"
          onClick={handleFindLocation}
          title="Centrar en mi ubicación"
        >
          <Navigation className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

// Componente para centrar el mapa en un marcador específico
function CenterMap({
  center,
  zoom,
}: {
  center: [number, number] | null
  zoom?: number
}) {
  const map = useMap()

  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom())
    }
  }, [center, map, zoom])

  return null
}

type MapViewProps = {
  reports: Report[]
  onMarkerClick: (report: Report) => void
  selectedReport: Report | null
}

export default function MapView({ reports, onMarkerClick, selectedReport }: MapViewProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([3.4516, -76.532]) // Cali por defecto
  const [mapReady, setMapReady] = useState(false)
  const mapRef = useRef<L.Map | null>(null)

  // Inicializar iconos de Leaflet
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })

    setMapReady(true)
  }, [])

  // Crear iconos personalizados según la severidad
  const createCustomIcon = (severity: string) => {
    let color = "blue"

    switch (severity) {
      case "alta":
      case "critica":
        color = "red"
        break
      case "media":
        color = "orange"
        break
      default:
        color = "blue"
    }

    return L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })
  }

  // Manejar cuando se encuentra la ubicación del usuario
  const handleLocationFound = (lat: number, lng: number) => {
    setUserLocation([lat, lng])
    setMapCenter([lat, lng])
  }

  // Centrar en el reporte seleccionado
  useEffect(() => {
    if (selectedReport && selectedReport.ubicacion) {
      setMapCenter([selectedReport.ubicacion.lat, selectedReport.ubicacion.lng])
    }
  }, [selectedReport])

  return (
    <div className="h-[calc(100vh-12rem)] w-full">
      {mapReady && (
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          whenReady={(map) => {
            mapRef.current = map.target
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Marcadores para cada bache */}
          {reports.map((report) => {
            if (!report.ubicacion) return null

            return (
              <Marker
                key={report.id}
                position={[report.ubicacion.lat, report.ubicacion.lng]}
                icon={createCustomIcon(report.severidad)}
                eventHandlers={{
                  click: () => onMarkerClick(report),
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{report.titulo}</p>
                    <p>{report.direccion}</p>
                    <p className="text-xs mt-1">
                      {report.estado === "pendiente" ? (
                        <span className="text-red-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Sin reparar
                        </span>
                      ) : (
                        <span className="text-yellow-600">En proceso de reparación</span>
                      )}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )
          })}

          {/* Marcador de la ubicación del usuario */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={L.divIcon({
                className: "custom-marker",
                html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
                iconSize: [16, 16],
                iconAnchor: [8, 8],
              })}
            >
              <Popup>Tu ubicación actual</Popup>
            </Marker>
          )}

          {/* Controles adicionales */}
          <ZoomControl position="bottomright" />
          <LocationFinder onLocationFound={handleLocationFound} />
          <CenterMap center={mapCenter} zoom={15} />
        </MapContainer>
      )}
    </div>
  )
}
