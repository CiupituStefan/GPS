import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocation } from '../../hooks/useLocation';
import { formatDecimal, formatAccuracy, formatAltitude, formatSpeed } from '../../utils/formatters';
import { generateMapHtml } from '../../utils/mapHtml';

// Conditionally import WebView only on native
let WebView: any = null;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').default;
}

export default function MapScreen() {
  const { latitude, longitude, accuracy, altitude, speed, isLoading, gpsEnabled, error, refreshLocation } = useLocation();
  const webViewRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [mapReady, setMapReady] = useState(false);

  // Send position updates to the map
  const sendMessage = useCallback((message: object) => {
    const json = JSON.stringify(message);
    if (Platform.OS === 'web') {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(json, '*');
      }
    } else {
      webViewRef.current?.postMessage(json);
    }
  }, []);

  // Update marker position when coordinates change
  useEffect(() => {
    if (latitude && longitude && mapReady) {
      sendMessage({
        type: 'updatePosition',
        lat: latitude,
        lng: longitude,
        accuracy: accuracy || 10,
        center: true,
      });
    }
  }, [latitude, longitude, accuracy, mapReady, sendMessage]);

  const centerOnUser = () => {
    sendMessage({ type: 'centerOnUser' });
  };

  const toggleMapType = () => {
    sendMessage({ type: 'toggleMapType' });
    setMapType(prev => (prev === 'standard' ? 'satellite' : 'standard'));
  };

  if (isLoading && !latitude) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-white text-lg mt-4">Acquiring location...</Text>
          <Text className="text-slate-400 text-sm mt-1">Waiting for GPS fix</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !latitude) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950">
        <View className="flex-1 items-center justify-center px-6">
          <MaterialCommunityIcons name="map-marker-off" size={48} color="#ef4444" />
          <Text className="text-white text-lg font-bold mt-4">Unable to show map</Text>
          <Text className="text-slate-400 text-center mt-2">{error}</Text>
          <TouchableOpacity
            onPress={refreshLocation}
            className="mt-6 bg-blue-500 rounded-xl px-6 py-3"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const mapHtml = generateMapHtml(latitude || 47.64, longitude || 26.24);

  const renderMap = () => {
    if (Platform.OS === 'web') {
      // Web: use iframe with Blob URL
      const blob = new Blob([mapHtml], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      return (
        <iframe
          ref={iframeRef as any}
          src={blobUrl}
          onLoad={() => {
            setMapReady(true);
            // Send initial position after iframe loads
            setTimeout(() => {
              if (latitude && longitude) {
                sendMessage({
                  type: 'updatePosition',
                  lat: latitude,
                  lng: longitude,
                  accuracy: accuracy || 10,
                  center: true,
                });
              }
            }, 500);
          }}
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          allow="geolocation"
        />
      );
    }

    // Native: use react-native-webview
    return (
      <WebView
        ref={webViewRef}
        source={{ html: mapHtml }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        onLoad={() => {
          setMapReady(true);
          // Send initial position after WebView loads
          setTimeout(() => {
            if (latitude && longitude) {
              sendMessage({
                type: 'updatePosition',
                lat: latitude,
                lng: longitude,
                accuracy: accuracy || 10,
                center: true,
              });
            }
          }, 500);
        }}
        onError={() => setMapReady(false)}
      />
    );
  };

  return (
    <View className="flex-1 bg-slate-950">
      {/* Map */}
      {renderMap()}

      {/* Top info overlay */}
      <SafeAreaView className="absolute top-0 left-0 right-0" edges={['top']}>
        <View className="mx-4 mt-2 bg-slate-900/90 rounded-2xl p-4 border border-slate-800">
          <View className="flex-row items-center mb-2">
            <MaterialCommunityIcons name="crosshairs-gps" size={20} color="#3b82f6" />
            <Text className="text-white font-bold text-base ml-2">GPS Tracker</Text>
            <View className="flex-1" />
            <View className="flex-row items-center">
              <View
                className="w-2 h-2 rounded-full mr-1.5"
                style={{ backgroundColor: gpsEnabled ? '#22c55e' : '#ef4444' }}
              />
              <Text className="text-xs" style={{ color: gpsEnabled ? '#22c55e' : '#ef4444' }}>
                {gpsEnabled ? 'Active' : 'Off'}
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-slate-400 text-xs">Lat</Text>
              <Text className="text-white font-mono font-bold text-sm">
                {formatDecimal(latitude, 6)}
              </Text>
            </View>
            <View>
              <Text className="text-slate-400 text-xs">Lng</Text>
              <Text className="text-white font-mono font-bold text-sm">
                {formatDecimal(longitude, 6)}
              </Text>
            </View>
            <View>
              <Text className="text-slate-400 text-xs">Alt</Text>
              <Text className="text-white font-bold text-sm">{formatAltitude(altitude)}</Text>
            </View>
            <View>
              <Text className="text-slate-400 text-xs">Acc</Text>
              <Text className="text-white font-bold text-sm">{formatAccuracy(accuracy)}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Map controls */}
      <View className="absolute right-4 bottom-28 gap-2">
        <TouchableOpacity
          onPress={centerOnUser}
          className="w-12 h-12 rounded-full bg-slate-900/90 items-center justify-center border border-slate-700"
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="crosshairs-gps" size={22} color="#3b82f6" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleMapType}
          className="w-12 h-12 rounded-full bg-slate-900/90 items-center justify-center border border-slate-700"
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={mapType === 'standard' ? 'satellite-variant' : 'map'}
            size={22}
            color="#94a3b8"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={refreshLocation}
          className="w-12 h-12 rounded-full bg-slate-900/90 items-center justify-center border border-slate-700"
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="refresh" size={22} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Bottom speed indicator */}
      {speed !== null && speed > 0 && (
        <View className="absolute bottom-24 left-4 bg-slate-900/90 rounded-xl px-4 py-2 border border-slate-700">
          <Text className="text-slate-400 text-xs">Speed</Text>
          <Text className="text-white font-bold text-lg">{formatSpeed(speed)}</Text>
        </View>
      )}
    </View>
  );
}
