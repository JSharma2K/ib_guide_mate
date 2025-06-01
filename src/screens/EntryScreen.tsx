import React from 'react';
import { View, StyleSheet, Platform, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme/theme';
import { RootStackParamList } from '../types/navigation';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

const GOLD_GRADIENT = ['#FFD700', '#FFC300', '#FFB300'];

const EntryScreen: React.FC<{ navigation: NativeStackNavigationProp<RootStackParamList, 'Entry'> }> = ({ navigation }) => {
  let [fontsLoaded] = useFonts({
    'ScopeOne-Regular': require('../../assets/fonts/ScopeOne-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ImageBackground
      source={require('../../assets/images/entry-bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.header}>
        <Animated.View entering={FadeIn.duration(1200)}>
          <Text style={[styles.premiumTitle, { color: '#7EC3FF' }]}>GuideMate</Text>
          <Text style={[styles.subtitle, { color: '#FFFFFF' }]}>Resources for IB Students and Teachers</Text>
        </Animated.View>
      </View>
      <View style={styles.centerContent}>
        <Animated.View entering={FadeIn.delay(200).duration(600)}>
          <TouchableOpacity
            style={styles.floatingButton}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Home', { userType: 'student' })}
          >
            <View style={styles.dash} />
            <Text style={[styles.floatingButtonText, { color: '#7EC3FF' }]}>Student Resources</Text>
            <View style={styles.dash} />
            <View style={styles.bottomDash} />
          </TouchableOpacity>
        </Animated.View>
        <Animated.View entering={FadeIn.delay(400).duration(600)}>
          <TouchableOpacity
            style={styles.floatingButton}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Home', { userType: 'teacher' })}
          >
            <View style={styles.dash} />
            <Text style={[styles.floatingButtonText, { color: '#7EC3FF' }]}>Teacher Resources</Text>
            <View style={styles.dash} />
            <View style={styles.bottomDash} />
          </TouchableOpacity>
        </Animated.View>
      </View>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/whetstone_white.png')}
          style={styles.miniLogo}
          resizeMode="contain"
        />
        <Text style={styles.disclaimer}>
          This app is not affiliated with or endorsed by the International Baccalaureate Organization.
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(24, 26, 32, 0.5)', // dark overlay for readability
    zIndex: 1,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 60,
    left: 0,
    width: '100%',
    zIndex: 2,
    paddingLeft: 24,
    paddingBottom: 16,
  },
  premiumTitle: {
    fontSize: 42,
    fontFamily: 'ScopeOne-Regular',
    color: 'rgba(255, 215, 0, 0.7)',
    letterSpacing: 2.5,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'ScopeOne-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    zIndex: 2,
  },
  floatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginVertical: 14,
    paddingVertical: 10,
    paddingHorizontal: 0,
    minWidth: 220,
    borderRadius: 24,
    position: 'relative',
  },
  floatingButtonText: {
    color: '#7EC3FF',
    fontFamily: 'ScopeOne-Regular',
    fontSize: 16,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  dash: {
    width: 6,
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    opacity: 0.85,
  },
  bottomDash: {
    position: 'absolute',
    bottom: -4,
    left: '50%',
    transform: [{ translateX: -30 }],
    width: 60,
    height: 2,
    backgroundColor: '#FFFFFF',
    opacity: 0.85,
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 18 : 24,
    zIndex: 2,
  },
  miniLogo: {
    width: 320,
    height: 110,
    opacity: 0.9,
  },
  disclaimer: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontFamily: 'ScopeOne-Regular',
    letterSpacing: 0.5,
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 16,
  },
});

export default EntryScreen; 