'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { eventAPI } from '@/lib/api';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
  latitude: number;
  longitude: number;
  tags: string[];
  attendee_count: number;
}

export default function EventMap() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Fix Leaflet default marker icon issue
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      setMapReady(true);
    }

    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await eventAPI.listMap();
      setEvents(response.data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatTag = (tag: string) => {
    return tag
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (loading || !mapReady) {
    return (
      <div className="h-full flex items-center justify-center bg-charcoal/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-solidarity-red mx-auto mb-4"></div>
          <p className="text-charcoal/70">Loading map...</p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-charcoal/5 rounded-lg">
        <div className="text-center p-8">
          <p className="text-xl font-semibold text-charcoal mb-2">No events with locations yet</p>
          <p className="text-charcoal/60">Events with coordinates will appear on the map</p>
        </div>
      </div>
    );
  }

  // Calculate center from events
  const centerLat = events.reduce((sum, e) => sum + e.latitude, 0) / events.length;
  const centerLng = events.reduce((sum, e) => sum + e.longitude, 0) / events.length;

  return (
    <div className="h-[600px] rounded-lg overflow-hidden border border-charcoal/10">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map((event) => (
          <Marker key={event.id} position={[event.latitude, event.longitude]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-charcoal mb-1">{event.title}</h3>
                {event.tags && event.tags.length > 0 && (
                  <p className="text-sm text-charcoal/70 mb-2">
                    {event.tags.slice(0, 2).map(formatTag).join(', ')}
                    {event.tags.length > 2 && ` +${event.tags.length - 2}`}
                  </p>
                )}
                <p className="text-sm text-charcoal/80 mb-2">{event.description.slice(0, 100)}...</p>
                <p className="text-xs text-charcoal/60 mb-1">📅 {formatEventDate(event.event_date)}</p>
                <p className="text-xs text-charcoal/60 mb-1">📍 {event.location}</p>
                <p className="text-xs text-charcoal/60 mb-3">👥 {event.attendee_count} attending</p>
                <a
                  href={`/events/${event.id}`}
                  className="text-sm text-solidarity-red hover:underline font-medium"
                >
                  View Details →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
