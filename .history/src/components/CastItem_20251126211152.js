import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

const CastItem = ({ name, job, image }) => {
  return (
    <View style={styles.container}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>{name.charAt(0)}</Text>
        </View>
      )}
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      {job && <Text style={styles.job}>{job}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginRight: 15, width: 70 },
  image: { width: 70, height: 70, borderRadius: 35, marginBottom: 5, backgroundColor: '#333' },
  placeholder: { justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#444' },
  placeholderText: { color: '#666', fontSize: 20 },
  name: { color: COLORS.text, fontSize: 10, textAlign: 'center' },
  job: { color: COLORS.subText, fontSize: 9, textAlign: 'center' },
});

export default CastItem;