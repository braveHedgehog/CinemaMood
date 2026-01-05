import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

const HomeScreen = ({ lang, setLang, onFetch, onMood, favorites, watchlist, onOpenMovie, onManage, texts }) => {
  
  const isEmpty = favorites.length === 0 && watchlist.length === 0;

  const renderMovieCard = ({ item }) => (
    <TouchableOpacity style={styles.cardContainer} onPress={() => onOpenMovie(item)} activeOpacity={0.7}>
      <Image source={{ uri: item.poster }} style={styles.poster} />
      {/* Hafif bir gölge efekti için alttaki view */}
      <View style={styles.cardShadow} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isEmpty ? styles.centerLayout : styles.startLayout]}>
      
      {/* --- ÜST HEADER ALANI --- */}
      <View style={styles.headerArea}>
        {/* Sol Taraf: Logo ve Başlık */}
        <View>
            <Text style={isEmpty ? styles.logoBig : styles.logoSmall}>🍿</Text>
            <Text style={isEmpty ? styles.titleBig : styles.titleSmall}>{texts.header}</Text>
            {isEmpty && <Text style={styles.subTitle}>{texts.subHeader}</Text>}
        </View>

        {/* Sağ Taraf: Dil Seçici */}
        <View style={styles.langRow}>
            <TouchableOpacity onPress={() => setLang('tr')} style={[styles.langBtn, lang === 'tr' && styles.langActive]}>
                <Text style={styles.langText}>TR</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLang('en')} style={[styles.langBtn, lang === 'en' && styles.langActive]}>
                <Text style={styles.langText}>EN</Text>
            </TouchableOpacity>
        </View>
      </View>

      {/* --- AKSİYON BUTONLARI (YAN YANA) --- */}
      <View style={styles.actionRow}>
        {/* 1. Rastgele */}
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.primary }]} onPress={onFetch}>
            <Text style={styles.btnIcon}>🎲</Text>
            <Text style={styles.btnText}>{texts.btnMain}</Text>
        </TouchableOpacity>

        {/* 2. Moduna Göre */}
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#333', borderWidth: 1, borderColor: '#555' }]} onPress={onMood}>
            <Text style={styles.btnIcon}>🎭</Text>
            <Text style={styles.btnText}>{texts.btnMood}</Text>
        </TouchableOpacity>
      </View>

      {/* --- LİSTELER (SOLA YASLI) --- */}
      {!isEmpty && (
        <View style={styles.listContainer}>
          
          {/* İZLEME LİSTESİ */}
          {watchlist.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{texts.watchlistHeader}</Text>
                <TouchableOpacity onPress={onManage}>
                    <Text style={styles.editLink}>{texts.manageList}</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={watchlist}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 20 }} // İlk eleman soldan boşluklu başlasın
                keyExtractor={item => 'w' + item.id}
                renderItem={renderMovieCard}
              />
            </View>
          )}

          {/* FAVORİLER */}
          {favorites.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { marginLeft: 20, marginBottom: 10 }]}>{texts.favHeader}</Text>
              <FlatList
                data={favorites}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 20 }}
                keyExtractor={item => 'f' + item.id}
                renderItem={renderMovieCard}
              />
            </View>
          )}
        </View>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50 },
  
  // Layout Modları
  centerLayout: { justifyContent: 'center', paddingHorizontal: 20 },
  startLayout: { justifyContent: 'flex-start' },

  // --- HEADER ---
  headerArea: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start',
      paddingHorizontal: 20,
      marginBottom: 30
  },
  logoBig: { fontSize: 60, marginBottom: 10, textAlign: 'center', width: '100%' },
  logoSmall: { fontSize: 24 }, // Doluyken küçük logo
  titleBig: { fontSize: 32, fontWeight: '900', color: '#fff', textAlign: 'center', letterSpacing: 1 },
  titleSmall: { fontSize: 20, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 }, // Doluyken küçük başlık
  subTitle: { color: '#888', textAlign: 'center', marginTop: 5 },

  // Dil Seçici
  langRow: { flexDirection: 'row', gap: 8 },
  langBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#222', borderWidth: 1, borderColor: '#444' },
  langActive: { borderColor: COLORS.primary, backgroundColor: '#333' },
  langText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  // --- BUTONLAR (YAN YANA) ---
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 15
  },
  actionButton: {
    flex: 1, // Mevcut alanın yarısını kapla
    height: 100,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  btnIcon: { fontSize: 32, marginBottom: 8 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14, textAlign: 'center' },

  // --- LİSTELER ---
  listContainer: { flex: 1 },
  section: { marginBottom: 25 },
  sectionHeader: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      paddingHorizontal: 20, 
      marginBottom: 10 
  },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
  editLink: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold' },

  // Film Kartları
  cardContainer: { marginRight: 15, position: 'relative' },
  poster: { width: 110, height: 165, borderRadius: 12, backgroundColor: '#222' },
});

export default HomeScreen;