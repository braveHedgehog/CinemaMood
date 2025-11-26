import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  ScrollView, 
  StatusBar, 
  ActivityIndicator,
  Alert,
  FlatList,
  Linking 
} from 'react-native';

const TMDB_API_KEY = '6d0eb9fb2cc59746f4d2de2ecf59d9c9';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const PROFILE_URL = 'https://image.tmdb.org/t/p/w185';

const TEXTS = {
  tr: {
    header: 'FİLM GURMESİ',
    subHeader: 'Sadece en iyiler, sadece senin için.',
    btnMain: 'Rastgele Film Bul 🎲',
    favHeader: '❤️ FAVORİLERİM',
    loading: 'Veritabanı taranıyor...',
    watchLabel: 'TR\'DE BURADA:',
    noPlatform: 'Dijitalde Yok / Sinema',
    trailer: '▶ FRAGMANI İZLE',
    cast: 'OYUNCULAR',
    crew: 'YÖNETİM EKİBİ',
    btnAgain: '🎲 BAŞKA ÖNER',
    btnBack: 'Ana Sayfaya Dön',
    connErr: 'Bağlantı Hatası',
    noInfo: 'Bilgi Yok'
  },
  en: {
    header: 'MOVIE GOURMET',
    subHeader: 'Only the best, tailored for you.',
    btnMain: 'Find Random Movie 🎲',
    favHeader: '❤️ MY FAVORITES',
    loading: 'Scanning database...',
    watchLabel: 'WATCH IN US:',
    noPlatform: 'Not on Digital / Cinema',
    trailer: '▶ WATCH TRAILER',
    cast: 'CAST',
    crew: 'CREW',
    btnAgain: '🎲 SUGGEST ANOTHER',
    btnBack: 'Back to Home',
    connErr: 'Connection Error',
    noInfo: 'No Info'
  }
};

const HIDDEN_GENRES = [28, 35, 18, 27, 878, 10749, 53, 9648, 80];

const BACKUP_CAST = [{ id: 'c1', name: 'N/A', profile_path: null }];
const BACKUP_DATA = [
  { id: 101, original_title: 'Inception', title: 'Başlangıç', overview: 'Dream within a dream...', poster_path: null, vote_average: 8.8, release_date: '2010', platform: 'Netflix', cast: BACKUP_CAST },
];

export default function App() {
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState('tr');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const T = TEXTS[lang];

  const toggleFavorite = (item) => {
    if (favorites.some(fav => fav.id === item.id)) {
      setFavorites(favorites.filter(fav => fav.id !== item.id));
    } else {
      setFavorites([...favorites, item]);
    }
  };
  const isFavorite = (id) => favorites.some(fav => fav.id === id);

  const openYouTube = (query) => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' trailer')}`;
    Linking.openURL(url).catch(() => Alert.alert("Error", "YouTube Error"));
  };
  
  const getPlatformColor = (platformName) => {
    if (!platformName) return '#333';
    const lower = platformName.toLowerCase();
    if (lower.includes('netflix')) return '#E50914';
    if (lower.includes('disney')) return '#113CCF';
    if (lower.includes('amazon') || lower.includes('prime')) return '#00A8E1';
    if (lower.includes('apple')) return '#000000';
    if (lower.includes('hulu')) return '#1CE783'; // Hulu Yeşili
    if (lower.includes('hbo') || lower.includes('max')) return '#5329B3'; // HBO Moru
    if (lower.includes('peacock')) return '#000000';
    if (lower.includes('blutv')) return '#28D7C8';
    if (lower.includes('mubi')) return '#B29058';
    return '#444';
  };
  
  const fetchRandomMovie = async () => {
    setLoading(true);
    
    try {
      let dataToUse = null;
      let castData = [];
      let crewData = [];
      let platformName = T.noPlatform;

      const apiLang = lang === 'tr' ? 'tr-TR' : 'en-US';
      const regionCode = lang === 'tr' ? 'TR' : 'US';

      if (TMDB_API_KEY) {
        const randomGenreId = HIDDEN_GENRES[Math.floor(Math.random() * HIDDEN_GENRES.length)];
        const randomPage = Math.floor(Math.random() * 20) + 1;
        
        const response = await fetch(
          `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${randomGenreId}&page=${randomPage}&language=${apiLang}&sort_by=popularity.desc`
        );
        const json = await response.json();
        
        if (json.results && json.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * json.results.length);
          dataToUse = json.results[randomIndex];
          
          const creditsResponse = await fetch(`${BASE_URL}/movie/${dataToUse.id}/credits?api_key=${TMDB_API_KEY}&language=${apiLang}`);
          const creditsJson = await creditsResponse.json();
          castData = creditsJson.cast ? creditsJson.cast.slice(0, 10) : [];
          
          if (creditsJson.crew) {
             const keyRoles = ['Director', 'Screenplay', 'Writer'];
             const crewMap = new Map();
             creditsJson.crew.forEach(person => {
                 if (keyRoles.includes(person.job) && !crewMap.has(person.id)) {
                     crewMap.set(person.id, person);
                 }
             });
             crewData = Array.from(crewMap.values()).slice(0, 4);
          }
          
          const providerResponse = await fetch(`${BASE_URL}/movie/${dataToUse.id}/watch/providers?api_key=${TMDB_API_KEY}`);
          const providerJson = await providerResponse.json();
          
          const localProviders = providerJson.results?.[regionCode];

          if (localProviders) {
            if (localProviders.flatrate && localProviders.flatrate.length > 0) {
                platformName = localProviders.flatrate[0].provider_name;
            } else if (localProviders.rent && localProviders.rent.length > 0) {
                platformName = `${localProviders.rent[0].provider_name} (${lang === 'tr' ? 'Kirala' : 'Rent'})`;
            } else if (localProviders.buy && localProviders.buy.length > 0) {
                platformName = `${localProviders.buy[0].provider_name} (${lang === 'tr' ? 'Satın Al' : 'Buy'})`;
            }
          }
        }
      }

      if (!dataToUse) {
        dataToUse = BACKUP_DATA[Math.floor(Math.random() * BACKUP_DATA.length)];
        castData = dataToUse.cast || [];
        platformName = dataToUse.platform;
      }

      const formattedResult = {
        id: dataToUse.id,
        originalTitle: dataToUse.original_title,
        translatedTitle: dataToUse.title,
        overview: dataToUse.overview || T.noInfo,
        rating: dataToUse.vote_average ? dataToUse.vote_average.toFixed(1) : "?",
        date: dataToUse.release_date || "????",
        poster: dataToUse.poster_path ? `${IMAGE_URL}${dataToUse.poster_path}` : 'https://via.placeholder.com/500x750/333/FFF?text=No+Poster',
        platform: platformName,
        platformColor: getPlatformColor(platformName),
        cast: castData.map(p => ({ id: p.id, name: p.name, image: p.profile_path ? `${PROFILE_URL}${p.profile_path}` : null })),
        crew: crewData.map(p => ({ id: p.id, name: p.name, job: p.job, image: p.profile_path ? `${PROFILE_URL}${p.profile_path}` : null }))
      };

      setResult(formattedResult);
      setStep(2);

    } catch (error) {
      console.error(error);
      Alert.alert("Error", T.connErr);
    } finally {
      setLoading(false);
    }
  };

  const openFavorite = (item) => {
      setResult(item);
      setStep(2);
  };
  
  const renderHome = () => (
    <View style={styles.centerContent}>
     
      <View style={styles.langSwitcher}>
        <TouchableOpacity 
          style={[styles.langBtn, lang === 'tr' && styles.langBtnActive]} 
          onPress={() => setLang('tr')}
        >
          <Text style={styles.langText}>🇹🇷 TR</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.langBtn, lang === 'en' && styles.langBtnActive]} 
          onPress={() => setLang('en')}
        >
          <Text style={styles.langText}>🇺🇸 EN</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.logo}>🍿</Text>
      <Text style={styles.headerTitle}>{T.header}</Text>
      <Text style={styles.subHeader}>{T.subHeader}</Text>
      
      <TouchableOpacity style={styles.mainButton} onPress={fetchRandomMovie}>
        <Text style={styles.mainButtonText}>{T.btnMain}</Text>
      </TouchableOpacity>

      {favorites.length > 0 && (
        <View style={styles.favSection}>
          <Text style={styles.favHeader}>{T.favHeader}</Text>
          <FlatList
            data={favorites}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.favCard} onPress={() => openFavorite(item)}>
                <Image source={{ uri: item.poster }} style={styles.favPoster} />
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
  
  const renderDetail = () => {
    const favStatus = isFavorite(result.id);
    const showSubTitle = result.originalTitle !== result.translatedTitle;

    const renderPerson = ({ item, isCrew }) => (
        <View style={styles.castContainer}>
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.castImage} />
            ) : (
                <View style={[styles.castImage, styles.placeholderCast]}><Text style={styles.placeholderCastText}>{item.name.charAt(0)}</Text></View>
            )}
            <Text style={styles.castName} numberOfLines={1}>{item.name}</Text>
            {isCrew && <Text style={styles.crewJob}>{item.job}</Text>}
        </View>
    );

    return (
    <ScrollView contentContainerStyle={styles.resultContainer} bounces={false}>
      <View style={styles.posterWrapper}>
          <Image source={{ uri: result.poster }} style={styles.poster} resizeMode="cover" />
          <TouchableOpacity style={styles.favButton} onPress={() => toggleFavorite(result)}>
              <Text style={styles.favIcon}>{favStatus ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
      </View>
      
      <View style={styles.detailsCard}>
        <View style={styles.topRow}>
          <Text style={styles.rating}>★ {result.rating}</Text>
          <Text style={styles.date}>{result.date.split('-')[0]}</Text>
        </View>
        
        <Text style={styles.originalTitle}>
            {result.originalTitle}
            {showSubTitle && <Text style={styles.turkishTitle}> ({result.translatedTitle})</Text>}
        </Text>
        
        <View style={[styles.platformBadge, { backgroundColor: result.platformColor }]}>
            <Text style={styles.watchLabel}>{T.watchLabel}</Text>
            <Text style={styles.platformName} numberOfLines={1}>{result.platform}</Text>
        </View>

        <TouchableOpacity style={styles.youtubeButton} onPress={() => openYouTube(result.originalTitle)}>
            <Text style={styles.youtubeText}>{T.trailer}</Text>
        </TouchableOpacity>

        <Text style={styles.overview}>{result.overview}</Text>

        <Text style={styles.sectionTitle}>{T.cast}</Text>
        <FlatList
            data={result.cast}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => renderPerson({item, isCrew: false})}
            keyExtractor={item => 'c'+item.id}
            ListEmptyComponent={<Text style={styles.emptyText}>{T.noInfo}</Text>}
        />

        {result.crew && result.crew.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{T.crew}</Text>
            <FlatList
                data={result.crew}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => renderPerson({item, isCrew: true})}
                keyExtractor={item => 'cr'+item.id}
            />
          </>
        )}

        <TouchableOpacity style={styles.actionButton} onPress={fetchRandomMovie}>
          <Text style={styles.actionBtnText}>{T.btnAgain}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep(1)}>
          <Text style={styles.secondaryBtnText}>{T.btnBack}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>{T.loading}</Text>
        </View>
      ) : (
        <>
          {step === 1 && renderHome()}
          {step === 2 && renderDetail()}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  
  langSwitcher: { position: 'absolute', top: 50, right: 20, flexDirection: 'row', gap: 10, zIndex: 10 },
  langBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#222', borderWidth: 1, borderColor: '#444' },
  langBtnActive: { backgroundColor: '#444', borderColor: '#FF6B6B' },
  langText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  logo: { fontSize: 80, marginBottom: 20 },
  headerTitle: { fontSize: 36, fontWeight: '900', color: '#fff', textAlign: 'center', letterSpacing: 1 },
  subHeader: { color: '#666', fontSize: 16, marginBottom: 50, textAlign: 'center' },
  
  mainButton: {
    backgroundColor: '#FF6B6B', width: '100%', paddingVertical: 25, borderRadius: 20,
    alignItems: 'center', elevation: 5,
  },
  mainButtonText: { color: '#fff', fontSize: 22, fontWeight: 'bold', letterSpacing: 1 },

  favSection: { position: 'absolute', bottom: 30, left: 0, right: 0, paddingLeft: 20 },
  favHeader: { color: '#fff', fontWeight: 'bold', marginBottom: 15, fontSize: 14, opacity: 0.8 },
  favCard: { marginRight: 15, width: 80 },
  favPoster: { width: 80, height: 120, borderRadius: 8, backgroundColor: '#222' },

  
  resultContainer: { paddingBottom: 40 },
  posterWrapper: { position: 'relative' },
  poster: { width: '100%', height: 500 },
  favButton: { position: 'absolute', top: 50, right: 20, backgroundColor: 'rgba(0,0,0,0.6)', padding: 12, borderRadius: 50 },
  favIcon: { fontSize: 28 },
  
  detailsCard: { backgroundColor: '#0F0F0F', marginTop: -40, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, minHeight: 500 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' },
  rating: { color: '#F5C518', fontSize: 20, fontWeight: 'bold' },
  date: { color: '#888', fontSize: 16 },
  
  originalTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 20, lineHeight: 34 },
  turkishTitle: { fontStyle: 'italic', fontWeight: '300', fontSize: 22, color: '#ccc' },
  
  platformBadge: {
    padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 15,
  },
  watchLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 'bold' },
  platformName: { color: '#fff', fontSize: 18, fontWeight: '900', maxWidth: '60%' },

  youtubeButton: { backgroundColor: '#CC0000', flexDirection: 'row', justifyContent: 'center', padding: 14, borderRadius: 12, marginBottom: 25 },
  youtubeText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  overview: { color: '#ccc', lineHeight: 24, marginBottom: 25, fontSize: 15 },
  sectionTitle: { color: '#777', fontWeight: 'bold', marginBottom: 12, marginTop: 15, fontSize: 13 },
  
  castContainer: { alignItems: 'center', marginRight: 15, width: 70 },
  castImage: { width: 70, height: 70, borderRadius: 35, marginBottom: 5, backgroundColor: '#333' },
  placeholderCast: { justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#444' },
  placeholderCastText: { color: '#666', fontSize: 20 },
  castName: { color: '#fff', fontSize: 10, textAlign: 'center' },
  crewJob: { color: '#888', fontSize: 9, textAlign: 'center' },
  emptyText: { color: '#555' },

  actionButton: { backgroundColor: '#333', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 30, marginBottom: 10, borderWidth: 1, borderColor: '#555' },
  actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  secondaryButton: { padding: 15, alignItems: 'center' },
  secondaryBtnText: { color: '#666' },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0F0F' },
  loadingText: { color: '#fff', marginTop: 15, fontSize: 16 },
});