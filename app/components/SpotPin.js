import React from "react";
import { View, Image, StyleSheet } from "react-native";

export default function SpotPin({ image }) {
  return (
    <View style={styles.pinCircle}>
      <Image source={image} style={styles.pinImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  pinCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#FF3366",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  pinImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
});
