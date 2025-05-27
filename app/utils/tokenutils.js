import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode'; // ✅ Correcto

export const getDecodedToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      return jwt_decode(token); // ✅
    }
    return null;
  } catch (err) {
    console.error('Error al decodificar el token:', err);
    return null;
  }
};
