import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
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
import { BOOKS } from '@/constants/books';

const { width, height } = Dimensions.get('window');

export default function ReadBookScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [isSombreMode, setIsSombreMode] = useState(false);

    const book = BOOKS.find(b => b.id === id);

    if (!book || !book.chapters) {
        return (
            <SafeAreaView style={styles.container}>
                <ThemedText>Book or chapters not found</ThemedText>
            </SafeAreaView>
        );
    }

    const currentChapter = book.chapters[currentChapterIndex];

    const handleNextChapter = () => {
        if (currentChapterIndex < book.chapters.length - 1) {
            setCurrentChapterIndex(currentChapterIndex + 1);
        } else {
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
                    {/* Header */}
                    <View style={[styles.header, isSombreMode && styles.headerSombre]}>
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
                                <ThemedText
                                    style={[styles.username, isSombreMode && styles.textSombre]}
                                    lightColor={isSombreMode ? "#FFF" : "#000"}
                                    darkColor={isSombreMode ? "#FFF" : "#000"}
                                >
                                    @ouchin55edcx
                                </ThemedText>
                                <ThemedText
                                    style={[styles.level, isSombreMode && styles.textSombreDim]}
                                    lightColor={isSombreMode ? "#AAA" : "#666"}
                                    darkColor={isSombreMode ? "#AAA" : "#666"}
                                >
                                    Beginner Level
                                </ThemedText>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.iconButton, isSombreMode && styles.buttonSombre]}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="book-outline" size={24} color={isSombreMode ? "#FFF" : "#2D4A44"} />
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    headerSombre: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    textSombre: {
        color: '#FFF',
    },
    textSombreDim: {
        color: '#AAA',
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
