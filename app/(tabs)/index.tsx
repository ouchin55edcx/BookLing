import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

import { BOOKS } from '@/constants/books';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const CATEGORIES = ['All', 'Animal Tales', 'Magic World', 'Space & Stars'];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = BOOKS.filter(book => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderBook = ({ item }: { item: typeof BOOKS[0] }) => (
    <TouchableOpacity
      style={styles.bookCard}
      activeOpacity={0.9}
      onPress={() => router.push(`/book-details/${item.id}`)}
    >
      <Image source={item.image} style={styles.bookImage} contentFit="cover" />
      <View style={styles.bookOverlay}>
        <ThemedText style={styles.bookTitle} numberOfLines={2}>{item.title}</ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.profileSection}
          onPress={() => router.push('/profile')}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' }}
              style={styles.avatar}
            />
          </View>
          <View>
            <ThemedText style={styles.username}>@ouchin55edcx</ThemedText>
            <ThemedText style={styles.level}>Beginner Level</ThemedText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/progress')}>
          <Ionicons name="stats-chart-outline" size={24} color="#2D4A44" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="search anything here ..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {CATEGORIES.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryPill,
                selectedCategory === category && styles.categoryPillActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <ThemedText style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}>
                {category}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Books Grid */}
      <FlatList
        data={filteredBooks}
        renderItem={renderBook}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.booksGrid}
        columnWrapperStyle={styles.booksRow}
        showsVerticalScrollIndicator={false}
      />

      {/* Custom Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItemActive}>
            <ThemedText style={styles.navTextActive}>Home</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navIconContainer}
            onPress={() => router.push('/saved')}
          >
            <Ionicons name="book-outline" size={24} color="#2D4A44" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA', // Light cyan background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFF',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#C8E6C9',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#A8D5BA',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  username: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  level: {
    fontSize: 12,
    color: '#666',
  },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 1,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 15,
    borderWidth: 1.5,
    borderColor: '#000',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    marginBottom: 15,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#000',
  },
  categoryPillActive: {
    backgroundColor: '#000',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  categoryTextActive: {
    color: '#FFF',
  },
  booksGrid: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  booksRow: {
    justifyContent: 'space-between',
  },
  bookCard: {
    width: (width - 50) / 2,
    aspectRatio: 0.75,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFF',
  },
  bookImage: {
    width: '100%',
    height: '100%',
  },
  bookOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
  },
  bookTitle: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#81C784',
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: '#000',
    justifyContent: 'space-between',
  },
  navItemActive: {
    backgroundColor: '#E0F7FA',
    height: 50,
    flex: 1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  navTextActive: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  navIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
});
