import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export default function usePermissionsAndLocation() {
  const [location, setLocation] = useState(null);
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const locationStatus = await Location.requestForegroundPermissionsAsync();
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();

        if (locationStatus.status !== 'granted' || cameraStatus.status !== 'granted') {
          Alert.alert(
            'Permisos requeridos',
            'Se requieren permisos de ubicación y cámara para usar esta aplicación.',
            [{ text: 'OK' }]
          );
          setHasPermissions(false);
          return;
        }

        setHasPermissions(true);
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      } catch (error) {
        console.error('Error al solicitar permisos o ubicación:', error);
        setHasPermissions(false);
      }
    };
    requestPermissions();
  }, []);

  return { location, hasPermissions };
}
