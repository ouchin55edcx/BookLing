import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();

    const handleGetStarted = () => {
        router.push('/nickname');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <ThemedText
                    style={styles.logoText}
                    lightColor="#000000"
                    darkColor="#000000"
                >
                    BookLing
                </ThemedText>
            </View>

            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    <View style={styles.glow} />
                    <Image
                        source={require('@/assets/images/book-character.png')}
                        style={styles.illustration}
                        contentFit="contain"
                    />
                </View>

                <View style={styles.textContainer}>
                    <ThemedText
                        style={styles.title}
                        lightColor="#000000"
                        darkColor="#000000"
                    >
                        Find your favorite book and story
                    </ThemedText>
                    <ThemedText
                        style={styles.subtitle}
                        lightColor="#333333"
                        darkColor="#333333"
                    >
                        Read, learn, and imagine every day
                    </ThemedText>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={handleGetStarted} activeOpacity={0.8}>
                    <ThemedText style={styles.buttonText}>Get Started</ThemedText>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0F7FA', // Light cyan background matching the design
    },
    header: {
        alignItems: 'center',
        paddingTop: 40,
    },
    logoText: {
        fontSize: 36,
        fontWeight: '900',
        color: '#000',
        letterSpacing: 0.5,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    imageContainer: {
        width: width * 0.85,
        height: width * 0.85,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    glow: {
        position: 'absolute',
        width: width * 0.7,
        height: width * 0.7,
        backgroundColor: '#FFF',
        borderRadius: width * 0.35,
        opacity: 0.5,
    },
    illustration: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        alignItems: 'center',
        gap: 12,
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        lineHeight: 42,
        paddingHorizontal: 10,
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        color: '#444',
        fontWeight: '500',
        opacity: 0.8,
    },
    footer: {
        paddingHorizontal: 40,
        paddingBottom: 50,
    },
    button: {
        backgroundColor: '#7CB342', // Soft green button matching the design
        paddingVertical: 18,
        borderRadius: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
    },
});
