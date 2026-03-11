import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface GPSStatusBadgeProps {
  enabled: boolean;
  provider: string;
  accuracy: number | null;
}

export function GPSStatusBadge({ enabled, provider, accuracy }: GPSStatusBadgeProps) {
  const qualityLabel = getQualityLabel(accuracy);
  const qualityColor = getQualityColor(accuracy);

  return (
    <View className="flex-row items-center gap-3">
      <View className="flex-row items-center bg-slate-800 rounded-full px-3 py-1.5">
        <View
          className="w-2.5 h-2.5 rounded-full mr-2"
          style={{ backgroundColor: enabled ? '#22c55e' : '#ef4444' }}
        />
        <Text className="text-white text-xs font-semibold">
          {enabled ? 'GPS Active' : 'GPS Off'}
        </Text>
      </View>

      {enabled && (
        <View className="flex-row items-center bg-slate-800 rounded-full px-3 py-1.5">
          <MaterialCommunityIcons name="satellite-variant" size={14} color={qualityColor} />
          <Text className="text-xs font-semibold ml-1.5" style={{ color: qualityColor }}>
            {qualityLabel}
          </Text>
        </View>
      )}

      <View className="flex-row items-center bg-slate-800 rounded-full px-3 py-1.5">
        <MaterialCommunityIcons
          name={provider === 'GPS' ? 'crosshairs-gps' : 'wifi'}
          size={14}
          color="#94a3b8"
        />
        <Text className="text-slate-400 text-xs font-semibold ml-1.5">
          {provider}
        </Text>
      </View>
    </View>
  );
}

function getQualityLabel(accuracy: number | null): string {
  if (accuracy === null) return 'No fix';
  if (accuracy <= 5) return 'Excellent';
  if (accuracy <= 15) return 'Good';
  if (accuracy <= 50) return 'Moderate';
  return 'Poor';
}

function getQualityColor(accuracy: number | null): string {
  if (accuracy === null) return '#64748b';
  if (accuracy <= 5) return '#22c55e';
  if (accuracy <= 15) return '#3b82f6';
  if (accuracy <= 50) return '#f59e0b';
  return '#ef4444';
}
