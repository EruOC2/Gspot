import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SpotContext } from "../../context/SpotContext";
import { useFavorites } from "../../context/FavoriteContext";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { spots } = useContext(SpotContext);
  const { favorites } = useFavorites();

  const mySpots = spots.filter((spot) => spot.user === "@mockUser");

  const renderSpot = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("SpotDetails", { spot: item })}
    >
      <Image source={item.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.placeName}>{item.placeName}</Text>
        <Text style={styles.location}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Botón de menú (Drawer) */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}
      >
        <Ionicons name="menu" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.username}>@mockUser</Text>

      <TouchableOpacity
        style={styles.favoritesButton}
        onPress={() => navigation.navigate("Favoritos")}
      >
        <Text style={styles.favoritesText}>⭐ Ver mis favoritos</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Mis Spots</Text>
      {mySpots.length === 0 ? (
        <Text style={styles.noSpots}>Aún no has subido ningún spot.</Text>
      ) : (
        <FlatList
          data={mySpots}
          renderItem={renderSpot}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  menuButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  favoritesButton: {
    backgroundColor: "#FF3366",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  favoritesText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noSpots: {
    color: "#666",
  },
  card: {
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    padding: 10,
    flex: 1,
    justifyContent: "center",
  },
  placeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  location: {
    color: "#666",
    marginTop: 4,
  },
});
