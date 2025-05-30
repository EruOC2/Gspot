import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabsNavigator from "./BottomTabsNavigator";
import SpotDetailsScreen from "../screens/SpotDetailsScreen";
import LogoutDrawer from "../screens/LogoutDrawer"; // Nuevo componente

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerWrapper() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: "right", // 👉 Drawer desde la derecha
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Tabs" component={BottomTabsNavigator} />
      <Drawer.Screen name="LogoutDrawer" component={LogoutDrawer} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainDrawer"
        component={DrawerWrapper}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SpotDetails"
        component={SpotDetailsScreen}
        options={{ title: "Detalles del Spot" }}
      />
    </Stack.Navigator>
  );
}
