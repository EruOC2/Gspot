import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const stored = await AsyncStorage.getItem("favoritos");
      if (stored) setFavorites(JSON.parse(stored));
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("favoritos", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (spot) => {
    if (!favorites.some((f) => f._id === spot._id)) {
      setFavorites([...favorites, spot]);
    }
  };

  const removeFromFavorites = (spot) => {
    setFavorites(favorites.filter((f) => f._id !== spot._id));
  };

  const isFavorite = (spot) => {
    return favorites.some((f) => f._id === spot._id);
  };

  const forceCleanFavorites = async () => {
    const valid = favorites.filter(
      (item) =>
        item &&
        item._id &&
        item.placeName &&
        (item.image || item.imagePath)
    );
    setFavorites(valid);
    await AsyncStorage.setItem("favoritos", JSON.stringify(valid));
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        forceCleanFavorites,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);