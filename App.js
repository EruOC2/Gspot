import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import { AuthProvider } from "./context/AuthContext";
import { SpotProvider } from "./context/SpotContext";
import { FavoriteProvider } from "./context/FavoriteContext";
import * as Notifications from "expo-notifications";

// Configuración de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  return (
    <AuthProvider>
      <FavoriteProvider>
        <SpotProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SpotProvider>
      </FavoriteProvider>
    </AuthProvider>
  );
}
