import { Ionicons } from '@expo/vector-icons';
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
import { BOOKS } from '@/constants/books';

const { width } = Dimensions.get('window');

export default function BookDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const book = BOOKS.find(b => b.id === id);

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
                    <Ionicons name="book-outline" size={24} color="#2D4A44" />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>Book Details</ThemedText>
                <TouchableOpacity style={styles.headerIcon}>
                    <Ionicons name="book-outline" size={24} color="#2D4A44" />
                </TouchableOpacity>
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
                <View style={styles.actionBar}>
                    <TouchableOpacity style={styles.actionIconContainer}>
                        <Ionicons name="book-outline" size={24} color="#2D4A44" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.readButton}
                        activeOpacity={0.8}
                        onPress={() => router.push(`/read/${book.id}`)}
                    >
                        <ThemedText style={styles.readButtonText}>Read This Book</ThemedText>
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
    readButton: {
        flex: 1,
        backgroundColor: '#FFF',
        height: 55,
        borderRadius: 27.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    readButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});
