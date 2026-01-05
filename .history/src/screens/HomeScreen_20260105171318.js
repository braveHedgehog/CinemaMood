import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const HomeScreen = ({ lang, setLang, onFetch, favorites, watchlist, onOpenMovie, onManage, texts,onMood }) => {
  
  const isEmpty = favorites.length === 0 && watchlist.length === 0;
  
  const renderMovieCard = ({ item }) => (
    <TouchableOpacity style={styles.miniCard} onPress={() => onOpenMovie(item)}>
      <Image source={{ uri: item.poster }} style={styles.miniPoster} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.centerContent, isEmpty && styles.centerContentEmpty]}>
      
      {}
      <View style={styles.langSwitcher}>
        <TouchableOpacity style={[styles.langBtn, lang === 'tr' && styles.langBtnActive]} onPress={() => setLang('tr')}>
          <Text style={styles.langText}>🇹🇷</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.langBtn, lang === 'en' && styles.langBtnActive]} onPress={() => setLang('en')}>
          <Text style={styles.langText}>🇺🇸</Text>
        </TouchableOpacity>
      </View>

      {}
      <View style={styles.titleContainer}>
        <Text style={styles.logo}>🍿</Text>
        <Text style={styles.headerTitle}>{texts.header}</Text>
        <Text style={styles.subHeader}>{texts.subHeader}</Text>
      </View>
      
      {}
      <TouchableOpacity style={styles.mainButton} onPress={onFetch}>
        <Text style={styles.mainButtonText}>{texts.btnMain}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.moodButton} onPress={onMood}>
            <Text style={styles.moodButtonText}>{texts.btnMood}</Text>
          </TouchableOpacity>

      {}
      {!isEmpty && (
        <View style={styles.listsContainer}>
          
          {}
          {watchlist.length > 0 && (
            <View style={styles.listSection}>
              <View style={styles.headerRow}>
                  <Text style={styles.listHeader}>{texts.watchlistHeader}</Text>
                  <TouchableOpacity onPress={onManage}>
                      <Text style={styles.manageText}>{texts.manageList}</Text>
                  </TouchableOpacity>
              </View>
              <FlatList
                data={watchlist}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => 'w' + item.id}
                renderItem={renderMovieCard}
              />
            </View>
          )}

          {}
          {favorites.length > 0 && (
            <View style={styles.listSection}>
              <Text style={[styles.listHeader, { marginBottom: 10 }]}>{texts.favHeader}</Text>
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
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  centerContent: { 
    flex: 1, 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    backgroundColor: COLORS.background, 
    alignItems: 'center',
    justifyContent: 'flex-start' 
  },
  
  centerContentEmpty: {
    paddingTop: 0,
    justifyContent: 'center'
  },

  langSwitcher: { position: 'absolute', top: 50, right: 20, flexDirection: 'row', gap: 10, zIndex: 10 },
  langBtn: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 15, backgroundColor: '#222', borderWidth: 1, borderColor: '#444' },
  langBtnActive: { backgroundColor: '#444', borderColor: COLORS.primary },
  langText: { color: COLORS.text, fontWeight: 'bold' },
  
  titleContainer: { alignItems: 'center', marginBottom: 10 },
  logo: { fontSize: 60, marginBottom: 10 },
  headerTitle: { fontSize: 32, fontWeight: '900', color: COLORS.text, textAlign: 'center', letterSpacing: 1 },
  subHeader: { color: COLORS.subText, fontSize: 14, marginBottom: 30, textAlign: 'center' },
  
  mainButton: { backgroundColor: COLORS.primary, width: '100%', paddingVertical: 20, borderRadius: 20, alignItems: 'center', elevation: 5, marginBottom: 20 },
  mainButtonText: { color: COLORS.text, fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },

  moodButton: {
    backgroundColor: '#222', 
    width: '100%',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444'
  },
  moodButtonText: { 
    color: '#ccc',
    fontSize: 16, 
    fontWeight: '600',
    letterSpacing: 0.5 
  },
  
  listsContainer: { width: '100%', flex: 1 },
  listSection: { marginBottom: 20 },
  
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10,
    paddingRight: 5
  },
  listHeader: { color: COLORS.text, fontWeight: 'bold', fontSize: 14, opacity: 0.9 },
  manageText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold' },

  miniCard: { marginRight: 15, width: 90 },
  miniPoster: { width: 90, height: 135, borderRadius: 8, backgroundColor: '#222' },
});

export default HomeScreen;