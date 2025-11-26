import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@mood_cinema_favorites_v1';

// Veriyi Kaydet
export const saveFavoritesToStorage = async (favorites) => {
  try {
    const jsonValue = JSON.stringify(favorites);
    await AsyncStorage.setItem(FAVORITES_KEY, jsonValue);
  } catch (e) {
    console.error("Kaydetme hatası:", e);
  }
};

// Veriyi Oku
export const loadFavoritesFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Okuma hatası:", e);
    return [];
  }
};