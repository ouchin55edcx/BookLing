import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

const { width, height } = Dimensions.get('window');

export default function NicknameScreen() {
    const router = useRouter();
    const [nickname, setNickname] = useState('');

    const handleNext = async () => {
        if (nickname.trim()) {
            try {
                await AsyncStorage.setItem('nickname', nickname.trim());
                router.replace('/(tabs)');
            } catch (error) {
                console.error('Error saving nickname:', error);
                router.replace('/(tabs)');
            }
        }
    };

    return (
        <ImageBackground
            source={require('@/assets/images/nickname-bg.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <StatusBar style="dark" />
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    {/* Skip button removed as nickname is required */}
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.content}
                >
                    <View style={styles.titleContainer}>
                        <ThemedText
                            style={styles.title}
                            lightColor="#2D4A44"
                            darkColor="#2D4A44"
                        >
                            What's your nickname?
                        </ThemedText>
                    </View>


                    <View style={styles.inputWrapper}>
                        <View style={styles.inputContainer}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={{ uri: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' }}
                                    style={styles.avatar}
                                />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your nickname..."
                                placeholderTextColor="#999"
                                value={nickname}
                                onChangeText={setNickname}
                                autoCapitalize="words"
                                autoCorrect={false}
                            />
                            <TouchableOpacity
                                style={[styles.nextButton, !nickname.trim() && styles.nextButtonDisabled]}
                                onPress={handleNext}
                                disabled={!nickname.trim()}
                            >
                                <Ionicons name="chevron-forward" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        <ThemedText
                            style={styles.helperText}
                            lightColor="#666"
                            darkColor="#666"
                        >
                            Please enter a fun nickname to start your adventure!
                        </ThemedText>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: width,
        height: height,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    titleContainer: {
        paddingHorizontal: 40,
        marginTop: 20,
        marginBottom: height * 0.38, // This pushes the input down below the book character
    },
    title: {
        fontSize: 38,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 46,
    },
    inputWrapper: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        width: '100%',
        height: 64,
        borderRadius: 32,
        paddingHorizontal: 8,
        borderWidth: 2,
        borderColor: '#A8D5BA',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    input: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 15,
        fontSize: 18,
        color: '#333',
    },
    nextButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#8BC34A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nextButtonDisabled: {
        backgroundColor: '#C5E1A5',
    },
    helperText: {
        marginTop: 15,
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.8,
        paddingHorizontal: 40,
    },
});
