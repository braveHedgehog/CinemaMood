import React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const HomeScreen = ({ lang, setLang, onFetch, favorites, onOpenFavorite, texts }) => {
  return (
    <View style={styles.centerContent}>
      
      {/* Dil Seçici */}
      <View style={styles.langSwitcher}>
        <TouchableOpacity style={[styles.langBtn, lang === 'tr' && styles.langBtnActive]} onPress={() => setLang('tr')}>
          <Text style={styles.langText}>🇹🇷 TR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.langBtn, lang === 'en' && styles.langBtnActive]} onPress={() => setLang('en')}>
          <Text style={styles.langText}>🇺🇸 EN</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.logo}>🍿</Text>
      <Text style={styles.headerTitle}>{texts.header}</Text>
      <Text style={styles.subHeader}>{texts.subHeader}</Text>
      
      <TouchableOpacity style={styles.mainButton} onPress={onFetch}>
        <Text style={styles.mainButtonText}>{texts.btnMain}</Text>
      </TouchableOpacity>

      {favorites.length > 0 && (
        <View style={styles.favSection}>
          <Text style={styles.favHeader}>{texts.favHeader}</Text>
          <FlatList
            data={favorites}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.favCard} onPress={() => onOpenFavorite(item)}>
                <Image source={{ uri: item.poster }} style={styles.favPoster} />
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: COLORS.background },
  langSwitcher: { position: 'absolute', top: 50, right: 20, flexDirection: 'row', gap: 10, zIndex: 10 },
  langBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#222', borderWidth: 1, borderColor: '#444' },
  langBtnActive: { backgroundColor: '#444', borderColor: COLORS.primary },
  langText: { color: COLORS.text, fontWeight: 'bold' },
  logo: { fontSize: 80, marginBottom: 20 },
  headerTitle: { fontSize: 36, fontWeight: '900', color: COLORS.text, textAlign: 'center', letterSpacing: 1 },
  subHeader: { color: COLORS.subText, fontSize: 16, marginBottom: 50, textAlign: 'center' },
  mainButton: { backgroundColor: COLORS.primary, width: '100%', paddingVertical: 25, borderRadius: 20, alignItems: 'center', elevation: 5 },
  mainButtonText: { color: COLORS.text, fontSize: 22, fontWeight: 'bold', letterSpacing: 1 },
  favSection: { position: 'absolute', bottom: 30, left: 0, right: 0, paddingLeft: 20 },
  favHeader: { color: COLORS.text, fontWeight: 'bold', marginBottom: 15, fontSize: 14, opacity: 0.8 },
  favCard: { marginRight: 15, width: 80 },
  favPoster: { width: 80, height: 120, borderRadius: 8, backgroundColor: '#222' },
});

export default HomeScreen;