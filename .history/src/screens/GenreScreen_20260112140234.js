import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

// Tür Listesi
const GENRES = [
  // Özel Kategoriler
  { id: 'local-tr', tr: 'Yerli Filmler',color: '#E84118' },
  { id: 'rom-com', tr: 'Romantik Komedi', en: 'Rom-Com', emoji: '😍', color: '#e056fd' },
  
  // Standart Türler
  { id: 28, tr: 'Aksiyon', en: 'Action', emoji: '🔥', color: '#FF4757' },
  { id: 35, tr: 'Komedi', en: 'Comedy', emoji: '😂', color: '#FFA502' },
  { id: 18, tr: 'Dram', en: 'Drama', emoji: '🎭', color: '#5352ED' },
  { id: 27, tr: 'Korku', en: 'Horror', emoji: '👻', color: '#2F3542' },
  { id: 878, tr: 'Bilim Kurgu', en: 'Sci-Fi', emoji: '👽', color: '#2ED573' },
  { id: 10749, tr: 'Romantik', en: 'Romance', emoji: '❤️', color: '#FF6B81' },
  { id: 53, tr: 'Gerilim', en: 'Thriller', emoji: '🔪', color: '#57606F' },
  { id: 9648, tr: 'Gizem', en: 'Mystery', emoji: '🕵️‍♂️', color: '#747D8C' },
  { id: 16, tr: 'Animasyon', en: 'Animation', emoji: '🎨', color: '#1E90FF' },
  { id: 14, tr: 'Fantastik', en: 'Fantasy', emoji: '🦄', color: '#A29BFE' },
];

const GenreScreen = ({ lang, onSelectGenre, onBack, texts }) => {

  // --- FİLTRELEME MANTIĞI ---
  // Eğer dil İngilizce ise 'local-tr' ID'li öğeyi listeden çıkar.
  const displayedGenres = GENRES.filter(item => {
    if (lang === 'en' && item.id === 'local-tr') {
        return false; // Listeye alma
    }
    return true; // Diğerlerini al
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: item.color + '20', borderColor: item.color }]}
      onPress={() => onSelectGenre(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.dot, { backgroundColor: item.color }]} />
      <Text style={styles.genreText}>{lang === 'tr' ? item.tr : item.en}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.titleArea}>
            <Text style={styles.headerTitle}>{texts.genreTitle}</Text>
            <Text style={styles.subHeader}>
                {lang === 'tr' ? 'Bugün ne izlemek istersin?' : 'What\'s your vibe today?'}
            </Text>
        </View>
      </View>

      <FlatList
        // GENRES yerine filtrelediğimiz displayedGenres'i veriyoruz
        data={displayedGenres} 
        keyExtractor={item => 'g_' + item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 20 },
  
  headerContainer: { 
      paddingHorizontal: 20, 
      marginBottom: 20, 
      flexDirection: 'row', 
      alignItems: 'flex-start' 
  },
  backBtn: { 
      padding: 10, 
      backgroundColor: '#222', 
      borderRadius: 12, 
      marginRight: 15,
      borderWidth: 1,
      borderColor: '#333'
  },
  backText: { color: '#fff', fontSize: 22, fontWeight: 'bold', lineHeight: 24 },
  
  titleArea: { flex: 1 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 0.5, marginBottom: 5 },
  subHeader: { color: '#888', fontSize: 14 },

  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  row: { justifyContent: 'space-between', marginBottom: 20 },

  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.85,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  
  dot: {
      position: 'absolute',
      top: 15,
      right: 15,
      width: 8,
      height: 8,
      borderRadius: 4,
      opacity: 0.8
  },

  emoji: {
    fontSize: 42,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10
  },
  genreText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center'
  }
});

export default GenreScreen;