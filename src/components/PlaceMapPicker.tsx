import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { Place } from '../types';

declare global {
  interface Window {
    google?: any;
    __googleMapsPromise?: Promise<any>;
  }
}

interface PlaceMapPickerProps {
  places: Place[];
  selectedPlaceId: string;
  center: { lat: number; lng: number };
  onSelectPlace: (place: Place) => void;
}

function loadGoogleMaps(apiKey: string) {
  if (window.google?.maps) {
    return Promise.resolve(window.google);
  }

  if (window.__googleMapsPromise) {
    return window.__googleMapsPromise;
  }

  window.__googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return window.__googleMapsPromise;
}

export default function PlaceMapPicker({
  places,
  selectedPlaceId,
  center,
  onSelectPlace,
}: PlaceMapPickerProps) {
  const apiKey = (import.meta as ImportMeta & {
    env: Record<string, string | undefined>;
  }).env.VITE_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const selectedPlace = useMemo(
    () => places.find((place) => place.id === selectedPlaceId) || null,
    [places, selectedPlaceId],
  );

  useEffect(() => {
    if (!apiKey) {
      setMapError("Ajoutez VITE_GOOGLE_MAPS_API_KEY dans votre fichier .env pour activer la carte.");
      return;
    }

    let cancelled = false;

    loadGoogleMaps(apiKey)
      .then((google) => {
        if (cancelled || !mapRef.current) return;

        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center,
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        setMapReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setMapError("Impossible de charger Google Maps pour le moment.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey, center]);

  useEffect(() => {
    if (!mapReady || !window.google?.maps || !mapInstanceRef.current) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();

    places.forEach((place) => {
      const marker = new window.google.maps.Marker({
        map: mapInstanceRef.current,
        position: { lat: place.lat, lng: place.lng },
        title: place.name,
        animation: place.id === selectedPlaceId ? window.google.maps.Animation.DROP : undefined,
      });

      marker.addListener('click', () => {
        onSelectPlace(place);
        mapInstanceRef.current.panTo({ lat: place.lat, lng: place.lng });
      });

      markersRef.current.push(marker);
      bounds.extend({ lat: place.lat, lng: place.lng });
    });

    if (selectedPlace) {
      mapInstanceRef.current.panTo({ lat: selectedPlace.lat, lng: selectedPlace.lng });
      mapInstanceRef.current.setZoom(14);
    } else if (places.length > 0) {
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [mapReady, onSelectPlace, places, selectedPlace, selectedPlaceId]);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl overflow-hidden border border-dark-border bg-dark/50">
        {mapError ? (
          <div className="min-h-[320px] p-6 flex flex-col items-center justify-center text-center text-slate-400">
            <MapPin size={28} className="text-emerald-400 mb-3" />
            <p className="font-medium text-white mb-2">Carte indisponible</p>
            <p className="text-sm max-w-md">{mapError}</p>
          </div>
        ) : !mapReady ? (
          <div className="min-h-[320px] flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-500" size={28} />
          </div>
        ) : (
          <div ref={mapRef} className="min-h-[320px] w-full" />
        )}
      </div>

      <div className="grid gap-3 max-h-80 overflow-y-auto">
        {places.map((place) => (
          <button
            key={place.id}
            type="button"
            onClick={() => onSelectPlace(place)}
            className={`text-left p-4 rounded-xl border transition-all ${
              selectedPlaceId === place.id
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-dark-border bg-dark/40 hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{place.name}</p>
                <p className="text-sm text-slate-400 mt-1">{place.address}, {place.city}</p>
                <p className="text-xs text-slate-500 mt-2">Admin: {place.adminName}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-emerald-400 font-bold">{place.pricePerHour} DT/h</p>
                <p className="text-xs text-slate-500 mt-1">{place.rating.toFixed(1)} / 5</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
