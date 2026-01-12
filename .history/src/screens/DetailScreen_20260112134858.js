import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, FlatList, StyleSheet, Linking, Alert, Dimensions, Platform,Share } from 'react-native';
import { COLORS } from '../constants/colors';
import CastItem from '../components/CastItem';


const { width, height } = Dimensions.get('window');

const DetailScreen = ({ result, onBack, onAgain, isFavorite, onToggleFavorite, isInWatchlist, onToggleWatchlist, texts }) => {

 const openYouTube = () => {
    if (result.youtubeKey) {
        // Eğer resmi fragman ID'si varsa:
        const appUrl = `youtube://watch?v=${result.youtubeKey}`; // Uygulamada açmaya çalış
        const webUrl = `https://www.youtube.com/watch?v=${result.youtubeKey}`; // Tarayıcıda aç

        Linking.canOpenURL(appUrl).then(supported => {
            if (supported) {
                Linking.openURL(appUrl);
            } else {
                Linking.openURL(webUrl);
            }
        });
    } else {
        // Eğer resmi fragman YOKSA (Eski usül arama yap):
        const query = result.originalTitle;
        const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' trailer')}`;
        Linking.openURL(url).catch(() => Alert.alert("Hata", "YouTube açılamadı."));
    }
  };

  const getPlatformColor = (p) => {
    if(!p) return COLORS.platforms.default;
    const l = p.toLowerCase();
    if(l.includes('netflix')) return COLORS.platforms.netflix;
    if(l.includes('disney')) return COLORS.platforms.disney;
    if(l.includes('prime') || l.includes('amazon')) return COLORS.platforms.prime;
    if(l.includes('apple')) return COLORS.platforms.apple;
    if(l.includes('mubi')) return COLORS.platforms.mubi;
    if(l.includes('blutv')) return COLORS.platforms.blutv;
    return COLORS.platforms.default;
  };

  const showSubTitle = result.originalTitle !== result.translatedTitle;
  const platformColor = getPlatformColor(result.platform);
  const handleShare = async () => {
  try {
    const message = `🎬 ${result.originalTitle} (${result.rating})\n\nBu filmi CİnemaMood'da buldum! İzlemelisin.\n\nÖzet: ${result.overview}`;
    await Share.share({ message });
  } catch (error) {
    console.log(error.message);
  }
};

  return (
    <View style={styles.mainContainer}>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* POSTER ALANI */}
        <View style={styles.posterWrapper}>
          <Image source={result.poster ? { uri: result.poster } : null} style={styles.poster} resizeMode="cover" />
          
          {/* Siyah Gradient Efekti (Yazılar okunsun diye alttan karartma) */}
          <View style={styles.gradientOverlay} />
        </View>
        
        {/* DETAY KARTI */}
        <View style={styles.detailsCard}>
           
           {/* Header Bilgileri */}
           <View style={styles.headerInfo}>
              <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ {result.rating}</Text>
              </View>
              <Text style={styles.genreText}>{result.genres}</Text>
              <Text style={styles.date}>{result.date.split('-')[0]}</Text>
           </View>
            
           <Text style={styles.originalTitle}>
                {result.originalTitle}
                {showSubTitle && <Text style={styles.translatedTitle}> ({result.translatedTitle})</Text>}
           </Text>

           {/* Platform & YouTube */}
           <View style={styles.actionRow}>
               <View style={[styles.platformBadge, { backgroundColor: platformColor }]}>
                    <Text style={styles.watchLabel}>{texts.watchLabel}</Text>
                    <Text style={styles.platformName} numberOfLines={1}>{result.platform}</Text>
               </View>

               <TouchableOpacity style={styles.youtubeButton} onPress={openYouTube}>
                    <Text style={styles.youtubeIcon}>▶</Text>
               </TouchableOpacity>
           </View>

           <Text style={styles.overview}>{result.overview}</Text>

           {/* Oyuncular */}
           <Text style={styles.sectionTitle}>{texts.cast}</Text>
           <FlatList
                data={result.cast}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => <CastItem name={item.name} image={item.image} />}
                keyExtractor={item => 'c' + item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>{texts.noInfo}</Text>}
           />

           {/* Yönetim Ekibi */}
           {result.crew && result.crew.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>{texts.crew}</Text>
                <FlatList
                    data={result.crew}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => <CastItem name={item.name} job={item.job} image={item.image} />}
                    keyExtractor={item => 'cr' + item.id}
                />
              </>
           )}
           
           {/* ScrollView'in altına boşluk bırakıyoruz ki Floating Buton yazıları kapatmasın */}
           <View style={{ height: 100 }} />

        </View>
      </ScrollView>

      {/* --- SABİT (FLOATING) ÜST BUTONLAR --- */}
      
      {/* 1. GERİ DÖN (Sol Üst) */}
      <TouchableOpacity style={styles.backButtonFixed} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {/* 2. SAĞ ÜST İKONLAR (Watchlist & Fav) */}
      <View style={styles.topRightButtons}>
          <TouchableOpacity style={styles.iconButtonSmall} onPress={onToggleWatchlist}>
              <Text style={styles.iconTextSmall}>{isInWatchlist ? '✅' : '🎬'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButtonSmall} onPress={handleShare}>
        <Text style={styles.iconTextSmall}>📤</Text>
    </TouchableOpacity>

          <TouchableOpacity style={styles.iconButtonSmall} onPress={onToggleFavorite}>
              <Text style={styles.iconTextSmall}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
      </View>

      {/* --- SABİT (FLOATING) ALT BUTON (BAŞKA ÖNER) --- */}
      <View style={styles.floatingBottomContainer}>
          <TouchableOpacity style={styles.floatingButton} onPress={onAgain} activeOpacity={0.8}>
            <Text style={styles.floatingBtnText}>{texts.btnAgain}</Text>
          </TouchableOpacity>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 0 },
  
  posterWrapper: { position: 'relative', height: 500 },
  poster: { width: '100%', height: '100%', backgroundColor: '#222' },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150, // Posterin altına doğru hafif karartma
    backgroundColor: 'rgba(0,0,0,0.3)' 
  },

  // --- SABİT BUTONLAR ---
  backButtonFixed: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 50 : 20, // Çentik ayarı
      left: 20,
      width: 45,
      height: 45,
      borderRadius: 25,
      backgroundColor: 'rgba(0,0,0,0.6)', // Yarı saydam siyah
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)'
  },
  backIcon: { color: '#fff', fontSize: 30, fontWeight: 'bold', marginTop:-10 },

  topRightButtons: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 50 : 20,
      right: 20,
      flexDirection: 'row',
      gap: 10,
      zIndex: 10
  },
  iconButtonSmall: {
      width: 45,
      height: 45,
      borderRadius: 25,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)'
  },
  iconTextSmall: { fontSize: 20 },

  // --- FLOATING ALT BUTON ---
  floatingBottomContainer: {
      position: 'absolute',
      bottom: 30,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 20,
  },
  floatingButton: {
      flexDirection: 'row',
      backgroundColor: COLORS.primary, // Ana renk
      paddingVertical: 16,
      paddingHorizontal: 30,
      borderRadius: 30,
      alignItems: 'center',
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 8,
  },
  floatingBtnText: {
      color: COLORS.text,
      fontSize: 18,
      fontWeight: 'bold',
      letterSpacing: 1,
      marginLeft: 10
  },
  floatingBtnIcon: { fontSize: 22 },

  // --- DETAY KARTI ---
  detailsCard: { 
      backgroundColor: COLORS.background, 
      marginTop: -40, 
      borderTopLeftRadius: 30, 
      borderTopRightRadius: 30, 
      padding: 25, 
      minHeight: 500 
  },
  
  // Header Info (Puan, Tür, Yıl yan yana)
  headerInfo: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      marginBottom: 15, 
      flexWrap: 'wrap',
      gap: 10
  },
  ratingBadge: { backgroundColor: '#F5C518', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  ratingText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  genreText: { color: '#ccc', fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  date: { color: '#888', fontSize: 14 },

  originalTitle: { color: COLORS.text, fontSize: 28, fontWeight: 'bold', marginBottom: 20, lineHeight: 34 },
  translatedTitle: { fontStyle: 'italic', fontWeight: '300', fontSize: 22, color: '#ccc' },

  // Platform ve Youtube Yan Yana
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  platformBadge: { 
      flex: 1, 
      backgroundColor: '#333', 
      padding: 12, 
      borderRadius: 12, 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between' 
  },
  watchLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 'bold' },
  platformName: { color: '#fff', fontSize: 15, fontWeight: 'bold', maxWidth: '70%' },
  
  youtubeButton: { 
      width: 50, 
      backgroundColor: COLORS.youtube, 
      borderRadius: 12, 
      justifyContent: 'center', 
      alignItems: 'center' 
  },
  youtubeIcon: { color: '#fff', fontSize: 20 },

  overview: { color: '#ccc', lineHeight: 24, marginBottom: 25, fontSize: 15 },
  sectionTitle: { color: COLORS.subText, fontWeight: 'bold', marginBottom: 12, marginTop: 15, fontSize: 13 },
  emptyText: { color: COLORS.subText },
});

export default DetailScreen;