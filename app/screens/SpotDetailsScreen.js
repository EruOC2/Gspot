import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useFavorites } from "../../context/FavoriteContext";

export default function SpotDetailsScreen({ route }) {
  const { spot } = route.params ?? {};

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(spot?.likes || 0);

  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const favorited = isFavorite(spot);

  if (!spot) {
    return (
      <View style={styles.centered}>
        <Text>Error: spot no disponible</Text>
      </View>
    );
  }

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const toggleFavorite = () => {
    if (favorited) {
      removeFromFavorites(spot);
    } else {
      addToFavorites(spot);
    }
  };

  const openInMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.lat},${spot.lon}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={spot.image} style={styles.image} resizeMode="cover" />
      <View style={styles.detailsContainer}>
        <Text style={styles.placeName}>{spot.placeName}</Text>
        <Text style={styles.location}>{spot.location}</Text>
        <View style={styles.row}>
          <Text style={styles.user}>Subido por: {spot.user}</Text>
          <Text style={styles.date}>• 12/05/2025</Text>
        </View>

        {spot.tags && (
          <View style={styles.tagsContainer}>
            {spot.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.likeButton} onPress={toggleLike}>
          <Text style={styles.likeText}>
            {liked ? "❤️" : "💕"} {likeCount} Likes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.likeButton, { backgroundColor: "#555" }]}
          onPress={toggleFavorite}
        >
          <Text style={styles.likeText}>
            {favorited ? "★ Guardado" : "☆ Guardar Spot"}
          </Text>
        </TouchableOpacity>

        {spot.lat && spot.lon && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: spot.lat,
                longitude: spot.lon,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker coordinate={{ latitude: spot.lat, longitude: spot.lon }} />
            </MapView>
          </View>
        )}

        {spot.lat && spot.lon && (
          <TouchableOpacity style={styles.mapButton} onPress={openInMaps}>
            <Text style={styles.mapButtonText}>📍 Cómo llegar</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
  },
  detailsContainer: {
    padding: 20,
  },
  placeName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  location: {
    color: "#666",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  user: {
    fontWeight: "500",
    color: "#444",
  },
  date: {
    marginLeft: 10,
    color: "#888",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  tag: {
    backgroundColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: "#555",
  },
  likeButton: {
    backgroundColor: "#FF3366",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  likeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  mapContainer: {
    width: width - 40,
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  mapButton: {
    backgroundColor: "#3366FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  mapButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});