import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated, StatusBar, ImageBackground, TouchableOpacity } from 'react-native';
import { Text, Card, List, Searchbar, Button as PaperButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, gradientColors, styles as themeStyles } from '../theme/theme';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { Feather } from '@expo/vector-icons';

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const highlightText = (text: string, highlightedText: string) => {
  if (!highlightedText) return text;
  const escapedHighlight = escapeRegExp(highlightedText);
  const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === highlightedText.toLowerCase() ?
      <Text key={i} style={themeStyles.highlightedText}>{part}</Text> :
      part
  );
};

const VisualArtsScreen = ({ navigation, route }: { navigation: any; route: any }) => {
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
  const visualArtsTipsAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;
  
  // ScrollView ref for auto-scrolling
  const scrollViewRef = useRef<ScrollView>(null);

  // Section keys and content for search
  const sectionContentStrings: Record<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'visualArtsTips', string> = {
    overview: `Syllabus Overview
The IB Visual Arts course encourages students to challenge their own creative and cultural expectations and boundaries. It is a thought-provoking course in which students develop analytical skills in problem-solving and divergent thinking, while working towards technical proficiency and confidence as art-makers. Students are expected to explore and compare visual arts from different perspectives and in different contexts, and through this inquiry, develop an appreciation of the expressive and aesthetic diversity in the world around them. The course is designed to equip students with the knowledge and skills to become creative thinkers and confident communicators through visual expression.`,
    essentials: `Syllabus Outline and Teaching Hours
The course is divided into three main areas of study across both SL and HL levels: Comparative Study, Process Portfolio, and Exhibition. The teaching hours are structured as follows:
SL: 150 hours total
HL: 240 hours total

Assessment Objectives in Practice
AO1: Demonstrate knowledge and understanding of specified content
AO2: Apply skills and techniques effectively
AO3: Analyse and evaluate information, artworks, and ideas
AO4: Present information and artistic expression in a structured and appropriate format

Assessment Outline and Weightages
SL:
- Comparative Study: 20%
- Process Portfolio: 40%
- Exhibition: 40%

HL:
- Comparative Study: 20%
- Process Portfolio: 40%
- Exhibition: 40%`,
    coreThemes: `Concepts, Content, and Contexts

Concepts:
Artistic intention, Techniques, Visual language

Content:
Comparative Study, Process Portfolio, Exhibition

Contexts:
Cultural, Historical, Contemporary, Personal`,
    detailedRubrics: `Comparative Study Assessment Framework
The Comparative Study component uses specific evaluation criteria with varying point allocations. Assessment areas include:

Factual Information: Accurate and relevant information about artworks and their contexts (0-6 points)
Analysis and Evaluation: Comparative analysis and evaluation of artworks (0-12 points)
Making Connections: Connections between own work and investigated work (0-6 points)
Presentation and Subject-Specific Language: Effective visual presentation and use of terminology (0-6 points)
HL only - Curatorial Rationale: Presentation of intention and curatorial decisions (0-4 points for HL only)

Art-making inquiries portfolio - Assessment Criteria
Criterion A: Knowledge and understanding of art forms
Excellent (9-10): Shows thorough knowledge of art forms studied, with clear understanding of their cultural significance and creative contexts
Good (7-8): Shows good knowledge of art forms studied, with understanding of their cultural significance and creative contexts
Satisfactory (5-6): Shows adequate knowledge of art forms studied, with some understanding of their cultural significance and creative contexts
Needs Improvement (3-4): Shows limited knowledge of art forms studied, with minimal understanding of their cultural significance and creative contexts
Poor (1-2): Shows very limited knowledge of art forms studied, with little understanding of their cultural significance and creative contexts

Criterion B: Application of skills and techniques
Excellent (9-10): Demonstrates excellent application of skills and techniques appropriate to the art form
Good (7-8): Demonstrates good application of skills and techniques appropriate to the art form
Satisfactory (5-6): Demonstrates adequate application of skills and techniques appropriate to the art form
Needs Improvement (3-4): Demonstrates limited application of skills and techniques appropriate to the art form
Poor (1-2): Demonstrates very limited application of skills and techniques appropriate to the art form

Criterion C: Thinking creatively
Excellent (9-10): Shows excellent creative thinking in the development of ideas and artistic solutions
Good (7-8): Shows good creative thinking in the development of ideas and artistic solutions
Satisfactory (5-6): Shows adequate creative thinking in the development of ideas and artistic solutions
Needs Improvement (3-4): Shows limited creative thinking in the development of ideas and artistic solutions
Poor (1-2): Shows very limited creative thinking in the development of ideas and artistic solutions

Criterion D: Responding to artwork
Excellent (9-10): Shows excellent ability to respond to and analyze artwork from different perspectives
Good (7-8): Shows good ability to respond to and analyze artwork from different perspectives
Satisfactory (5-6): Shows adequate ability to respond to and analyze artwork from different perspectives
Needs Improvement (3-4): Shows limited ability to respond to and analyze artwork from different perspectives
Poor (1-2): Shows very limited ability to respond to and analyze artwork from different perspectives

Connections study - Assessment Criteria
Criterion A: Knowledge and understanding
Excellent (9-10): Shows thorough knowledge and understanding of artistic connections between different works and contexts
Good (7-8): Shows good knowledge and understanding of artistic connections between different works and contexts
Satisfactory (5-6): Shows adequate knowledge and understanding of artistic connections between different works and contexts
Needs Improvement (3-4): Shows limited knowledge and understanding of artistic connections between different works and contexts
Poor (1-2): Shows very limited knowledge and understanding of artistic connections between different works and contexts

Criterion B: Visual analysis
Excellent (9-10): Demonstrates excellent visual analysis skills with detailed examination of artistic elements
Good (7-8): Demonstrates good visual analysis skills with examination of artistic elements
Satisfactory (5-6): Demonstrates adequate visual analysis skills with some examination of artistic elements
Needs Improvement (3-4): Demonstrates limited visual analysis skills with minimal examination of artistic elements
Poor (1-2): Demonstrates very limited visual analysis skills with little examination of artistic elements

Criterion C: Interpretation and evaluation
Excellent (9-10): Shows excellent interpretation and evaluation of artistic works with thoughtful insights
Good (7-8): Shows good interpretation and evaluation of artistic works with insights
Satisfactory (5-6): Shows adequate interpretation and evaluation of artistic works with some insights
Needs Improvement (3-4): Shows limited interpretation and evaluation of artistic works with few insights
Poor (1-2): Shows very limited interpretation and evaluation of artistic works with minimal insights

Artist project - Assessment Criteria (HL only)
Criterion A: Conceptual understanding
Excellent (9-10): Shows thorough conceptual understanding of artistic themes and ideas with clear development
Good (7-8): Shows good conceptual understanding of artistic themes and ideas with development
Satisfactory (5-6): Shows adequate conceptual understanding of artistic themes and ideas with some development
Needs Improvement (3-4): Shows limited conceptual understanding of artistic themes and ideas with minimal development
Poor (1-2): Shows very limited conceptual understanding of artistic themes and ideas with little development

Criterion B: Technical proficiency
Excellent (9-10): Demonstrates excellent technical skills and mastery of chosen artistic medium
Good (7-8): Demonstrates good technical skills and competency in chosen artistic medium
Satisfactory (5-6): Demonstrates adequate technical skills and basic competency in chosen artistic medium
Needs Improvement (3-4): Demonstrates limited technical skills and minimal competency in chosen artistic medium
Poor (1-2): Demonstrates very limited technical skills and little competency in chosen artistic medium

Criterion C: Creative development
Excellent (9-10): Shows excellent creative development with innovative approaches and original thinking
Good (7-8): Shows good creative development with some innovative approaches and original thinking
Satisfactory (5-6): Shows adequate creative development with basic approaches and some original thinking
Needs Improvement (3-4): Shows limited creative development with few innovative approaches and minimal original thinking
Poor (1-2): Shows very limited creative development with little innovative approaches and original thinking

Resolved artworks - Internal Assessment Criteria (SL)
Criterion A: Technical skills
Excellent (9-10): Demonstrates excellent technical skills with masterful execution of artistic techniques
Good (7-8): Demonstrates good technical skills with competent execution of artistic techniques
Satisfactory (5-6): Demonstrates adequate technical skills with basic execution of artistic techniques
Needs Improvement (3-4): Demonstrates limited technical skills with minimal execution of artistic techniques
Poor (1-2): Demonstrates very limited technical skills with poor execution of artistic techniques

Criterion B: Creative thinking
Excellent (9-10): Shows excellent creative thinking with innovative solutions and original artistic expression
Good (7-8): Shows good creative thinking with some innovative solutions and artistic expression
Satisfactory (5-6): Shows adequate creative thinking with basic solutions and some artistic expression
Needs Improvement (3-4): Shows limited creative thinking with few solutions and minimal artistic expression
Poor (1-2): Shows very limited creative thinking with poor solutions and little artistic expression

Criterion C: Coherence and intention
Excellent (9-10): Shows excellent coherence with clear artistic intention and unified body of work
Good (7-8): Shows good coherence with artistic intention and mostly unified body of work
Satisfactory (5-6): Shows adequate coherence with some artistic intention and partially unified body of work
Needs Improvement (3-4): Shows limited coherence with unclear artistic intention and fragmented body of work
Poor (1-2): Shows very limited coherence with no clear artistic intention and disconnected body of work

Selected resolved artworks - Internal Assessment Criteria (HL)
Criterion A: Technical skills
Excellent (9-10): Demonstrates excellent technical skills with masterful execution across multiple artistic techniques
Good (7-8): Demonstrates good technical skills with competent execution across artistic techniques
Satisfactory (5-6): Demonstrates adequate technical skills with basic execution across some artistic techniques
Needs Improvement (3-4): Demonstrates limited technical skills with minimal execution across few artistic techniques
Poor (1-2): Demonstrates very limited technical skills with poor execution across artistic techniques

Criterion B: Creative thinking and development
Excellent (9-10): Shows excellent creative thinking with sophisticated development of innovative artistic ideas
Good (7-8): Shows good creative thinking with development of innovative artistic ideas
Satisfactory (5-6): Shows adequate creative thinking with some development of artistic ideas
Needs Improvement (3-4): Shows limited creative thinking with minimal development of artistic ideas
Poor (1-2): Shows very limited creative thinking with poor development of artistic ideas

Criterion C: Coherence and artistic intention
Excellent (9-10): Shows excellent coherence with clear and sophisticated artistic intention throughout selected works
Good (7-8): Shows good coherence with clear artistic intention throughout selected works
Satisfactory (5-6): Shows adequate coherence with some artistic intention throughout selected works
Needs Improvement (3-4): Shows limited coherence with unclear artistic intention throughout selected works
Poor (1-2): Shows very limited coherence with no clear artistic intention throughout selected works`,
    visualArtsTips: `1. Document your artistic process regularly in your Visual Arts Journal.

2. Explore a wide variety of media, techniques, and styles.

3. Research artists from diverse cultural and historical backgrounds.

4. Reflect deeply on your creative decisions and process.

5. Use subject-specific language accurately and appropriately.

6. Pay attention to how your work is curated and presented.

7. Stay consistent with deadlines to allow time for refinement.

8. Actively seek and apply feedback from peers and teachers.

9. Make intentional and meaningful connections between artworks.

10. Balance creativity with technical proficiency.`,
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'visualArtsTips'> = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'visualArtsTips'];

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
      'visualArtsTips': visualArtsTipsAnimation,
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
      'visualArtsTips': 'Visual Arts Tips',
    };
    
    const matches = sectionKeys.filter(key =>
      sectionContentStrings[key].toLowerCase().includes(trimmedQuery.toLowerCase()) ||
      sectionTitles[key].toLowerCase().includes(trimmedQuery.toLowerCase())
    );

    // Prioritize detailed rubrics if it's in the matches
    const prioritizedMatches = matches.includes('detailedRubrics') 
      ? ['detailedRubrics', ...matches.filter(m => m !== 'detailedRubrics')]
      : matches;

    setMatchingSections(prioritizedMatches);
    setCurrentMatchIndex(0);
    if (prioritizedMatches.length > 0) {
      setExpandedSection(prioritizedMatches[0]);
      
      // Auto-scroll to detailed rubrics section if it's the first match
      if (prioritizedMatches[0] === 'detailedRubrics') {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({ y: 1200, animated: true });
        }, 400);
      }
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
      'visualArtsTips': visualArtsTipsAnimation,
    }[expandedSection];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    const allSectionKeys = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'visualArtsTips'];
    allSectionKeys.forEach(key => {
      if (key !== expandedSection) {
        const anim = {
          'overview': overviewAnimation,
          'essentials': essentialsAnimation,
          'coreThemes': coreThemesAnimation,
          'detailedRubrics': detailedRubricsAnimation,
          'visualArtsTips': visualArtsTipsAnimation,
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

  const renderAnimatedContent = (section: 'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'visualArtsTips', content: React.ReactNode) => {
    const animationValue = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'coreThemes': coreThemesAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'visualArtsTips': visualArtsTipsAnimation,
    }[section];
    if (!animationValue) return null;
    return (
      <Animated.View
        style={{
          maxHeight: animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 7000],
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
    return <AppLoading />;
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
        ref={scrollViewRef}
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Visual Arts</Text>
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
                  {renderAnimatedContent(section.key as 'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'visualArtsTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      {section.key === 'overview' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 8 }}>Syllabus Overview</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText("The IB Visual Arts course encourages students to challenge their own creative and cultural expectations and boundaries. It is a thought-provoking course in which students develop analytical skills in problem-solving and divergent thinking, while working towards technical proficiency and confidence as art-makers. Students are expected to explore and compare visual arts from different perspectives and in different contexts, and through this inquiry, develop an appreciation of the expressive and aesthetic diversity in the world around them. The course is designed to equip students with the knowledge and skills to become creative thinkers and confident communicators through visual expression.", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'essentials' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Syllabus Outline and Teaching Hours</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("The course is divided into three main areas of study across both SL and HL levels: Comparative Study, Process Portfolio, and Exhibition. The teaching hours are structured as follows:\nSL: 150 hours total\nHL: 240 hours total", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Objectives in Practice</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("AO1: Demonstrate knowledge and understanding of specified content\nAO2: Apply skills and techniques effectively\nAO3: Analyse and evaluate information, artworks, and ideas\nAO4: Present information and artistic expression in a structured and appropriate format", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Outline and Weightages</Text>
                          
                          {/* SL Assessment Overview Table (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginTop: 16, marginBottom: 8 }}>SL Assessment Structure</Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Component</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Weight</Text>
                            </View>
                            {/* External Assessment */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF', backgroundColor: 'rgba(126, 195, 255, 0.06)' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, fontWeight: 'bold' }}>External Assessment</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center', fontWeight: 'bold' }}>60%</Text>
                            </View>
                            {/* Art Portfolio */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <View style={{ flex: 2, padding: 12 }}>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, fontWeight: 'bold' }}>Art Portfolio (32 marks)</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                                  Portfolio showing personal art investigations and creative development through inquiry-based learning.
                                </Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                                  • PDF file: up to 15 screens (max 3,000 words)
                                </Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                                  • Separate text file with sources
                                </Text>
                              </View>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>40%</Text>
                            </View>
                            {/* Connections Study */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <View style={{ flex: 2, padding: 12 }}>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, fontWeight: 'bold' }}>Connections Study (24 marks)</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                                  SL-only task connecting one student artwork with two works by different artists through research and cultural understanding.
                                </Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                                  • File: up to 10 screens (max 2,500 words)
                                </Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                                  • Separate text file with sources
                                </Text>
                              </View>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>20%</Text>
                            </View>
                            {/* Internal Assessment */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF', backgroundColor: 'rgba(126, 195, 255, 0.06)' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, fontWeight: 'bold' }}>Internal Assessment</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center', fontWeight: 'bold' }}>40%</Text>
                            </View>
                            {/* Completed Artworks */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <View style={{ flex: 2, padding: 12 }}>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, fontWeight: 'bold' }}>Completed Artworks (32 marks)</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                                  Five completed artworks demonstrating coherent artistic intentions with written rationale explaining creative choices.
                                </Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                                  • Five image/video files (max 3 mins each) with details
                                </Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                                  • PDF rationale: up to 2 screens (max 700 words)
                                </Text>
                              </View>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}></Text>
                            </View>
                          </View>
                          
                          {/* HL Assessment Overview Table (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginTop: 24, marginBottom: 8 }}>HL Assessment Structure</Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Component</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Weight</Text>
                            </View>
                            {/* External Assessment */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF', backgroundColor: 'rgba(126, 195, 255, 0.06)' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, fontWeight: 'bold' }}>External Assessment</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center', fontWeight: 'bold' }}>60%</Text>
                            </View>
                            {/* Art-making inquiries portfolio */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <View style={{ flex: 2, padding: 12 }}>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, fontWeight: 'bold' }}>Art-making inquiries portfolio (32 marks)</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                                  SL and HL task focusing on student's art-making as inquiry with visual evidence of personal investigations and creative discoveries.
                                </Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                                  • PDF file: up to 15 screens (max 3,000 words)
                                </Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                                  • Separate text file with sources
                                </Text>
                              </View>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>30%</Text>
                            </View>
                            {/* Artist project */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <View style={{ flex: 2, padding: 12 }}>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, fontWeight: 'bold' }}>Artist project (40 marks)</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                                  HL-only standalone task where students create and situate an artwork within a chosen context, connecting with at least two works by different artists.
                                </Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                                  • PDF file: up to 12 screens (max 2,500 words)
                                </Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                                  • Video file: up to 3 minutes with artwork details (max 100 words)
                                </Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                                  • Separate text file with sources
                                </Text>
                              </View>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>30%</Text>
                            </View>
                            {/* Internal Assessment */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF', backgroundColor: 'rgba(126, 195, 255, 0.06)' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, fontWeight: 'bold' }}>Internal Assessment</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center', fontWeight: 'bold' }}>40%</Text>
                            </View>
                            {/* Selected resolved artworks */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <View style={{ flex: 2, padding: 12 }}>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, fontWeight: 'bold' }}>Selected resolved artworks (40 marks)</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                                  HL-only task creating a coherent body of work with five selected artworks demonstrating artistic intentions and synthesis of concept and form.
                                </Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                                  • Five image/video files (max 3 mins each) with details
                                </Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 12, marginTop: 4, lineHeight: 16 }}>
                                  • PDF rationale: up to 8 screens (max 700 words) and five artwork texts (max 1,000 words total)
                                </Text>
                              </View>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}></Text>
                            </View>
                          </View>
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
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>{highlightText("Artistic intention, Techniques, Visual language", highlightedText)}</Text>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>{highlightText("Comparative Study, Process Portfolio, Exhibition", highlightedText)}</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>{highlightText("Cultural, Historical, Contemporary, Personal", highlightedText)}</Text>
                            </View>
                          </View>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8 }}>Comparative Study Assessment Framework</Text>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginBottom: 16 }}>{highlightText("The Comparative Study component uses specific evaluation criteria with varying point allocations. Assessment areas include:", highlightedText)}</Text>
                          
                          {/* Assessment Framework Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
                            {/* Header Row */}
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Assessment Area</Text>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Focus</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Points</Text>
                            </View>
                            
                            {/* Data Rows */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>{highlightText("Factual Information", highlightedText)}</Text>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>{highlightText("Accurate and relevant information about artworks and their contexts", highlightedText)}</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>0-6</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>{highlightText("Analysis and Evaluation", highlightedText)}</Text>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>{highlightText("Comparative analysis and evaluation of artworks", highlightedText)}</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>0-12</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>{highlightText("Making Connections", highlightedText)}</Text>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>{highlightText("Connections between own work and investigated work", highlightedText)}</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>0-6</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>{highlightText("Presentation and Subject-Specific Language", highlightedText)}</Text>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>{highlightText("Effective visual presentation and use of terminology", highlightedText)}</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>0-6</Text>
                            </View>
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>{highlightText("HL only: Curatorial Rationale", highlightedText)}</Text>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>{highlightText("Presentation of intention and curatorial decisions", highlightedText)}</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>0-4</Text>
                            </View>
                          </View>
                          
                          {/* Art-making inquiries portfolio Criteria Table (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginTop: 24, marginBottom: 8 }}>Art-making inquiries portfolio - Assessment Criteria</Text>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginBottom: 16, fontStyle: 'italic' }}>
                            {highlightText("Weighting: SL 40% HL 30%", highlightedText)}
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
                            {/* Header Row */}
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Criterion</Text>
                              <Text style={{ flex: 4, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Evidence Requirements</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Marks</Text>
                              <Text style={{ flex: 1.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Objective</Text>
                            </View>
                            
                            {/* Criterion A */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>A: Exploration and experimentation</Text>
                              <Text style={{ flex: 4, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Trying different art techniques and materials to create your own personal artistic style</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>8</Text>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Investigate</Text>
                            </View>
                            
                            {/* Criterion B */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>B: Practical investigation</Text>
                              <Text style={{ flex: 4, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Looking at and learning from other artists' work to improve your own art</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>8</Text>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Investigate</Text>
                            </View>
                            
                            {/* Criterion C */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>C: Lines of inquiry</Text>
                              <View style={{ flex: 4, padding: 12 }}>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>
                                  • Using guiding questions or ideas to drive your artwork
                                </Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, marginTop: 4 }}>
                                  • Showing how your art evolved by following specific themes or questions
                                </Text>
                              </View>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>8</Text>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Generate</Text>
                            </View>
                            
                            {/* Criterion D */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>D: Critical review</Text>
                              <View style={{ flex: 4, padding: 12 }}>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>
                                  • Thinking deeply about your work
                                </Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, marginTop: 4 }}>
                                  • Making changes to improve both your techniques and ideas
                                </Text>
                              </View>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>8</Text>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Refine</Text>
                            </View>
                            
                            {/* Total Row */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 2, borderColor: '#7EC3FF', backgroundColor: 'rgba(126, 195, 255, 0.1)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Total</Text>
                              <Text style={{ flex: 4, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}></Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>32</Text>
                              <Text style={{ flex: 1.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}></Text>
                            </View>
                          </View>
                          
                          {/* Connections study Criteria Table (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginTop: 24, marginBottom: 8 }}>Connections study - Assessment Criteria</Text>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginBottom: 16, fontStyle: 'italic' }}>
                            {highlightText("Weighting: SL 20%", highlightedText)}
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
                            {/* Header Row */}
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Criterion</Text>
                              <Text style={{ flex: 4, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Evidence Requirements</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Marks</Text>
                              <Text style={{ flex: 1.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Objective</Text>
                            </View>
                            
                            {/* Criterion A */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>A: Connections with context(s)</Text>
                              <Text style={{ flex: 4, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>How the student's chosen finished artwork connects to their own background and experiences</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>8</Text>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Situate</Text>
                            </View>
                            
                            {/* Criterion B */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>B: Connections with artworks</Text>
                              <Text style={{ flex: 4, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Links between the student's chosen finished artwork and at least two artworks by different artists</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>8</Text>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Situate</Text>
                            </View>
                            
                            {/* Criterion C */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>C: Investigation of cultural significance</Text>
                              <Text style={{ flex: 4, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Understanding of the cultural importance of the two artworks by different artists, selected in connection with the student's own chosen finished artwork</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>8</Text>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Investigate</Text>
                            </View>
                            
                            {/* Total Row */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 2, borderColor: '#7EC3FF', backgroundColor: 'rgba(126, 195, 255, 0.1)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Total</Text>
                              <Text style={{ flex: 4, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}></Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>24</Text>
                              <Text style={{ flex: 1.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}></Text>
                            </View>
                          </View>
                          
                          {/* Artist project Criteria Table (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginTop: 24, marginBottom: 8 }}>Artist project - Assessment Criteria (HL only)</Text>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginBottom: 16, fontStyle: 'italic' }}>
                            {highlightText("Weighting: HL 30%", highlightedText)}
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
                            {/* Header Row */}
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Criterion</Text>
                              <Text style={{ flex: 4, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Evidence Requirements</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Marks</Text>
                              <Text style={{ flex: 1.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Objectives</Text>
                            </View>
                            
                            {/* Criterion A */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>A: Proposal (up to 3 screens, max 500 words)</Text>
                              <View style={{ flex: 4, padding: 12 }}>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>
                                  • Your ideas for the project and how it fits in the chosen location
                                </Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, marginTop: 4 }}>
                                  • What you learned about the chosen location through research
                                </Text>
                              </View>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>8</Text>
                              <View style={{ flex: 1.5, padding: 12 }}>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Investigate</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Situate</Text>
                              </View>
                            </View>
                            
                            {/* Criterion B */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>B: Connections (up to 4 screens, max 1,000 words)</Text>
                              <View style={{ flex: 4, padding: 12 }}>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>
                                  • How your project connects to at least two artworks by different artists
                                </Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, marginTop: 4 }}>
                                  • Research about why at least two other artworks are culturally important to help with your project
                                </Text>
                              </View>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>8</Text>
                              <View style={{ flex: 1.5, padding: 12 }}>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Investigate</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Situate</Text>
                              </View>
                            </View>
                            
                            {/* Criterion C */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>C: Dialogues (up to 2 screens, max 500 words)</Text>
                              <Text style={{ flex: 4, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Your responses to important feedback to make your project better for the location and viewers</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>6</Text>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Refine</Text>
                            </View>
                            
                            {/* Criterion D */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>D: Curation and realization in context (up to 3 minutes of video)</Text>
                              <Text style={{ flex: 4, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Finishing your final project by combining your ideas and artistic techniques to communicate with real or potential viewers</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>10</Text>
                              <View style={{ flex: 1.5, padding: 12 }}>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Synthesize</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Curate</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Situate</Text>
                              </View>
                            </View>
                            
                            {/* Criterion E */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>E: Post-production evaluation (up to 2 screens, max 300 words)</Text>
                              <Text style={{ flex: 4, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Looking back at how well your finished project worked in the chosen location and how effectively it communicated with real or potential viewers</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>4</Text>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Situate</Text>
                            </View>
                            
                            {/* Criterion F */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>F: Future development (up to 1 screen, max 200 words)</Text>
                              <Text style={{ flex: 4, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>New directions and ideas based on what you learned from reflecting on your project</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>4</Text>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Situate</Text>
                            </View>
                            
                            {/* Total Row */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 2, borderColor: '#7EC3FF', backgroundColor: 'rgba(126, 195, 255, 0.1)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Total</Text>
                              <Text style={{ flex: 4, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}></Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>40</Text>
                              <Text style={{ flex: 1.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}></Text>
                            </View>
                          </View>
                          
                          {/* Resolved artworks Criteria Table (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginTop: 24, marginBottom: 8 }}>Resolved artworks - Internal Assessment Criteria (SL)</Text>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginBottom: 16, fontStyle: 'italic' }}>
                            {highlightText("Weighting: 40%", highlightedText)}
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
                            {/* Header Row */}
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Criterion</Text>
                              <Text style={{ flex: 4, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Evidence Requirements</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Marks</Text>
                              <Text style={{ flex: 1.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Objective</Text>
                            </View>
                            
                            {/* Criterion A */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>A: Coherence of body of artworks</Text>
                              <Text style={{ flex: 4, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>A unified collection of five finished artworks</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>8</Text>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Curate</Text>
                            </View>
                            
                            {/* Criterion B */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>B: Conceptual realization</Text>
                              <Text style={{ flex: 4, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Combining concept and form to communicate your artistic ideas</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>12</Text>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Synthesize</Text>
                            </View>
                            
                            {/* Criterion C */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>C: Technical resolution</Text>
                              <Text style={{ flex: 4, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Skillful use of materials and techniques to communicate your artistic ideas</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>12</Text>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Resolve</Text>
                            </View>
                            
                            {/* Total Row */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 2, borderColor: '#7EC3FF', backgroundColor: 'rgba(126, 195, 255, 0.1)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Total</Text>
                              <Text style={{ flex: 4, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}></Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>32</Text>
                              <Text style={{ flex: 1.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}></Text>
                            </View>
                          </View>
                          
                          {/* Selected resolved artworks Criteria Table (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginTop: 24, marginBottom: 8 }}>Selected resolved artworks - Internal Assessment Criteria (HL)</Text>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginBottom: 16, fontStyle: 'italic' }}>
                            {highlightText("Weighting: 40%", highlightedText)}
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
                            {/* Header Row */}
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Criterion</Text>
                              <Text style={{ flex: 4, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Evidence Requirements</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Marks</Text>
                              <Text style={{ flex: 1.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Objective</Text>
                            </View>
                            
                            {/* Criterion A */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>A: Coherence of body of selected artworks</Text>
                              <View style={{ flex: 4, padding: 12 }}>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>
                                  • The process of choosing five finished artworks from your broader collection of work
                                </Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, marginTop: 4 }}>
                                  • A unified collection of five chosen finished artworks
                                </Text>
                              </View>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>8</Text>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Curate</Text>
                            </View>
                            
                            {/* Criterion B */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>B: Conceptual realization</Text>
                              <Text style={{ flex: 4, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Combining concept and form to communicate your artistic ideas</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>12</Text>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Synthesize</Text>
                            </View>
                            
                            {/* Criterion C */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>C: Technical resolution</Text>
                              <Text style={{ flex: 4, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Skillful use of materials and techniques to communicate your artistic ideas</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>12</Text>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Resolve</Text>
                            </View>
                            
                            {/* Criterion D */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>D: Understanding of artistic context</Text>
                              <Text style={{ flex: 4, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Thoughtful analysis to place each of the chosen five finished artworks in their proper setting</Text>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>8</Text>
                              <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, lineHeight: 18 }}>Situate</Text>
                            </View>
                            
                            {/* Total Row */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 2, borderColor: '#7EC3FF', backgroundColor: 'rgba(126, 195, 255, 0.1)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Total</Text>
                              <Text style={{ flex: 4, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}></Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>40</Text>
                              <Text style={{ flex: 1.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}></Text>
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
                title="Visual Arts Tips"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('visualArtsTips')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'visualArtsTips' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'visualArtsTips' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('visualArtsTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText(sectionContentStrings.visualArtsTips, highlightedText)}</Text>
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
              subject: 'VISUAL_ARTS', 
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

export default VisualArtsScreen; 