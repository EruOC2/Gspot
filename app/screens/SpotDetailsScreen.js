import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { likeSpot } from "../api/api";
import { useFavorites } from "../../context/FavoriteContext";
import { useAuth } from "../../context/AuthContext";
import { SpotContext } from "../../context/SpotContext";

export default function SpotDetailsScreen({ route }) {
  const { spot } = route.params ?? {};
  const [spotData, setSpotData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { updateSpotLikes } = useContext(SpotContext);

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const id = spot?._id || spot?.id;
        const res = await fetch(`http://192.168.0.33:3000/stories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setSpotData(data);
        setLiked(data.likedBy?.includes(user?.email));
      } catch (err) {
        console.error("Error al cargar el spot:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpot();
  }, []);

  const toggleLike = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const id = spotData?._id;
      const result = await likeSpot(id, token);

      // Actualiza localmente en esta pantalla
      const newLikedBy = result.liked
        ? [...(spotData.likedBy || []), user?.email]
        : (spotData.likedBy || []).filter((email) => email !== user?.email);

      const updatedSpot = {
        ...spotData,
        likes: result.likes,
        likedBy: newLikedBy,
      };

      setSpotData(updatedSpot);
      setLiked(result.liked);

      // Actualiza también el contexto global
      updateSpotLikes(id, result.likes, user?.email);
    } catch (err) {
      Alert.alert("Error", "No se pudo dar/quitar like.");
      console.error("Error al dar/quitar like:", err);
    }
  };

  const toggleFavorite = () => {
    if (isFavorite(spotData)) {
      removeFromFavorites(spotData);
    } else {
      addToFavorites(spotData);
    }
  };

  const openInMaps = () => {
    const lat = spotData?.lat || spotData?.location?.latitude;
    const lon = spotData?.lon || spotData?.location?.longitude;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    Linking.openURL(url);
  };

  if (loading || !spotData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF3366" />
      </View>
    );
  }

  const lat = spotData?.lat || spotData?.location?.latitude;
  const lon = spotData?.lon || spotData?.location?.longitude;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: `http://192.168.0.33:3000/${spotData.imagePath}` }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.placeName}>{spotData.placeName}</Text>
        <Text style={styles.location}>
          {lat && lon ? `Lat: ${lat}, Lon: ${lon}` : "Ubicación no disponible"}
        </Text>
        <View style={styles.row}>
          <Text style={styles.user}>Subido por: {spotData.user}</Text>
          <Text style={styles.date}>
            • {new Date(spotData.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {spotData.tags && (
          <View style={styles.tagsContainer}>
            {spotData.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.likeButton} onPress={toggleLike}>
          <Text style={styles.likeText}>
            {liked ? "❤️" : "💕"} {spotData.likes} Likes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.likeButton, { backgroundColor: "#555" }]}
          onPress={toggleFavorite}
        >
          <Text style={styles.likeText}>
            {isFavorite(spotData) ? "★ Guardado" : "☆ Guardar Spot"}
          </Text>
        </TouchableOpacity>

        {lat && lon && (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: lat,
                longitude: lon,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker coordinate={{ latitude: lat, longitude: lon }} />
            </MapView>
          </View>
        )}

        {lat && lon && (
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
