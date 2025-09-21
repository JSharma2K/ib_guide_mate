import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated, StatusBar, ImageBackground, TouchableOpacity } from 'react-native';
import { Text, Card, List, Searchbar, Button as PaperButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, gradientColors, styles as themeStyles } from '../theme/theme';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { Feather } from '@expo/vector-icons';

const escapeRegExp = (input: string) => input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const highlightText = (text: string, highlightedText: string) => {
  if (!highlightedText) return text;
  const safe = escapeRegExp(highlightedText);
  const parts = text.split(new RegExp(`(${safe})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === highlightedText.toLowerCase() ?
      <Text key={i} style={themeStyles.highlightedText}>{part}</Text> :
      part
  );
};

const RubricTable = ({ data, highlightedText }: { data: { criterion: string; summary: string; max: number }[]; highlightedText: string }) => (
  <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
    <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
      <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.4, padding: 8 }}>Criterion</Text>
      <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.1, padding: 8 }}>Descriptor Summary</Text>
      <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Max</Text>
    </View>
    {data.map((row, idx) => (
      <View key={idx} style={{ flexDirection: 'row', borderTopWidth: idx === 0 ? 0 : 1, borderColor: '#7EC3FF' }}>
        <Text style={{ flex: 2.4, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.criterion, highlightedText)}</Text>
        <Text style={{ flex: 2.1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.summary, highlightedText)}</Text>
        <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular' }}>{highlightText(String(row.max), highlightedText)}</Text>
      </View>
    ))}
  </View>
);

const HistoryScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const userType = route?.params?.userType || 'student';
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [highlightedText, setHighlightedText] = useState('');
  const [matchingSections, setMatchingSections] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const sectionYPositionsRef = useRef<Record<string, number>>({});
  const sectionAnchorsYRef = useRef<Record<string, number>>({});

  // Animation values for each section
  const overviewAnimation = useRef(new Animated.Value(0)).current;
  const essentialsAnimation = useRef(new Animated.Value(0)).current;
  const coreThemesAnimation = useRef(new Animated.Value(0)).current;
  const detailedRubricsAnimation = useRef(new Animated.Value(0)).current;
  const historyTipsAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  // Section keys and content for search
  const sectionContentStrings: Record<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'historyTips', string> = {
    overview: `The IB History course develops students' understanding of the past through critical engagement with historical sources and concepts. It emphasizes the development of historical skills such as evaluation of evidence, comparison, causation, and understanding change over time. Students explore a range of world history topics while considering multiple perspectives and interpretations.`,
    essentials: `Syllabus Outline and Teaching Hours\nSL: 150 hours\nHL: 240 hours\n\nAssessment Objectives in Practice\nAO1: Demonstrate detailed, relevant and accurate historical knowledge.\nAO2: Demonstrate understanding of historical concepts and methods.\nAO3: Analyse and evaluate historical sources and evidence.\nAO4: Construct clear, focused, and coherent arguments based on evidence.\n\nAssessment Outline and Weightage\nStandard Level (SL)\n- Paper 1: Source-based paper on prescribed subjects (1 hour) – 30%\n- Paper 2: Essay paper on world history topics (1.5 hours) – 45%\n- Internal Assessment: Historical investigation – 25%\n\nHigher Level (HL)\n- Paper 1: Source-based paper on prescribed subjects – 20%\n- Paper 2: Essay paper on world history topics – 25%\n- Paper 3: Essay paper based on regional option (2.5 hours) – 35%\n- Internal Assessment: Historical investigation – 20%\n\nInternal Assessment\nHistorical Investigation – 20 hours (SL and HL)`,
    coreThemes: `Prescribed Subjects (SL/HL)\n- Military leaders\n- Conquest and its impact\n- The move to global war\n- Rights and protest\n- Conflict and intervention\n\nWorld History Topics (SL/HL)\n- Society and economy (750–1400)\n- Causes and effects of medieval wars (750–1500)\n- Dynasties and rulers (750–1500)\n- Societies in transition (1400–1700)\n- Early Modern states (1450–1789)\n- Origins, development and impact of industrialization (1750–2005)\n- Independence movements (1800–2000)\n- Evolution and development of democratic states (1848–2000)\n- Authoritarian states (20th century)\n- Causes and effects of 20th-century wars\n- The Cold War: Superpower tensions and rivalries (20th century)\n\nHL Regional Options (HL only)\n- History of Africa and the Middle East\n- History of the Americas\n- History of Asia and Oceania\n- History of Europe`,
    detailedRubrics: `Detailed Rubrics – Internal Assessment (Historical Investigation)

Criteria A–C: Identification and evaluation of sources; Investigation; Reflection.

Also included for search coverage:
• Paper 1 — Source Questions (Ques., Description, Marks) – comprehension, source value/limits, compare/contrast, argue using sources + own knowledge
• Paper 1 — Fourth Question Markbands – bands 0, 1–3, 4–6, 7–9 with level descriptors (relevance, knowledge accuracy, analysis, synthesis)
• Paper 2 — Essay Markbands (SL/HL) – bands 0, 1–3, 4–6, 7–9, 10–12, 13–15 with descriptors (structure, knowledge, examples, evaluation)
• Paper 3 HL — External Assessment Markbands – bands 0, 1–3, 4–6, 7–9, 10–12 with descriptors (understanding question, structure, knowledge accuracy, historical context, examples, analysis, evaluation, perspectives, conclusion)`,
    historyTips: `Top 10 Study Tips for Success – History\n\n1. Familiarize yourself with historical concepts such as causation, change, and significance.\n2. Use a study timeline to organize world history topics chronologically.\n3. Practice Paper 1 by working through source-based questions under timed conditions.\n4. Develop thematic essay skills for Paper 2 by linking content across different topics.\n5. For HL, regularly write full-length essays for Paper 3 using past paper prompts.\n6. Choose a well-defined and original topic for your Historical Investigation.\n7. Evaluate sources critically, focusing on origin, purpose, value, and limitations.\n8. Make flashcards of key dates, events, and historiographical interpretations.\n9. Use planning structures (e.g., PEEL) for clear and coherent essays.\n10. Self-assess your writing against rubrics to improve clarity and analytical depth.`,
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'historyTips'> = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'historyTips'];

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

  const scrollToSection = (sectionKey: string) => {
    const y = sectionYPositionsRef.current[sectionKey];
    if (scrollViewRef.current && typeof y === 'number') {
      const offset = 96;
      scrollViewRef.current.scrollTo({ y: Math.max(y - offset, 0), animated: true });
    }
  };

  const scrollToY = (y: number) => {
    if (scrollViewRef.current && typeof y === 'number') {
      const offset = 96;
      scrollViewRef.current.scrollTo({ y: Math.max(y - offset, 0), animated: true });
    }
  };

  const registerSectionAnchor = (sectionKey: string, anchorKey: string, yWithinSection: number) => {
    const sectionHeaderY = sectionYPositionsRef.current[sectionKey] || 0;
    const paddingAllowance = 40;
    sectionAnchorsYRef.current[anchorKey] = sectionHeaderY + yWithinSection + paddingAllowance;
  };

  const findHistoryRubricAnchorForQuery = (q: string): string | null => {
    const lower = q.toLowerCase();
    // IA criteria anchors
    if (lower.includes('criterion a') || lower.includes('identification and evaluation of sources')) return 'hist_critA';
    if (lower.includes('criterion b') || lower.includes('investigation')) return 'hist_critB';
    if (lower.includes('criterion c') || lower.includes('reflection')) return 'hist_critC';
    // Paper 1 anchors
    if (lower.includes('paper 1') && (lower.includes('source questions') || lower.includes('first question'))) return 'hist_p1_overview';
    if (lower.includes('fourth question') || lower.includes('q4') || lower.includes('markbands')) return 'hist_p1_q4_bands';
    // Paper 2 anchors
    if (lower.includes('paper 2') || lower.includes('essay markbands')) return 'hist_p2_bands';
    return null;
  };

  const toggleSection = (section: string) => {
    const isExpanding = expandedSection !== section;
    setExpandedSection(isExpanding ? section : null);
    const animationValue = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'coreThemes': coreThemesAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'historyTips': historyTipsAnimation,
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
      'historyTips': 'History Tips',
    };
    
    let matches = sectionKeys.filter(key =>
      sectionContentStrings[key].toLowerCase().includes(trimmedQuery.toLowerCase()) ||
      sectionTitles[key].toLowerCase().includes(trimmedQuery.toLowerCase())
    );
    // If query clearly targets a specific rubric subsection, ensure detailedRubrics is included
    if (findHistoryRubricAnchorForQuery(trimmedQuery) && !matches.includes('detailedRubrics')) {
      matches = [...matches, 'detailedRubrics'];
    }
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
      'historyTips': historyTipsAnimation,
    }[expandedSection];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    const allSectionKeys = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'historyTips'];
    allSectionKeys.forEach(key => {
      if (key !== expandedSection) {
        const anim = {
          'overview': overviewAnimation,
          'essentials': essentialsAnimation,
          'coreThemes': coreThemesAnimation,
          'detailedRubrics': detailedRubricsAnimation,
          'historyTips': historyTipsAnimation,
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

    // After expanding, scroll to matching anchor if the search query targets a subsection
    if (highlightedText) {
      setTimeout(() => {
        if (expandedSection === 'detailedRubrics') {
          const anchor = findHistoryRubricAnchorForQuery(highlightedText);
          const y = anchor ? sectionAnchorsYRef.current[anchor] : undefined;
          if (typeof y === 'number') {
            scrollToY(y);
          } else {
            scrollToSection(expandedSection);
          }
        } else {
          scrollToSection(expandedSection);
        }
      }, 200);
    }
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
      'coreThemes': coreThemesAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'historyTips': historyTipsAnimation,
    }[section];
    if (!animationValue) return null;
    return (
      <Animated.View
        style={{
          maxHeight: animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 6000],
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>History</Text>
            <Text style={{ fontSize: 16, color: '#8A97A7', fontFamily: 'ScopeOne-Regular', marginBottom: 12 }}>Group 3: Individuals and Societies</Text>
            <View style={{ height: 2, backgroundColor: '#7EC3FF', marginBottom: 8 }} />
          </View>
          {/* Dropdowns */}
          {[{ key: 'overview', title: 'Course Overview' }, { key: 'essentials', title: 'Subject Essentials' }, { key: 'coreThemes', title: 'Prescribed Literature' }, { key: 'detailedRubrics', title: 'Detailed Rubrics' }].map((section, idx, arr) => (
            <View key={section.key} onLayout={(e) => { sectionYPositionsRef.current[section.key] = e.nativeEvent.layout.y; }}>
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
                      {section.key === 'overview' && (
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText(sectionContentStrings.overview, highlightedText)}</Text>
                      )}
                      {section.key === 'essentials' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Syllabus Outline and Teaching Hours</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("SL: 150 hours\nHL: 240 hours", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Objectives in Practice</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("AO1: Demonstrate detailed, relevant and accurate historical knowledge.\nAO2: Demonstrate understanding of historical concepts and methods.\nAO3: Analyse and evaluate historical sources and evidence.\nAO4: Construct clear, focused, and coherent arguments based on evidence.", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Outline and Weightage</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginBottom: 8 }}>{highlightText("Standard Level (SL)", highlightedText)}</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- Paper 1: Source-based paper on prescribed subjects (1 hour) – 30%\n- Paper 2: Essay paper on world history topics (1.5 hours) – 45%\n- Internal Assessment: Historical investigation – 25%", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginTop: 12, marginBottom: 8 }}>{highlightText("Higher Level (HL)", highlightedText)}</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- Paper 1: Source-based paper on prescribed subjects – 20%\n- Paper 2: Essay paper on world history topics – 25%\n- Paper 3: Essay paper based on regional option (2.5 hours) – 35%\n- Internal Assessment: Historical investigation – 20%", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Internal Assessment</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("Historical Investigation – 20 hours (SL and HL)", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'coreThemes' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Prescribed Subjects (SL/HL)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- Military leaders\n- Conquest and its impact\n- The move to global war\n- Rights and protest\n- Conflict and intervention", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>World History Topics (SL/HL)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- Society and economy (750–1400)\n- Causes and effects of medieval wars (750–1500)\n- Dynasties and rulers (750–1500)\n- Societies in transition (1400–1700)\n- Early Modern states (1450–1789)\n- Origins, development and impact of industrialization (1750–2005)\n- Independence movements (1800–2000)\n- Evolution and development of democratic states (1848–2000)\n- Authoritarian states (20th century)\n- Causes and effects of 20th-century wars\n- The Cold War: Superpower tensions and rivalries (20th century)", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>HL Regional Options (HL only)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- History of Africa and the Middle East\n- History of the Americas\n- History of Asia and Oceania\n- History of Europe", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          <Text onLayout={(e) => registerSectionAnchor('detailedRubrics', 'hist_ia_header', e.nativeEvent.layout.y)} style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 12 }}>Detailed Rubrics – Internal Assessment (Historical Investigation)</Text>
                          
                          {/* Internal Assessment Rubric Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.2, padding: 8 }}>Criterion</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.8, padding: 8 }}>Description</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Marks</Text>
                            </View>
                            {[
                              { criterion: 'A: Identification and evaluation of sources', description: 'Recognition and assessment of two sources considering their background, intent, worth, and constraints.', marks: '0-6' },
                              { criterion: 'B: Investigation', description: 'Structured, coherent and focused inquiry with meaningful analysis and assessment using appropriate historical sources.', marks: '0-15' },
                              { criterion: 'C: Reflection', description: 'Thoughtful consideration of what the inquiry revealed about the approaches used by historians.', marks: '0-4' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 2.2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.criterion, highlightedText)}</Text>
                                <Text style={{ flex: 2.8, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.description, highlightedText)}</Text>
                                <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.marks, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>


                          {/* Paper 1 — Source Questions (Paraphrased) */}
                          <Text onLayout={(e) => registerSectionAnchor('detailedRubrics', 'hist_p1_overview', e.nativeEvent.layout.y)} style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16, marginBottom: 8 }}>Paper 1 — Source Questions (Paraphrased)</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.2, padding: 8 }}>Question</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.6, padding: 8 }}>Description</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1.0, padding: 8, textAlign: 'center' }}>Marks</Text>
                            </View>
                            {[
                              { q: 'First question, part A', desc: 'Checks basic understanding of one source.', marks: '3' },
                              { q: 'First question, part B', desc: 'Further checks understanding of one source.', marks: '2' },
                              { q: 'Second question', desc: 'Judge strengths and limits of one source. Consider who made it, why it was made, and what it says.', marks: '4' },
                              { q: 'Third question', desc: 'Compare and contrast what two sources show about the topic.', marks: '6' },
                              { q: 'Fourth question', desc: 'Use the sources and your own knowledge to argue and reach a conclusion.', marks: '9' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 2.2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.q, highlightedText)}</Text>
                                <Text style={{ flex: 2.8, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.desc, highlightedText)}</Text>
                                <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.marks, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Paper 1 — Fourth Question Markbands (Paraphrased) */}
                          <Text onLayout={(e) => registerSectionAnchor('detailedRubrics', 'hist_p1_q4_bands', e.nativeEvent.layout.y)} style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16, marginBottom: 8 }}>Paper 1 — Fourth Question Markbands (Paraphrased)</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1.0, padding: 8 }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 4.0, padding: 8 }}>Level Descriptor</Text>
                            </View>
                            {[
                              { band: '0', desc: 'Does not meet the basic expectations described below.' },
                              { band: '1–3', desc: 'Not really on task. Mentions sources but mainly describes them with little or no analysis. Own knowledge is missing, off-topic, or inaccurate.' },
                              { band: '4–6', desc: 'Mostly on task. Uses sources to support points. Own knowledge may be thin or partially accurate. Some linking of ideas from sources and knowledge.' },
                              { band: '7–9', desc: 'Clearly on task. Sources are used well to support arguments. Own knowledge is accurate and relevant. Strong integration of sources with personal knowledge.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1.0, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.band, highlightedText)}</Text>
                                <Text style={{ flex: 4.0, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.desc, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>

                          {/* Paper 2 — Essay Markbands (SL/HL, Paraphrased) */}
                          <Text onLayout={(e) => registerSectionAnchor('detailedRubrics', 'hist_p2_bands', e.nativeEvent.layout.y)} style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16, marginBottom: 8 }}>Paper 2 — Essay Markbands (SL/HL, Paraphrased)</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1.0, padding: 8 }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 4.0, padding: 8 }}>Level Descriptor</Text>
                            </View>
                            {[
                              { band: '0', desc: 'Does not meet the basic expectations described below.' },
                              { band: '1–3', desc: 'Very limited grasp of the question. Disorganized response. Minimal or inaccurate knowledge. Almost no analysis.' },
                              { band: '4–6', desc: 'Some understanding of the task. Structure is unclear. Examples are thin or vague. Mostly descriptive with little analysis.' },
                              { band: '7–9', desc: 'Partial understanding. Attempts a structure. Some accurate knowledge. Moves beyond description with limited, uneven analysis.' },
                              { band: '10–12', desc: 'Understands what the question is asking. Generally well structured. Mostly accurate knowledge. Some effective analysis and evaluation with supported points.' },
                              { band: '13–15', desc: 'Clearly focused and well organized. Accurate, relevant knowledge. Strong examples and thoughtful evaluation. Consistent, well‑supported argument.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1.0, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.band, highlightedText)}</Text>
                                <Text style={{ flex: 4.0, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.desc, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Paper 3 HL External Markbands (Paraphrased) */}
                          <Text onLayout={(e) => registerSectionAnchor('detailedRubrics', 'hist_p3_hl_bands', e.nativeEvent.layout.y)} style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16, marginBottom: 8 }}>Paper 3 HL — External Assessment Markbands (Paraphrased)</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1.0, padding: 8 }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 4.0, padding: 8 }}>Level Descriptor</Text>
                            </View>
                            {[
                              { band: '0', desc: 'Does not meet the basic expectations described below.' },
                              { band: '1–3', desc: 'Shows little understanding of what the question is asking. Poor structure or no clear essay format. Little focus on the task.\n\nLimited knowledge present. Examples are wrong, unrelated, or unclear.\n\nContains little or no thoughtful analysis. Mostly general statements and unsupported claims.' },
                              { band: '4–6', desc: 'Shows some understanding of what the question asks. Tries to follow a structured approach, but lacks clarity and flow.\n\nShows knowledge but it lacks accuracy and relevance. Superficial understanding of historical context. Uses specific examples, though these may be unclear or not relevant.\n\nSome limited analysis, but the response is mainly telling what happened rather than analyzing.' },
                              { band: '7–9', desc: 'Shows understanding of what the question demands, but these demands are only partially addressed. Attempts to follow a structured approach.\n\nKnowledge is partly accurate and relevant. Events are generally placed in their historical context. Examples used are appropriate and relevant.\n\nThe response moves beyond description to include some analysis or thoughtful commentary, but this is not sustained.' },
                              { band: '10–12', desc: 'The demands of the question are understood and addressed. Answers are generally well structured and organized, although there may be some repetition or lack of clarity in places.\n\nKnowledge is mostly accurate and relevant. Events are placed in their historical context, and there is a clear understanding of historical concepts. Examples used are appropriate and relevant, and are used to support the analysis.\n\nArguments are mainly clear and flow well. There is some awareness and evaluation of different perspectives.\n\nThe response contains thoughtful analysis. Most of the main points are supported, and the response argues to a consistent conclusion.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1.0, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.band, highlightedText)}</Text>
                                <Text style={{ flex: 4.0, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.desc, highlightedText)}</Text>
                              </View>
                            ))}
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
            
            <View>
              <List.Item
                title="History Tips"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('historyTips')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'historyTips' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'historyTips' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('historyTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 16 }}>Top 10 Study Tips for Success – History</Text>
                      
                      <View style={{ marginBottom: 8 }}>
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', lineHeight: 22 }}>{highlightText("1. Familiarize yourself with historical concepts such as causation, change, and significance.\n\n2. Use a study timeline to organize world history topics chronologically.\n\n3. Practice Paper 1 by working through source-based questions under timed conditions.\n\n4. Develop thematic essay skills for Paper 2 by linking content across different topics.\n\n5. For HL, regularly write full-length essays for Paper 3 using past paper prompts.\n\n6. Choose a well-defined and original topic for your Historical Investigation.\n\n7. Evaluate sources critically, focusing on origin, purpose, value, and limitations.\n\n8. Make flashcards of key dates, events, and historiographical interpretations.\n\n9. Use planning structures (e.g., PEEL) for clear and coherent essays.\n\n10. Self-assess your writing against rubrics to improve clarity and analytical depth.", highlightedText)}</Text>
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
              subject: 'HISTORY', 
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

export default HistoryScreen; 