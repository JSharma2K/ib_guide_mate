import React, { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Platform, StatusBar, Image, ImageBackground, Animated as RNAnimated } from 'react-native';
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
  route: { params?: { userType?: 'student' | 'teacher'; subjectGroup?: 'english' | 'mathematics' } };
};

const ALL_SUBJECTS = [
  {
    key: 'english-a',
    icon: 'book',
    title: 'English A',
    subtitle: 'Literature',
    color: '#B6C7F7',
    group: 'english',
  },
  {
    key: 'english-a-performance',
    icon: 'music',
    title: 'English A',
    subtitle: 'Literature and Performance',
    color: '#C7B6F7',
    group: 'english',
  },
  {
    key: 'english-a-language-literature',
    icon: 'edit-3',
    title: 'English A',
    subtitle: 'Language and Literature',
    color: '#B6F7C7',
    group: 'english',
  },
  {
    key: 'math-aa',
    icon: 'bar-chart-2',
    title: 'Math AA',
    subtitle: 'Analysis and Approaches',
    color: '#E6D6FC',
    group: 'mathematics',
  },
  {
    key: 'math-ai',
    icon: 'cpu',
    title: 'Math AI',
    subtitle: 'Applications and Interpretation',
    color: '#FFF6B7',
    group: 'mathematics',
  },
];

const sectionKeys = ['overview', 'essentials', 'literature', 'detailedRubrics'];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const userType = route?.params?.userType || 'student';
  const subjectGroup = route?.params?.subjectGroup;
  
  // Filter subjects based on the selected group
  const SUBJECTS = subjectGroup 
    ? ALL_SUBJECTS.filter(subject => subject.group === subjectGroup)
    : ALL_SUBJECTS;
    
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new RNAnimated.Value(1)).current;
  
  let [fontsLoaded] = useFonts({
    'ScopeOne-Regular': require('../../assets/fonts/ScopeOne-Regular.ttf'),
  });

  const renderSubject = useCallback(({ item, index }: any) => (
    <Animated.View entering={FadeInDown.delay(200 + index * 100).duration(600)}>
      <Card
        style={[styles.subjectCard, { borderWidth: 2, borderColor: '#7EC3FF', backgroundColor: '#22242C' }]}
        onPress={() => {
          if (item.key === 'english-a') {
            navigation.navigate('EnglishALiterature', { userType });
          } else if (item.key === 'english-a-performance') {
            navigation.navigate('EnglishALiteraturePerformance', { userType });
          } else if (item.key === 'english-a-language-literature') {
            navigation.navigate('EnglishALanguageLiterature', { userType });
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
            <Feather name={item.icon} size={32} color={'#7EC3FF'} style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.subjectTitle, { color: '#FFFFFF' }]}>{item.title}</Text>
              <Text style={[styles.subjectSubtitle, { color: '#FFFFFF' }]}>{item.subtitle}</Text>
            </View>
            <Feather name="chevron-right" size={24} color="#FFFFFF" />
          </View>
        </LinearGradient>
      </Card>
    </Animated.View>
  ), [navigation, userType]);

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const fadeThreshold = 50;
    
    if (scrollY > fadeThreshold) {
      RNAnimated.timing(homeIconOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else {
      RNAnimated.timing(homeIconOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#181A20',
      },
      headerTintColor: '#7EC3FF',
      headerTitleStyle: {
        fontFamily: 'Inter_700Bold',
        fontSize: 22,
        color: '#7EC3FF',
      },
      animation: 'fade',
    });
  }, [navigation]);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ImageBackground
      source={require('../../assets/images/entry-bg.png')}
      style={[styles.flex1, { width: '100%', height: '100%' }]}
      resizeMode="cover"
    >
      {/* Home icon top left */}
      <RNAnimated.View style={{ position: 'absolute', top: 56, left: 16, zIndex: 100, flexDirection: 'row', alignItems: 'center', opacity: homeIconOpacity }}>
        <Feather
          name="home"
          size={20}
          color="#7EC3FF"
          onPress={() => navigation.goBack()}
          style={{ cursor: 'pointer' }}
          accessibilityRole="button"
          accessibilityLabel="Go to Subject Groups"
        />
      </RNAnimated.View>
      
      <StatusBar barStyle="light-content" />
      <View style={styles.gradient}>
        <Animated.View entering={FadeInUp.duration(800)} style={styles.topSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[styles.appTitle, { fontSize: 26, color: '#7EC3FF' }]}>GuideMate</Text>
          </View>
        </Animated.View>
        <View style={styles.subjectsSection}>
          <Text style={[styles.subjectSubheading, { color: '#FFFFFF' }]}>Subjects</Text>
          <FlatList
            data={SUBJECTS}
            renderItem={renderSubject}
            keyExtractor={item => item.key}
            contentContainerStyle={{ gap: 18 }}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
          />
        </View>
        <View style={styles.footer}>
          <Image
            source={require('../../assets/images/whetstone_white.png')}
            style={styles.footerLogo}
            resizeMode="contain"
          />
          <Text style={styles.disclaimer}>
            This app is not affiliated with or endorsed by the International Baccalaureate Organization.
          </Text>
        </View>
      </View>
    </ImageBackground>
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
    color: '#7EC3FF',
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
    shadowColor: '#7EC3FF',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#7EC3FF',
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
    color: '#FFFFFF',
    marginBottom: 10,
  },
  disclaimer: {
    fontSize: 12,
    color: '#B6B6B6',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'Inter_400Regular',
    fontWeight: '400',
    marginTop: 4,
  },
});

export default HomeScreen; 