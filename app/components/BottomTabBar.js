import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

export default function BottomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          if (!isFocused) navigation.navigate(route.name);
        };

        if (route.name === 'Historias') {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.centerButton}
              activeOpacity={0.7}
            >
              <Text style={styles.centerButtonText}>+</Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <Text style={{ color: isFocused ? '#3b82f6' : '#6b7280' }}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  centerButton: {
    width: 70,
    height: 70,
    backgroundColor: '#3b82f6',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  centerButtonText: {
    fontSize: 36,
    color: 'white',
    lineHeight: 36,
  },
});
