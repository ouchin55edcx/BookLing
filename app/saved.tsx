import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Book, fetchBooks } from '@/lib/api';

const { width } = Dimensions.get('window');

export default function SavedBooksScreen() {
    const router = useRouter();
    const [savedBooks, setSavedBooks] = React.useState<Book[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const loadSavedBooks = async () => {
            try {
                const books = await fetchBooks();
                // For demonstration, let's say the first 3 books are saved
                setSavedBooks(books.slice(0, 3));
            } catch (error) {
                console.error('Error loading saved books:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSavedBooks();
    }, []);

    const renderBook = ({ item }: { item: Book }) => (
        <TouchableOpacity
            style={styles.bookCard}
            activeOpacity={0.9}
            onPress={() => router.push(`/book-details/${item.id}`)}
        >
            <View style={styles.imageWrapper}>
                <Image source={item.image} style={styles.bookImage} contentFit="cover" />
                <View style={styles.heartBadge}>
                    <Ionicons name="heart" size={18} color="#FF5252" />
                </View>
            </View>
            <View style={styles.bookInfo}>
                <ThemedText style={styles.bookTitle} numberOfLines={1}>{item.title}</ThemedText>
                <ThemedText style={styles.bookCategory}>{item.category}</ThemedText>
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#000" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

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

            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <ThemedText style={styles.title}>Saved Books</ThemedText>
                    <View style={styles.countBadge}>
                        <ThemedText style={styles.countText}>{savedBooks.length}</ThemedText>
                    </View>
                </View>

                {savedBooks.length > 0 ? (
                    <FlatList
                        data={savedBooks}
                        renderItem={renderBook}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                    />
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="heart-outline" size={80} color="#CCC" />
                        <ThemedText style={styles.emptyText}>No saved books yet!</ThemedText>
                        <TouchableOpacity
                            style={styles.exploreButton}
                            onPress={() => router.replace('/(tabs)')}
                        >
                            <ThemedText style={styles.exploreButtonText}>Explore Books</ThemedText>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Custom Bottom Navigation */}
            <View style={styles.bottomNavContainer}>
                <View style={styles.bottomNav}>
                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() => router.replace('/(tabs)')}
                    >
                        <ThemedText style={styles.navText}>Home</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navIconContainerActive}>
                        <Ionicons name="heart" size={24} color="#2D4A44" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0F7FA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#DDD',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 25,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#000',
    },
    countBadge: {
        backgroundColor: '#81C784',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#000',
    },
    countText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    listContent: {
        paddingBottom: 120,
    },
    bookCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 12,
        marginBottom: 15,
        borderWidth: 1.5,
        borderColor: '#000',
        alignItems: 'center',
        gap: 15,
    },
    imageWrapper: {
        width: 80,
        height: 100,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    bookImage: {
        width: '100%',
        height: '100%',
    },
    heartBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255,255,255,0.9)',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    bookInfo: {
        flex: 1,
        gap: 4,
    },
    bookTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    bookCategory: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyText: {
        fontSize: 20,
        color: '#666',
        marginTop: 20,
        fontWeight: '500',
    },
    exploreButton: {
        marginTop: 25,
        backgroundColor: '#81C784',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: '#000',
    },
    exploreButtonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
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
    navItem: {
        height: 50,
        flex: 1,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    navText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    navIconContainerActive: {
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
