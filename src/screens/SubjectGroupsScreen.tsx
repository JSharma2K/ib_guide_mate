import React, { useRef, useEffect } from 'react';
import { View, ScrollView, Animated, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SubjectGroups'>;
  route: {
    params: {
      userType: 'student' | 'teacher';
    };
  };
};

const SubjectGroupsScreen: React.FC<Props> = ({ navigation, route }) => {
  const userType = route?.params?.userType || 'student';
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  const subjectGroups = [
    {
      id: 1,
      title: 'Studies in Language and Literature',
      subtitle: 'Group 1',
      icon: 'book-open',
      subjects: ['English A Literature', 'English A Language & Literature', 'English A Literature & Performance'],
      color: '#7EC3FF',
      gradient: ['rgba(126, 195, 255, 0.2)', 'rgba(126, 195, 255, 0.05)']
    },
    {
      id: 2,
      title: 'Language Acquisition',
      subtitle: 'Group 2',
      icon: 'globe',
      subjects: ['Language B', 'Language Ab Initio', 'Classical Languages'],
      color: '#7EC3FF',
      gradient: ['rgba(126, 195, 255, 0.2)', 'rgba(126, 195, 255, 0.05)']
    },
    {
      id: 3,
      title: 'Individuals and Societies',
      subtitle: 'Group 3',
      icon: 'users',
      subjects: ['Philosophy', 'History', 'Global Politics'],
      color: '#7EC3FF',
      gradient: ['rgba(126, 195, 255, 0.2)', 'rgba(126, 195, 255, 0.05)']
    },
    {
      id: 4,
      title: 'Sciences',
      subtitle: 'Group 4',
      icon: 'zap',
      subjects: ['Coming Soon'],
      color: '#7EC3FF',
      gradient: ['rgba(126, 195, 255, 0.2)', 'rgba(126, 195, 255, 0.05)']
    },
    {
      id: 5,
      title: 'Mathematics',
      subtitle: 'Group 5',
      icon: 'trending-up',
      subjects: ['Mathematics AA', 'Mathematics AI'],
      color: '#7EC3FF',
      gradient: ['rgba(126, 195, 255, 0.2)', 'rgba(126, 195, 255, 0.05)']
    },
    {
      id: 6,
      title: 'The Arts',
      subtitle: 'Group 6',
      icon: 'image',
      subjects: ['Coming Soon'],
      color: '#7EC3FF',
      gradient: ['rgba(126, 195, 255, 0.2)', 'rgba(126, 195, 255, 0.05)']
    }
  ];

  const handleGroupPress = (groupId: number) => {
    if (groupId === 1) {
      // Navigate to Home with English subjects
      navigation.navigate('Home', { userType, subjectGroup: 'english' });
    } else if (groupId === 2) {
      // Navigate to Language Acquisition subject selection screen
      navigation.navigate('LanguageAcquisition', { userType });
    } else if (groupId === 3) {
      // Navigate to Individuals and Societies subject selection screen
      navigation.navigate('IndividualsAndSocieties', { userType });
    } else if (groupId === 5) {
      // Navigate to Home with Math subjects
      navigation.navigate('Home', { userType, subjectGroup: 'mathematics' });
    } else {
      // For other groups, show coming soon or navigate accordingly
      // You can add more navigation logic here as you add more subjects
    }
  };

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const fadeThreshold = 50;
    
    if (scrollY > fadeThreshold) {
      Animated.timing(homeIconOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(homeIconOpacity, {
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

  let [fontsLoaded] = useFonts({
    'ScopeOne-Regular': require('../../assets/fonts/ScopeOne-Regular.ttf'),
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ImageBackground
      source={require('../../assets/images/entry-bg.png')}
      style={{ flex: 1, width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      {/* Home icon top left */}
      <Animated.View style={{ position: 'absolute', top: 56, left: 16, zIndex: 100, flexDirection: 'row', alignItems: 'center', opacity: homeIconOpacity }}>
        <Feather
          name="home"
          size={20}
          color="#7EC3FF"
          onPress={() => navigation.goBack()}
          style={{ cursor: 'pointer' }}
          accessibilityRole="button"
          accessibilityLabel="Go to Entry Screen"
        />
      </Animated.View>

      <ScrollView 
        contentContainerStyle={{ paddingTop: 112, paddingBottom: 32, paddingHorizontal: 16 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={{ marginBottom: 32, alignItems: 'center' }}>
          <Text style={{ 
            fontSize: 28, 
            color: '#fff', 
            fontFamily: 'ScopeOne-Regular', 
            fontWeight: 'bold', 
            marginBottom: 8,
            textAlign: 'center'
          }}>
            IB Subject Groups
          </Text>
          <Text style={{ 
            fontSize: 16, 
            color: '#8A97A7', 
            fontFamily: 'ScopeOne-Regular',
            textAlign: 'center'
          }}>
            Choose your subject group to explore resources
          </Text>
        </View>

        {/* Subject Groups Grid */}
        <View style={{ gap: 16 }}>
          {subjectGroups.map((group, index) => (
            <TouchableOpacity
              key={group.id}
              onPress={() => handleGroupPress(group.id)}
              style={{
                borderRadius: 18,
                borderWidth: 1,
                borderColor: group.color,
                backgroundColor: 'rgba(182,199,247,0.12)',
                overflow: 'hidden',
                marginBottom: 8,
                height: 120,
              }}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={group.gradient as [string, string]}
                style={{ padding: 20, flex: 1 }}
              >
                {/* Top section with icon, title, and chevron */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <View style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: `${group.color}20`,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16
                  }}>
                    <Feather name={group.icon as any} size={24} color={group.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 12,
                      color: group.color,
                      fontFamily: 'ScopeOne-Regular',
                      fontWeight: '600',
                      marginBottom: 4
                    }}>
                      {group.subtitle}
                    </Text>
                    <Text style={{
                      fontSize: 18,
                      color: '#fff',
                      fontFamily: 'ScopeOne-Regular',
                      fontWeight: 'bold',
                      lineHeight: 24
                    }}>
                      {group.title}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#FFFFFF" />
                </View>
                
                {/* Bottom section - fixed position for subject count */}
                <View style={{ position: 'absolute', bottom: 12, left: 20, right: 20, minHeight: 20 }}>
                  <Text style={{
                    fontSize: 14,
                    color: '#B6B6B6',
                    fontFamily: 'ScopeOne-Regular',
                    lineHeight: 20,
                    textAlign: 'center'
                  }}>
                    {group.subjects.length === 1 && group.subjects[0] === 'Coming Soon' 
                      ? 'Coming Soon' 
                      : `${group.subjects.length} subject${group.subjects.length > 1 ? 's' : ''} available`
                    }
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Core Components Section */}
        <View style={{ marginTop: 32 }}>
          <Text style={{
            fontSize: 20,
            color: '#fff',
            fontFamily: 'ScopeOne-Regular',
            fontWeight: 'bold',
            marginBottom: 16,
            textAlign: 'center'
          }}>
            Core Components
          </Text>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('ExtendedEssay', { userType })}
            style={{
              borderRadius: 18,
              borderWidth: 1,
              borderColor: '#7EC3FF',
              backgroundColor: 'rgba(182,199,247,0.12)',
              overflow: 'hidden',
            }}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(126, 195, 255, 0.2)', 'rgba(126, 195, 255, 0.05)']}
              style={{ padding: 20 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: 'rgba(126, 195, 255, 0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16
                }}>
                  <Feather name="edit-3" size={24} color="#7EC3FF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 18,
                    color: '#fff',
                    fontFamily: 'ScopeOne-Regular',
                    fontWeight: 'bold',
                    marginBottom: 4
                  }}>
                    Extended Essay
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#B6B6B6',
                    fontFamily: 'ScopeOne-Regular'
                  }}>
                    4,000-word independent research project
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color="#FFFFFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Whetstone Education Logo */}
        <View style={{ alignItems: 'center', marginTop: 32, marginBottom: 8 }}>
          <Image
            source={require('../../assets/images/whetstone_white.png')}
            style={{
              width: 200,
              height: 70,
              resizeMode: 'contain',
              opacity: 0.9
            }}
          />
        </View>

        {/* Disclaimer */}
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Text style={{
            fontSize: 12,
            color: '#B6B6B6',
            textAlign: 'center',
            lineHeight: 18,
            fontFamily: 'ScopeOne-Regular',
            fontWeight: '400',
          }}>
            This app is not affiliated with or endorsed by the International Baccalaureate Organization.
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default SubjectGroupsScreen; 