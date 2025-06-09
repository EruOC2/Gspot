import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { SpotContext } from "../../context/SpotContext";
import { useNavigation } from "@react-navigation/native";
import SpotPin from "../components/SpotPin";

const { width, height } = Dimensions.get("window");

const haversineDistance = (lat1, lon1, lat2, lon2) => {
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
};

export default function MapScreen() {
  const { spots } = useContext(SpotContext);
  const [region, setRegion] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredSpots, setFilteredSpots] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "No se puede acceder a tu ubicación");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });

      const nearby = spots
        .filter((spot) => {
          const dist = haversineDistance(latitude, longitude, spot.lat, spot.lon);
          return dist <= 50;
        })
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5);

      setFilteredSpots(nearby);
    })();
  }, [spots]);

  const handleSearch = async () => {
    Keyboard.dismiss();
    try {
      const result = await Location.geocodeAsync(searchText);
      if (!result.length) {
        Alert.alert("No encontrado", "No se encontró el lugar ingresado.");
        return;
      }

      const { latitude, longitude } = result[0];

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });

      const found = spots
        .filter((spot) => {
          const d = haversineDistance(latitude, longitude, spot.lat, spot.lon);
          return d <= 50;
        })
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5);

      setFilteredSpots(found);
    } catch (e) {
      Alert.alert("Error", "No se pudo buscar la ciudad.");
    }
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {filteredSpots.map((spot) => (
            <Marker
              key={spot.id}
              coordinate={{ latitude: spot.lat, longitude: spot.lon }}
              onPress={() => navigation.navigate("SpotDetails", { spot })}
            >
              <SpotPin image={spot.image} />
            </Marker>
          ))}
        </MapView>
      )}

      {region && filteredSpots.length === 0 && (
        <View style={styles.noSpots}>
          <Text style={styles.noSpotsText}>
            No hay spots cerca de esta ubicación.
          </Text>
        </View>
      )}

      <View style={styles.searchBar}>
        <TextInput
          placeholder="Buscar ciudad o país"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.btnText}>Buscar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width, height },
  searchBar: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: "#FF3366",
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noSpots: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    elevation: 5,
    alignItems: "center",
  },
  noSpotsText: {
    color: "#888",
    fontWeight: "500",
  },
});
