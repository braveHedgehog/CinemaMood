import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

// 'onOpen' parametresini ekledik
const WatchlistScreen = ({ watchlist, onBack, onOpen, onRemove, onMoveUp, onMoveDown, texts }) => {

  const renderItem = ({ item, index }) => {
    const isFirst = index === 0;
    const isLast = index === watchlist.length - 1;

    return (
      <View style={styles.card}>
        
        {/* SOL TIKLANABİLİR ALAN (Numara + Poster + Bilgi) */}
        <TouchableOpacity 
            style={styles.clickableArea} 
            onPress={() => onOpen(item)} // Tıklanınca detaya git
            activeOpacity={0.7}
        >
            {/* 1. NUMARA (Sıralama) */}
            <Text style={styles.rankNumber}>#{index + 1}</Text>

            {/* 2. POSTER */}
            <Image source={{ uri: item.poster }} style={styles.poster} />

            {/* 3. BİLGİ */}
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={1}>{item.originalTitle}</Text>
              <Text style={styles.subTitle} numberOfLines={1}>{item.translatedTitle}</Text>
              <Text style={styles.rating}>★ {item.rating}</Text>
            </View>
        </TouchableOpacity>

        {/* SAĞ TARAF: AKSİYON BUTONLARI (Bunlar ayrı durmalı) */}
        <View style={styles.actions}>
          {!isFirst && (
            <TouchableOpacity style={styles.actionBtn} onPress={() => onMoveUp(index)}>
              <Text style={styles.actionIcon}>⬆️</Text>
            </TouchableOpacity>
          )}

          {!isLast && (
            <TouchableOpacity style={styles.actionBtn} onPress={() => onMoveDown(index)}>
              <Text style={styles.actionIcon}>⬇️</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => onRemove(item)}>
            <Text style={styles.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{texts.manageTitle}</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={watchlist}
        keyExtractor={item => 'w_edit_' + item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{texts.emptyList}</Text>
          </View>
        }
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
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#1F1F1F', 
    borderRadius: 12, 
    marginBottom: 12, 
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between' // Sol ve sağ tarafı ayır
  },
  
  // Tıklanabilir alan (Sol tarafın tamamı)
  clickableArea: {
      flex: 1, 
      flexDirection: 'row', 
      alignItems: 'center',
      marginRight: 10
  },

  // Numara Stili
  rankNumber: {
      color: COLORS.primary, // Turuncu/Kırmızı renk
      fontSize: 18,
      fontWeight: '900',
      width: 35, // Sabit genişlik ki hizalama bozulmasın
      textAlign: 'center',
      marginRight: 5,
      fontStyle: 'italic'
  },

  poster: { width: 45, height: 68, borderRadius: 6, backgroundColor: '#333' },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 2 },
  subTitle: { color: '#888', fontSize: 11, marginBottom: 4, fontStyle: 'italic' },
  rating: { color: COLORS.star, fontSize: 11, fontWeight: 'bold' },

  actions: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  actionBtn: { 
    width: 32, height: 32, 
    backgroundColor: '#333', 
    borderRadius: 8, 
    justifyContent: 'center', alignItems: 'center' 
  },
  deleteBtn: { backgroundColor: 'rgba(204, 0, 0, 0.2)', borderWidth: 1, borderColor: '#CC0000' },
  actionIcon: { fontSize: 14 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#555', fontSize: 16 },
});

export default WatchlistScreen;