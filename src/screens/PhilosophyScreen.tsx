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

const PhilosophyScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const userType = route?.params?.userType || 'student';
  const [searchQuery, setSearchQuery] = useState('');
  const scrollViewRef = useRef<ScrollView | null>(null);
  const sectionYPositionsRef = useRef<Record<string, number>>({});
  const sectionAnchorsYRef = useRef<Record<string, number>>({});
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [highlightedText, setHighlightedText] = useState('');
  const [matchingSections, setMatchingSections] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Animation values for each section
  const overviewAnimation = useRef(new Animated.Value(0)).current;
  const essentialsAnimation = useRef(new Animated.Value(0)).current;
  const coreThemesAnimation = useRef(new Animated.Value(0)).current;
  const detailedRubricsAnimation = useRef(new Animated.Value(0)).current;
  const philosophyTipsAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  // Section keys and content for search
  const sectionContentStrings: Record<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'philosophyTips', string> = {
    overview: `The IB Philosophy course encourages students to engage critically with fundamental questions about life, existence, knowledge, ethics, and the nature of reality. The curriculum provides a foundation in philosophical methods and traditions while developing the ability to analyze, construct, and evaluate arguments. Students explore key ideas through prescribed texts, internally assessed tasks, and optional themes.`,
    essentials: `Syllabus Outline and Teaching Hours\nSL – 150 hours | HL – 240 hours\n- Core theme: Being Human\n- Optional themes (e.g., Aesthetics, Epistemology, Ethics, Philosophy of Religion, Political Philosophy)\n- Prescribed text (chosen from the IB-approved list)\n- Internal assessment: Philosophical analysis of a non-philosophical stimulus\n- HL extension: Exploration of the nature of philosophical activity\n\nAssessment Objectives in Practice\nAO1: Demonstrate knowledge and understanding of philosophical content.\nAO2: Analyze philosophical concepts, positions, and arguments.\nAO3: Construct and evaluate philosophical arguments.\nAO4 (HL only): Demonstrate understanding of the nature, function, and methodology of philosophy.\n\nAssessment Outline and Weightage\nStandard Level (SL):\n- Paper 1 (Core theme and one optional theme): 50%\n- Internal Assessment (Philosophical analysis): 25%\n- Paper 2 (Prescribed text): 25%\n\nHigher Level (HL):\n- Paper 1 (Core theme and one optional theme): 40%\n- Internal Assessment: 20%\n- Paper 2 (Prescribed text): 20%\n- Paper 3 (HL extension): 20%`,
    coreThemes: `Overview of the SL and HL Course: Concepts, Content, and Contexts\n\nConcepts\nIdentity\nTruth\nReality\nValues\nJustification\n\nContent\nCore theme – Being human\nOptional themes (e.g., Epistemology, Ethics)\nPhilosophical traditions and methods\nPrescribed texts\nPhilosophical argumentation\n\nContexts\nSocial, historical, cultural contexts\nPersonal beliefs, global ideologies\nInterdisciplinary connections\nMoral and political frameworks\nPhilosophical, literary, and artistic sources`,
    detailedRubrics: `Assessment Rubrics – Internal Assessment\n\nA: Philosophical Issue — Recognition and clear explanation of the philosophical problem presented in the given material. (Max 6)\nB: Philosophical Analysis — Thoroughness and precision in examining and discussing the philosophical problem. (Max 12)\nC: Relevance and Support — Application of relevant examples and sources to strengthen the philosophical discussion. (Max 6)\n\nInternal Assessment Criteria — SL and HL (overview) — The analysis is assessed using the following five criteria.\n\nCriterion A: Finding the Problem and Explaining Why (3 marks)\n0: The work does not reach a standard described by the descriptors below.\n1: The thinking problem brought up by the given material is hinted at but not clearly pointed out. There is no explanation of the connection between the given material and the thinking problem identified.\n2: The thinking problem brought up by the given material is clearly pointed out. There is some explanation of the connection between the given material and the thinking problem identified.\n3: The thinking problem brought up by the given material is clearly and directly pointed out. There is a clear explanation of the connection between the given material and the thinking problem identified.\n\nCriterion B: Clear Writing (4 marks)\n0: The work does not reach a standard described by the descriptors below.\n1: The writing is poorly organized, or where there is some organization there is little focus on the task. Most points are unclear and hard to understand.\n2: The writing tries to follow an organized approach although it is sometimes unclear what it is trying to say. Many points lack clarity and exactness.\n3: The writing is organized and generally well-structured, and can be easily followed. Points are generally clear and make sense together.\n4: The writing is focused and well-organized. All or nearly all of the points made are clear and make sense together.\n\nCriterion C: What You Know and How Well You Understand (4 marks)\n0: The work does not reach a standard described by the descriptors below.\n1: There is little helpful information. The explanation of the thinking problem is very basic. Special thinking words are not used or are used wrong.\n2: Some information is shown but this is not accurate and not helpful. There is a basic explanation of the thinking problem. Special thinking words are used, sometimes correctly.\n3: Information is mostly accurate and helpful. There is a good explanation of the thinking problem. Special thinking words are used, mostly correctly.\n4: The writing contains helpful, accurate and detailed information. There is a well-developed explanation of the thinking problem. There is correct use of special thinking words throughout the writing.\n\nCriterion D: Deep Thinking and Analysis (8 marks)\n0: The work does not reach a standard described by the descriptors below.\n1–2: The writing is mostly just telling facts. There is very little deep thinking. Where examples are included, these don't work well and/or aren't helpful.\n3–4: The writing contains some deep thinking but is more about telling facts than analyzing. Some examples are included.\n5–6: The writing contains deep thinking, but this thinking needs more development. Helpful examples are used to support the argument.\n7–8: The writing contains well-developed deep thinking. Helpful and clearly presented examples are used effectively to support the argument.\n\nCriterion E: Weighing Different Views and Making Judgments (6 marks)\n0: The work does not reach a standard described by the descriptors below.\n1–2: There is little thoughtful discussion of different viewpoints. Few of the main points are backed up with good reasons. There is no conclusion, or the conclusion doesn't relate to the topic.\n3–4: There is some thoughtful discussion of different viewpoints. Some of the main points are backed up with good reasons. The conclusion is stated but is shallow or doesn't fully match the argument.\n5–6: There is clear thoughtful discussion of different viewpoints. All or nearly all of the main points are backed up with good reasons. The writing argues from a consistently held position. The conclusion is clearly stated and matches the argument.`,
    philosophyTips: `Top 10 Study Tips for Success – Philosophy\n\n1. Read prescribed texts multiple times with annotation.\n2. Practice outlining arguments before writing full responses.\n3. Master the core theme thoroughly—it appears in all exam levels.\n4. Use real-world examples to ground abstract arguments.\n5. Compare and contrast philosophical perspectives in essays.\n6. Practice explaining complex ideas clearly and concisely.\n7. Use feedback from past papers to refine essay structure.\n8. Understand the assessment rubrics and apply them to your writing.\n9. Use philosophical vocabulary accurately and consistently.\n10. Discuss your ideas with peers to test clarity and logic.`,
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'philosophyTips'> = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'philosophyTips'];

  // Full-text blob of Detailed Rubrics table content to improve search coverage
  const detailedRubricsSearchContent = `
  A: Philosophical Issue — Recognition and clear explanation of the philosophical problem presented in the given material.
  B: Philosophical Analysis — Thoroughness and precision in examining and discussing the philosophical problem.
  C: Relevance and Support — Application of relevant examples and sources to strengthen the philosophical discussion.

  Criterion A: Finding the Problem and Explaining Why (3 marks)
  0: The work does not reach a standard described by the descriptors below.
  1: The thinking problem brought up by the given material is hinted at but not clearly pointed out. There is no explanation of the connection between the given material and the thinking problem identified.
  2: The thinking problem brought up by the given material is clearly pointed out. There is some explanation of the connection between the given material and the thinking problem identified.
  3: The thinking problem brought up by the given material is clearly and directly pointed out. There is a clear explanation of the connection between the given material and the thinking problem identified.

  Criterion B: Clear Writing (4 marks)
  0: The work does not reach a standard described by the descriptors below.
  1: The writing is poorly organized, or where there is some organization there is little focus on the task. Most points are unclear and hard to understand.
  2: The writing tries to follow an organized approach although it is sometimes unclear what it is trying to say. Many points lack clarity and exactness.
  3: The writing is organized and generally well-structured, and can be easily followed. Points are generally clear and make sense together.
  4: The writing is focused and well-organized. All or nearly all of the points made are clear and make sense together.

  Criterion C: What You Know and How Well You Understand (4 marks)
  0: The work does not reach a standard described by the descriptors below.
  1: There is little helpful information. The explanation of the thinking problem is very basic. Special thinking words are not used or are used wrong.
  2: Some information is shown but this is not accurate and not helpful. There is a basic explanation of the thinking problem. Special thinking words are used, sometimes correctly.
  3: Information is mostly accurate and helpful. There is a good explanation of the thinking problem. Special thinking words are used, mostly correctly.
  4: The writing contains helpful, accurate and detailed information. There is a well-developed explanation of the thinking problem. There is correct use of special thinking words throughout the writing.

  Criterion D: Deep Thinking and Analysis (8 marks)
  0: The work does not reach a standard described by the descriptors below.
  1-2: The writing is mostly just telling facts. There is very little deep thinking. Where examples are included, these don't work well and/or aren't helpful.
  3-4: The writing contains some deep thinking but is more about telling facts than analyzing. Some examples are included.
  5-6: The writing contains deep thinking, but this thinking needs more development. Helpful examples are used to support the argument.
  7-8: The writing contains well-developed deep thinking. Helpful and clearly presented examples are used effectively to support the argument.

  Criterion E: Weighing Different Views and Making Judgments (6 marks)
  0: The work does not reach a standard described by the descriptors below.
  1-2: There is little thoughtful discussion of different viewpoints. Few of the main points are backed up with good reasons. There is no conclusion, or the conclusion doesn't relate to the topic.
  3-4: There is some thoughtful discussion of different viewpoints. Some of the main points are backed up with good reasons. The conclusion is stated but is shallow or doesn't fully match the argument.
  5-6: There is clear thoughtful discussion of different viewpoints. All or nearly all of the main points are backed up with good reasons. The writing argues from a consistently held position. The conclusion is clearly stated and matches the argument.
  `;

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
      // Offset so the section header sits below the top bar
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
    // Account for padding/margins between header and content
    const paddingAllowance = 40;
    sectionAnchorsYRef.current[anchorKey] = sectionHeaderY + yWithinSection + paddingAllowance;
  };

  const findRubricAnchorForQuery = (q: string): string | null => {
    const lower = q.toLowerCase();
    if (
      lower.includes('criterion e') ||
      lower.includes('weighing different views') ||
      lower.includes('making judgments') ||
      lower.includes('making judgement') ||
      lower.includes('viewpoint') ||
      lower.includes('viewpoints') ||
      lower.includes('conclusion') ||
      lower.includes('conclusions') ||
      lower.includes('position') ||
      lower.includes('consistently held') ||
      lower.includes('reasons') ||
      lower.includes('reasoning')
    ) return 'rubrics_critE';
    if (lower.includes('criterion d') || lower.includes('deep thinking') || lower.includes('analysis')) return 'rubrics_critD';
    if (lower.includes('criterion c') || lower.includes('what you know') || lower.includes('understand')) return 'rubrics_critC';
    if (lower.includes('criterion b') || lower.includes('clear writing')) return 'rubrics_critB';
    if (lower.includes('criterion a') || lower.includes('finding the problem')) return 'rubrics_critA';
    if (lower.includes('internal assessment criteria')) return 'rubrics_criteria_overview';
    if (lower.includes('philosophical issue') || lower.includes('philosophical analysis') || lower.includes('relevance and support')) return 'rubrics_ia_table';
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
      'philosophyTips': philosophyTipsAnimation,
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
      'philosophyTips': 'Philosophy Tips',
    };
    
    let matches = sectionKeys.filter(key =>
      sectionContentStrings[key].toLowerCase().includes(trimmedQuery.toLowerCase()) ||
      sectionTitles[key].toLowerCase().includes(trimmedQuery.toLowerCase())
    );

    // If query appears inside the detailed rubrics tables, include that section as a match
    if (detailedRubricsSearchContent.toLowerCase().includes(trimmedQuery.toLowerCase()) && !matches.includes('detailedRubrics')) {
      matches = [...matches, 'detailedRubrics'];
    }

    // Prioritize opening Detailed Rubrics when it matches
    const prioritizedMatches = matches.includes('detailedRubrics')
      ? (['detailedRubrics', ...matches.filter(k => k !== 'detailedRubrics')])
      : matches;

    setMatchingSections(prioritizedMatches);
    setCurrentMatchIndex(0);
    if (prioritizedMatches.length > 0) {
      setExpandedSection(prioritizedMatches[0]);
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
      'philosophyTips': philosophyTipsAnimation,
    }[expandedSection];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    const allSectionKeys = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'philosophyTips'];
    allSectionKeys.forEach(key => {
      if (key !== expandedSection) {
        const anim = {
          'overview': overviewAnimation,
          'essentials': essentialsAnimation,
          'coreThemes': coreThemesAnimation,
          'detailedRubrics': detailedRubricsAnimation,
          'philosophyTips': philosophyTipsAnimation,
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

    // After expanding due to search, scroll to the section header
    if (highlightedText) {
      setTimeout(() => {
        if (expandedSection === 'detailedRubrics') {
          const anchor = findRubricAnchorForQuery(highlightedText);
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
      'philosophyTips': philosophyTipsAnimation,
    }[section];
    if (!animationValue) return null;
    
    // Increase max height for detailed rubrics to accommodate all tables
            const maxHeight = section === 'detailedRubrics' ? 6000 : 3000;
    
    return (
      <Animated.View
        style={{
          maxHeight: animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, maxHeight],
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Philosophy</Text>
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
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("SL – 150 hours | HL – 240 hours\n- Core theme: Being Human\n- Optional themes (e.g., Aesthetics, Epistemology, Ethics, Philosophy of Religion, Political Philosophy)\n- Prescribed text (chosen from the IB-approved list)\n- Internal assessment: Philosophical analysis of a non-philosophical stimulus\n- HL extension: Exploration of the nature of philosophical activity", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Objectives in Practice</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("AO1: Demonstrate knowledge and understanding of philosophical content.\nAO2: Analyze philosophical concepts, positions, and arguments.\nAO3: Construct and evaluate philosophical arguments.\nAO4 (HL only): Demonstrate understanding of the nature, function, and methodology of philosophy.", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Outline and Weightage</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("Standard Level (SL):\n- Paper 1 (Core theme and one optional theme): 50%\n- Internal Assessment (Philosophical analysis): 25%\n- Paper 2 (Prescribed text): 25%\n\nHigher Level (HL):\n- Paper 1 (Core theme and one optional theme): 40%\n- Internal Assessment: 20%\n- Paper 2 (Prescribed text): 20%\n- Paper 3 (HL extension): 20%", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'coreThemes' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 12 }}>Overview of the SL and HL Course: Concepts, Content, and Contexts</Text>
                          
                          {/* Table Header */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Concepts</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Content</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Contexts</Text>
                            </View>
                            
                            {/* Table Rows */}
                            {[
                              { concept: 'Identity', content: 'Core theme – Being human', context: 'Social, historical, cultural contexts' },
                              { concept: 'Truth', content: 'Optional themes (e.g., Epistemology, Ethics)', context: 'Personal beliefs, global ideologies' },
                              { concept: 'Reality', content: 'Philosophical traditions and methods', context: 'Interdisciplinary connections' },
                              { concept: 'Values', content: 'Prescribed texts', context: 'Moral and political frameworks' },
                              { concept: 'Justification', content: 'Philosophical argumentation', context: 'Philosophical, literary, and artistic sources' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', fontSize: 14 }}>{highlightText(row.concept, highlightedText)}</Text>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', fontSize: 14 }}>{highlightText(row.content, highlightedText)}</Text>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', fontSize: 14 }}>{highlightText(row.context, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          <Text onLayout={(e) => registerSectionAnchor('detailedRubrics', 'rubrics_ia_table', e.nativeEvent.layout.y)} style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 12 }}>Assessment Rubrics – Internal Assessment</Text>
                          
                          {/* Internal Assessment Rubric Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.2, padding: 8 }}>Criterion</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.8, padding: 8 }}>Description</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Marks</Text>
                            </View>
                            {[
                              { criterion: 'A: Philosophical Issue', description: 'Recognition and clear explanation of the philosophical problem presented in the given material', marks: 6 },
                              { criterion: 'B: Philosophical Analysis', description: 'Thoroughness and precision in examining and discussing the philosophical problem', marks: 12 },
                              { criterion: 'C: Relevance and Support', description: 'Application of relevant examples and sources to strengthen the philosophical discussion', marks: 6 }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 2.2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.criterion, highlightedText)}</Text>
                                <Text style={{ flex: 2.8, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.description, highlightedText)}</Text>
                                <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular' }}>{highlightText(String(row.marks), highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Internal Assessment Criteria - SL and HL */}
                          <Text onLayout={(e) => registerSectionAnchor('detailedRubrics', 'rubrics_criteria_overview', e.nativeEvent.layout.y)} style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Internal Assessment Criteria — SL and HL</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 12 }}>The analysis is assessed using the following five criteria.</Text>
                          
                          {/* Criterion A: Identification of issue and justification Table */}
                          <Text onLayout={(e) => registerSectionAnchor('detailedRubrics', 'rubrics_critA', e.nativeEvent.layout.y)} style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16, marginBottom: 12 }}>Criterion A: Finding the Problem and Explaining Why (3 marks)</Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Points</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>What You Need to Show</Text>
                            </View>
                            {[
                              { marks: '0', description: 'The work does not reach a standard described by the descriptors below.' },
                              { marks: '1', description: 'The thinking problem brought up by the given material is hinted at but not clearly pointed out. There is no explanation of the connection between the given material and the thinking problem identified.' },
                              { marks: '2', description: 'The thinking problem brought up by the given material is clearly pointed out. There is some explanation of the connection between the given material and the thinking problem identified.' },
                              { marks: '3', description: 'The thinking problem brought up by the given material is clearly and directly pointed out. There is a clear explanation of the connection between the given material and the thinking problem identified.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.marks, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 18 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                                                     </View>
                           
                           {/* Criterion B: Clarity Table */}
                           <Text onLayout={(e) => registerSectionAnchor('detailedRubrics', 'rubrics_critB', e.nativeEvent.layout.y)} style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Criterion B: Clear Writing (4 marks)</Text>
                           
                           <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                             <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                               <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Points</Text>
                               <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>What You Need to Show</Text>
                             </View>
                             {[
                               { marks: '0', description: 'The work does not reach a standard described by the descriptors below.' },
                               { marks: '1', description: 'The writing is poorly organized, or where there is some organization there is little focus on the task. Most points are unclear and hard to understand.' },
                               { marks: '2', description: 'The writing tries to follow an organized approach although it is sometimes unclear what it is trying to say. Many points lack clarity and exactness.' },
                               { marks: '3', description: 'The writing is organized and generally well-structured, and can be easily followed. Points are generally clear and make sense together.' },
                               { marks: '4', description: 'The writing is focused and well-organized. All or nearly all of the points made are clear and make sense together.' }
                             ].map((row, idx) => (
                               <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                 <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.marks, highlightedText)}</Text>
                                 <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 18 }}>{highlightText(row.description, highlightedText)}</Text>
                               </View>
                             ))}
                                                       </View>
                            
                            {/* Criterion C: Knowledge and understanding Table */}
                            <Text onLayout={(e) => registerSectionAnchor('detailedRubrics', 'rubrics_critC', e.nativeEvent.layout.y)} style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Criterion C: What You Know and How Well You Understand (4 marks)</Text>
                            
                            <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                              <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                                <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Points</Text>
                                <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>What You Need to Show</Text>
                              </View>
                              {[
                                { marks: '0', description: 'The work does not reach a standard described by the descriptors below.' },
                                { marks: '1', description: 'There is little helpful information. The explanation of the thinking problem is very basic. Special thinking words are not used or are used wrong.' },
                                { marks: '2', description: 'Some information is shown but this is not accurate and not helpful. There is a basic explanation of the thinking problem. Special thinking words are used, sometimes correctly.' },
                                { marks: '3', description: 'Information is mostly accurate and helpful. There is a good explanation of the thinking problem. Special thinking words are used, mostly correctly.' },
                                { marks: '4', description: 'The writing contains helpful, accurate and detailed information. There is a well-developed explanation of the thinking problem. There is correct use of special thinking words throughout the writing.' }
                              ].map((row, idx) => (
                                <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                  <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.marks, highlightedText)}</Text>
                                  <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 18 }}>{highlightText(row.description, highlightedText)}</Text>
                                </View>
                              ))}
                            </View>
                            
                            {/* Criterion D: Analysis Table */}
                            <Text onLayout={(e) => registerSectionAnchor('detailedRubrics', 'rubrics_critD', e.nativeEvent.layout.y)} style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Criterion D: Deep Thinking and Analysis (8 marks)</Text>
                            
                            <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                              <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                                <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Points</Text>
                                <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>What You Need to Show</Text>
                              </View>
                              {[
                                { marks: '0', description: 'The work does not reach a standard described by the descriptors below.' },
                                { marks: '1-2', description: 'The writing is mostly just telling facts. There is very little deep thinking. Where examples are included, these don\'t work well and/or aren\'t helpful.' },
                                { marks: '3-4', description: 'The writing contains some deep thinking but is more about telling facts than analyzing. Some examples are included.' },
                                { marks: '5-6', description: 'The writing contains deep thinking, but this thinking needs more development. Helpful examples are used to support the argument.' },
                                { marks: '7-8', description: 'The writing contains well-developed deep thinking. Helpful and clearly presented examples are used effectively to support the argument.' }
                              ].map((row, idx) => (
                                <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                  <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.marks, highlightedText)}</Text>
                                  <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 18 }}>{highlightText(row.description, highlightedText)}</Text>
                                </View>
                              ))}
                            </View>
                            
                            {/* Criterion E: Evaluation Table */}
                            <Text onLayout={(e) => registerSectionAnchor('detailedRubrics', 'rubrics_critE', e.nativeEvent.layout.y)} style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Criterion E: Weighing Different Views and Making Judgments (6 marks)</Text>
                            
                            <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                              <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                                <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Points</Text>
                                <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>What You Need to Show</Text>
                              </View>
                              {[
                                { marks: '0', description: 'The work does not reach a standard described by the descriptors below.' },
                                { marks: '1-2', description: 'There is little thoughtful discussion of different viewpoints. Few of the main points are backed up with good reasons. There is no conclusion, or the conclusion doesn\'t relate to the topic.' },
                                { marks: '3-4', description: 'There is some thoughtful discussion of different viewpoints. Some of the main points are backed up with good reasons. The conclusion is stated but is shallow or doesn\'t fully match the argument.' },
                                { marks: '5-6', description: 'There is clear thoughtful discussion of different viewpoints. All or nearly all of the main points are backed up with good reasons. The writing argues from a consistently held position. The conclusion is clearly stated and matches the argument.' }
                              ].map((row, idx) => (
                                <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                  <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.marks, highlightedText)}</Text>
                                  <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 18 }}>{highlightText(row.description, highlightedText)}</Text>
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
                title="Philosophy Tips"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('philosophyTips')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'philosophyTips' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'philosophyTips' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('philosophyTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 16 }}>Top 10 Study Tips for Success – Philosophy</Text>
                      
                      <View style={{ marginBottom: 8 }}>
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', lineHeight: 22 }}>{highlightText("1. Read prescribed texts multiple times with annotation.\n\n2. Practice outlining arguments before writing full responses.\n\n3. Master the core theme thoroughly—it appears in all exam levels.\n\n4. Use real-world examples to ground abstract arguments.\n\n5. Compare and contrast philosophical perspectives in essays.\n\n6. Practice explaining complex ideas clearly and concisely.\n\n7. Use feedback from past papers to refine essay structure.\n\n8. Understand the assessment rubrics and apply them to your writing.\n\n9. Use philosophical vocabulary accurately and consistently.\n\n10. Discuss your ideas with peers to test clarity and logic.", highlightedText)}</Text>
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
              subject: 'PHILOSOPHY', 
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

export default PhilosophyScreen; 