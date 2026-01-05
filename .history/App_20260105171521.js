import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  StatusBar, 
  View, 
  ActivityIndicator, 
  Text, 
  Alert, 
  StyleSheet, 
  Platform, 
  StatusBar as RNStatusBar 
} from 'react-native';


import { COLORS } from './src/constants/colors';
import { TEXTS } from './src/constants/texts';
import { fetchSmartMovieData, IMAGE_URL, PROFILE_URL } from './src/services/api';
import { 
    saveFavoritesToStorage, loadFavoritesFromStorage,
    saveWatchlistToStorage, loadWatchlistFromStorage 
} from './src/services/storage';


import HomeScreen from './src/screens/HomeScreen';
import DetailScreen from './src/screens/DetailScreen';
import WatchlistScreen from './src/screens/WatchlistScreen';
import GenreScreen from './src/screens/GenreScreen';

export default function App() {
  
  const [step, setStep] = useState(1);
  
  const [lastStep, setLastStep] = useState(1);

  const [lang, setLang] = useState('tr');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  const T = TEXTS[lang];
 
  useEffect(() => {
    const loadData = async () => {
      const savedFavs = await loadFavoritesFromStorage();
      const savedWatchlist = await loadWatchlistFromStorage();
      setFavorites(savedFavs);
      setWatchlist(savedWatchlist);
    };
    loadData();
  }, []);

  
  const toggleFavorite = async (item) => {
    let updated;
    if (favorites.some(fav => fav.id === item.id)) {
      updated = favorites.filter(fav => fav.id !== item.id);
    } else {
      updated = [...favorites, item];
    }
    setFavorites(updated);
    await saveFavoritesToStorage(updated);
  };

  
  const toggleWatchlist = async (item) => {
    let updated;
    if (watchlist.some(w => w.id === item.id)) {
      updated = watchlist.filter(w => w.id !== item.id);
    } else {
      updated = [...watchlist, item];
    }
    setWatchlist(updated);
    await saveWatchlistToStorage(updated);
  };
  
  const removeFromWatchlist = async (item) => {
    const updated = watchlist.filter(w => w.id !== item.id);
    setWatchlist(updated);
    await saveWatchlistToStorage(updated);
  };

  const moveWatchlistItemUp = async (index) => {
    if (index === 0) return;
    const newList = [...watchlist];
    [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]];
    setWatchlist(newList);
    await saveWatchlistToStorage(newList);
  };

  const moveWatchlistItemDown = async (index) => {
    if (index === watchlist.length - 1) return;
    const newList = [...watchlist];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    setWatchlist(newList);
    await saveWatchlistToStorage(newList);
  };
  
  const determineNextGenre = () => {
    if (favorites.length === 0) return null; 

    const explorationChance = 0.3; 
    if (Math.random() < explorationChance) return null;

    
    let genrePool = [];
    favorites.forEach(movie => {
        if (movie.genreIds && movie.genreIds.length > 0) {
            genrePool.push(movie.genreIds[0]); 
        }
    });

    if (genrePool.length === 0) return null;
    return genrePool[Math.floor(Math.random() * genrePool.length)];
  };
  
  const handleFetch = async () => {
    setLoading(true);
    try {
        const targetGenre = determineNextGenre();
        const data = await fetchSmartMovieData(lang, targetGenre);
        
        if (data) {
            const processed = processMovieData(data);
            setResult(processed);
            setLastStep(1); 
            setStep(2); 
        }
    } catch (e) {
        Alert.alert("Hata", T.connErr);
    } finally {
        setLoading(false);
    }
  };
  
  const handleGenreFetch = async (genreId) => {
    setLoading(true);
    try {
        const data = await fetchSmartMovieData(lang, genreId);
        
        if (data) {
            const processed = processMovieData(data);
            setResult(processed);
            
            setLastStep(4); 
            setStep(2);
        }
    } catch (e) {
        Alert.alert("Hata", T.connErr);
    } finally {
        setLoading(false);
    }
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
        genreIds: movie.genre_ids,
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
            watchlist={watchlist}
            
            onMood={() => setStep(4)} 
            
            onManage={() => setStep(3)}

            
            onOpenMovie={(item) => { 
                setResult(item); 
                setLastStep(1); 
                setStep(2); 
            }} 
            texts={T}
        />
      ) : step === 2 ? (
        
        <DetailScreen 
            result={result}
            
            onBack={() => setStep(lastStep)} 
           
            onAgain={() => {
                if (lastStep === 4 && result && result.genreIds) {
                    handleGenreFetch(result.genreIds[0]);
                } else {
                    handleFetch();
                }
            }}

            isFavorite={favorites.some(f => f.id === result.id)}
            onToggleFavorite={() => toggleFavorite(result)}
            isInWatchlist={watchlist.some(w => w.id === result.id)}
            onToggleWatchlist={() => toggleWatchlist(result)}
            texts={T}
        />
      ) : step === 3 ? (
        <WatchlistScreen 
            watchlist={watchlist}
            onBack={() => setStep(1)} // Ana sayfaya dön
           
            onOpen={(item) => {
                setResult(item);
                setLastStep(3);
                setStep(2);
            }}

            onRemove={removeFromWatchlist}
            onMoveUp={moveWatchlistItemUp}
            onMoveDown={moveWatchlistItemDown}
            texts={T}
        />
      ) : (
        <GenreScreen 
            lang={lang}
            texts={T}
            onBack={() => setStep(1)}
            onSelectGenre={(genreId) => handleGenreFetch(genreId)}
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