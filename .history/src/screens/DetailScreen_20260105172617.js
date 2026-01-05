import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, FlatList, StyleSheet, Linking, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import CastItem from '../components/CastItem';

const DetailScreen = ({ result, onBack, onAgain, isFavorite, onToggleFavorite, isInWatchlist, onToggleWatchlist, texts }) => {

  const openYouTube = () => {
    const query = result.originalTitle;
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' trailer')}`;
    Linking.openURL(url).catch(() => Alert.alert("Hata", "YouTube açılamadı."));
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

  return (
    <ScrollView contentContainerStyle={styles.container} bounces={false}>
      {/* POSTER VE BUTONLAR */}
      <View style={styles.posterWrapper}>
        <Image source={result.poster ? { uri: result.poster } : null} style={styles.poster} resizeMode="cover" />
        
        <View style={styles.headerButtons}>
            {/* İzleme Listesi Butonu */}
            <TouchableOpacity style={styles.iconButton} onPress={onToggleWatchlist}>
                <Text style={styles.iconText}>{isInWatchlist ? '✅' : '🔖'}</Text>
            </TouchableOpacity>

            {/* Favori Butonu */}
            <TouchableOpacity style={styles.iconButton} onPress={onToggleFavorite}>
                <Text style={styles.iconText}>{isFavorite ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
        </View>
      </View>
      
      {/* DETAY KARTI */}
      <View style={styles.detailsCard}>
         
         <View style={styles.topRow}>
            <Text style={styles.rating}>★ {result.rating}</Text>
            <Text style={styles.date}>{result.date.split('-')[0]}</Text>
         </View>
         
         {/* YENİ EKLENEN TÜR BİLGİSİ */}
         <Text style={styles.genreText}>{result.genres}</Text>
          
         <Text style={styles.originalTitle}>
              {result.originalTitle}
              {showSubTitle && <Text style={styles.translatedTitle}> ({result.translatedTitle})</Text>}
         </Text>

         <View style={[styles.platformBadge, { backgroundColor: platformColor }]}>
              <Text style={styles.watchLabel}>{texts.watchLabel}</Text>
              <Text style={styles.platformName} numberOfLines={1}>{result.platform}</Text>
         </View>

         <TouchableOpacity style={styles.youtubeButton} onPress={openYouTube}>
              <Text style={styles.youtubeText}>{texts.trailer}</Text>
         </TouchableOpacity>

         <Text style={styles.overview}>{result.overview}</Text>

         <Text style={styles.sectionTitle}>{texts.cast}</Text>
         <FlatList
              data={result.cast}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => <CastItem name={item.name} image={item.image} />}
              keyExtractor={item => 'c' + item.id}
              ListEmptyComponent={<Text style={styles.emptyText}>{texts.noInfo}</Text>}
         />

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

         {/* ALT BUTONLAR */}
         <TouchableOpacity style={styles.actionButton} onPress={onAgain}>
            <Text style={styles.actionBtnText}>{texts.btnAgain}</Text>
         </TouchableOpacity>
          
         <TouchableOpacity style={styles.secondaryButton} onPress={onBack}>
            <Text style={styles.secondaryBtnText}>{texts.btnBack}</Text>
         </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 40, backgroundColor: COLORS.background },
  posterWrapper: { position: 'relative' },
  poster: { width: '100%', height: 500, backgroundColor: '#222' },
  
  headerButtons: { position: 'absolute', top: 50, right: 20, flexDirection: 'row', gap: 15 },
  iconButton: { backgroundColor: 'rgba(0,0,0,0.6)', padding: 12, borderRadius: 50, width: 55, height: 55, justifyContent: 'center', alignItems: 'center' },
  iconText: { fontSize: 26 },

  detailsCard: { backgroundColor: COLORS.background, marginTop: -40, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, minHeight: 500 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, alignItems: 'center' },
  
  rating: { color: COLORS.star, fontSize: 20, fontWeight: 'bold' },
  date: { color: COLORS.subText, fontSize: 16 },

  // YENİ TÜR STİLİ
  genreText: { 
      color: '#888', 
      fontSize: 12, 
      fontWeight: '700', 
      textTransform: 'uppercase', 
      letterSpacing: 1, 
      marginBottom: 15 
  },

  originalTitle: { color: COLORS.text, fontSize: 28, fontWeight: 'bold', marginBottom: 20, lineHeight: 34 },
  translatedTitle: { fontStyle: 'italic', fontWeight: '300', fontSize: 22, color: '#ccc' },
  platformBadge: { padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  watchLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 'bold' },
  platformName: { color: '#fff', fontSize: 18, fontWeight: '900', maxWidth: '60%' },
  youtubeButton: { backgroundColor: COLORS.youtube, flexDirection: 'row', justifyContent: 'center', padding: 14, borderRadius: 12, marginBottom: 25 },
  youtubeText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  overview: { color: '#ccc', lineHeight: 24, marginBottom: 25, fontSize: 15 },
  sectionTitle: { color: COLORS.subText, fontWeight: 'bold', marginBottom: 12, marginTop: 15, fontSize: 13 },
  emptyText: { color: COLORS.subText },
  actionButton: { backgroundColor: '#333', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 30, marginBottom: 10, borderWidth: 1, borderColor: '#555' },
  actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  secondaryButton: { padding: 15, alignItems: 'center' },
  secondaryBtnText: { color: COLORS.subText },
});

export default DetailScreen;