import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

// Sabit Tür Listesi (Emoji ve ID'ler)
const GENRES = [
  { id: 28, tr: 'Aksiyon 🔥', en: 'Action 🔥' },
  { id: 35, tr: 'Komedi 😂', en: 'Comedy 😂' },
  { id: 18, tr: 'Dram 🎭', en: 'Drama 🎭' },
  { id: 27, tr: 'Korku 👻', en: 'Horror 👻' },
  { id: 878, tr: 'Bilim Kurgu 👽', en: 'Sci-Fi 👽' },
  { id: 10749, tr: 'Romantik ❤️', en: 'Romance ❤️' },
  { id: 53, tr: 'Gerilim 🔪', en: 'Thriller 🔪' },
  { id: 9648, tr: 'Gizem 🕵️‍♂️', en: 'Mystery 🕵️‍♂️' },
  { id: 16, tr: 'Animasyon 🎨', en: 'Animation 🎨' },
  { id: 14, tr: 'Fantastik 🦄', en: 'Fantasy 🦄' },
];

const GenreScreen = ({ lang, onSelectGenre, onBack, texts }) => {

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onSelectGenre(item.id)} // ID'yi gönderiyoruz
    >
      <Text style={styles.genreText}>{lang === 'tr' ? item.tr : item.en}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{texts.genreTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Grid Liste */}
      <FlatList
        data={GENRES}
        keyExtractor={item => 'g_' + item.id}
        renderItem={renderItem}
        numColumns={2} // İki sütunlu görünüm
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  backBtn: { padding: 10, backgroundColor: '#222', borderRadius: 10 },
  backText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
  
  listContent: { paddingHorizontal: 15, paddingBottom: 40 },
  row: { justifyContent: 'space-between', marginBottom: 15 },

  card: {
    backgroundColor: '#1F1F1F',
    width: '48%', // Yanyana iki tane sığsın
    paddingVertical: 25,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
    elevation: 3,
  },
  genreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default GenreScreen;