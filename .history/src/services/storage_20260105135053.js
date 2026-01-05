import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@mood_cinema_favorites_v1';
const WATCHLIST_KEY = '@mood_cinema_watchlist_v1'; // YENİ

// --- FAVORİLER (Mevcut) ---
export const saveFavoritesToStorage = async (favorites) => {
  try {
    const jsonValue = JSON.stringify(favorites);
    await AsyncStorage.setItem(FAVORITES_KEY, jsonValue);
  } catch (e) { console.error(e); }
};

export const loadFavoritesFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) { return []; }
};

// --- İZLEME LİSTESİ (YENİ) ---
export const saveWatchlistToStorage = async (watchlist) => {
  try {
    const jsonValue = JSON.stringify(watchlist);
    await AsyncStorage.setItem(WATCHLIST_KEY, jsonValue);
  } catch (e) { console.error(e); }
};

export const loadWatchlistFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(WATCHLIST_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) { return []; }
};