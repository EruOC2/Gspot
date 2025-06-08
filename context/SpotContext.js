import React, { createContext, useEffect, useState } from "react";
import { fetchSpots } from "../app/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SpotContext = createContext();

export const SpotProvider = ({ children }) => {
  const [spots, setSpots] = useState([]);

  const refreshSpots = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const data = await fetchSpots();
      const userEmail = parseJwt(token)?.email;

      const formatted = data.map((spot) => ({
        ...spot,
        id: spot._id,
        liked: spot.likedBy?.includes(userEmail),
        saved: false,
        image: { uri: `http://192.168.0.33:3000/${spot.imagePath}` },
      }));

      setSpots(formatted);
    } catch (error) {
      console.error("Error al cargar spots del backend:", error);
    }
  };

  useEffect(() => {
    refreshSpots();
  }, []);

  const toggleLike = (id) => {
    setSpots((prev) =>
      prev.map((spot) =>
        spot.id === id
          ? {
              ...spot,
              liked: !spot.liked,
              likes: spot.likes + (spot.liked ? -1 : 1),
            }
          : spot
      )
    );
  };

  const toggleSave = (id) => {
    setSpots((prev) =>
      prev.map((spot) =>
        spot.id === id ? { ...spot, saved: !spot.saved } : spot
      )
    );
  };

  const updateSpotLikes = (spotId, newLikes, userEmail) => {
    setSpots((prev) =>
      prev.map((spot) =>
        spot.id === spotId
          ? {
              ...spot,
              likes: newLikes,
              likedBy: newLikes > spot.likes
                ? [...(spot.likedBy || []), userEmail]
                : (spot.likedBy || []).filter((email) => email !== userEmail),
              liked: newLikes > spot.likes,
            }
          : spot
      )
    );
  };

  
  const parseJwt = (token) => {
    if (!token) return {};
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error al decodificar token:", error);
      return {};
    }
  };

  return (
    <SpotContext.Provider
      value={{
        spots,
        toggleLike,
        toggleSave,
        refreshSpots,
        updateSpotLikes,
      }}
    >
      {children}
    </SpotContext.Provider>
  );
};
