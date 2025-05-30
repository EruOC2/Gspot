import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Favoritos() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis spots guardados</Text>
      {/* Aquí irán los spots guardados */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
