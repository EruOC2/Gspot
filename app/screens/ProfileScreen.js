import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { SpotContext } from "../../context/SpotContext";
import { useFavorites } from "../../context/FavoriteContext";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { deleteSpot } from "../../app/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { logout, user } = useAuth();
  const { spots, refreshSpots } = useContext(SpotContext);
  const { favorites } = useFavorites();

  const [deletingId, setDeletingId] = useState(null);

  const mySpots = spots.filter((spot) => spot.user === user?.email);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      const token = await AsyncStorage.getItem("token");
      await deleteSpot(id, token);
      await refreshSpots();
      setDeletingId(null);
      Alert.alert(" Eliminado", "El spot ha sido eliminado exitosamente");
    } catch (err) {
      setDeletingId(null);
      console.error(err);
      Alert.alert("Error", "No se pudo eliminar el spot");
    }
  };

  const confirmDelete = (id) => {
    Alert.alert(
      "¿Eliminar spot?",
      "Esta acción no se puede deshacer",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", onPress: () => handleDelete(id), style: "destructive" },
      ]
    );
  };

  const renderSpot = ({ item }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("SpotDetails", { spot: item })}
      >
        <Image source={item.image} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.placeName}>{item.placeName}</Text>
          <Text style={styles.location}>
            {item.lat?.toFixed(3)}, {item.lon?.toFixed(3)}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>
          {deletingId === item.id ? "Eliminando..." : "Eliminar"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={styles.menuButton}
      >
        <Ionicons name="menu" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.username}>{user?.email || "@mockUser"}</Text>

      <Button
        title="Ver mis favoritos"
        onPress={() => navigation.navigate("Favoritos")}
      />

      <Button title="Cerrar sesión" onPress={logout} color="#FF3366" />

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
  },
  menuButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 60,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  noSpots: {
    color: "#666",
  },
  cardContainer: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#f9f9f9",
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
  deleteButton: {
    backgroundColor: "#FFCCCC",
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 4,
  },
  deleteText: {
    color: "#FF3366",
    textAlign: "center",
  },
});
 