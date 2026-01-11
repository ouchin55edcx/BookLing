import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
    const router = useRouter();

    const STATS = [
        { label: 'Books Read', value: '12', icon: 'book', color: '#81C784' },
        { label: 'Total Pages', value: '156', icon: 'document-text', color: '#64B5F6' },
        { label: 'Day Streak', value: '5', icon: 'flame', color: '#FFB74D' },
        { label: 'Badges', value: '8', icon: 'medal', color: '#BA68C8' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={28} color="#000" />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>My Profile</ThemedText>
                <TouchableOpacity style={styles.settingsButton}>
                    <Ionicons name="settings-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarWrapper}>
                        <Image
                            source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity style={styles.editAvatarButton}>
                            <Ionicons name="camera" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <ThemedText style={styles.username}>@ouchin55edcx</ThemedText>
                    <View style={styles.levelBadge}>
                        <ThemedText style={styles.levelText}>Beginner Level</ThemedText>
                    </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {STATS.map((stat, index) => (
                        <View key={index} style={styles.statItem}>
                            <View style={[styles.statIconContainer, { backgroundColor: stat.color }]}>
                                <Ionicons name={stat.icon as any} size={24} color="#FFF" />
                            </View>
                            <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
                            <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
                        </View>
                    ))}
                </View>

                {/* Achievements Section */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Recent Achievements</ThemedText>
                    <View style={styles.achievementsList}>
                        <View style={styles.achievementItem}>
                            <View style={styles.achievementIcon}>
                                <Ionicons name="star" size={30} color="#FFD54F" />
                            </View>
                            <View style={styles.achievementInfo}>
                                <ThemedText style={styles.achievementName}>First Book Finished!</ThemedText>
                                <ThemedText style={styles.achievementDate}>Unlocked 2 days ago</ThemedText>
                            </View>
                        </View>
                        <View style={styles.achievementItem}>
                            <View style={styles.achievementIcon}>
                                <Ionicons name="calendar" size={30} color="#81C784" />
                            </View>
                            <View style={styles.achievementInfo}>
                                <ThemedText style={styles.achievementName}>3 Day Streak</ThemedText>
                                <ThemedText style={styles.achievementDate}>Unlocked yesterday</ThemedText>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
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
        paddingVertical: 15,
        backgroundColor: '#FFF',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
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
    avatarWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#C8E6C9',
        borderWidth: 4,
        borderColor: '#81C784',
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#81C784',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFF',
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
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
        padding: 20,
        gap: 15,
    },
    statItem: {
        backgroundColor: '#FFF',
        width: (width - 55) / 2,
        borderRadius: 25,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#000',
    },
    statIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 15,
    },
    achievementsList: {
        gap: 12,
    },
    achievementItem: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 20,
        alignItems: 'center',
        gap: 15,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    achievementIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFF9C4',
        justifyContent: 'center',
        alignItems: 'center',
    },
    achievementInfo: {
        flex: 1,
    },
    achievementName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    achievementDate: {
        fontSize: 12,
        color: '#888',
    },
});
