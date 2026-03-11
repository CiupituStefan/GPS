import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';

export interface GPSData {
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  speed: number | null;
  accuracy: number | null;
  heading: number | null;
  timestamp: number | null;
  gpsEnabled: boolean;
  provider: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: GPSData = {
  latitude: null,
  longitude: null,
  altitude: null,
  speed: null,
  accuracy: null,
  heading: null,
  timestamp: null,
  gpsEnabled: false,
  provider: '--',
  isLoading: true,
  error: null,
};

export function useLocation() {
  const [gpsData, setGPSData] = useState<GPSData>(initialState);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  const requestPermission = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setPermissionGranted(granted);
      if (!granted) {
        setGPSData(prev => ({
          ...prev,
          isLoading: false,
          error: 'Location permission denied. Please enable it in Settings.',
        }));
      }
      return granted;
    } catch (err) {
      setGPSData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to request location permission.',
      }));
      return false;
    }
  }, []);

  const checkGPSStatus = useCallback(async () => {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      const providerStatus = await Location.getProviderStatusAsync();
      setGPSData(prev => ({
        ...prev,
        gpsEnabled: enabled,
        provider: providerStatus.gpsAvailable
          ? 'GPS'
          : providerStatus.networkAvailable
            ? 'Network'
            : 'None',
      }));
      return enabled;
    } catch {
      return false;
    }
  }, []);

  const startWatching = useCallback(async () => {
    if (watchRef.current) return;

    try {
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 0,
        },
        (location) => {
          setGPSData(prev => ({
            ...prev,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude,
            speed: location.coords.speed,
            accuracy: location.coords.accuracy,
            heading: location.coords.heading,
            timestamp: location.timestamp,
            gpsEnabled: true,
            isLoading: false,
            error: null,
          }));
        }
      );
      watchRef.current = sub;
    } catch (err) {
      setGPSData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to start GPS tracking.',
      }));
    }
  }, []);

  const stopWatching = useCallback(() => {
    if (watchRef.current) {
      watchRef.current.remove();
      watchRef.current = null;
    }
  }, []);

  const refreshLocation = useCallback(async () => {
    setGPSData(prev => ({ ...prev, isLoading: true }));
    await checkGPSStatus();
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      setGPSData(prev => ({
        ...prev,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude,
        speed: location.coords.speed,
        accuracy: location.coords.accuracy,
        heading: location.coords.heading,
        timestamp: location.timestamp,
        isLoading: false,
        error: null,
      }));
    } catch {
      setGPSData(prev => ({ ...prev, isLoading: false }));
    }
  }, [checkGPSStatus]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const granted = await requestPermission();
      if (!mounted || !granted) return;

      const enabled = await checkGPSStatus();
      if (!mounted) return;

      if (enabled) {
        await startWatching();
      } else {
        setGPSData(prev => ({
          ...prev,
          isLoading: false,
          error: 'GPS is disabled. Please enable location services.',
        }));
      }
    };

    init();

    const statusInterval = setInterval(() => {
      if (mounted) checkGPSStatus();
    }, 5000);

    return () => {
      mounted = false;
      clearInterval(statusInterval);
      stopWatching();
    };
  }, [requestPermission, checkGPSStatus, startWatching, stopWatching]);

  return {
    ...gpsData,
    permissionGranted,
    refreshLocation,
    stopWatching,
    startWatching,
  };
}
