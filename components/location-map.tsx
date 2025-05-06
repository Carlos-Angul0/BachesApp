"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import L from "leaflet"

type LocationMapProps = {
  onLocationSelect: (lat: number, lng: number) => void
  initialLocation?: { lat: number; lng: number }
}

// Componente para manejar eventos del mapa
function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function LocationMap({ onLocationSelect, initialLocation }: LocationMapProps) {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || { lat: 3.4516, lng: -76.532 }) // Coordenadas de Cali por defecto
  const [isOpen, setIsOpen] = useState(false)

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

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng })
  }

  const handleConfirm = () => {
    onLocationSelect(selectedLocation.lat, selectedLocation.lng)
    setIsOpen(false)
  }

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setSelectedLocation({ lat: latitude, lng: longitude })
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error)
          alert("No se pudo obtener tu ubicación actual. Por favor selecciona manualmente en el mapa.")
        },
      )
    } else {
      alert("Tu navegador no soporta geolocalización. Por favor selecciona manualmente en el mapa.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="shrink-0">
          <MapPin className="h-4 w-4 mr-2" />
          Usar GPS / Mapa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selecciona la ubicación del bache</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Button variant="outline" onClick={handleGetCurrentLocation}>
            <MapPin className="h-4 w-4 mr-2" />
            Usar mi ubicación actual
          </Button>
          <div className="h-[400px] w-full rounded-md overflow-hidden">
            {isClient && (
              <MapContainer
                center={[selectedLocation.lat, selectedLocation.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
                <MapEvents onLocationSelect={handleLocationSelect} />
              </MapContainer>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Coordenadas seleccionadas: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>Confirmar ubicación</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
