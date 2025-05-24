import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Platform, StatusBar, Image } from 'react-native';
import { Card, useTheme, Text, List } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import ExtendedEssayScreen from '../screens/ExtendedEssayScreen';
import { RootStackParamList } from '../types/navigation';


const { width } = Dimensions.get('window');

const Logo = () => (
  <View style={{ alignItems: 'center', marginBottom: 8 }}>
    <Text style={{ color: '#B6B6B6', fontSize: 22, fontFamily: 'Inter_700Bold' }}>~WE</Text>
  </View>
);

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
  route: { params?: { userType?: 'student' | 'teacher' } };
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
  {
    key: 'extended-essay',
    icon: 'file-text',
    title: 'Extended Essay',
    subtitle: 'Core Component',
    color: '#FFB6C1',
  },
];

const sectionKeys = ['overview', 'essentials', 'literature', 'detailedRubrics'];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const userType = route?.params?.userType || 'student';
  let [fontsLoaded] = useFonts({
    'ScopeOne-Regular': require('../../assets/fonts/ScopeOne-Regular.ttf'),
  });

  const renderSubject = useCallback(({ item, index }: any) => (
    <Animated.View entering={FadeInDown.delay(200 + index * 100).duration(600)}>
      <Card
        style={[styles.subjectCard, { borderWidth: 2, borderColor: '#FFD700', backgroundColor: '#22242C' }]}
        onPress={() => {
          if (item.key === 'english-a') {
            navigation.navigate('EnglishALiterature', { userType });
          } else if (item.key === 'math-aa') {
            navigation.navigate('MathAA', { userType });
          } else if (item.key === 'math-ai') {
            navigation.navigate('MathAI', { userType });
          } else if (item.key === 'extended-essay') {
            navigation.navigate('ExtendedEssay', { userType });
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
  ), [navigation, userType]);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#181A20',
      },
      headerTintColor: '#FFD700',
      headerTitleStyle: {
        fontFamily: 'Inter_700Bold',
        fontSize: 22,
        color: '#FFD700',
      },
      animation: 'fade',
    });
  }, [navigation]);

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
            <Text style={[styles.appTitle, { fontSize: 26 }]}>IB GuideMate</Text>
          </View>
        </Animated.View>
        <View style={styles.subjectsSection}>
          <Text style={styles.subjectSubheading}>Subjects</Text>
          <FlatList
            data={SUBJECTS}
            renderItem={renderSubject}
            keyExtractor={item => item.key}
            contentContainerStyle={{ gap: 18 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View style={styles.footer}>
          <Image
            source={require('../../assets/images/whetstone-logo.png')}
            style={styles.footerLogo}
            resizeMode="contain"
          />
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
    fontFamily: 'ScopeOne-Regular',
    color: '#FFD700',
    letterSpacing: 0.5,
    marginBottom: 10,
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
    fontFamily: 'ScopeOne-Regular',
    color: '#FFD700',
    marginBottom: 2,
  },
  subjectSubtitle: {
    fontSize: 14,
    fontFamily: 'ScopeOne-Regular',
    color: '#B6B6B6',
    fontWeight: '400',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingTop: 12,
  },
  footerLogo: {
    width: 200,
    height: 70,
    opacity: 0.9,
    marginBottom: 4,
  },
  subjectSubheading: {
    fontSize: 20,
    fontFamily: 'ScopeOne-Regular',
    color: '#FFD700',
    marginBottom: 10,
  },
});

export default HomeScreen; 