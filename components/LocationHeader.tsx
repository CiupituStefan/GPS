import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDecimal } from '../utils/formatters';

interface LocationHeaderProps {
  latitude: number | null;
  longitude: number | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export function LocationHeader({ latitude, longitude, isLoading, onRefresh }: LocationHeaderProps) {
  return (
    <View className="bg-slate-800/80 rounded-2xl p-5 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-xl bg-blue-500/20 items-center justify-center mr-3">
            <MaterialCommunityIcons name="map-marker" size={24} color="#3b82f6" />
          </View>
          <Text className="text-white text-lg font-bold">Current Location</Text>
        </View>
        <TouchableOpacity
          onPress={onRefresh}
          className="w-10 h-10 rounded-xl bg-slate-700 items-center justify-center"
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="refresh"
            size={20}
            color={isLoading ? '#64748b' : '#3b82f6'}
          />
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-4">
        <View className="flex-1">
          <Text className="text-slate-400 text-xs mb-1">Latitude</Text>
          <Text className="text-white text-xl font-bold font-mono">
            {formatDecimal(latitude, 6)}
          </Text>
        </View>
        <View className="w-px bg-slate-700" />
        <View className="flex-1">
          <Text className="text-slate-400 text-xs mb-1">Longitude</Text>
          <Text className="text-white text-xl font-bold font-mono">
            {formatDecimal(longitude, 6)}
          </Text>
        </View>
      </View>
    </View>
  );
}
