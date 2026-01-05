import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, View, ActivityIndicator, Text, Alert, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';

import { COLORS } from './src/constants/colors';
import { TEXTS } from './src/constants/texts';
// API fonksiyonunu güncelledik
import { fetchSmartMovieData, IMAGE_URL, PROFILE_URL } from './src/services/api';
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

  useEffect(() => {
    const loadData = async () => {
      const savedFavorites = await loadFavoritesFromStorage();
      setFavorites(savedFavorites);
    };
    loadData();
  }, []);

  const toggleFavorite = async (item) => {
    let updatedFavorites;
    // Favori ekleme/çıkarma mantığı
    if (favorites.some(fav => fav.id === item.id)) {
      updatedFavorites = favorites.filter(fav => fav.id !== item.id);
    } else {
      // Eklendiğinde genreIds'i kaydettiğimizden emin oluyoruz (API'den geliyor)
      updatedFavorites = [...favorites, item];
    }
    setFavorites(updatedFavorites);
    await saveFavoritesToStorage(updatedFavorites);
  };

  // --- AKILLI ÖNERİ ALGORİTMASI ---
  const determineNextGenre = () => {
    // 1. Eğer hiç favori yoksa, mecburen rastgele (null) döndür.
    if (favorites.length === 0) return null;

    // 2. %30 İhtimalle "Keşif Modu" (Rastgele yeni şeyler öner)
    // Bu sayede kullanıcı hep aynı türde sıkışıp kalmaz.
    const explorationChance = 0.3; 
    if (Math.random() < explorationChance) {
      console.log("🎲 Keşif Modu: Rastgele tür seçiliyor.");
      return null;
    }

    // 3. %70 İhtimalle "Akıllı Mod" (Kullanıcının zevkine göre)
    // Favorilerdeki TÜM türleri tek bir havuzda topla.
    let genrePool = [];
    favorites.forEach(movie => {
        if (movie.genreIds && movie.genreIds.length > 0) {
            // Filmin ana türünü (ilk sıradaki genelde ana türdür) havuza at
            genrePool.push(movie.genreIds[0]); 
            // İstersen tüm türleri de atabilirsin: genrePool.push(...movie.genreIds);
        }
    });

    // Eğer havuz boşsa (teknik hata vs) rastgele dön
    if (genrePool.length === 0) return null;

    // Havuzdan rastgele bir tane çek.
    // Örnek: Havuzda [Korku, Korku, Korku, Komedi] varsa, Korku gelme ihtimali %75'tir.
    const selectedGenre = genrePool[Math.floor(Math.random() * genrePool.length)];
    
    console.log(`🧠 Akıllı Mod: Kullanıcının sevdiği tür seçildi (ID: ${selectedGenre})`);
    return selectedGenre;
  };


  const handleFetch = async () => {
    setLoading(true);
    try {
        // Beyne sor: Hangi türü getireyim?
        const targetGenre = determineNextGenre();

        // API'ye bu türü gönder (veya null ise rastgele gelir)
        const data = await fetchSmartMovieData(lang, targetGenre);
        
        if (data) {
            const processed = processMovieData(data);
            setResult(processed);
            setStep(2);
        }
    } catch (e) {
        console.error(e);
        Alert.alert("Hata", T.connErr);
    } finally {
        setLoading(false);
    }
  };

  // --- VERİ İŞLEME ---
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
        // ÖNEMLİ: Favoriye eklerken türünü bilmemiz için bunu saklıyoruz
        genreIds: movie.genre_ids, 
        originalTitle: movie.original_title,
        translatedTitle: movie.title,
        overview: movie.overview || T.noInfo,
        rating: movie.vote_average?.toFixed(1) || "?",
        date: movie.release_date || "????",
        poster: movie.poster_path ? `${IMAGE_URL}${movie.poster_path}` : null,
        platform: platformName,
        // App.js içindeki getPlatformColor fonksiyonunu buraya taşıyabilir veya direkt import edebilirsin
        // Şimdilik basitlik adına platform rengini DetailScreen içinde hallediyoruz
        cast: credits.cast?.slice(0, 10).map(p => ({ id: p.id, name: p.name, image: p.profile_path ? `${PROFILE_URL}${p.profile_path}` : null })) || [],
        crew: credits.crew?.filter(p => ['Director', 'Writer'].includes(p.job)).slice(0, 4).map(p => ({ id: p.id, name: p.name, job: p.job, image: p.profile_path ? `${PROFILE_URL}${p.profile_path}` : null })) || []
    };
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