import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uploadStory } from "../api/api";
import { useAuth } from "../../context/AuthContext";
import { SpotContext } from "../../context/SpotContext"; // ✅ Importar contexto

export default function UploadSpot() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [placeName, setPlaceName] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { refreshSpots } = useContext(SpotContext); // ✅ Usar contexto

  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      if (
        cameraStatus.status !== "granted" ||
        locationStatus.status !== "granted"
      ) {
        Alert.alert(
          "Permisos requeridos",
          "Activa permisos de cámara y ubicación para continuar"
        );
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.canceled) {
        const pickedImage = result.assets[0];
        setImage(pickedImage);
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }
    } catch (err) {
      Alert.alert("Error", "No se pudo obtener la imagen o la ubicación.");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!image) newErrors.image = "Toma una foto.";
    if (!placeName.trim()) newErrors.placeName = "Este campo es obligatorio.";
    if (!location) newErrors.location = "Activa tu ubicación.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("placeName", placeName);
      formData.append("latitude", location.latitude.toString());
      formData.append("longitude", location.longitude.toString());
      formData.append("tags", tags);

      const fileName = image.uri.split("/").pop();
      const fileType = fileName.split(".").pop();
      formData.append("image", {
        uri: image.uri,
        name: fileName,
        type: `image/${fileType}`,
      });

      const token = await AsyncStorage.getItem("token");
      await uploadStory(formData, token);

      await refreshSpots(); // ✅ Actualizar lista de spots

      Alert.alert("¡Listo!", "Spot subido correctamente");
      setImage(null);
      setLocation(null);
      setPlaceName("");
      setTags("");
      setErrors({});
      setTimeout(() => navigation.navigate("Inicio"), 1500);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo subir el spot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subir nuevo Spot</Text>
      <TouchableOpacity
        onPress={pickImage}
        style={styles.imagePicker}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#FF3366" />
        ) : image ? (
          <Image source={{ uri: image.uri }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>Toca para tomar una foto</Text>
        )}
      </TouchableOpacity>
      {errors.image && <Text style={styles.error}>{errors.image}</Text>}
      <TextInput
        placeholder="Nombre del lugar"
        style={[styles.input, errors.placeName && { borderColor: "red" }]}
        value={placeName}
        onChangeText={(text) => {
          setPlaceName(text);
          if (errors.placeName) setErrors({ ...errors, placeName: null });
        }}
      />
      {errors.placeName && (
        <Text style={styles.error}>{errors.placeName}</Text>
      )}
      <TextInput
        placeholder="Tags separados por comas (ej: urbano, graffiti)"
        style={styles.input}
        value={tags}
        onChangeText={setTags}
      />
      <Button
        title={loading ? "Subiendo..." : "Subir Spot"}
        onPress={handleSubmit}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  imagePicker: {
    height: 200,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  imageText: { color: "#999" },
  image: { width: "100%", height: "100%", borderRadius: 12 },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  error: { color: "red", fontSize: 13, marginBottom: 8 },
});
