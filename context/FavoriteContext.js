import React, { createContext, useContext, useState } from "react";

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addToFavorites = (spot) => {
    if (!isFavorite(spot)) {
      setFavorites((prev) => [...prev, spot]);
    }
  };

  const removeFromFavorites = (spot) => {
    setFavorites((prev) => prev.filter((s) => s.id !== spot.id));
  };

  const isFavorite = (spot) => {
    return favorites.some((s) => s.id === spot.id);
  };

  return (
    <FavoriteContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);