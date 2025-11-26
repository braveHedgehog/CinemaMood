import React, { useState, useEffect } from 'react'; // useEffect eklendi
import { SafeAreaView, StatusBar, View, ActivityIndicator, Text, Alert, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';

// Importlarımız
import { COLORS } from './src/constants/colors';
import { TEXTS } from './src/constants/texts';
import { fetchRandomMovieData, IMAGE_URL, PROFILE_URL } from './src/services/api';
// YENİ: Storage servisini ekledik
import { saveFavoritesToStorage, loadFavoritesFromStorage } from './src/services/storage';

import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';

export default function App() {
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState('tr');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const T = TEXTS[lang];

  // --- YENİ EKLENEN KISIM: BAŞLANGIÇTA YÜKLEME ---
  useEffect(() => {
    const loadData = async () => {
      const savedFavorites = await loadFavoritesFromStorage();
      setFavorites(savedFavorites);
    };
    loadData();
  }, []);

  // --- GÜNCELLENEN MANTIK: HER DEĞİŞİKLİKTE KAYDETME ---
  const toggleFavorite = async (item) => {
    let updatedFavorites;
    
    if (favorites.some(fav => fav.id === item.id)) {
      // Çıkar
      updatedFavorites = favorites.filter(fav => fav.id !== item.id);
    } else {
      // Ekle
      updatedFavorites = [...favorites, item];
    }

    setFavorites(updatedFavorites); // Ekrana yansıt
    await saveFavoritesToStorage(updatedFavorites); // Hafızaya yaz
  };

  const processMovieData = (rawData) => {
    const { movie, credits, providers } = rawData;
    let platformName = T.noPlatform;
    
    if (providers) {
        if (providers.flatrate) platformName = providers.flatrate[0].provider_name;
        else if (providers.rent) platformName = providers.rent[0].provider_name + ' (Kiralama)';
        else if (providers.buy) platformName = providers.buy[0].provider_name + ' (Satın Al)';
    }

    return {
        id: movie.id,
        originalTitle: movie.original_title,
        translatedTitle: movie.title,
        overview: movie.overview || T.noInfo,
        rating: movie.vote_average?.toFixed(1) || "?",
        date: movie.release_date || "????",
        poster: movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : null,
        platform: platformName,
        cast: credits.cast?.slice(0, 10).map(p => ({ id: p.id, name: p.name, image: p.profile_path ? `${PROFILE_URL}${p.profile_path}` : null })) || [],
        crew: credits.crew?.filter(p => ['Director', 'Writer'].includes(p.job)).slice(0, 4).map(p => ({ id: p.id, name: p.name, job: p.job, image: p.profile_path ? `${PROFILE_URL}${p.profile_path}` : null })) || []
    };
  };

  const handleFetch = async () => {
    setLoading(true);
    try {
        const data = await fetchRandomMovieData(lang);
        if (data) {
            const processed = processMovieData(data);
            setResult(processed);
            setStep(2);
        }
    } catch (e) {
        Alert.alert("Hata", T.connErr);
    } finally {
        setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ color: COLORS.text, marginTop: 10 }}>{T.loading}</Text>
        </View>
      ) : step === 1 ? (
        <HomeScreen 
            lang={lang} 
            setLang={setLang} 
            onFetch={handleFetch} 
            favorites={favorites} 
            onOpenFavorite={(item) => { setResult(item); setStep(2); }}
            texts={T}
        />
      ) : (
        <DetailScreen 
            result={result}
            onBack={() => setStep(1)}
            onAgain={handleFetch}
            isFavorite={favorites.some(f => f.id === result.id)}
            onToggleFavorite={() => toggleFavorite(result)}
            texts={T}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});