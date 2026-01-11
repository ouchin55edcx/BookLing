import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Book, fetchBookById } from '@/lib/api';
import { ActivityIndicator } from 'react-native';

const { width } = Dimensions.get('window');

export default function BookDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [book, setBook] = React.useState<Book | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const loadBook = async () => {
            if (typeof id === 'string') {
                const data = await fetchBookById(id);
                setBook(data || null);
            }
            setIsLoading(false);
        };
        loadBook();
    }, [id]);

    const handleRead = async () => {
        if (!book) return;

        try {
            const [savedReadBooks, savedPendingBooks] = await Promise.all([
                AsyncStorage.getItem('readBooks'),
                AsyncStorage.getItem('pendingBooks')
            ]);

            const readIds = savedReadBooks ? JSON.parse(savedReadBooks) : [];
            let pendingIds = savedPendingBooks ? JSON.parse(savedPendingBooks) : [];

            // Only add to pending if not already read and not already pending
            if (!readIds.includes(book.id) && !pendingIds.includes(book.id)) {
                pendingIds.push(book.id);
                await AsyncStorage.setItem('pendingBooks', JSON.stringify(pendingIds));
            }

            router.push(`/read/${book.id}`);
        } catch (error) {
            console.error('Error updating pending books:', error);
            router.push(`/read/${book.id}`);
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#000" />
            </SafeAreaView>
        );
    }

    if (!book) {
        return (
            <SafeAreaView style={styles.container}>
                <ThemedText>Book not found</ThemedText>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#2D4A44" />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>Book Details</ThemedText>
                <View style={{ width: 45 }} />
            </View>

            <View style={styles.content}>
                {/* Book Cover */}
                <View style={styles.coverContainer}>
                    <Image source={book.image} style={styles.coverImage} contentFit="cover" />
                </View>

                {/* Book Info */}
                <View style={styles.infoContainer}>
                    <ThemedText style={styles.title}>{book.title}</ThemedText>
                    <ThemedText style={styles.author}>by Gemini</ThemedText>
                    <ThemedText style={styles.description}>
                        {book.description || "Join Luna, a curious little star, as she discovers the magic of books."}
                    </ThemedText>
                </View>
            </View>

            {/* Bottom Action Bar */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.readButton}
                    activeOpacity={0.8}
                    onPress={handleRead}
                >
                    <ThemedText style={styles.readButtonText}>Read This Book</ThemedText>
                </TouchableOpacity>
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
        paddingVertical: 15,
        backgroundColor: '#FFF',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    headerIcon: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        borderWidth: 1,
        borderColor: '#DDD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 30,
        paddingHorizontal: 20,
    },
    coverContainer: {
        width: width * 0.7,
        aspectRatio: 0.75,
        borderRadius: 30,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 10,
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        marginTop: 30,
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        lineHeight: 34,
    },
    author: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#444',
        lineHeight: 22,
        marginTop: 10,
        paddingHorizontal: 20,
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    readButton: {
        backgroundColor: '#81C784',
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    readButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
});
