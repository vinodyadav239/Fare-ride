import React, { useEffect, useState, useRef } from 'react';

const MapView = ({ ride }) => {
  const [driver, setDriver] = useState(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [routePolyline, setRoutePolyline] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [reached, setReached] = useState(false);
  const mapRef = useRef(null);
  const movementIntervalRef = useRef(null);
  const notifiedRef = useRef(false);

  // Initialize Google Maps with fallback
  useEffect(() => {
    const initMap = () => {
      if (!window.google || !mapRef.current) return;

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 13.63, lng: 79.42 },
        zoom: 14,
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      });

      setMap(mapInstance);
    };

    if (window.google) {
      initMap();
    } else {
      window.initMap = initMap;
    }

    return () => {
      if (map) {
        map.setMap(null);
      }
    };
  }, []);

  // Build route between pickup and destination using Google Directions (road-following polyline)
  useEffect(() => {
    if (!map || !window.google) return;

    const defaultPickup = { lat: 13.6236179, lng: 79.2810435 };
    const defaultDest = { lat: 13.65, lng: 79.45 };

    const pickup = ride?.pickup || defaultPickup;
    const destination = ride?.destination || defaultDest;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route({
      origin: new window.google.maps.LatLng(pickup.lat, pickup.lng),
      destination: new window.google.maps.LatLng(destination.lat, destination.lng),
      travelMode: window.google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: false
    }, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK && result?.routes?.[0]) {
        const route = result.routes[0];
        const overviewPath = route.overview_path || [];
        const pts = overviewPath.map(p => ({ lat: p.lat(), lng: p.lng() }));

        setRoutePath(pts);

        if (routePolyline) {
          routePolyline.setPath(pts);
        } else {
          const poly = new window.google.maps.Polyline({
            path: pts,
            geodesic: false,
            strokeColor: '#2563eb',
            strokeOpacity: 0.9,
            strokeWeight: 4
          });
          poly.setMap(map);
          setRoutePolyline(poly);
        }

        try {
          const bounds = new window.google.maps.LatLngBounds();
          pts.forEach(pt => bounds.extend(new window.google.maps.LatLng(pt.lat, pt.lng)));
          map.fitBounds(bounds, 48);
        } catch (_) {}
      } else {
        // Fallback to simple straight path if Directions fails
        const steps = 12;
        const pts = [];
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          pts.push({
            lat: pickup.lat + (destination.lat - pickup.lat) * t,
            lng: pickup.lng + (destination.lng - pickup.lng) * t
          });
        }
        setRoutePath(pts);
        if (routePolyline) {
          routePolyline.setPath(pts);
        } else {
          const poly = new window.google.maps.Polyline({
            path: pts,
            geodesic: false,
            strokeColor: '#2563eb',
            strokeOpacity: 0.9,
            strokeWeight: 4
          });
          poly.setMap(map);
          setRoutePolyline(poly);
        }
      }
    });
  }, [map, ride]);

  // Add markers (pickup, destination, driver)
  useEffect(() => {
    if (!map || !window.google) return;

    markers.forEach(marker => marker.setMap(null));
    const newMarkers = [];

    const pickup = ride?.pickup || { lat: 13.6236179, lng: 79.2810435, name: 'Pickup' };
    const destination = ride?.destination || { lat: 13.65, lng: 79.45, name: 'Destination' };

    const pickupMarker = new window.google.maps.Marker({
      position: { lat: pickup.lat, lng: pickup.lng },
      map: map,
      title: pickup.name || 'Pickup Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#10b981"/>
            <text x="12" y="16" text-anchor="middle" fill="white" font-size="12">📍</text>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(30, 30),
        anchor: new window.google.maps.Point(15, 15)
      }
    });

    const destMarker = new window.google.maps.Marker({
      position: { lat: destination.lat, lng: destination.lng },
      map: map,
      title: destination.name || 'Destination',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#ef4444"/>
            <text x="12" y="16" text-anchor="middle" fill="white" font-size="12">🏁</text>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(30, 30),
        anchor: new window.google.maps.Point(15, 15)
      }
    });

    newMarkers.push(pickupMarker, destMarker);

    if (driver) {
      const driverMarker = new window.google.maps.Marker({
        position: { lat: driver.lat, lng: driver.lng },
        map: map,
        title: `Driver: ${driver.name}`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#3b82f6"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="16">🚖</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        }
      });
      newMarkers.push(driverMarker);
    }

    setMarkers(newMarkers);
  }, [map, driver, ride]);

  // Movement only AFTER driver accepts (ride.status === 'accepted')
  useEffect(() => {
    // Cleanup any prior movement when status changes away from accepted
    if (movementIntervalRef.current) {
      clearInterval(movementIntervalRef.current);
      movementIntervalRef.current = null;
    }

    if (!ride || !routePath.length) return;

    if (ride.status !== 'accepted') {
      // Not accepted yet: reset driver and arrival banner
      setDriver(null);
      setReached(false);
      notifiedRef.current = false;
      setRouteIndex(0);
      return;
    }

    // Accepted: set driver at start and begin movement
    setReached(false);
    notifiedRef.current = false;
    setRouteIndex(0);
    setDriver({ name: 'Raju', lat: routePath[0].lat, lng: routePath[0].lng });

    movementIntervalRef.current = setInterval(() => {
      setRouteIndex((idx) => {
        const nextIdx = Math.min(idx + 1, routePath.length - 1);
        const nextPoint = routePath[nextIdx];
        if (nextPoint) {
          setDriver((prev) => prev ? { ...prev, lat: nextPoint.lat, lng: nextPoint.lng } : prev);
        }

        if (nextIdx === routePath.length - 1 && !notifiedRef.current) {
          notifiedRef.current = true;
          setReached(true);
          try { window?.alert && window.alert('Reached the destination'); } catch (_) {}
          if (movementIntervalRef.current) {
            clearInterval(movementIntervalRef.current);
            movementIntervalRef.current = null;
          }
        }
        return nextIdx;
      });
    }, 1000);

    return () => {
      if (movementIntervalRef.current) {
        clearInterval(movementIntervalRef.current);
        movementIntervalRef.current = null;
      }
    };
  }, [ride?.status, routePath]);

  const fallbackContent = React.createElement('div', {
    className: 'h-full flex items-center justify-center bg-gray-100'
  }, [
    React.createElement('div', {
      key: 'fallback-content',
      className: 'text-center p-8'
    }, [
      React.createElement('h3', {
        key: 'fallback-title',
        className: 'text-xl font-semibold text-gray-700 mb-4'
      }, 'Map Loading...'),
      React.createElement('p', {
        key: 'fallback-text',
        className: 'text-gray-500 mb-4'
      }, 'Google Maps is loading. Please wait...'),
      React.createElement('div', {
        key: 'loading-spinner',
        className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'
      })
    ])
  ]);

  return React.createElement('div', {
    className: 'h-[80vh] rounded-2xl shadow-lg overflow-hidden bg-gray-100'
  }, [
    React.createElement('div', {
      key: 'map-header',
      className: 'bg-white p-4 border-b'
    }, [
      React.createElement('h3', {
        key: 'map-title',
        className: 'text-lg font-semibold text-gray-800'
      }, 'Google Maps - Transit Tracking'),
      React.createElement('p', {
        key: 'map-subtitle',
        className: 'text-sm text-gray-600'
      }, reached ? 'Arrived at destination' : (ride?.status === 'accepted' ? 'Driver en route' : 'Waiting for driver to accept'))
    ]),
    React.createElement('div', {
      key: 'map-container',
      className: 'relative h-full'
    }, [
      React.createElement('div', {
        key: 'map-canvas',
        ref: mapRef,
        className: 'w-full h-full'
      }),
      !window.google && fallbackContent,
      reached && React.createElement('div', {
        key: 'arrival-banner',
        className: 'absolute top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow'
      }, 'Reached the destination')
    ])
  ]);
};

export default MapView;