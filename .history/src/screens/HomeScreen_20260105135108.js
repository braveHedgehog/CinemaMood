import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

// Parametreye 'watchlist' eklendi
const HomeScreen = ({ lang, setLang, onFetch, favorites, watchlist, onOpenMovie, texts }) => {
  
  // Ortak Kart Render Fonksiyonu (Kod tekrarını önlemek için)
  const renderMovieCard = ({ item }) => (
    <TouchableOpacity style={styles.miniCard} onPress={() => onOpenMovie(item)}>
      <Image source={{ uri: item.poster }} style={styles.miniPoster} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.centerContent}>
      
      {/* Dil Seçici */}
      <View style={styles.langSwitcher}>
        <TouchableOpacity style={[styles.langBtn, lang === 'tr' && styles.langBtnActive]} onPress={() => setLang('tr')}>
          <Text style={styles.langText}>🇹🇷</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.langBtn, lang === 'en' && styles.langBtnActive]} onPress={() => setLang('en')}>
          <Text style={styles.langText}>🇺🇸</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.logo}>🍿</Text>
      <Text style={styles.headerTitle}>{texts.header}</Text>
      <Text style={styles.subHeader}>{texts.subHeader}</Text>
      
      <TouchableOpacity style={styles.mainButton} onPress={onFetch}>
        <Text style={styles.mainButtonText}>{texts.btnMain}</Text>
      </TouchableOpacity>

      {/* --- LİSTELER ALANI (Scroll Edilebilir Yapıyoruz) --- */}
      <View style={styles.listsContainer}>
        
        {/* 1. İZLEME LİSTESİ (YENİ) */}
        {watchlist.length > 0 && (
          <View style={styles.listSection}>
            <Text style={styles.listHeader}>{texts.watchlistHeader}</Text>
            <FlatList
              data={watchlist}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => 'w' + item.id}
              renderItem={renderMovieCard}
            />
          </View>
        )}

        {/* 2. FAVORİLER */}
        {favorites.length > 0 && (
          <View style={styles.listSection}>
            <Text style={styles.listHeader}>{texts.favHeader}</Text>
            <FlatList
              data={favorites}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => 'f' + item.id}
              renderItem={renderMovieCard}
            />
          </View>
        )}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  centerContent: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: COLORS.background, alignItems: 'center' },
  langSwitcher: { position: 'absolute', top: 50, right: 20, flexDirection: 'row', gap: 10, zIndex: 10 },
  langBtn: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15, backgroundColor: '#222', borderWidth: 1, borderColor: '#444' },
  langBtnActive: { backgroundColor: '#444', borderColor: COLORS.primary },
  langText: { color: COLORS.text, fontWeight: 'bold' },
  
  logo: { fontSize: 60, marginBottom: 10 },
  headerTitle: { fontSize: 32, fontWeight: '900', color: COLORS.text, textAlign: 'center', letterSpacing: 1 },
  subHeader: { color: COLORS.subText, fontSize: 14, marginBottom: 30, textAlign: 'center' },
  
  mainButton: { backgroundColor: COLORS.primary, width: '100%', paddingVertical: 20, borderRadius: 20, alignItems: 'center', elevation: 5, marginBottom: 20 },
  mainButtonText: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },

  // Listeler için stil
  listsContainer: { width: '100%', flex: 1 }, // Ekranın kalanını kaplasın
  listSection: { marginBottom: 20 },
  listHeader: { color: COLORS.text, fontWeight: 'bold', marginBottom: 10, fontSize: 14, opacity: 0.9 },
  miniCard: { marginRight: 15, width: 90 },
  miniPoster: { width: 90, height: 135, borderRadius: 8, backgroundColor: '#222' },
});

export default HomeScreen;