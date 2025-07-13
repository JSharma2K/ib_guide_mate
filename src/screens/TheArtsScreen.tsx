import React, { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions, Platform, StatusBar, Image, ImageBackground, Animated as RNAnimated } from 'react-native';
import { Card, useTheme, Text, List } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { RootStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TheArts'>;
  route: { params?: { userType?: 'student' | 'teacher' } };
};

const THE_ARTS_SUBJECTS = [
  {
    key: 'dance',
    icon: 'music',
    title: 'Dance',
    subtitle: 'Movement and artistic expression',
    color: '#B6C7F7',
    group: 'arts',
  },
  {
    key: 'filmstudies',
    icon: 'film',
    title: 'Film Studies',
    subtitle: 'Cinema and visual storytelling',
    color: '#B6C7F7',
    group: 'arts',
  },
  {
    key: 'music',
    icon: 'headphones',
    title: 'Music',
    subtitle: 'Sound, composition, and performance',
    color: '#B6C7F7',
    group: 'arts',
  },
  {
    key: 'theater',
    icon: 'users',
    title: 'Theater',
    subtitle: 'Performance and dramatic arts',
    color: '#B6C7F7',
    group: 'arts',
  },
  {
    key: 'visualarts',
    icon: 'edit-3',
    title: 'Visual Arts',
    subtitle: 'Creative expression through visual media',
    color: '#B6C7F7',
    group: 'arts',
  },
];

const TheArtsScreen: React.FC<Props> = ({ navigation, route }) => {
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
          if (item.key === 'dance') {
            navigation.navigate('Dance', { userType });
          } else if (item.key === 'filmstudies') {
            navigation.navigate('FilmStudies', { userType });
          } else if (item.key === 'music') {
            navigation.navigate('Music', { userType });
          } else if (item.key === 'theater') {
            navigation.navigate('Theater', { userType });
          } else if (item.key === 'visualarts') {
            navigation.navigate('VisualArts', { userType });
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
            <Text style={[styles.appTitle, { fontSize: 26, color: '#7EC3FF' }]}>The Arts</Text>
          </View>
          <Text style={[styles.subtitle, { color: '#8A97A7' }]}>Group 6: Creative expression and artistic exploration</Text>
        </Animated.View>
        <View style={styles.subjectsSection}>
          <Text style={[styles.subjectSubheading, { color: '#FFFFFF' }]}>Available Subjects</Text>
          <FlatList
            data={THE_ARTS_SUBJECTS}
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
            Arts subjects for IB students{'\n'}
            Explore creative expression and artistic exploration
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
    paddingTop: 112,
    paddingBottom: 32,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appTitle: {
    fontSize: 28,
    fontFamily: 'ScopeOne-Regular',
    fontWeight: 'bold',
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
    fontFamily: 'ScopeOne-Regular',
    fontWeight: 'bold',
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
    fontFamily: 'ScopeOne-Regular',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subjectSubtitle: {
    fontSize: 14,
    fontFamily: 'ScopeOne-Regular',
  },
});

export default TheArtsScreen; 