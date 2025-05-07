import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Platform, StatusBar } from 'react-native';
import { Card, useTheme, Text } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useFonts, Montserrat_700Bold, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';

const { width } = Dimensions.get('window');

const Logo = () => (
  <View style={{ alignItems: 'center', marginBottom: 8 }}>
    <Text style={{ color: '#FFD700', fontSize: 28, fontFamily: 'Montserrat_700Bold' }}>~WE</Text>
  </View>
);

type RootStackParamList = {
  Home: undefined;
  SubjectList: undefined;
  SubjectDetail: { subjectId: string };
  ManageGuides: undefined;
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const SUBJECTS = [
  {
    key: 'english-a',
    icon: 'book-open-page-variant',
    title: 'English A',
    subtitle: 'Literature',
    color: '#FFE0A3',
  },
  {
    key: 'math-aa',
    icon: 'chart-line',
    title: 'Math AA',
    subtitle: 'Analysis and Approaches',
    color: '#FFB870',
  },
  {
    key: 'math-ai',
    icon: 'calculator-variant',
    title: 'Math AI',
    subtitle: 'Applications and Interpretation',
    color: '#FFB870',
  },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  let [fontsLoaded] = useFonts({
    Montserrat_700Bold,
    Montserrat_400Regular,
  });

  const renderSubject = useCallback(({ item, index }: any) => (
    <Animated.View entering={FadeInDown.delay(200 + index * 100).duration(600)}>
      <Card
        style={styles.subjectCard}
        onPress={() => navigation.navigate('SubjectList')}
        elevation={0}
      >
        <LinearGradient
          colors={["rgba(26,35,126,0.85)", "rgba(26,35,126,0.65)"]}
          style={styles.glass}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.subjectCardContent}>
            <MaterialCommunityIcons name={item.icon} size={36} color={item.color} style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.subjectTitle}>{item.title}</Text>
              <Text style={styles.subjectSubtitle}>{item.subtitle}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={28} color="#FFD700" />
          </View>
        </LinearGradient>
      </Card>
    </Animated.View>
  ), [navigation]);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.flex1}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#232B4D", "#1A237E", "#121933"]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <Animated.View entering={FadeInUp.duration(800)} style={styles.topSection}>
          <Text style={styles.appTitle}>IB GuideMate</Text>
          <Text style={styles.appSubtitle}>
            The app where IB subject{"\n"}guides are more accessible{"\n"}than ever.
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
    fontSize: 44,
    fontFamily: 'Montserrat_700Bold',
    color: '#FFD700',
    letterSpacing: 1,
    marginBottom: 18,
    textShadowColor: 'rgba(255, 215, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 16,
  },
  appSubtitle: {
    fontSize: 18,
    color: '#E0D8C3',
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: 'Montserrat_400Regular',
    fontWeight: '400',
    marginBottom: 8,
    opacity: 0.92,
  },
  subjectsSection: {
    flex: 1,
    justifyContent: 'center',
  },
  subjectCard: {
    backgroundColor: 'transparent',
    borderRadius: 22,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden',
  },
  glass: {
    borderRadius: 22,
    padding: 0,
    overflow: 'hidden',
  },
  subjectCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 22,
    backdropFilter: 'blur(8px)', // for web, ignored on native
  },
  subjectTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#FFD700',
    marginBottom: 2,
  },
  subjectSubtitle: {
    fontSize: 15,
    color: '#E0D8C3',
    fontFamily: 'Montserrat_400Regular',
    fontWeight: '400',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 12,
  },
  footerText: {
    color: '#FFD700',
    fontSize: 15,
    marginTop: 2,
    fontFamily: 'Montserrat_400Regular',
    letterSpacing: 0.5,
  },
});

export default HomeScreen; 