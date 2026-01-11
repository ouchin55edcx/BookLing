import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
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

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
    const router = useRouter();

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
                <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                    <Ionicons name="book-outline" size={24} color="#2D4A44" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <ThemedText style={styles.title}>Your Progress</ThemedText>

                {/* Progress Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statHeader}>
                        <ThemedText style={styles.statPercentage}>66% completed</ThemedText>
                        <ThemedText style={styles.statChapter}>Chapter 3 of 5</ThemedText>
                    </View>
                    <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFill, { width: '66%' }]} />
                    </View>
                </View>

                {/* Circular Progress */}
                <View style={styles.circularContainer}>
                    <View style={styles.circleOuter}>
                        <View style={styles.circleInner}>
                            <ThemedText style={styles.pagesCount}>12/18</ThemedText>
                            <ThemedText style={styles.pagesLabel}>Pages Read</ThemedText>
                        </View>
                        {/* Simple CSS-based partial circle effect */}
                        <View style={styles.circleProgressOverlay} />
                    </View>
                </View>
            </View>

            {/* Bottom Action Bar */}
            <View style={styles.footer}>
                <View style={styles.actionBar}>
                    <TouchableOpacity style={styles.actionIconContainer}>
                        <Ionicons name="book-outline" size={24} color="#2D4A44" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.continueButton} onPress={() => router.back()} activeOpacity={0.8}>
                        <ThemedText style={styles.continueButtonText}>Continue Reading</ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FFF9', // Very light green/white background
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
        paddingHorizontal: 30,
        paddingTop: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#000',
        marginBottom: 40,
    },
    statsContainer: {
        marginBottom: 50,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    statPercentage: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    statChapter: {
        fontSize: 14,
        color: '#666',
    },
    progressBarBackground: {
        height: 24,
        backgroundColor: '#C5E1A5',
        borderRadius: 12,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#80CBC4',
        borderRadius: 12,
    },
    circularContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    circleOuter: {
        width: width * 0.65,
        height: width * 0.65,
        borderRadius: (width * 0.65) / 2,
        borderWidth: 25,
        borderColor: '#81C784',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    circleInner: {
        alignItems: 'center',
    },
    pagesCount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    pagesLabel: {
        fontSize: 18,
        color: '#333',
        fontWeight: '500',
    },
    circleProgressOverlay: {
        position: 'absolute',
        top: -25,
        left: -25,
        width: width * 0.65,
        height: width * 0.65,
        borderRadius: (width * 0.65) / 2,
        borderWidth: 25,
        borderColor: '#80CBC4',
        borderBottomColor: 'transparent',
        borderRightColor: 'transparent',
        transform: [{ rotate: '45deg' }],
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
    continueButton: {
        flex: 1,
        backgroundColor: '#FFF',
        height: 55,
        borderRadius: 27.5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000',
    },
    continueButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});
