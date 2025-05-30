import React, { createContext, useState } from "react";

export const SpotContext = createContext();

export const SpotProvider = ({ children }) => {
  const [spots, setSpots] = useState([
    {
      id: "1",
      image: require("../assets/mock_spot1.png"),
      location: "Calle Roma 123, CDMX",
      user: "@eruochoa",
      placeName: "Muro graffiti Roma",
      likes: 34,
      liked: false,
      saved: false,
      lat: 19.417380,
      lon: -99.162000,
    },
    {
      id: "2",
      image: require("../assets/mock_spot2.png"),
      location: "Av. Insurgentes, CDMX",
      user: "@eruochoa",
      placeName: "Puente Insurgentes",
      likes: 27,
      liked: false,
      saved: false,
      lat: 19.441500,
      lon: -99.159300,
    },
    {
      id: "3",
      image: require("../assets/mock_spot1.png"),
      location: "Parque México, CDMX",
      user: "@eruochoa",
      placeName: "Parque México",
      likes: 12,
      liked: false,
      saved: false,
      lat: 19.412940,
      lon: -99.173120,
    },
  ]);

  const toggleLike = (id) => {
    setSpots((prevSpots) =>
      prevSpots.map((spot) =>
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
    setSpots((prevSpots) =>
      prevSpots.map((spot) =>
        spot.id === id ? { ...spot, saved: !spot.saved } : spot
      )
    );
  };

  return (
    <SpotContext.Provider value={{ spots, toggleLike, toggleSave }}>
      {children}
    </SpotContext.Provider>
  );
};
