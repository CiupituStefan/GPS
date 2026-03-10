export function formatCoordinate(value: number | null, type: 'lat' | 'lng'): string {
  if (value === null || value === undefined) return '--';
  const abs = Math.abs(value);
  const degrees = Math.floor(abs);
  const minutesDecimal = (abs - degrees) * 60;
  const minutes = Math.floor(minutesDecimal);
  const seconds = ((minutesDecimal - minutes) * 60).toFixed(2);

  let direction: string;
  if (type === 'lat') {
    direction = value >= 0 ? 'N' : 'S';
  } else {
    direction = value >= 0 ? 'E' : 'W';
  }

  return `${degrees}°${minutes}'${seconds}" ${direction}`;
}

export function formatDecimal(value: number | null, decimals: number = 5): string {
  if (value === null || value === undefined) return '--';
  return value.toFixed(decimals);
}

export function formatAltitude(meters: number | null): string {
  if (meters === null || meters === undefined) return '--';
  return `${meters.toFixed(1)} m`;
}

export function formatSpeed(metersPerSecond: number | null): string {
  if (metersPerSecond === null || metersPerSecond === undefined || metersPerSecond < 0) return '0.0 km/h';
  const kmh = metersPerSecond * 3.6;
  return `${kmh.toFixed(1)} km/h`;
}

export function formatAccuracy(meters: number | null): string {
  if (meters === null || meters === undefined) return '--';
  return `±${meters.toFixed(1)} m`;
}

export function formatDate(timestamp: number | null): string {
  if (!timestamp) return '--';
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatTime(timestamp: number | null): string {
  if (!timestamp) return '--';
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export function estimateSatellites(accuracy: number | null): string {
  if (accuracy === null || accuracy === undefined) return '--';
  if (accuracy <= 5) return '10+';
  if (accuracy <= 10) return '7-9';
  if (accuracy <= 20) return '5-7';
  if (accuracy <= 50) return '3-5';
  return '< 3';
}

export function getGPSQuality(accuracy: number | null): 'excellent' | 'good' | 'moderate' | 'poor' | 'none' {
  if (accuracy === null || accuracy === undefined) return 'none';
  if (accuracy <= 5) return 'excellent';
  if (accuracy <= 15) return 'good';
  if (accuracy <= 50) return 'moderate';
  return 'poor';
}
