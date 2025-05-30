import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LogoutDrawer() {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Aquí iría lógica real para cerrar sesión si la tienes
    navigation.reset({
      index: 0,
      routes: [{ name: "MainDrawer" }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menú</Text>
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
