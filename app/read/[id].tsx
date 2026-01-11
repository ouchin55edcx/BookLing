import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ImageBackground,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Book, fetchBookById } from '@/lib/api';
import { ActivityIndicator } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ReadBookScreen() {
    const { id, chapter } = useLocalSearchParams();
    const router = useRouter();
    const [book, setBook] = useState<Book | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [isSombreMode, setIsSombreMode] = useState(false);
    const [nickname, setNickname] = useState('Explorer');

    useEffect(() => {
        const loadData = async () => {
            if (typeof id === 'string') {
                const [bookData, savedNickname, savedProgress] = await Promise.all([
                    fetchBookById(id),
                    AsyncStorage.getItem('nickname'),
                    AsyncStorage.getItem(`progress_${id}`)
                ]);
                setBook(bookData || null);
                if (savedNickname) setNickname(savedNickname);

                // If there's a chapter in the URL, use it. Otherwise use saved progress.
                if (typeof chapter === 'string') {
                    setCurrentChapterIndex(parseInt(chapter));
                } else if (savedProgress) {
                    setCurrentChapterIndex(parseInt(savedProgress));
                }
            }
            setIsLoading(false);
        };
        loadData();
    }, [id, chapter]);

    // Save progress whenever chapter changes
    useEffect(() => {
        if (book && typeof id === 'string') {
            AsyncStorage.setItem(`progress_${id}`, currentChapterIndex.toString());
        }
    }, [currentChapterIndex, id, book]);

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#000" />
            </SafeAreaView>
        );
    }

    if (!book || !book.chapters) {
        return (
            <SafeAreaView style={styles.container}>
                <ThemedText>Book or chapters not found</ThemedText>
            </SafeAreaView>
        );
    }

    const currentChapter = book.chapters[currentChapterIndex];

    const handleNextChapter = async () => {
        if (currentChapterIndex < book.chapters.length - 1) {
            setCurrentChapterIndex(currentChapterIndex + 1);
        } else {
            // Finish Reading
            try {
                const savedReadBooks = await AsyncStorage.getItem('readBooks');
                const savedPendingBooks = await AsyncStorage.getItem('pendingBooks');

                let readIds = savedReadBooks ? JSON.parse(savedReadBooks) : [];
                let pendingIds = savedPendingBooks ? JSON.parse(savedPendingBooks) : [];

                if (!readIds.includes(book.id)) {
                    readIds.push(book.id);
                }
                pendingIds = pendingIds.filter((bid: string) => bid !== book.id);

                await Promise.all([
                    AsyncStorage.setItem('readBooks', JSON.stringify(readIds)),
                    AsyncStorage.setItem('pendingBooks', JSON.stringify(pendingIds)),
                    AsyncStorage.removeItem(`progress_${book.id}`) // Clear progress when finished
                ]);
            } catch (error) {
                console.error('Error saving read status:', error);
            }
            router.back();
        }
    };

    const toggleSombreMode = () => {
        setIsSombreMode(!isSombreMode);
    };

    return (
        <View style={styles.container}>
            <StatusBar style={isSombreMode ? "light" : "dark"} />

            <ImageBackground
                source={currentChapter.image}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                {isSombreMode && <View style={styles.darkOverlay} />}
                <SafeAreaView style={styles.safeArea}>
                    {/* Close Button */}
                    <View style={styles.closeButtonContainer}>
                        <TouchableOpacity
                            style={[styles.closeButton, isSombreMode && styles.closeButtonSombre]}
                            onPress={() => router.push('/(tabs)')}
                        >
                            <Ionicons name="close" size={28} color={isSombreMode ? "#FFF" : "#000"} />
                        </TouchableOpacity>
                    </View>

                    {/* Content Overlay */}
                    <View style={styles.contentContainer}>
                        <View style={[styles.textCard, isSombreMode && styles.textCardSombre]}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <ThemedText
                                    style={[styles.chapterTitle, isSombreMode && styles.textSombre]}
                                    lightColor={isSombreMode ? "#FFF" : "#000"}
                                    darkColor={isSombreMode ? "#FFF" : "#000"}
                                >
                                    Chapter {currentChapterIndex + 1}: {currentChapter.title}
                                </ThemedText>
                                <ThemedText
                                    style={[styles.chapterContent, isSombreMode && styles.textSombre]}
                                    lightColor={isSombreMode ? "#EEE" : "#333"}
                                    darkColor={isSombreMode ? "#EEE" : "#333"}
                                >
                                    {currentChapter.content}
                                </ThemedText>
                            </ScrollView>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <View style={[styles.actionBar, isSombreMode && styles.actionBarSombre]}>
                            <TouchableOpacity
                                style={[styles.actionIconContainer, isSombreMode && styles.buttonSombre]}
                                onPress={toggleSombreMode}
                            >
                                <Ionicons
                                    name={isSombreMode ? "sunny-outline" : "moon-outline"}
                                    size={24}
                                    color={isSombreMode ? "#FFF" : "#2D4A44"}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.nextButton, isSombreMode && styles.buttonSombre]}
                                onPress={handleNextChapter}
                                activeOpacity={0.8}
                            >
                                <ThemedText
                                    style={[styles.nextButtonText, isSombreMode && styles.textSombre]}
                                    lightColor={isSombreMode ? "#FFF" : "#333"}
                                    darkColor={isSombreMode ? "#FFF" : "#333"}
                                >
                                    {currentChapterIndex < book.chapters.length - 1 ? 'Next Chapter' : 'Finish Reading'}
                                </ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: width,
        height: height,
    },
    safeArea: {
        flex: 1,
    },
    closeButtonContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
    },
    closeButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    textCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        width: '100%',
        maxHeight: height * 0.6,
        borderRadius: 30,
        padding: 25,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    chapterTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        marginBottom: 20,
    },
    chapterContent: {
        fontSize: 18,
        lineHeight: 28,
        color: '#333',
        textAlign: 'center',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    actionBar: {
        flexDirection: 'row',
        backgroundColor: '#81C784',
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        paddingHorizontal: 15,
        borderWidth: 1.5,
        borderColor: '#000',
        gap: 15,
    },
    actionIconContainer: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    nextButton: {
        flex: 1,
        backgroundColor: '#FFF',
        height: 55,
        borderRadius: 27.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    nextButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    // Sombre Mode Styles
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    closeButtonSombre: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#555',
    },
    textSombre: {
        color: '#FFF',
    },
    buttonSombre: {
        backgroundColor: '#333',
        borderColor: '#555',
    },
    textCardSombre: {
        backgroundColor: 'rgba(30,30,30,0.9)',
        borderColor: '#444',
    },
    actionBarSombre: {
        backgroundColor: '#1B5E20', // Darker green
        borderColor: '#333',
    },
});
