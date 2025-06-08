import React, { useContext, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { SpotContext } from "../../context/SpotContext";
import SpotCard from "../components/SpotCard";

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function HomeFeed() {
  const { spots } = useContext(SpotContext);
  const [location, setLocation] = useState(null);
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchNearbySpots = async () => {
        setLoading(true);

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permiso denegado", "No se puede acceder a tu ubicación");
          setLoading(false);
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        if (!isActive) return;

        setLocation(loc.coords);

        const nearby = [];
        let notified = false;

        for (const spot of spots) {
          const dist = haversineDistance(
            loc.coords.latitude,
            loc.coords.longitude,
            spot.lat,
            spot.lon
          );

          if (dist <= 150) nearby.push(spot);

          if (spot.saved && dist < 0.3 && !notified) {
            notified = true;
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "📍 ¡Spot cercano guardado!",
                body: `Estás cerca de: ${spot.placeName}`,
                data: { spotId: spot.id },
              },
              trigger: null,
            });
          }
        }

        setFilteredSpots(nearby);
        setLoading(false);
      };

      fetchNearbySpots();

      return () => {
        isActive = false;
      };
    }, [spots])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF3366" />
        <Text style={{ marginTop: 10 }}>Cargando spots cercanos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredSpots}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => <SpotCard spot={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay spots cerca de ti.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  list: {
    paddingTop: 20,
    paddingBottom: 80,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
