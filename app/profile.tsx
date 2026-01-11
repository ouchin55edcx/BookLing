import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Book, fetchBooks } from '@/lib/api';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
    const router = useRouter();
    const [nickname, setNickname] = useState('Explorer');
    const [readBooksCount, setReadBooksCount] = useState(0);
    const [pendingBooks, setPendingBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        setIsLoading(true);
        try {
            const [savedNickname, savedReadBooks, savedPendingBooks, allBooks] = await Promise.all([
                AsyncStorage.getItem('nickname'),
                AsyncStorage.getItem('readBooks'),
                AsyncStorage.getItem('pendingBooks'),
                fetchBooks()
            ]);

            if (savedNickname) setNickname(savedNickname);

            const readIds = savedReadBooks ? JSON.parse(savedReadBooks) : [];
            setReadBooksCount(readIds.length);

            const pendingIds = savedPendingBooks ? JSON.parse(savedPendingBooks) : [];
            const pendingData = allBooks.filter(book => pendingIds.includes(book.id));
            setPendingBooks(pendingData);

        } catch (error) {
            console.error('Error loading profile data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinueReading = async (bookId: string) => {
        try {
            const savedProgress = await AsyncStorage.getItem(`progress_${bookId}`);
            const chapterIndex = savedProgress ? parseInt(savedProgress) : 0;

            router.push({
                pathname: '/read/[id]',
                params: { id: bookId, chapter: chapterIndex.toString() }
            });
        } catch (error) {
            console.error('Error resuming book:', error);
            router.push({
                pathname: '/read/[id]',
                params: { id: bookId }
            });
        }
    };

    const handleMarkAsDone = async (bookId: string) => {
        try {
            const savedReadBooks = await AsyncStorage.getItem('readBooks');
            const savedPendingBooks = await AsyncStorage.getItem('pendingBooks');

            let readIds = savedReadBooks ? JSON.parse(savedReadBooks) : [];
            let pendingIds = savedPendingBooks ? JSON.parse(savedPendingBooks) : [];

            if (!readIds.includes(bookId)) {
                readIds.push(bookId);
            }
            pendingIds = pendingIds.filter((id: string) => id !== bookId);

            await Promise.all([
                AsyncStorage.setItem('readBooks', JSON.stringify(readIds)),
                AsyncStorage.setItem('pendingBooks', JSON.stringify(pendingIds)),
                AsyncStorage.removeItem(`progress_${bookId}`)
            ]);

            setReadBooksCount(readIds.length);
            setPendingBooks(prev => prev.filter(book => book.id !== bookId));
        } catch (error) {
            console.error('Error marking book as done:', error);
        }
    };

    const STATS = [
        { label: 'Books Read', value: readBooksCount.toString(), icon: 'book', color: '#81C784' },
        { label: 'Pending', value: pendingBooks.length.toString(), icon: 'time', color: '#64B5F6' },
        { label: 'Day Streak', value: '1', icon: 'flame', color: '#FFB74D' },
        { label: 'Badges', value: '3', icon: 'medal', color: '#BA68C8' },
    ];

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#7CB342" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>My Profile</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.profileBackground}>
                        <View style={styles.decorCircle1} />
                        <View style={styles.decorCircle2} />
                        <View style={styles.decorCircle3} />
                    </View>

                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatarGlow} />
                        <Image
                            source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}` }}
                            style={styles.avatar}
                        />
                        <View style={styles.starBadge}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                        </View>
                    </View>

                    <ThemedText style={styles.username}>@{nickname}</ThemedText>

                    <View style={styles.levelBadge}>
                        <Ionicons name="ribbon" size={16} color="#FFF" />
                        <ThemedText style={styles.levelText}>Beginner Reader</ThemedText>
                    </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {STATS.map((stat, index) => (
                        <View key={index} style={[styles.statItem, { backgroundColor: stat.color }]}>
                            <View style={styles.statIconWrapper}>
                                <Ionicons name={stat.icon as any} size={28} color="#FFF" />
                            </View>
                            <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
                            <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
                            <View style={styles.statShine} />
                        </View>
                    ))}
                </View>

                {/* Pending Books Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="book" size={24} color="#FF6B6B" />
                        <ThemedText style={styles.sectionTitle}>Reading Now</ThemedText>
                        {pendingBooks.length > 0 && (
                            <View style={styles.countBubble}>
                                <ThemedText style={styles.countBubbleText}>{pendingBooks.length}</ThemedText>
                            </View>
                        )}
                    </View>

                    {pendingBooks.length > 0 ? (
                        <View style={styles.pendingList}>
                            {pendingBooks.map((book) => (
                                <View key={book.id} style={styles.pendingItem}>
                                    <View style={styles.bookImageWrapper}>
                                        <Image source={book.image} style={styles.pendingImage} />
                                        <View style={styles.bookShadow} />
                                    </View>
                                    <View style={styles.pendingInfo}>
                                        <ThemedText style={styles.pendingTitle} numberOfLines={1}>{book.title}</ThemedText>
                                        <View style={styles.pendingActions}>
                                            <TouchableOpacity
                                                style={styles.continueButton}
                                                onPress={() => handleContinueReading(book.id)}
                                            >
                                                <Ionicons name="play-circle" size={18} color="#FFF" />
                                                <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.doneIconButton}
                                                onPress={() => handleMarkAsDone(book.id)}
                                            >
                                                <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="book-outline" size={48} color="#CCC" />
                            <ThemedText style={styles.emptyText}>No books in progress</ThemedText>
                            <ThemedText style={styles.emptySubtext}>Start reading to see them here!</ThemedText>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF5E6',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF',
        borderBottomWidth: 3,
        borderBottomColor: '#000',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    backButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#FFE082',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    settingsButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    profileCard: {
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingVertical: 30,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    profileBackground: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    decorCircle1: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        top: -30,
        right: -20,
    },
    decorCircle2: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        bottom: 20,
        left: 10,
    },
    decorCircle3: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        bottom: -20,
        right: 30,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 15,
    },
    avatarGlow: {
        position: 'absolute',
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: '#FFD700',
        opacity: 0.3,
        top: -5,
        left: -5,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#000',
        backgroundColor: '#FFF',
    },
    starBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#000',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    username: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
    },
    levelBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 15,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#81C784',
    },
    levelText: {
        color: '#2E7D32',
        fontWeight: 'bold',
        fontSize: 14,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        gap: 15,
        marginBottom: 10,
    },
    statItem: {
        width: (width - 55) / 2,
        padding: 20,
        borderRadius: 25,
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#000',
        position: 'relative',
        overflow: 'hidden',
    },
    statIconWrapper: {
        marginBottom: 10,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
    },
    statLabel: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
    },
    statShine: {
        position: 'absolute',
        top: -20,
        right: -20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 25,
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
        flex: 1,
    },
    countBubble: {
        backgroundColor: '#FF6B9D',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    countBubbleText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
    },
    pendingList: {
        gap: 15,
    },
    pendingItem: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 12,
        borderWidth: 3,
        borderColor: '#000',
        alignItems: 'center',
        gap: 15,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 0,
    },
    bookImageWrapper: {
        position: 'relative',
    },
    pendingImage: {
        width: 70,
        height: 95,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#000',
    },
    bookShadow: {
        position: 'absolute',
        bottom: -3,
        right: -3,
        width: 70,
        height: 95,
        borderRadius: 12,
        backgroundColor: '#000',
        zIndex: -1,
    },
    pendingInfo: {
        flex: 1,
        gap: 8,
    },
    pendingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    pendingActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    continueButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#000',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    continueButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    doneIconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    emptyState: {
        padding: 40,
        backgroundColor: '#FFF',
        borderRadius: 20,
        borderStyle: 'dashed',
        borderWidth: 3,
        borderColor: '#DDD',
        alignItems: 'center',
        gap: 10,
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptySubtext: {
        color: '#999',
        textAlign: 'center',
        fontSize: 14,
    },
});

