import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useFavorites } from "../../context/FavoriteContext";
import { useNavigation } from "@react-navigation/native";

const placeholderImage =
  "https://via.placeholder.com/300x200.png?text=Sin+imagen";

export default function Favoritos() {
  const { favorites } = useFavorites();
  const navigation = useNavigation();

  // Limpieza de favoritos inválidos
  const validFavorites = favorites.filter(
    (item) => item && item._id && item.placeName
  );

  if (!validFavorites.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Mis spots guardados</Text>
        <Text style={styles.emptyText}>Aún no has guardado ningún spot.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis spots guardados</Text>
      <FlatList
        data={validFavorites}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => {
          const imageSource = item.image
            ? typeof item.image === "string"
              ? { uri: item.image }
              : item.image
            : item.imagePath
            ? { uri: `http://192.168.0.33:3000/${item.imagePath}` }
            : { uri: placeholderImage };

          return (
            <TouchableOpacity
              onPress={() => navigation.navigate("SpotDetails", { spot: item })}
              style={styles.card}
            >
              <Image source={imageSource} style={styles.image} />
              <View style={styles.cardContent}>
                <Text style={styles.name}>{item.placeName}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    width: width - 32,
    height: 200,
  },
  cardContent: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});
