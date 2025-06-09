import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useAuth } from "../../context/AuthContext";

import BottomTabsNavigator from "./BottomTabsNavigator";
import SpotDetailsScreen from "../screens/SpotDetailsScreen";
import LogoutDrawer from "../screens/LogoutDrawer";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MainDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: "right",
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Tabs" component={BottomTabsNavigator} />
      <Drawer.Screen name="LogoutDrawer" component={LogoutDrawer} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, checking } = useAuth();

  if (checking) return null; // Puedes mostrar un spinner aquí

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainDrawer" component={MainDrawer} />
          <Stack.Screen
            name="SpotDetails"
            component={SpotDetailsScreen}
            options={{ title: "Detalles del Spot" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
