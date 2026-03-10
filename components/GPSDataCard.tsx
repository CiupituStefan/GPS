import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface GPSDataCardProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
  iconColor?: string;
  compact?: boolean;
}

export function GPSDataCard({ icon, label, value, iconColor = '#3b82f6', compact = false }: GPSDataCardProps) {
  return (
    <View className={`bg-slate-800 rounded-2xl ${compact ? 'p-3' : 'p-4'} flex-1 min-w-0`}>
      <View className="flex-row items-center mb-2">
        <View className="w-8 h-8 rounded-lg items-center justify-center mr-2" style={{ backgroundColor: iconColor + '20' }}>
          <MaterialCommunityIcons name={icon} size={18} color={iconColor} />
        </View>
        <Text className="text-slate-400 text-xs font-medium flex-1" numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text className={`text-white font-bold ${compact ? 'text-base' : 'text-lg'}`} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}
