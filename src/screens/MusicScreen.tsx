import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated, StatusBar, ImageBackground, TouchableOpacity } from 'react-native';
import { Text, Card, List, Searchbar, Button as PaperButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, gradientColors, styles as themeStyles } from '../theme/theme';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Feather } from '@expo/vector-icons';

const highlightText = (text: string, highlightedText: string) => {
  if (!highlightedText) return text;
  const parts = text.split(new RegExp(`(${highlightedText})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === highlightedText.toLowerCase() ?
      <Text key={i} style={themeStyles.highlightedText}>{part}</Text> :
      part
  );
};

const MusicScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const userType = route?.params?.userType || 'student';
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [highlightedText, setHighlightedText] = useState('');
  const [matchingSections, setMatchingSections] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Animation values for each section
  const overviewAnimation = useRef(new Animated.Value(0)).current;
  const essentialsAnimation = useRef(new Animated.Value(0)).current;
  const coreThemesAnimation = useRef(new Animated.Value(0)).current;
  const detailedRubricsAnimation = useRef(new Animated.Value(0)).current;
  const musicTipsAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  // Section keys and content for search
  const sectionContentStrings: Record<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'musicTips', string> = {
    overview: `Syllabus Overview
The Music course in the IB Diploma Programme is designed to broaden students' understanding of music through composition, performance, analysis, and reflection. Students explore music in context and develop musical understanding across cultures, genres, and eras.`,
    essentials: `Syllabus Outline & Teaching Hours
SL: 150 hours | HL: 240 hours
Core Areas: Exploring music in context, Experimenting with music, Presenting music
HL Extension: The contemporary music maker

Assessment Objectives in Practice
1. Demonstrate knowledge and understanding of musical elements.
2. Experiment with musical ideas and techniques.
3. Present and communicate musical intentions clearly.
4. Reflect critically on music in a variety of contexts.

Assessment Outline and Weightages
SL:
- Exploring Music in Context (External, 30%)
- Experimenting with Music (External, 30%)
- Presenting Music (External, 40%)

HL:
- Includes all SL components and an additional Internal assessment:
- The Contemporary Music Maker (Internal, 30%)`,
    coreThemes: `Concepts, Content, and Contexts

Concepts:
Identity, Culture, Creativity, Interpretation, Expression

Content:
Music composition, Performance, Analysis of musical excerpts, Curating musical materials

Contexts:
Personal, Local, Global`,
    detailedRubrics: `Assessment Standards

Exploring Music in Context
Standard A: Musical examination and critique (6 points)
Standard B: Critical thinking about music within cultural settings (6 points)
Standard C: Communication of musical understanding and purpose (6 points)

Experimenting with Music
Standard A: Documentation of creative musical journey (6 points)
Standard B: Evolution and refinement of musical concepts (6 points)
Standard C: Practical application of musical ideas (6 points)

Presenting Music
Standard A: Curation and organization of musical content (6 points)
Standard B: Creative vision and artistic expression (6 points)
Standard C: Technical skill and musical proficiency (6 points)

The Contemporary Music Maker (HL only)
Standard A: Artistic vision and strategic planning (6 points)
Standard B: Implementation and delivery (6 points)
Standard C: Critical analysis and assessment (6 points)`,
    musicTips: `1. Listen to a wide range of music from different cultures and genres.

2. Keep a reflective journal of your creative process and listening activities.

3. Practice analyzing unfamiliar musical pieces regularly.

4. Experiment with new compositional tools and software.

5. Record and review your performances to refine expression.

6. Curate your portfolio with clear musical intentions.

7. Use the assessment rubrics to self-evaluate your work before submission.

8. Engage in discussions with peers to expand perspectives.

9. Time-manage your projects to avoid last-minute stress.

10. Stay inspired by attending live or virtual performances.`,
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'musicTips'> = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'musicTips'];

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

  const toggleSection = (section: string) => {
    const isExpanding = expandedSection !== section;
    setExpandedSection(isExpanding ? section : null);
    const animationValue = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'coreThemes': coreThemesAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'musicTips': musicTipsAnimation,
    }[section];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: isExpanding ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const trimmedQuery = query.trim();
    setHighlightedText(trimmedQuery);
    if (!trimmedQuery) {
      setMatchingSections([]);
      setCurrentMatchIndex(0);
      setExpandedSection(null);
      return;
    }
    
    const sectionTitles = {
      'overview': 'Course Overview',
      'essentials': 'Subject Essentials', 
      'coreThemes': 'Prescribed Literature',
      'detailedRubrics': 'Detailed Rubrics',
      'musicTips': 'Music Tips',
    };
    
    const matches = sectionKeys.filter(key =>
      sectionContentStrings[key].toLowerCase().includes(trimmedQuery.toLowerCase()) ||
      sectionTitles[key].toLowerCase().includes(trimmedQuery.toLowerCase())
    );
    setMatchingSections(matches);
    setCurrentMatchIndex(0);
    if (matches.length > 0) {
      setExpandedSection(matches[0]);
    } else {
      setExpandedSection(null);
    }
  };

  const handleNextMatch = () => {
    if (matchingSections.length < 2) return;
    const nextIndex = (currentMatchIndex + 1) % matchingSections.length;
    setCurrentMatchIndex(nextIndex);
    setExpandedSection(matchingSections[nextIndex]);
  };

  useEffect(() => {
    if (matchingSections.length > 0) {
      setExpandedSection(matchingSections[currentMatchIndex]);
    } else {
      setExpandedSection(null);
    }
  }, [currentMatchIndex, matchingSections]);

  useEffect(() => {
    if (!expandedSection) return;
    const animationValue = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'coreThemes': coreThemesAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'musicTips': musicTipsAnimation,
    }[expandedSection];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    const allSectionKeys = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'musicTips'];
    allSectionKeys.forEach(key => {
      if (key !== expandedSection) {
        const anim = {
          'overview': overviewAnimation,
          'essentials': essentialsAnimation,
          'coreThemes': coreThemesAnimation,
          'detailedRubrics': detailedRubricsAnimation,
          'musicTips': musicTipsAnimation,
        }[key];
        if (anim) {
          Animated.timing(anim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      }
    });
  }, [expandedSection]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const renderAnimatedContent = (section: 'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'musicTips', content: React.ReactNode) => {
    const animationValue = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'coreThemes': coreThemesAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'musicTips': musicTipsAnimation,
    }[section];
    if (!animationValue) return null;
    return (
      <Animated.View
        style={{
          maxHeight: animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 5000],
          }),
          opacity: animationValue,
          overflow: 'hidden',
        }}
      >
        <View style={{ backgroundColor: 'rgba(24,26,32,0.92)', borderRadius: 12, padding: 16, marginTop: 8 }}>
          {content}
        </View>
      </Animated.View>
    );
  };

  let [fontsLoaded] = useFonts({
    'ScopeOne-Regular': require('../../assets/fonts/ScopeOne-Regular.ttf'),
  });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground
      source={require('../../assets/images/entry-bg.png')}
      style={{ flex: 1, width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <View style={{ position: 'absolute', top: 56, left: 16, zIndex: 100, flexDirection: 'row', alignItems: 'center' }}>
        <Animated.View
          style={{
            opacity: homeIconOpacity,
          }}
        >
          <Feather
            name="home"
            size={20}
            color="#7EC3FF"
            onPress={() => navigation.goBack()}
            style={{ cursor: 'pointer' }}
            accessibilityRole="button"
            accessibilityLabel="Go to Home"
          />
        </Animated.View>
      </View>
      <ScrollView 
        keyboardShouldPersistTaps="handled" 
        contentContainerStyle={{ paddingTop: 112, paddingBottom: 32, paddingHorizontal: 16 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Searchbar
          placeholder="Search guide topics..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={{
            backgroundColor: '#22242C',
            borderRadius: 16,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: '#7EC3FF',
            shadowOpacity: 0,
          }}
          inputStyle={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular' }}
          placeholderTextColor="#FFFFFF"
          iconColor="#FFFFFF"
        />
        {matchingSections.length > 1 && (
          <View style={{ alignItems: 'flex-end', marginTop: -16, marginBottom: 16 }}>
            <PaperButton
              mode="outlined"
              onPress={handleNextMatch}
              style={{
                borderRadius: 24,
                backgroundColor: 'transparent',
                minWidth: 120,
                elevation: 2,
                paddingVertical: 4,
                borderWidth: 1,
                borderColor: '#7EC3FF',
              }}
              labelStyle={{ color: '#FFFFFF', fontFamily: 'ScopeOne-Regular', fontSize: 15 }}
            >
              {`Next (${currentMatchIndex + 1}/${matchingSections.length})`}
            </PaperButton>
          </View>
        )}
        <View style={{ borderRadius: 18, borderWidth: 1, borderColor: '#7EC3FF', backgroundColor: 'rgba(182,199,247,0.12)', marginBottom: 24, overflow: 'hidden', paddingHorizontal: 8 }}>
          <View style={{ padding: 20, paddingBottom: 0 }}>
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Music</Text>
            <Text style={{ fontSize: 16, color: '#8A97A7', fontFamily: 'ScopeOne-Regular', marginBottom: 12 }}>Group 6: The Arts</Text>
            <View style={{ height: 2, backgroundColor: '#7EC3FF', marginBottom: 8 }} />
          </View>
          {/* Dropdowns */}
          {[{ key: 'overview', title: 'Course Overview' }, { key: 'essentials', title: 'Subject Essentials' }, { key: 'coreThemes', title: 'Prescribed Literature' }, { key: 'detailedRubrics', title: 'Detailed Rubrics' }].map((section, idx, arr) => (
            <View key={section.key}>
              <List.Item
                title={section.title}
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection(section.key)}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === section.key ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === section.key && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent(section.key as 'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'musicTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      {section.key === 'overview' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 8 }}>Syllabus Overview</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText("The Music course in the IB Diploma Programme is designed to broaden students' understanding of music through composition, performance, analysis, and reflection. Students explore music in context and develop musical understanding across cultures, genres, and eras.", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'essentials' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Syllabus Outline & Teaching Hours</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("SL: 150 hours | HL: 240 hours\nCore Areas: Exploring music in context, Experimenting with music, Presenting music\nHL Extension: The contemporary music maker", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Objectives in Practice</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("1. Demonstrate knowledge and understanding of musical elements.\n2. Experiment with musical ideas and techniques.\n3. Present and communicate musical intentions clearly.\n4. Reflect critically on music in a variety of contexts.", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Outline and Weightages</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("SL:\n- Exploring Music in Context (External, 30%)\n- Experimenting with Music (External, 30%)\n- Presenting Music (External, 40%)\n\nHL:\n- Includes all SL components and an additional Internal assessment:\n- The Contemporary Music Maker (Internal, 30%)", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'coreThemes' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8 }}>Concepts, Content, and Contexts</Text>
                          
                          {/* Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
                            {/* Header Row */}
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Concepts</Text>
                              <Text style={{ flex: 1.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Content</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Contexts</Text>
                            </View>
                            
                            {/* Data Row */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>{highlightText("Identity, Culture, Creativity, Interpretation, Expression", highlightedText)}</Text>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>{highlightText("Music composition, Performance, Analysis of musical excerpts, Curating musical materials", highlightedText)}</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>{highlightText("Personal, Local, Global", highlightedText)}</Text>
                            </View>
                          </View>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8 }}>Assessment Standards</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginTop: 16 }}>Exploring Music in Context</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 1.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Standard</Text>
                              <Text style={{ flex: 3, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Description</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Marks</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>Standard A</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText("Musical examination and critique", highlightedText)}</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>{highlightText("6", highlightedText)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>Standard B</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText("Critical thinking about music within cultural settings", highlightedText)}</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>{highlightText("6", highlightedText)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>Standard C</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText("Communication of musical understanding and purpose", highlightedText)}</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>{highlightText("6", highlightedText)}</Text>
                            </View>
                          </View>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginTop: 16 }}>Experimenting with Music</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 1.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Standard</Text>
                              <Text style={{ flex: 3, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Description</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Marks</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>Standard A</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText("Documentation of creative musical journey", highlightedText)}</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>{highlightText("6", highlightedText)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>Standard B</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText("Evolution and refinement of musical concepts", highlightedText)}</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>{highlightText("6", highlightedText)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>Standard C</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText("Practical application of musical ideas", highlightedText)}</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>{highlightText("6", highlightedText)}</Text>
                            </View>
                          </View>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginTop: 16 }}>Presenting Music</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 1.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Standard</Text>
                              <Text style={{ flex: 3, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Description</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Marks</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>Standard A</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText("Curation and organization of musical content", highlightedText)}</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>{highlightText("6", highlightedText)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>Standard B</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText("Creative vision and artistic expression", highlightedText)}</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>{highlightText("6", highlightedText)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>Standard C</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText("Technical skill and musical proficiency", highlightedText)}</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>{highlightText("6", highlightedText)}</Text>
                            </View>
                          </View>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginTop: 16 }}>The Contemporary Music Maker (HL only)</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 1.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Standard</Text>
                              <Text style={{ flex: 3, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Description</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Marks</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>Standard A</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText("Artistic vision and strategic planning", highlightedText)}</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>{highlightText("6", highlightedText)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>Standard B</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText("Implementation and delivery", highlightedText)}</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>{highlightText("6", highlightedText)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>Standard C</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText("Critical analysis and assessment", highlightedText)}</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>{highlightText("6", highlightedText)}</Text>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
              {idx < arr.length - 1 && (
                <View style={{ height: 2, backgroundColor: '#7EC3FF', alignSelf: 'flex-start', width: 80, borderRadius: 2, marginLeft: 20, marginTop: -4, marginBottom: 8 }} />
              )}
            </View>
          ))}
        </View>
        {userType === 'student' && (
          <View style={{ borderRadius: 16, borderWidth: 1, borderColor: '#7EC3FF', backgroundColor: 'rgba(182,199,247,0.12)', marginBottom: 24, overflow: 'hidden', paddingHorizontal: 8 }}>
            <View style={{ padding: 20, paddingBottom: 0 }}>
              <Text style={{ fontSize: 22, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Student Resources</Text>
              <View style={{ height: 2, backgroundColor: '#7EC3FF', marginBottom: 8 }} />
            </View>
            
            <View>
              <List.Item
                title="Music Tips"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('musicTips')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'musicTips' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'musicTips' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('musicTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText(sectionContentStrings.musicTips, highlightedText)}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
        {userType === 'teacher' && (
          <View style={{ borderRadius: 16, borderWidth: 1, borderColor: '#7EC3FF', backgroundColor: 'rgba(182,199,247,0.12)', marginBottom: 24, overflow: 'hidden', paddingHorizontal: 8 }}>
            <List.Item
              title="Teacher-Only Resources"
              titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
              style={{ paddingVertical: 16, paddingLeft: 20 }}
            />
          </View>
        )}
        
        <TouchableOpacity
          style={{
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#7EC3FF',
            backgroundColor: 'rgba(126, 195, 255, 0.1)',
            marginBottom: 24,
            overflow: 'hidden',
          }}
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('GradePrediction', { 
              subject: 'MUSIC', 
              userType: userType 
            });
          }}
        >
          <LinearGradient
            colors={['rgba(126, 195, 255, 0.15)', 'rgba(126, 195, 255, 0.05)']}
            style={{ padding: 20 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="trending-up" size={24} color="#7EC3FF" style={{ marginRight: 12 }} />
              <Text style={{
                fontSize: 18,
                color: '#7EC3FF',
                fontFamily: 'ScopeOne-Regular',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                Predict Your Grade
              </Text>
            </View>
            <Text style={{
              fontSize: 14,
              color: '#B6B6B6',
              fontFamily: 'ScopeOne-Regular',
              textAlign: 'center',
              marginTop: 8
            }}>
              Get an estimate of your final grade based on your current performance
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 8 }}>
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

export default MusicScreen; 