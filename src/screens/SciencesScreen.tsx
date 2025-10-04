import React, { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Platform, StatusBar, Image, ImageBackground, Animated as RNAnimated } from 'react-native';
import { Card, useTheme, Text, List } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { RootStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Sciences'>;
  route: { params?: { userType?: 'student' | 'teacher' } };
};

const SCIENCES_SUBJECTS = [
  {
    key: 'biology',
    icon: 'activity',
    title: 'Biology',
    subtitle: 'Living systems and processes',
    color: '#B6C7F7',
    group: 'sciences',
  },
  {
    key: 'chemistry',
    icon: 'zap',
    title: 'Chemistry',
    subtitle: 'Matter and molecular interactions',
    color: '#B6C7F7',
    group: 'sciences',
  },
  {
    key: 'computer-science',
    icon: 'cpu',
    title: 'Computer Science',
    subtitle: 'Programming and systems',
    color: '#B6C7F7',
    group: 'sciences',
  },
  {
    key: 'physics',
    icon: 'zap-off',
    title: 'Physics',
    subtitle: 'Matter, energy, and motion',
    color: '#B6C7F7',
    group: 'sciences',
  },
  {
    key: 'sports-exercise-health-science',
    icon: 'heart',
    title: 'Sports, Exercise & Health',
    subtitle: 'Human performance and health',
    color: '#B6C7F7',
    group: 'sciences',
  },
];

const SciencesScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const userType = route?.params?.userType || 'student';
  
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
          if (item.key === 'biology') {
            navigation.navigate('Biology', { userType });
          } else if (item.key === 'chemistry') {
            navigation.navigate('Chemistry', { userType });
          } else if (item.key === 'computer-science') {
            navigation.navigate('ComputerScience', { userType });
          } else if (item.key === 'physics') {
            navigation.navigate('Physics', { userType });
          } else if (item.key === 'sports-exercise-health-science') {
            navigation.navigate('SportsExerciseHealthScience', { userType });
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
      headerShown: false,
    });
  }, [navigation]);

  if (!fontsLoaded) {
    return null;
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
          name="arrow-left"
          size={20}
          color="#7EC3FF"
          onPress={() => navigation.goBack()}
          style={{ cursor: 'pointer' }}
          accessibilityRole="button"
          accessibilityLabel="Go Back to Subject Groups"
        />
      </RNAnimated.View>
      
      <StatusBar barStyle="light-content" />
      <View style={styles.gradient}>
        <Animated.View entering={FadeInUp.duration(800)} style={styles.topSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[styles.appTitle, { fontSize: 26, color: '#7EC3FF' }]}>Sciences</Text>
          </View>
          <Text style={[styles.subtitle, { color: '#8A97A7' }]}>Group 4: Experimental sciences and scientific inquiry</Text>
        </Animated.View>
        <View style={styles.subjectsSection}>
          <Text style={[styles.subjectSubheading, { color: '#FFFFFF' }]}>Available Subjects</Text>
          <FlatList
            data={SCIENCES_SUBJECTS}
            renderItem={renderSubject}
            keyExtractor={item => item.key}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.subjectsList}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
        </View>
        
        {/* Footer */}
        <View style={{ alignItems: 'center', marginTop: 32, marginBottom: 16 }}>
          <Text style={{
            fontSize: 12,
            color: '#8A97A7',
            textAlign: 'center',
            lineHeight: 18,
            fontFamily: 'ScopeOne-Regular',
            fontWeight: '400',
          }}>
            Sciences subjects for IB students{'\n'}
            Explore experimental sciences and scientific inquiry
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
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingHorizontal: 20,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'ScopeOne-Regular',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'ScopeOne-Regular',
    textAlign: 'center',
  },
  subjectsSection: {
    flex: 1,
  },
  subjectSubheading: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'ScopeOne-Regular',
    marginBottom: 16,
    textAlign: 'center',
  },
  subjectsList: {
    paddingBottom: 20,
  },
  subjectCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  glass: {
    borderRadius: 16,
  },
  subjectCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'ScopeOne-Regular',
    marginBottom: 4,
  },
  subjectSubtitle: {
    fontSize: 14,
    fontFamily: 'ScopeOne-Regular',
    opacity: 0.8,
  },
});

export default SciencesScreen; 