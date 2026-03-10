import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocation } from '../../hooks/useLocation';
import { GPSDataCard } from '../../components/GPSDataCard';
import { GPSStatusBadge } from '../../components/GPSStatusBadge';
import { LocationHeader } from '../../components/LocationHeader';
import {
  formatAltitude,
  formatSpeed,
  formatAccuracy,
  formatDate,
  formatTime,
  formatCoordinate,
  estimateSatellites,
} from '../../utils/formatters';

export default function GPSDataScreen() {
  const {
    latitude,
    longitude,
    altitude,
    speed,
    accuracy,
    heading,
    timestamp,
    gpsEnabled,
    provider,
    isLoading,
    error,
    permissionGranted,
    refreshLocation,
  } = useLocation();

  if (isLoading && !latitude) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-20 h-20 rounded-full bg-blue-500/10 items-center justify-center mb-6">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
          <Text className="text-white text-xl font-bold mb-2">Acquiring GPS Signal</Text>
          <Text className="text-slate-400 text-center text-sm">
            Searching for satellites...{'\n'}This may take a moment.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !latitude) {
    return (
      <SafeAreaView className="flex-1 bg-slate-950">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-20 h-20 rounded-full bg-red-500/10 items-center justify-center mb-6">
            <MaterialCommunityIcons name="alert-circle-outline" size={40} color="#ef4444" />
          </View>
          <Text className="text-white text-xl font-bold mb-2">GPS Unavailable</Text>
          <Text className="text-slate-400 text-center text-sm mb-6">{error}</Text>
          {!permissionGranted && (
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              }}
              className="bg-blue-500 rounded-xl px-6 py-3"
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold">Open Settings</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={refreshLocation}
            className="mt-3 rounded-xl px-6 py-3 border border-slate-700"
            activeOpacity={0.8}
          >
            <Text className="text-slate-300 font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-6 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* App Title */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="crosshairs-gps" size={28} color="#3b82f6" />
            <Text className="text-white text-2xl font-bold ml-3">GPS Tracker</Text>
          </View>
        </View>

        {/* Status Badges */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <GPSStatusBadge enabled={gpsEnabled} provider={provider} accuracy={accuracy} />
        </ScrollView>

        {/* Coordinates Header Card */}
        <LocationHeader
          latitude={latitude}
          longitude={longitude}
          isLoading={isLoading}
          onRefresh={refreshLocation}
        />

        {/* Coordinate Details */}
        <View className="flex-row gap-3 mb-3">
          <GPSDataCard
            icon="latitude"
            label="Lat (DMS)"
            value={formatCoordinate(latitude, 'lat')}
            iconColor="#22c55e"
          />
          <GPSDataCard
            icon="longitude"
            label="Lng (DMS)"
            value={formatCoordinate(longitude, 'lng')}
            iconColor="#06b6d4"
          />
        </View>

        {/* GPS Data Grid */}
        <View className="flex-row gap-3 mb-3">
          <GPSDataCard
            icon="signal-variant"
            label="GPS Status"
            value={gpsEnabled ? 'Enabled' : 'Disabled'}
            iconColor={gpsEnabled ? '#22c55e' : '#ef4444'}
          />
          <GPSDataCard
            icon="access-point"
            label="Provider"
            value={provider}
            iconColor="#8b5cf6"
          />
        </View>

        <View className="flex-row gap-3 mb-3">
          <GPSDataCard
            icon="altimeter"
            label="Altitude"
            value={formatAltitude(altitude)}
            iconColor="#f59e0b"
          />
          <GPSDataCard
            icon="speedometer"
            label="Speed"
            value={formatSpeed(speed)}
            iconColor="#ec4899"
          />
        </View>

        <View className="flex-row gap-3 mb-3">
          <GPSDataCard
            icon="target"
            label="Accuracy"
            value={formatAccuracy(accuracy)}
            iconColor="#06b6d4"
          />
          <GPSDataCard
            icon="satellite-variant"
            label="Satellites (est.)"
            value={estimateSatellites(accuracy)}
            iconColor="#a855f7"
          />
        </View>

        <View className="flex-row gap-3 mb-3">
          <GPSDataCard
            icon="calendar"
            label="Date"
            value={formatDate(timestamp)}
            iconColor="#3b82f6"
          />
          <GPSDataCard
            icon="clock-outline"
            label="Time"
            value={formatTime(timestamp)}
            iconColor="#14b8a6"
          />
        </View>

        {/* Heading */}
        <View className="flex-row gap-3 mb-3">
          <GPSDataCard
            icon="compass"
            label="Heading"
            value={heading !== null && heading >= 0 ? `${heading.toFixed(1)}°` : '--'}
            iconColor="#f97316"
          />
          <View className="flex-1" />
        </View>

        {/* Last Updated */}
        <View className="items-center mt-2 mb-4">
          <Text className="text-slate-500 text-xs">
            Last updated: {formatTime(timestamp)} — {formatDate(timestamp)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
