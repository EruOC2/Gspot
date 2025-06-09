import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Button,
  Alert,
} from "react-native";
import { useFavorites } from "../../context/FavoriteContext";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const placeholderImage = "https://via.placeholder.com/300x200.png?text=Sin+imagen";

export default function Favoritos() {
  const { favorites, removeFromFavorites, forceCleanFavorites } = useFavorites();
  const navigation = useNavigation();

  useEffect(() => {
    const clean = async () => {
      await forceCleanFavorites();
    };
    clean();
  }, []);

  const handlePress = async (spot) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`http://192.168.0.33:3000/stories/${spot._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 404) {
        Alert.alert("Este spot ya no existe", "Se eliminará de tus favoritos.");
        removeFromFavorites(spot);
        return;
      }

      const data = await res.json();
      console.log("Spot desde backend:", data);

      if (!data || !data._id || !data.placeName) {
        Alert.alert("Error", "El spot está incompleto.");
        removeFromFavorites(spot);
        return;
      }

      navigation.navigate("SpotDetails", { spot: data });
    } catch (err) {
      console.error("Error al obtener spot:", err);
      Alert.alert("Error al cargar el spot", "No se pudo acceder al spot. Revisa tu conexión.");
    }
  };

  const validFavorites = favorites.filter(
    (item) => item && item._id && item.placeName
  );

  if (!validFavorites.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Mis spots guardados</Text>
        <Text style={styles.emptyText}>Aún no has guardado ningún spot.</Text>
        <Button
          title="Borrar favoritos"
          onPress={async () => {
            await AsyncStorage.removeItem("favoritos");
            Alert.alert("Favoritos limpiados");
          }}
        />
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
            <TouchableOpacity onPress={() => handlePress(item)} style={styles.card}>
              <Image source={imageSource} style={styles.image} />
              <View style={styles.cardContent}>
                <Text style={styles.name}>{item.placeName}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <Button
        title="Borrar todos los favoritos"
        onPress={async () => {
          await AsyncStorage.removeItem("favoritos");
          Alert.alert("Favoritos eliminados");
        }}
      />
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
  },
  image: {
    width: width - 32,
    height: 200,
  },
  cardContent: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    color: "#888",
    fontSize: 16,
  },
});
