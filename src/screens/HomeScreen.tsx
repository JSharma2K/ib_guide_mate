import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Platform, StatusBar } from 'react-native';
import { Card, useTheme, Text } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

const { width } = Dimensions.get('window');

const Logo = () => (
  <View style={{ alignItems: 'center', marginBottom: 8 }}>
    <Text style={{ color: '#B6B6B6', fontSize: 22, fontFamily: 'Inter_700Bold' }}>~WE</Text>
  </View>
);

type RootStackParamList = {
  Home: undefined;
  SubjectList: undefined;
  SubjectDetail: { subjectId: string };
  ManageGuides: undefined;
  EnglishALiterature: undefined;
  MathAA: undefined;
  MathAI: undefined;
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const SUBJECTS = [
  {
    key: 'english-a',
    icon: 'book',
    title: 'English A',
    subtitle: 'Literature',
    color: '#B6C7F7',
  },
  {
    key: 'math-aa',
    icon: 'bar-chart-2',
    title: 'Math AA',
    subtitle: 'Analysis and Approaches',
    color: '#E6D6FC',
  },
  {
    key: 'math-ai',
    icon: 'cpu',
    title: 'Math AI',
    subtitle: 'Applications and Interpretation',
    color: '#FFF6B7',
  },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  let [fontsLoaded] = useFonts({
    Inter_700Bold: require('../../assets/fonts/Inter-Bold.ttf'),
    Inter_400Regular: require('../../assets/fonts/Inter-Regular.ttf'),
    Inter_300Light: require('../../assets/fonts/Inter-Light.ttf'),
  });

  // Lightbulb shine animation
  const bulbGlow = useSharedValue(0.5);
  React.useEffect(() => {
    bulbGlow.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);
  const animatedBulbStyle = useAnimatedStyle(() => ({
    shadowColor: '#FFD700',
    shadowOpacity: bulbGlow.value,
    shadowRadius: 12 * bulbGlow.value,
    opacity: bulbGlow.value * 0.7 + 0.3,
    transform: [{ scale: 0.95 + bulbGlow.value * 0.1 }],
  }));

  const renderSubject = useCallback(({ item, index }: any) => (
    <Animated.View entering={FadeInDown.delay(200 + index * 100).duration(600)}>
      <Card
        style={[styles.subjectCard, { borderWidth: 2, borderColor: '#FFD700', backgroundColor: '#22242C' }]}
        onPress={() => {
          if (item.key === 'english-a') {
            navigation.navigate('EnglishALiterature');
          } else if (item.key === 'math-aa') {
            navigation.navigate('MathAA');
          } else if (item.key === 'math-ai') {
            navigation.navigate('MathAI');
          } else {
            navigation.navigate('SubjectList');
          }
        }}
        elevation={0}
      >
        <LinearGradient
          colors={["#22304A", "#181A20"]}
          style={styles.glass}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={[styles.subjectCardContent, { backgroundColor: 'rgba(34, 48, 74, 0.7)' }]}>
            <Feather name={item.icon} size={32} color={item.color} style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.subjectTitle}>{item.title}</Text>
              <Text style={styles.subjectSubtitle}>{item.subtitle}</Text>
            </View>
            <Feather name="chevron-right" size={24} color="#B6B6B6" />
          </View>
        </LinearGradient>
      </Card>
    </Animated.View>
  ), [navigation]);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={[styles.flex1, { backgroundColor: '#181A20' }]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#22304A", "#181A20"]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <Animated.View entering={FadeInUp.duration(800)} style={styles.topSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.appTitle}>IB GuideMate</Text>
            <Animated.View style={[{ marginLeft: 10 }, animatedBulbStyle]}>
              <MaterialCommunityIcons name="lightbulb-on-outline" size={32} color="#FFD700" />
            </Animated.View>
          </View>
          <Text style={styles.appSubtitle}>
            The app where IB subject guides are more accessible than ever.
          </Text>
        </Animated.View>
        <View style={styles.subjectsSection}>
          <FlatList
            data={SUBJECTS}
            renderItem={renderSubject}
            keyExtractor={item => item.key}
            contentContainerStyle={{ gap: 18 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View style={styles.footer}>
          <Logo />
          <Text style={styles.footerText}>A Whetstone Ed Initiative</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 60 : 80,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appTitle: {
    fontSize: 38,
    fontFamily: 'Inter_700Bold',
    color: '#FFD700',
    letterSpacing: 0.5,
    marginBottom: 10,
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#B6B6B6',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
    fontWeight: '400',
    marginBottom: 8,
    opacity: 0.92,
  },
  subjectsSection: {
    flex: 1,
    justifyContent: 'center',
  },
  subjectCard: {
    backgroundColor: '#22242C',
    borderRadius: 18,
    marginBottom: 0,
    shadowColor: '#FFD700',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  glass: {
    borderRadius: 18,
    padding: 0,
    overflow: 'hidden',
  },
  subjectCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(34, 48, 74, 0.7)',
    borderRadius: 18,
  },
  subjectTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#FFD700',
    marginBottom: 2,
  },
  subjectSubtitle: {
    fontSize: 14,
    color: '#B6B6B6',
    fontFamily: 'Inter_400Regular',
    fontWeight: '400',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,215,0,0.08)',
    paddingTop: 12,
  },
  footerText: {
    color: '#FFD700',
    fontSize: 13,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0.5,
  },
});

export default HomeScreen; 