import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/colors';

const { width } = Dimensions.get('window');

const HomeScreen = ({ lang, setLang, onFetch, onMood, favorites, watchlist, onOpenMovie, onManage, texts }) => {
  
  const isEmpty = favorites.length === 0 && watchlist.length === 0;

  const renderMovieCard = ({ item }) => (
    <TouchableOpacity style={styles.cardContainer} onPress={() => onOpenMovie(item)} activeOpacity={0.7}>
      <Image source={{ uri: item.poster }} style={styles.poster} />
      <View style={styles.cardShadow} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      {/* --- DİL SEÇİCİ (Her zaman sağ üstte sabit) --- */}
      <View style={styles.langWrapper}>
        <View style={styles.langRow}>
            <TouchableOpacity onPress={() => setLang('tr')} style={[styles.langBtn, lang === 'tr' && styles.langActive]}>
                <Text style={styles.langText}>TR</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLang('en')} style={[styles.langBtn, lang === 'en' && styles.langActive]}>
                <Text style={styles.langText}>EN</Text>
            </TouchableOpacity>
        </View>
      </View>

      {/* --- İÇERİK ALANI --- */}
      {/* Eğer boşsa 'centeredView', doluysa 'scrollingView' kullanıyoruz */}
      <View style={isEmpty ? styles.centeredView : styles.scrollingView}>

          {/* --- HEADER (LOGO & BAŞLIK) --- */}
          <View style={isEmpty ? styles.headerEmpty : styles.headerFilled}>
            {isEmpty ? (
                // BOŞ EKRAN TASARIMI (Büyük Logo)
                <View style={styles.emptyStateHero}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoBig}>🍿</Text>
                    </View>
                    <Text style={styles.titleBig}>{texts.header}</Text>
                    <Text style={styles.subTitle}>{texts.subHeader}</Text>
                </View>
            ) : (
                // DOLU EKRAN TASARIMI (Küçük, Sola Yaslı Logo)
                <View>
                    <Text style={styles.logoSmall}>🍿</Text>
                    <Text style={styles.titleSmall}>{texts.header}</Text>
                </View>
            )}
          </View>

          {/* --- AKSİYON BUTONLARI --- */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.primary }]} onPress={onFetch}>
                <Text style={styles.btnIcon}>🎲</Text>
                <Text style={styles.btnText}>{texts.btnMain}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.moodBtn]} onPress={onMood}>
                <Text style={styles.btnIcon}>🎭</Text>
                <Text style={styles.btnText}>{texts.btnMood}</Text>
            </TouchableOpacity>
          </View>

          {/* --- LİSTELER (Sadece Doluysa Görünür) --- */}
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
                    contentContainerStyle={{ paddingLeft: 20 }}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // --- LAYOUTS ---
  // Boşken tam ortala
  centeredView: { 
      flex: 1, 
      justifyContent: 'center', 
      paddingHorizontal: 20,
      marginTop: -40 // Optik dengeleme (Dil seçiciden dolayı)
  },
  // Doluyken yukarı yasla
  scrollingView: { 
      flex: 1, 
      justifyContent: 'flex-start',
      paddingTop: 80 
  },

  // --- DİL SEÇİCİ (SABİT) ---
  langWrapper: { 
      position: 'absolute', 
      top: 50, 
      right: 20, 
      zIndex: 100 
  },
  langRow: { flexDirection: 'row', gap: 8 },
  langBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.5)', borderWidth: 1, borderColor: '#444' },
  langActive: { borderColor: COLORS.primary, backgroundColor: '#333' },
  langText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  // --- HEADER STILLERI ---
  headerEmpty: { alignItems: 'center', marginBottom: 40 },
  headerFilled: { paddingHorizontal: 20, marginBottom: 20, alignItems: 'flex-start' },

  // BOŞ EKRAN ÖZEL (HERO)
  emptyStateHero: { alignItems: 'center' },
  logoCircle: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: '#1F1F1F', // Koyu gri daire
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#333',
      // Hafif Gölge
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 10,
  },
  logoBig: { fontSize: 70 },
  titleBig: { fontSize: 32, fontWeight: '900', color: '#fff', textAlign: 'center', letterSpacing: 1, marginBottom: 8 },
  subTitle: { color: '#888', textAlign: 'center', fontSize: 16, maxWidth: '80%' },

  // DOLU EKRAN ÖZEL
  logoSmall: { fontSize: 30, marginBottom: 5 },
  titleSmall: { fontSize: 24, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 },

  // --- BUTONLAR ---
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 15,
    width: '100%' // Boş ekranda tam genişlik
  },
  actionButton: {
    flex: 1,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  moodBtn: {
      backgroundColor: '#222', 
      borderWidth: 1, 
      borderColor: '#444',
      shadowColor: "#000",
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

  cardContainer: { marginRight: 15 },
  poster: { width: 110, height: 165, borderRadius: 12, backgroundColor: '#222' },
});

export default HomeScreen;