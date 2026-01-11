import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';

const { width } = Dimensions.get('window');

import { Book, fetchBooks, fetchCategories } from '@/lib/api';

export default function HomeScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [nickname, setNickname] = useState('Explorer');
  const [readBooks, setReadBooks] = useState<Book[]>([]);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, bks, savedNickname, savedReadIds] = await Promise.all([
          fetchCategories(),
          fetchBooks(),
          AsyncStorage.getItem('nickname'),
          AsyncStorage.getItem('readBooks')
        ]);

        setCategories(cats);
        setBooks(bks);
        if (savedNickname) setNickname(savedNickname);

        const readIds = savedReadIds ? JSON.parse(savedReadIds) : [];
        const finishedBooks = bks.filter(book => readIds.includes(book.id));
        setReadBooks(finishedBooks);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const getUserLevel = () => {
    const count = readBooks.length;
    if (count === 0) return 'New Reader';
    if (count < 3) return 'Rising Star';
    if (count < 7) return 'Book Worm';
    return 'Master Reader';
  };

  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderBook = ({ item }: { item: Book }) => (
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

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#7CB342" />
      </SafeAreaView>
    );
  }

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
              source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}` }}
              style={styles.avatar}
            />
          </View>
          <View>
            <ThemedText style={styles.username}>@{nickname}</ThemedText>
            <ThemedText style={styles.subtitle}>Welcome back!</ThemedText>
          </View>
        </TouchableOpacity>

        <View style={styles.badgeContainer}>
          <Ionicons name="ribbon" size={16} color="#FBC02D" />
          <ThemedText style={styles.level}>{getUserLevel()}</ThemedText>
        </View>
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
          {categories.map((category: string) => (
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
        ListHeaderComponent={
          readBooks.length > 0 ? (
            <View style={styles.finishedSection}>
              <View style={styles.sectionHeader}>
                <ThemedText style={styles.sectionTitle}>Finished Books</ThemedText>
                <View style={styles.countBadge}>
                  <ThemedText style={styles.countText}>{readBooks.length}</ThemedText>
                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.finishedScroll}>
                {readBooks.map((book) => (
                  <TouchableOpacity
                    key={book.id}
                    style={styles.finishedCard}
                    onPress={() => router.push(`/book-details/${book.id}`)}
                  >
                    <Image source={book.image} style={styles.finishedImage} contentFit="cover" />
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ThemedText style={styles.sectionTitle}>All Books</ThemedText>
            </View>
          ) : null
        }
      />

      {/* Custom Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItemActive}>
            <ThemedText style={styles.navTextActive}>Home</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navIconContainer}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person-outline" size={24} color="#2D4A44" />
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
  subtitle: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF9C4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FBC02D',
  },
  level: {
    fontSize: 11,
    color: '#F9A825',
    fontWeight: 'bold',
  },
  finishedSection: {
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  countBadge: {
    backgroundColor: '#81C784',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000',
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  finishedScroll: {
    paddingBottom: 10,
    gap: 15,
  },
  finishedCard: {
    width: 100,
    height: 140,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#000',
    backgroundColor: '#FFF',
  },
  finishedImage: {
    width: '100%',
    height: '100%',
  },
  checkBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
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
