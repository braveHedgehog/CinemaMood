import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const WatchlistScreen = ({ watchlist, onBack, onRemove, onMoveUp, onMoveDown, texts }) => {

  const renderItem = ({ item, index }) => {
    // Listenin başı veya sonu mu kontrolü (Butonları gizlemek için)
    const isFirst = index === 0;
    const isLast = index === watchlist.length - 1;

    return (
      <View style={styles.card}>
        {/* Sol Taraf: Poster */}
        <Image source={{ uri: item.poster }} style={styles.poster} />

        {/* Orta: Bilgi */}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{item.originalTitle}</Text>
          <Text style={styles.subTitle} numberOfLines={1}>{item.translatedTitle}</Text>
          <Text style={styles.rating}>★ {item.rating} • {item.date?.split('-')[0]}</Text>
        </View>

        {/* Sağ: Aksiyon Butonları */}
        <View style={styles.actions}>
          
          {/* Yukarı Taşı */}
          {!isFirst && (
            <TouchableOpacity style={styles.actionBtn} onPress={() => onMoveUp(index)}>
              <Text style={styles.actionIcon}>⬆️</Text>
            </TouchableOpacity>
          )}

          {/* Aşağı Taşı */}
          {!isLast && (
            <TouchableOpacity style={styles.actionBtn} onPress={() => onMoveDown(index)}>
              <Text style={styles.actionIcon}>⬇️</Text>
            </TouchableOpacity>
          )}

          {/* Sil (Çöp Kutusu) */}
          <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => onRemove(item)}>
            <Text style={styles.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Üst Başlık */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{texts.manageTitle}</Text>
        <View style={{ width: 40 }} /> {/* Hizalama için boşluk */}
      </View>

      {/* Liste */}
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
    alignItems: 'center'
  },
  poster: { width: 50, height: 75, borderRadius: 8, backgroundColor: '#333' },
  info: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  subTitle: { color: '#888', fontSize: 12, marginBottom: 5, fontStyle: 'italic' },
  rating: { color: COLORS.star, fontSize: 12, fontWeight: 'bold' },

  actions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  actionBtn: { 
    width: 35, height: 35, 
    backgroundColor: '#333', 
    borderRadius: 8, 
    justifyContent: 'center', alignItems: 'center' 
  },
  deleteBtn: { backgroundColor: 'rgba(204, 0, 0, 0.2)', borderWidth: 1, borderColor: '#CC0000' },
  actionIcon: { fontSize: 16 },

  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#555', fontSize: 16 },
});

export default WatchlistScreen;