/**
 * Generates an inline HTML document string with Leaflet.js + OpenStreetMap tiles.
 * Used by both native (WebView) and web (iframe) map rendering.
 */

export function generateMapHtml(lat: number, lng: number, zoom: number = 15): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #0f172a; }
    #map { width: 100%; height: 100%; }
    .leaflet-control-attribution { font-size: 10px !important; }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(3); opacity: 0; }
    }
    .pulse-marker {
      width: 16px; height: 16px;
      background: #3b82f6;
      border: 3px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(59,130,246,0.6);
    }
    .pulse-ring {
      position: absolute;
      width: 16px; height: 16px;
      top: 0; left: 0;
      background: rgba(59,130,246,0.4);
      border-radius: 50%;
      animation: pulse 2s ease-out infinite;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    });

    var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri',
      maxZoom: 18
    });

    var map = L.map('map', {
      center: [${lat}, ${lng}],
      zoom: ${zoom},
      layers: [osmLayer],
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    var currentLayer = 'standard';

    // Custom pulsing marker
    var pulseIcon = L.divIcon({
      className: '',
      html: '<div style="position:relative"><div class="pulse-ring"></div><div class="pulse-marker"></div></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    var marker = L.marker([${lat}, ${lng}], { icon: pulseIcon }).addTo(map);
    var accuracyCircle = L.circle([${lat}, ${lng}], {
      radius: 10,
      color: 'rgba(59,130,246,0.3)',
      fillColor: 'rgba(59,130,246,0.1)',
      fillOpacity: 0.5,
      weight: 1
    }).addTo(map);

    // Listen for messages from React Native / parent window
    function handleMessage(event) {
      var data;
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch (e) { return; }

      if (data.type === 'updatePosition') {
        var latlng = [data.lat, data.lng];
        marker.setLatLng(latlng);
        accuracyCircle.setLatLng(latlng);
        if (data.accuracy) {
          accuracyCircle.setRadius(data.accuracy);
        }
        if (data.center !== false) {
          map.setView(latlng);
        }
      } else if (data.type === 'centerOnUser') {
        map.setView(marker.getLatLng(), map.getZoom());
      } else if (data.type === 'toggleMapType') {
        if (currentLayer === 'standard') {
          map.removeLayer(osmLayer);
          map.addLayer(satelliteLayer);
          currentLayer = 'satellite';
        } else {
          map.removeLayer(satelliteLayer);
          map.addLayer(osmLayer);
          currentLayer = 'standard';
        }
      }
    }

    // React Native WebView uses document message event
    window.addEventListener('message', handleMessage);
    document.addEventListener('message', handleMessage);
  <\/script>
</body>
</html>`;
}
