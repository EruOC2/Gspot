import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const renderLocation = (loc) => {
  if (!loc || !loc.latitude || !loc.longitude) return 'Ubicación no disponible';
  return `${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}`;
};

export default function CardStory({ uri, location, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri }}
        style={styles.image}
        resizeMode="cover"
        onError={() => console.error('Error cargando imagen:', uri)}
      />
      <Text style={styles.locationText}>
        📍 {renderLocation(location)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 200,
  },
  locationText: {
    padding: 12,
    fontSize: 14,
    color: '#6b7280',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
});
