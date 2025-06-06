import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated, StatusBar, ImageBackground } from 'react-native';
import { Text, Card, List, Searchbar, Button as PaperButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, gradientColors, styles as themeStyles } from '../theme/theme';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
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

const EnglishALiteratureScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const userType = route?.params?.userType || 'student';
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [highlightedText, setHighlightedText] = useState('');
  const [matchingSections, setMatchingSections] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Animation values for each section
  const overviewAnimation = useRef(new Animated.Value(0)).current;
  const essentialsAnimation = useRef(new Animated.Value(0)).current;
  const literatureAnimation = useRef(new Animated.Value(0)).current;
  const detailedRubricsAnimation = useRef(new Animated.Value(0)).current;
  const englishLiteratureAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  // Section keys and content for search
  const sectionContentStrings: Record<'overview' | 'essentials' | 'literature' | 'detailedRubrics' | 'englishLiterature', string> = {
    overview: `English A: Literature is a course that focuses on the study of literary texts. It is designed for students who are interested in developing their understanding of literature and literary criticism. The course emphasizes the development of critical thinking and analytical skills through the study of a wide range of literary works from different periods, styles, and genres.`,
    essentials: `1. Syllabus Outline & Teaching Hours\nSL: 9 works required\nHL: 13 works required\nAreas of Exploration (SL/HL Hours):\n- Readers, Writers, and Texts: 50 / 80 hours\n- Time and Space: 50 / 80 hours\n- Intertextuality: Connecting Texts: 50 / 80 hours\nTotal: 150 SL / 240 HL hours\n\n2. Assessment Objectives in Practice\nObjective 1 - Know, understand, interpret:\n- Applied in all assessments: Paper 1, Paper 2, HL Essay, Individual Oral\nObjective 2 - Analyse and evaluate:\n- Focus on how language creates meaning; present in all components\nObjective 3 - Communicate:\n- Formal, organized, fluent delivery in all written and oral assessments\n\n3. Assessment Outline & Weightage\nSL:\n- Paper 1 (Guided Literary Analysis, 1 text): 35%\n- Paper 2 (Comparative Essay): 35%\n- Individual Oral: 30%\nHL:\n- Paper 1 (Guided Literary Analysis, 2 texts): 35%\n- Paper 2 (Comparative Essay): 25%\n- Individual Oral: 20%\n- HL Essay (1200-1500 words): 20%`,
    literature: `Works in Translation\n• Study of works originally written in languages other than English\n• Focus on cultural and historical context\n• Development of intercultural understanding\nWorks in English\n• Study of works written in English\n• Focus on literary techniques and devices\n• Development of critical analysis skills`,
    detailedRubrics: `Language A Literature Paper 1: How well you understand and interpret the text, How effectively you analyze literary techniques and evaluate their impact, How well-structured and focused your response is, Quality of your writing style and expression. Language A Literature Paper 2: Depth of knowledge about your chosen works and literary concepts, Quality of comparative analysis and critical evaluation, Clear thesis logical structure and sustained argument. Language A Literature Individual Oral: Understanding of texts and how they connect to your global issue, Analysis of literary choices and their effects on meaning, Clear structure and coherent presentation of ideas, Fluent delivery and appropriate use of literary terminology. Literature and Performance Written Assignment: Understanding of the text and performance concepts, Analysis of how performance choices affect meaning, Well-organized response with clear connections, Clear and effective written communication, Insightful analysis of performance elements and staging. Literature and Performance Internal Assessment: Knowledge of text and understanding of performance context, Critical analysis of literary and performance elements, Quality of your actual performance and interpretation, Effectiveness of your spoken presentation and discussion.`,
    englishLiterature: `English Literature Anchor analysis in the 7 key concepts: identity, culture, etc. Understand how translation affects meaning in works in translation. Contextualize your interpretations with cultural and historical insights. Practice Paper 2 comparative essays with real past prompts. Apply literary theory (e.g., Feminist, Marxist) effectively in the HL Essay. Quote briefly and analyze deeply—avoid overuse of textual evidence. Choose your global issue for the IO wisely and justify its relevance. Use the Learner Portfolio to explore and connect ideas between works. Focus on authorial choices, not just the story. Develop your comparative thinking—track both similarities and contrasts.`,
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'literature' | 'detailedRubrics' | 'englishLiterature'> = ['overview', 'essentials', 'literature', 'detailedRubrics', 'englishLiterature'];

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
      'essentials': essentialsAnimation,
      'literature': literatureAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'englishLiterature': englishLiteratureAnimation,
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
      'essentials': 'Subject Essentials', 
      'literature': 'Prescribed Literature',
      'detailedRubrics': 'Detailed Rubrics',
      'englishLiterature': 'English Literature',
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
  useEffect(() => {
    if (matchingSections.length > 0) {
      setExpandedSection(matchingSections[currentMatchIndex]);
    } else {
      setExpandedSection(null);
    }
  }, [currentMatchIndex, matchingSections]);

  // When expandedSection changes, trigger the animation for that section
  useEffect(() => {
    if (!expandedSection) return;
    const animationValue = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'literature': literatureAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'englishLiterature': englishLiteratureAnimation,
    }[expandedSection];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    // Collapse all other sections
    const allSectionKeys = ['overview', 'essentials', 'literature', 'detailedRubrics', 'englishLiterature'];
    allSectionKeys.forEach(key => {
      if (key !== expandedSection) {
        const anim = {
          'overview': overviewAnimation,
          'essentials': essentialsAnimation,
          'literature': literatureAnimation,
          'detailedRubrics': detailedRubricsAnimation,
          'englishLiterature': englishLiteratureAnimation,
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
      'essentials': essentialsAnimation,
      'literature': literatureAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'englishLiterature': englishLiteratureAnimation,
    }[section];
    if (!animationValue) return null;
    return (
      <Animated.View
        style={{
          maxHeight: animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 3000],
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
      {/* Custom back arrow and Home label */}
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>English A: Literature</Text>
            <Text style={{ fontSize: 16, color: '#8A97A7', fontFamily: 'ScopeOne-Regular', marginBottom: 12 }}>Group 1: Studies in Language and Literature</Text>
            <View style={{ height: 2, backgroundColor: '#7EC3FF', marginBottom: 8 }} />
          </View>
          {/* Dropdowns */}
          {[{ key: 'overview', title: 'Course Overview' }, { key: 'essentials', title: 'Subject Essentials' }, { key: 'literature', title: 'Prescribed Literature' }, { key: 'detailedRubrics', title: 'Detailed Rubrics' }].map((section, idx, arr) => (
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
                  {renderAnimatedContent(section.key, (
                    <View style={{ backgroundColor: 'transparent' }}>
                      {/* Section content logic as before */}
                      {section.key === 'overview' && (
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText(sectionContentStrings.overview, highlightedText)}</Text>
                      )}
                      {section.key === 'essentials' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>1. Syllabus Outline & Teaching Hours</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("SL: 9 works required\nHL: 13 works required\n\nAreas of Exploration (SL/HL Hours):\n- Readers, Writers, and Texts: 50 / 80 hours\n- Time and Space: 50 / 80 hours\n- Intertextuality: Connecting Texts: 50 / 80 hours\n\nTotal: 150 SL / 240 HL hours", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>2. Assessment Objectives in Practice</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("Objective 1 - Know, understand, interpret:\n- Applied in all assessments: Paper 1, Paper 2, HL Essay, Individual Oral\n\nObjective 2 - Analyse and evaluate:\n- Focus on how language creates meaning; present in all components\n\nObjective 3 - Communicate:\n- Formal, organized, fluent delivery in all written and oral assessments", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>3. Assessment Outline & Weightage</Text>
                          <Text style={{ ...themeStyles.levelTitle, color: '#7EC3FF', fontFamily: 'ScopeOne-Regular' }}>Standard Level (SL)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- Paper 1 (Guided Literary Analysis, 1 text): 35%\n- Paper 2 (Comparative Essay): 35%\n- Individual Oral: 30%", highlightedText)}</Text>
                          <Text style={{ ...themeStyles.levelTitle, color: '#7EC3FF', fontFamily: 'ScopeOne-Regular' }}>Higher Level (HL)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- Paper 1 (Guided Literary Analysis, 2 texts): 35%\n- Paper 2 (Comparative Essay): 25%\n- Individual Oral: 20%\n- HL Essay (1200-1500 words): 20%", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'literature' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Works in Translation</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Study of works originally written in languages other than English\n• Focus on cultural and historical context\n• Development of intercultural understanding", highlightedText)}</Text>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Works in English</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Study of works written in English\n• Focus on literary techniques and devices\n• Development of critical analysis skills", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          {/* Paper 1 Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginBottom: 8, color: '#7EC3FF' }}>Language A: Literature - Paper 1</Text>
                          <RubricTable
                            data={[
                              { criterion: 'A', summary: 'How well you understand and interpret the text', max: 5 },
                              { criterion: 'B', summary: 'How effectively you analyze literary techniques and evaluate their impact', max: 5 },
                              { criterion: 'C', summary: 'How well-structured and focused your response is', max: 5 },
                              { criterion: 'D', summary: 'Quality of your writing style and expression', max: 5 },
                            ]}
                            highlightedText={highlightedText}
                          />
                          {/* Paper 2 Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginTop: 24, marginBottom: 8, color: '#7EC3FF' }}>Language A: Literature - Paper 2</Text>
                          <RubricTable
                            data={[
                              { criterion: 'A', summary: 'Depth of knowledge about your chosen works and literary concepts', max: 10 },
                              { criterion: 'B', summary: 'Quality of comparative analysis and critical evaluation', max: 10 },
                              { criterion: 'C', summary: 'Clear thesis, logical structure, and sustained argument', max: 10 },
                            ]}
                            highlightedText={highlightedText}
                          />
                          {/* Individual Oral Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginTop: 24, marginBottom: 8, color: '#7EC3FF' }}>Language A: Literature - Individual Oral</Text>
                          <RubricTable
                            data={[
                              { criterion: 'A', summary: 'Understanding of texts and how they connect to your global issue', max: 10 },
                              { criterion: 'B', summary: 'Analysis of literary choices and their effects on meaning', max: 10 },
                              { criterion: 'C', summary: 'Clear structure and coherent presentation of ideas', max: 10 },
                              { criterion: 'D', summary: 'Fluent delivery and appropriate use of literary terminology', max: 10 },
                            ]}
                            highlightedText={highlightedText}
                          />
                          {/* Literature and Performance - Written Assignment Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginTop: 24, marginBottom: 8, color: '#7EC3FF' }}>Literature and Performance - Written Assignment</Text>
                          <RubricTable
                            data={[
                              { criterion: 'A', summary: 'Understanding of the text and performance concepts', max: 6 },
                              { criterion: 'B', summary: 'Analysis of how performance choices affect meaning', max: 6 },
                              { criterion: 'C', summary: 'Well-organized response with clear connections', max: 6 },
                              { criterion: 'D', summary: 'Clear and effective written communication', max: 4 },
                              { criterion: 'E', summary: 'Insightful analysis of performance elements and staging', max: 4 },
                            ]}
                            highlightedText={highlightedText}
                          />
                          {/* Literature and Performance - Internal Assessment Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginTop: 24, marginBottom: 8, color: '#7EC3FF' }}>Literature and Performance - Internal Assessment</Text>
                          <RubricTable
                            data={[
                              { criterion: 'A', summary: 'Knowledge of text and understanding of performance context', max: 8 },
                              { criterion: 'B', summary: 'Critical analysis of literary and performance elements', max: 8 },
                              { criterion: 'C', summary: 'Quality of your actual performance and interpretation', max: 8 },
                              { criterion: 'D', summary: 'Effectiveness of your spoken presentation and discussion', max: 8 },
                            ]}
                            highlightedText={highlightedText}
                          />
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
            
            {/* English Literature dropdown */}
            <View>
              <List.Item
                title="English Literature"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('englishLiterature')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'englishLiterature' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'englishLiterature' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('englishLiterature', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      {[
                        "Anchor analysis in the 7 key concepts: identity, culture, etc.",
                        "Understand how translation affects meaning in works in translation.",
                        "Contextualize your interpretations with cultural and historical insights.",
                        "Practice Paper 2 comparative essays with real past prompts.",
                        "Apply literary theory (e.g., Feminist, Marxist) effectively in the HL Essay.",
                        "Quote briefly and analyze deeply—avoid overuse of textual evidence.",
                        "Choose your global issue for the IO wisely and justify its relevance.",
                        "Use the Learner Portfolio to explore and connect ideas between works.",
                        "Focus on authorial choices, not just the story.",
                        "Develop your comparative thinking—track both similarities and contrasts."
                      ].map((tip, idx) => (
                        <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                          <Text style={{ color: '#7EC3FF', fontSize: 16, marginRight: 8, lineHeight: 24, fontFamily: 'ScopeOne-Regular' }}>{idx + 1}.</Text>
                          <Text style={[themeStyles.content, { flex: 1, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }]}>{highlightText(tip, highlightedText)}</Text>
                        </View>
                      ))}
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

export default EnglishALiteratureScreen; 