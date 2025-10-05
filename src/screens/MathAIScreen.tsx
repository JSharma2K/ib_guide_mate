import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated, Platform, ImageBackground, TouchableOpacity } from 'react-native';
import { Text, Card, List, Searchbar, Button as PaperButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, gradientColors, styles as themeStyles } from '../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

type MathAIScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MathAI'>;

type Props = {
  navigation: MathAIScreenNavigationProp;
  route: any;
};

const highlightText = (text: string, highlightedText: string) => {
  if (!highlightedText) return text;
  const parts = text.split(new RegExp(`(${highlightedText})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === highlightedText.toLowerCase() ?
      <Text key={i} style={themeStyles.highlightedText}>{part}</Text> :
      part
  );
};

const RubricTable = ({ data, highlightedText }: { data: { criterion: string; summary: string; max: number }[]; highlightedText: string }) => (
  <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
    <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
      <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1.6, padding: 8 }}>Criterion</Text>
      <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.3, padding: 8 }}>Descriptor Summary</Text>
      <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Max</Text>
    </View>
    {data.map((row, idx) => (
      <View key={idx} style={{ flexDirection: 'row', borderTopWidth: idx === 0 ? 0 : 1, borderColor: '#7EC3FF' }}>
        <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.criterion, highlightedText)}</Text>
        <Text style={{ flex: 2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.summary, highlightedText)}</Text>
        <Text style={{ flex: 0.5, color: '#B6B6B6', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular' }}>{highlightText(String(row.max), highlightedText)}</Text>
      </View>
    ))}
  </View>
);

const MathAIScreen: React.FC<Props> = ({ navigation, route }) => {
  const userType = route?.params?.userType || 'student';
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [highlightedText, setHighlightedText] = useState('');
  const [matchingSections, setMatchingSections] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Animation values for each section
  const overviewAnimation = useRef(new Animated.Value(0)).current;
  const topicsAnimation = useRef(new Animated.Value(0)).current;
  const essentialsAnimation = useRef(new Animated.Value(0)).current;
  const rubricsAnimation = useRef(new Animated.Value(0)).current;
  const mathematicsAIAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  const sectionContentStrings: Record<'overview' | 'topics' | 'essentials' | 'rubrics' | 'mathematicsAI', string> = {
    overview: `Mathematics: Applications and Interpretation is a course that focuses on mathematical modeling and the use of technology to solve real-world problems.`,
    topics: `• Number and Algebra\n• Functions\n• Geometry and Trigonometry\n• Statistics and Probability\n• Calculus\n• Discrete Mathematics\n• Further Statistics\n• Further Calculus` ,
    essentials: `Topics (SL/HL):\n• Number & Algebra (16/29)\n• Functions (31/42)\n• Geometry (18/46)\n• Statistics (36/52)\n• Calculus (19/41)\nAssessment Outline\n• Paper 1 (90m): 40%\n• Paper 2 (90m): 40%\n• IA: 20%\n• Paper 1 (120m): 30%\n• Paper 2 (120m): 30%\n• Paper 3 (75m): 20%\n• IA: 20%\nIA Rubrics (same as AA)\n• A: Presentation (4)\n• B: Mathematical communication (4)\n• C: Personal engagement (4)\n• D: Reflection (3)\n• E: Use of mathematics (5)\nAssessment Objectives in Practice\n• Emphasis on technology, modeling, and real-world applications`,
    rubrics: `Papers 1 2 3: Assessed via mark schemes not fixed rubrics. Real-world application and modeling, Correct use of technology GDC, Interpretation of data and results, Accuracy and mathematical reasoning, For HL Paper 3 emphasis on extended contextual problems. Internal Assessment Criteria SL and HL The investigation is internally assessed by the teacher and externally moderated using assessment criteria that relate to the objectives for mathematics. Each investigation is assessed against the following five criteria. The final mark for each investigation is the sum of the scores for each criterion. The maximum possible final mark is 20. Students will not receive a grade for their mathematics course if they have not submitted an investigation. Criterion A Presentation Criterion B Mathematical communication Criterion C Personal engagement Criterion D Reflection Criterion E Use of mathematics. Criterion A Presentation Achievement level 0 The investigation does not reach the standard described by the descriptors below. Achievement level 1 The investigation has some structure or some organization. Achievement level 2 The investigation has some structure and shows some organization. Achievement level 3 The investigation is structured and well organized. Achievement level 4 The investigation is structured, well organized, and concise. Criterion B Mathematical communication Achievement level 0 The investigation does not reach the standard described by the descriptors below. Achievement level 1 The investigation contains some relevant mathematical communication which is partially appropriate. Achievement level 2 The investigation contains some relevant appropriate mathematical communication. Achievement level 3 The mathematical communication is relevant, appropriate and is mostly consistent. Achievement level 4 The mathematical communication is relevant, appropriate and consistent throughout. Criterion C Personal engagement Achievement level 0 The investigation does not reach the standard described by the descriptors below. Achievement level 1 There is evidence of some personal engagement. Achievement level 2 There is evidence of significant personal engagement. Achievement level 3 There is evidence of outstanding personal engagement. Criterion D Reflection Achievement level 0 The investigation does not reach the standard described by the descriptors below. Achievement level 1 There is evidence of limited reflection. Achievement level 2 There is evidence of meaningful reflection. Achievement level 3 There is substantial evidence of critical reflection. Criterion E Use of mathematics SL Achievement level 0 The investigation does not reach the standard described by the descriptors below. Achievement level 1 Some relevant mathematics is used. Achievement level 2 Some relevant mathematics is used. Limited understanding is demonstrated. Achievement level 3 Relevant mathematics appropriate with the level of the course is used. Limited understanding is demonstrated. Achievement level 4 Relevant mathematics appropriate with the level of the course is used. The mathematics investigated is partially correct. Some knowledge and understanding are demonstrated. Achievement level 5 Relevant mathematics appropriate with the level of the course is used. The mathematics investigated is mostly correct. Good knowledge and understanding are demonstrated. Achievement level 6 Relevant mathematics appropriate with the level of the course is used. The mathematics investigated is correct. Thorough knowledge and understanding are demonstrated. Criterion E Use of mathematics HL Achievement level 0 The investigation does not reach the standard described by the descriptors below. Achievement level 1 Some relevant mathematics is used. Limited understanding is demonstrated. Achievement level 2 Some relevant mathematics is used. The mathematics investigated is partially correct. Some knowledge and understanding is demonstrated. Achievement level 3 Relevant mathematics appropriate with the level of the course is used. The mathematics investigated is correct. Some knowledge and understanding are demonstrated. Achievement level 4 Relevant mathematics appropriate with the level of the course is used. The mathematics investigated is correct. Good knowledge and understanding are demonstrated. Achievement level 5 Relevant mathematics appropriate with the level of the course is used. The mathematics investigated is correct and demonstrates sophistication or rigour. Thorough knowledge and understanding are demonstrated. Achievement level 6 Relevant mathematics appropriate with the level of the course is used. The mathematics investigated is precise and demonstrates sophistication and rigour. Thorough knowledge and understanding are demonstrated.`,
    mathematicsAI: `Mathematics AI Master your GDC and practice statistical functions thoroughly. Focus on real-world interpretation and contextual reasoning. Choose an IA topic with real, observable data. Support your reasoning visually with graphs and diagrams. Use your tech tools for clarity—not shortcuts. Practice interpreting data trends, outliers, and limitations. Use the formula booklet during every mock/practice exam. Focus on understanding over memorizing procedures. Define and explain your logic clearly in all written responses. Think like a data analyst—what does your analysis reveal?`,
  };
  const sectionKeys: Array<'overview' | 'topics' | 'essentials' | 'rubrics' | 'mathematicsAI'> = ['overview', 'topics', 'essentials', 'rubrics', 'mathematicsAI'];

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const fadeThreshold = 50; // Start fading after 50px scroll
    
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
      'topics': topicsAnimation,
      'essentials': essentialsAnimation,
      'rubrics': rubricsAnimation,
      'mathematicsAI': mathematicsAIAnimation,
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
    // Trim whitespace from the query for searching and highlighting
    const trimmedQuery = query.trim();
    setHighlightedText(trimmedQuery);
    if (!trimmedQuery) {
      setMatchingSections([]);
      setCurrentMatchIndex(0);
      setExpandedSection(null);
      return;
    }
    
    // Define section titles for matching
    const sectionTitles = {
      'overview': 'Course Overview',
      'topics': 'Topics',
      'essentials': 'Subject Essentials',
      'rubrics': 'Detailed Rubrics',
      'mathematicsAI': 'Mathematics AI'
    };
    
    // Find all sections that match content or title
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

  // Ensure expandedSection always matches the current match, even on first search
  React.useEffect(() => {
    if (matchingSections.length > 0) {
      setExpandedSection(matchingSections[currentMatchIndex]);
    } else {
      setExpandedSection(null);
    }
  }, [currentMatchIndex, matchingSections]);

  // When expandedSection changes, trigger the animation for that section
  React.useEffect(() => {
    if (!expandedSection) return;
    const animationValue = {
      'overview': overviewAnimation,
      'topics': topicsAnimation,
      'essentials': essentialsAnimation,
      'rubrics': rubricsAnimation,
      'mathematicsAI': mathematicsAIAnimation,
    }[expandedSection];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    // Collapse all other sections
    sectionKeys.forEach(key => {
      if (key !== expandedSection) {
        const anim = {
          'overview': overviewAnimation,
          'topics': topicsAnimation,
          'essentials': essentialsAnimation,
          'rubrics': rubricsAnimation,
          'mathematicsAI': mathematicsAIAnimation,
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

  const renderAnimatedContent = (section: string, content: React.ReactNode) => {
    const animationValue = {
      'overview': overviewAnimation,
      'topics': topicsAnimation,
      'essentials': essentialsAnimation,
      'rubrics': rubricsAnimation,
      'mathematicsAI': mathematicsAIAnimation,
    }[section];
    if (!animationValue) return null;
    return (
      <Animated.View
        style={{
          maxHeight: animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 10000],
          }),
          opacity: animationValue,
          overflow: 'hidden',
        }}
      >
        {content}
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
      {/* Home icon top left */}
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>Mathematics: Applications and Interpretation</Text>
            <Text style={{ fontSize: 16, color: '#8A97A7', fontFamily: 'ScopeOne-Regular', marginBottom: 12 }}>Group 5: Mathematics</Text>
            <View style={{ height: 2, backgroundColor: '#7EC3FF', marginBottom: 8 }} />
          </View>
          {/* Dropdowns */}
          {[{ key: 'overview', title: 'Course Overview' }, { key: 'topics', title: 'Topics' }, { key: 'essentials', title: 'Subject Essentials' }, { key: 'rubrics', title: 'Detailed Rubrics' }].map((section, idx, arr) => (
            <View key={section.key}>
              <List.Item
                title={() => (
                  <Text style={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}>
                    {highlightText(section.title, highlightedText)}
                  </Text>
                )}
                onPress={() => toggleSection(section.key)}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === section.key ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === section.key && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent(section.key, (
                    <View style={{ backgroundColor: 'rgba(24,26,32,0.92)', borderRadius: 12, padding: 16, marginTop: 8 }}>
                      {/* Section content logic as before */}
                      {section.key === 'overview' && (
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }}>{highlightText(sectionContentStrings.overview, highlightedText)}</Text>
                      )}
                      {section.key === 'topics' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Core Topics</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }}>{highlightText("• Number and Algebra\n• Functions\n• Geometry and Trigonometry\n• Statistics and Probability\n• Calculus", highlightedText)}</Text>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Additional HL Topics</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }}>{highlightText("• Discrete Mathematics\n• Further Statistics\n• Further Calculus", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'essentials' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Syllabus Overview</Text>
                          <View style={themeStyles.criterionContainer}>
                            <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }}>{highlightText("Topics (SL/HL):", highlightedText)}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Number & Algebra (16/29)\n• Functions (31/42)\n• Geometry (18/46)\n• Statistics (36/52)\n• Calculus (19/41)", highlightedText)}</Text>
                          </View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Assessment Outline</Text>
                          <View style={themeStyles.criterionContainer}>
                            <Text style={{ ...themeStyles.levelTitle, color: '#7EC3FF', fontFamily: 'ScopeOne-Regular' }}>Standard Level (SL)</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Paper 1 (90m): 40%\n• Paper 2 (90m): 40%\n• IA: 20%", highlightedText)}</Text>
                            <Text style={{ ...themeStyles.levelTitle, color: '#7EC3FF', fontFamily: 'ScopeOne-Regular' }}>Higher Level (HL)</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Paper 1 (120m): 30%\n• Paper 2 (120m): 30%\n• Paper 3 (75m): 20%\n• IA: 20%", highlightedText)}</Text>
                          </View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>IA Rubrics (same as AA)</Text>
                          <View style={themeStyles.criterionContainer}>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• A: Presentation (4)", highlightedText)}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• B: Mathematical communication (4)", highlightedText)}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• C: Personal engagement (4)", highlightedText)}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• D: Reflection (3)", highlightedText)}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• E: Use of mathematics (5)", highlightedText)}</Text>
                          </View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Assessment Objectives in Practice</Text>
                          <View style={themeStyles.criterionContainer}>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Emphasis on technology, modeling, and real-world applications", highlightedText)}</Text>
                          </View>
                        </View>
                      )}
                      {section.key === 'rubrics' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Papers 1, 2, 3</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', lineHeight: 22 }}>{highlightText('Assessed via mark schemes, not fixed rubrics.\n\nRewarded elements include:\n• Real-world application and modeling\n• Correct use of technology (GDC)\n• Interpretation of data and results\n• Accuracy and mathematical reasoning\n• For HL Paper 3: emphasis on extended contextual problems', highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 18 }}>Internal Assessment Criteria—SL and HL</Text>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', lineHeight: 22, marginBottom: 16 }}>
                            {highlightText('The investigation is internally assessed by the teacher and externally moderated using assessment criteria that relate to the objectives for mathematics.', highlightedText)}
                          </Text>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', lineHeight: 22, marginBottom: 16 }}>
                            {highlightText('Each investigation is assessed against the following five criteria. The final mark for each investigation is the sum of the scores for each criterion. The maximum possible final mark is 20.', highlightedText)}
                          </Text>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', lineHeight: 22, marginBottom: 16, fontWeight: 'bold' }}>
                            {highlightText('Students will not receive a grade for their mathematics course if they have not submitted an investigation.', highlightedText)}
                          </Text>
                          
                          {/* Internal Assessment Criteria Overview Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginTop: 12, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8 }}>Criterion</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2, padding: 8 }}>Focus Area</Text>
                            </View>
                            
                            {/* Criterion A */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>{highlightText('Criterion A', highlightedText)}</Text>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('Presentation', highlightedText)}</Text>
                            </View>
                            
                            {/* Criterion B */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>{highlightText('Criterion B', highlightedText)}</Text>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('Mathematical communication', highlightedText)}</Text>
                            </View>
                            
                            {/* Criterion C */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>{highlightText('Criterion C', highlightedText)}</Text>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('Personal engagement', highlightedText)}</Text>
                            </View>
                            
                            {/* Criterion D */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>{highlightText('Criterion D', highlightedText)}</Text>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('Reflection', highlightedText)}</Text>
                            </View>
                            
                            {/* Criterion E */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>{highlightText('Criterion E', highlightedText)}</Text>
                              <Text style={{ flex: 2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('Use of mathematics', highlightedText)}</Text>
                            </View>
                          </View>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 8 }}>Criterion A: Presentation</Text>
                          
                          {/* Criterion A: Presentation Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginTop: 12, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Achievement level</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Descriptor</Text>
                            </View>
                            
                            {/* Level 0 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('0', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('The investigation does not reach the standard described by the descriptors below.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 1 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('1', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('The investigation has some structure or some organization.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 2 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('2', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('The investigation has some structure and shows some organization.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 3 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('3', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('The investigation is structured and well organized.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 4 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('4', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('The investigation is structured, well organized, and concise.', highlightedText)}</Text>
                            </View>
                          </View>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 8 }}>Criterion B: Mathematical communication</Text>
                          
                          {/* Criterion B: Mathematical communication Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginTop: 12, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Achievement level</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Descriptor</Text>
                            </View>
                            
                            {/* Level 0 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('0', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('The investigation does not reach the standard described by the descriptors below.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 1 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('1', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('The investigation contains some relevant mathematical communication which is partially appropriate.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 2 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('2', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('The investigation contains some relevant appropriate mathematical communication.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 3 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('3', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('The mathematical communication is relevant, appropriate and is mostly consistent.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 4 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('4', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('The mathematical communication is relevant, appropriate and consistent throughout.', highlightedText)}</Text>
                            </View>
                          </View>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 8 }}>Criterion C: Personal engagement</Text>
                          
                          {/* Criterion C: Personal engagement Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginTop: 12, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Achievement level</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Descriptor</Text>
                            </View>
                            
                            {/* Level 0 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('0', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('The investigation does not reach the standard described by the descriptors below.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 1 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('1', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('There is evidence of some personal engagement.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 2 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('2', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('There is evidence of significant personal engagement.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 3 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('3', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('There is evidence of outstanding personal engagement.', highlightedText)}</Text>
                            </View>
                          </View>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 8 }}>Criterion D: Reflection</Text>
                          
                          {/* Criterion D: Reflection Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginTop: 12, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Achievement level</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Descriptor</Text>
                            </View>
                            
                            {/* Level 0 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('0', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('The investigation does not reach the standard described by the descriptors below.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 1 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('1', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('There is evidence of limited reflection.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 2 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('2', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('There is evidence of meaningful reflection.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 3 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('3', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('There is substantial evidence of critical reflection.', highlightedText)}</Text>
                            </View>
                          </View>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 8 }}>Criterion E: Use of mathematics—SL</Text>
                          
                          {/* Criterion E: Use of mathematics SL Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginTop: 12, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Achievement level</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Descriptor</Text>
                            </View>
                            
                            {/* Level 0 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('0', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('The investigation does not reach the standard described by the descriptors below.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 1 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('1', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('Some relevant mathematics is used.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 2 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('2', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('Some relevant mathematics is used. Limited understanding is demonstrated.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 3 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('3', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('Relevant mathematics appropriate with the level of the course is used. Limited understanding is demonstrated.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 4 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('4', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('Relevant mathematics appropriate with the level of the course is used. The mathematics investigated is partially correct. Some knowledge and understanding are demonstrated.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 5 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('5', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('Relevant mathematics appropriate with the level of the course is used. The mathematics investigated is mostly correct. Good knowledge and understanding are demonstrated.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 6 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('6', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('Relevant mathematics appropriate with the level of the course is used. The mathematics investigated is correct. Thorough knowledge and understanding are demonstrated.', highlightedText)}</Text>
                            </View>
                          </View>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 8 }}>Criterion E: Use of mathematics—HL</Text>
                          
                          {/* Criterion E: Use of mathematics HL Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginTop: 12, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Achievement level</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Descriptor</Text>
                            </View>
                            
                            {/* Level 0 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('0', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('The investigation does not reach the standard described by the descriptors below.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 1 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('1', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('Some relevant mathematics is used. Limited understanding is demonstrated.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 2 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('2', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('Some relevant mathematics is used. The mathematics investigated is partially correct. Some knowledge and understanding is demonstrated.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 3 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('3', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('Relevant mathematics appropriate with the level of the course is used. The mathematics investigated is correct. Some knowledge and understanding are demonstrated.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 4 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('4', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('Relevant mathematics appropriate with the level of the course is used. The mathematics investigated is correct. Good knowledge and understanding are demonstrated.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 5 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('5', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('Relevant mathematics appropriate with the level of the course is used. The mathematics investigated is correct and demonstrates sophistication or rigour. Thorough knowledge and understanding are demonstrated.', highlightedText)}</Text>
                            </View>
                            
                            {/* Level 6 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText('6', highlightedText)}</Text>
                              <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('Relevant mathematics appropriate with the level of the course is used. The mathematics investigated is precise and demonstrates sophistication and rigour. Thorough knowledge and understanding are demonstrated.', highlightedText)}</Text>
                            </View>
                          </View>
                          <Text style={{ 
                            fontSize: 11, 
                            color: 'rgba(255, 255, 255, 0.5)', 
                            fontFamily: 'ScopeOne-Regular', 
                            marginTop: 16, 
                            textAlign: 'center',
                            fontStyle: 'italic'
                          }}>
                            *This is interpreted material for educational guidance and not official assessment criteria.
                          </Text>
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
            
            {/* Mathematics AI dropdown */}
            <View>
              <List.Item
                title="Mathematics AI"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('mathematicsAI')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'mathematicsAI' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'mathematicsAI' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('mathematicsAI', (
                    <View style={{ backgroundColor: 'rgba(24,26,32,0.92)', borderRadius: 12, padding: 16, marginTop: 8 }}>
                      <View>
                        {[
                          "Master your GDC and practice statistical functions thoroughly.",
                          "Focus on real-world interpretation and contextual reasoning.",
                          "Choose an IA topic with real, observable data.",
                          "Support your reasoning visually with graphs and diagrams.",
                          "Use your tech tools for clarity—not shortcuts.",
                          "Practice interpreting data trends, outliers, and limitations.",
                          "Use the formula booklet during every mock/practice exam.",
                          "Focus on understanding over memorizing procedures.",
                          "Define and explain your logic clearly in all written responses.",
                          "Think like a data analyst—what does your analysis reveal?"
                        ].map((tip, idx) => (
                          <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                            <Text style={{ color: '#7EC3FF', fontSize: 16, marginRight: 8, lineHeight: 24, fontFamily: 'ScopeOne-Regular' }}>{idx + 1}.</Text>
                            <Text style={[themeStyles.content, { flex: 1, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }]}>{highlightText(tip, highlightedText)}</Text>
                          </View>
                        ))}
                      </View>
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
        
        {/* Predict Your Grade Button */}
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
              subject: 'MATH AI',
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

        {/* Disclaimer */}
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

export default MathAIScreen; 