import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SpotContext } from "../../context/SpotContext";

export default function SpotCard({ spotId }) {
  const navigation = useNavigation();
  const { spots, toggleLike } = useContext(SpotContext);

  const spot = spots.find((s) => s.id === spotId);

  if (!spot) return null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("SpotDetails", { spot })}
    >
      <Image source={spot.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.placeName}>{spot.placeName}</Text>
        <Text style={styles.location}>{spot.location}</Text>

        <View style={styles.likeRow}>
          <TouchableOpacity onPress={() => toggleLike(spot.id)}>
            <Text style={styles.likeButton}>{spot.liked ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
          <Text style={styles.likeCount}>{spot.likes} Likes</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 200,
  },
  info: {
    padding: 12,
  },
  placeName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  location: {
    color: "#666",
    marginTop: 4,
  },
  likeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  likeButton: {
    fontSize: 20,
    marginRight: 10,
  },
  likeCount: {
    color: "#FF3366",
    fontWeight: "bold",
  },
});
