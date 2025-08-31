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

const GeographyScreen = ({ navigation, route }: { navigation: any; route: any }) => {
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
  const geographyTipsAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  // Section keys and content for search
  const sectionContentStrings: Record<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'geographyTips', string> = {
    overview: `The IB Geography course aims to develop an understanding of the interrelationships between people, places, spaces, and the environment. It explores both the physical and human dimensions of geography at local, regional, and global scales. Students investigate pressing global issues such as climate change, population distribution, urbanization, and sustainability through inquiry-based learning and critical thinking.`,
    essentials: `Syllabus Outline and Teaching Hours\nSL (150 hours)\n- Core theme: Geographic perspectives—global change\n- Two optional themes (e.g., Freshwater, Urban environments)\n- Internal assessment (fieldwork)\nHL (240 hours)\n- Core theme: Geographic perspectives—global change\n- Three optional themes\n- HL extension: Global interactions\n- Internal assessment (fieldwork)\n\nAssessment Objectives in Practice\nAO1: Demonstrate knowledge and understanding of specified content.\nAO2: Apply and analyse knowledge and understanding in different contexts.\nAO3: Synthesize and evaluate geographic information.\nAO4: Select, use, and apply a variety of appropriate skills and techniques.\n\nAssessment Outline and Weightage\nStandard Level (SL)\n- Paper 1 (Optional themes): 35%\n- Paper 2 (Core): 40%\n- Internal Assessment (Fieldwork): 25%\nHigher Level (HL)\n- Paper 1 (Optional themes): 25%\n- Paper 2 (Core): 35%\n- Paper 3 (HL Extension – Global interactions): 20%\n- Internal Assessment (Fieldwork): 20%`,
    coreThemes: `Prescribed Literature Overview\n\nConcepts\n• Place\n• Space\n• Scale\n• Power\n• Possibilities\n• Processes\n\nContent\n• Geographic perspectives on global change\n• Optional themes (e.g. Freshwater, Urban environments, Leisure, Tourism and Sport)\n• HL extension: Global interactions (for HL only)\n• Core units such as population distribution, global climate, resource consumption\n• Internal assessment (fieldwork)\n• Interconnected systems and flows (environmental, demographic, economic, etc.)\n\nContexts\n• Local, national, regional, and global scales\n• Physical and human geography\n• Geopolitical, socio-economic, and environmental perspectives\n• Real-world case studies from different global regions\n• Topical and current global challenges\n• Analysis of data and geospatial representations (maps, graphs, models, etc.)`,
    detailedRubrics: `Assessment Rubrics – Internal Assessment (Fieldwork)

Criteria A–G: Research question and context; Research methodology; Data quality and presentation; Analysis and interpretation; Research conclusions; Critical evaluation; Academic presentation.

Also includes additional tables and markbands:
• Paper Assessment Framework (Max Score: 10): performance indicators for bands 0, 1–2, 3–4, 5–6, 7–8, 9–10.
• Paper 3 HL – Extended Response Assessment (Max Score: 12): bands 0, 1–3, 4–6, 7–9, 10–12 with characteristics (analysis, synthesis, structure).
• Paper 3 (HL) – Part B Assessment (Max Mark: 16): bands 0, 1–4, 5–8, 9–12, 13–16 with level descriptors (focus, evidence, evaluation, organization).`,
    geographyTips: `Top 10 Study Tips for Success – Geography\n\n• Familiarize yourself thoroughly with case studies for all themes.\n\n• Use diagrams and maps effectively in your answers.\n\n• Understand command terms and structure answers accordingly.\n\n• Practice past paper questions under timed conditions.\n\n• Keep a glossary of key terms and definitions.\n\n• Choose IA topics that are specific, measurable, and locally relevant.\n\n• Incorporate evaluation and synthesis into essay-style questions.\n\n• Learn how to analyze and interpret graphs, maps, and statistics.\n\n• Plan essays before writing to ensure clarity and organization.\n\n• Use the assessment rubrics to self-assess and refine work.`,
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'geographyTips'> = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'geographyTips'];

  // Full-text blob of Detailed Rubrics content to improve search coverage
  const detailedRubricsSearchContent = `
  Assessment Rubrics Internal Assessment Fieldwork
  A Research question and context Developing a well-defined and focused research question with appropriate geographic context 0-3
  B Research methodology Selecting suitable research methods and providing strong justification for their use 0-3
  C Data quality and presentation Gathering precise and relevant data with effective organization and presentation 0-6
  D Analysis and interpretation Conducting thoughtful analysis that logically supports the research findings 0-8
  E Research conclusions Formulating well-supported conclusions that directly address the research question 0-2
  F Critical evaluation Providing thoughtful review and assessment of research methods and outcomes 0-3
  G Academic presentation Meeting academic standards for organization citations and word count limits 0-3

  Paper Assessment Framework Max Score 10
  0 Work fails to meet any assessment standards outlined below
  1-2 Response lacks focus and structure with minimal relevant content Contains brief disconnected statements Shows no clear analytical approach Lacks appropriate geographic terminology
  3-4 General response with limited development and weak supporting evidence Includes basic information with poor organization Minimal use of geographic concepts and terminology Limited analytical depth
  5-6 Addresses the question partially with some relevant analysis Shows limited evaluation and reasoning Basic use of geographic terminology Some organization present but inconsistent
  7-8 Comprehensive response with strong analytical content Clear conclusions supported by evidence Appropriate use of geographic concepts Well-structured argument with some evaluation
  9-10 Thorough well-developed response demonstrating deep understanding Sophisticated analysis with multiple perspectives Excellent use of geographic terminology Clear structure with strong evaluative conclusions

  Paper 3 HL Extended Response Assessment Max Score 12
  0 Work does not meet the minimum standards described below
  1-3 Basic response with significant limitations in scope and development Contains unconnected factual information Lacks synthesis and evaluative thinking Poor paragraph organization and flow
  4-6 Partially developed response addressing some aspects of the question Combines relevant and irrelevant supporting material Shows minimal synthesis with basic conclusions Inconsistent structural organization
  7-9 Well-developed response covering most question requirements with analytical depth Presents balanced arguments with some brief development Uses mostly accurate and relevant supporting evidence Shows some paragraph connectivity and logical flow
  10-12 Comprehensive response fully addressing the question with sophisticated analysis Demonstrates integrated evidence with clear well-reasoned arguments Excellent structural organization with strong paragraph cohesion Note Advanced synthesis not required at this level

  Paper 3 HL Part B Assessment Max Mark 16
  0 The work does not reach a standard described by the descriptors below
  1-4 General lacks focus and structure Unconnected facts no synthesis Weak or no conclusion
  5-8 Partially addresses the question with limited links Some valid but weak perspectives Basic grouping of ideas
  9-12 Addresses most of the question some evaluation Multiple guide links listed but not integrated Good evidence but paragraph connections weak
  13-16 Fully addresses question with evaluated analysis Logical flow linked paragraphs Clear opinion supported by evidence Explicit links to guide and perspectives
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

  const toggleSection = (section: string) => {
    const isExpanding = expandedSection !== section;
    setExpandedSection(isExpanding ? section : null);
    const animationValue = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'coreThemes': coreThemesAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'geographyTips': geographyTipsAnimation,
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
      'geographyTips': 'Geography Tips',
    };
    
    let matches = sectionKeys.filter(key =>
      sectionContentStrings[key].toLowerCase().includes(trimmedQuery.toLowerCase()) ||
      sectionTitles[key].toLowerCase().includes(trimmedQuery.toLowerCase())
    );
    // Include Detailed Rubrics when the full-text blob matches
    if (detailedRubricsSearchContent.toLowerCase().includes(trimmedQuery.toLowerCase()) && !matches.includes('detailedRubrics')) {
      matches = ['detailedRubrics', ...matches];
    }
    // Prioritize opening Detailed Rubrics when present
    if (matches.includes('detailedRubrics')) {
      matches = ['detailedRubrics', ...matches.filter(k => k !== 'detailedRubrics')];
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
      'geographyTips': geographyTipsAnimation,
    }[expandedSection];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    const allSectionKeys = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'geographyTips'];
    allSectionKeys.forEach(key => {
      if (key !== expandedSection) {
        const anim = {
          'overview': overviewAnimation,
          'essentials': essentialsAnimation,
          'coreThemes': coreThemesAnimation,
          'detailedRubrics': detailedRubricsAnimation,
          'geographyTips': geographyTipsAnimation,
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
      'coreThemes': coreThemesAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'geographyTips': geographyTipsAnimation,
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Geography</Text>
            <Text style={{ fontSize: 16, color: '#8A97A7', fontFamily: 'ScopeOne-Regular', marginBottom: 12 }}>Group 3: Individuals and Societies</Text>
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
                  {renderAnimatedContent(section.key, (
                    <View style={{ backgroundColor: 'transparent' }}>
                      {section.key === 'overview' && (
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText(sectionContentStrings.overview, highlightedText)}</Text>
                      )}
                      {section.key === 'essentials' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Syllabus Outline and Teaching Hours</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginBottom: 8 }}>{highlightText("SL (150 hours)", highlightedText)}</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- Core theme: Geographic perspectives—global change\n- Two optional themes (e.g., Freshwater, Urban environments)\n- Internal assessment (fieldwork)", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginTop: 12, marginBottom: 8 }}>{highlightText("HL (240 hours)", highlightedText)}</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- Core theme: Geographic perspectives—global change\n- Three optional themes\n- HL extension: Global interactions\n- Internal assessment (fieldwork)", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Objectives in Practice</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("AO1: Demonstrate knowledge and understanding of specified content.\nAO2: Apply and analyse knowledge and understanding in different contexts.\nAO3: Synthesize and evaluate geographic information.\nAO4: Select, use, and apply a variety of appropriate skills and techniques.", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Outline and Weightage</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginBottom: 8 }}>{highlightText("Standard Level (SL)", highlightedText)}</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- Paper 1 (Optional themes): 35%\n- Paper 2 (Core): 40%\n- Internal Assessment (Fieldwork): 25%", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginTop: 12, marginBottom: 8 }}>{highlightText("Higher Level (HL)", highlightedText)}</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- Paper 1 (Optional themes): 25%\n- Paper 2 (Core): 35%\n- Paper 3 (HL Extension – Global interactions): 20%\n- Internal Assessment (Fieldwork): 20%", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'coreThemes' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 16 }}>Prescribed Literature Overview</Text>
                          
                          {/* Concepts Section */}
                          <View style={{ borderRadius: 8, padding: 12, marginBottom: 12 }}>
                            <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8 }}>Concepts</Text>
                            <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText("• Place\n• Space\n• Scale\n• Power\n• Possibilities\n• Processes", highlightedText)}</Text>
                          </View>
                          
                          {/* Content Section */}
                          <View style={{ borderRadius: 8, padding: 12, marginBottom: 12 }}>
                            <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8 }}>Content</Text>
                            <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText("• Geographic perspectives on global change\n• Optional themes (e.g. Freshwater, Urban environments, Leisure, Tourism and Sport)\n• HL extension: Global interactions (for HL only)\n• Core units such as population distribution, global climate, resource consumption\n• Internal assessment (fieldwork)\n• Interconnected systems and flows (environmental, demographic, economic, etc.)", highlightedText)}</Text>
                          </View>
                          
                          {/* Contexts Section */}
                          <View style={{ borderRadius: 8, padding: 12, marginBottom: 8 }}>
                            <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8 }}>Contexts</Text>
                            <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText("• Local, national, regional, and global scales\n• Physical and human geography\n• Geopolitical, socio-economic, and environmental perspectives\n• Real-world case studies from different global regions\n• Topical and current global challenges\n• Analysis of data and geospatial representations (maps, graphs, models, etc.)", highlightedText)}</Text>
                          </View>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 12 }}>Assessment Rubrics – Internal Assessment (Fieldwork)</Text>
                          
                          {/* Internal Assessment Rubric Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.2, padding: 8 }}>Criterion</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.8, padding: 8 }}>Description</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Marks</Text>
                            </View>
                            {[
                              { criterion: 'A: Research question and context', description: 'Developing a well-defined and focused research question with appropriate geographic context.', marks: '0-3' },
                              { criterion: 'B: Research methodology', description: 'Selecting suitable research methods and providing strong justification for their use.', marks: '0-3' },
                              { criterion: 'C: Data quality and presentation', description: 'Gathering precise and relevant data with effective organization and presentation.', marks: '0-6' },
                              { criterion: 'D: Analysis and interpretation', description: 'Conducting thoughtful analysis that logically supports the research findings.', marks: '0-8' },
                              { criterion: 'E: Research conclusions', description: 'Formulating well-supported conclusions that directly address the research question.', marks: '0-2' },
                              { criterion: 'F: Critical evaluation', description: 'Providing thoughtful review and assessment of research methods and outcomes.', marks: '0-3' },
                              { criterion: 'G: Academic presentation', description: 'Meeting academic standards for organization, citations, and word count limits.', marks: '0-3' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 2.2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.criterion, highlightedText)}</Text>
                                <Text style={{ flex: 2.8, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.description, highlightedText)}</Text>
                                <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.marks, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Additional Assessment Table - Paper Marking Scheme */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Paper Assessment Framework (Max Score: 10)</Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Score Range</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Performance Indicators</Text>
                            </View>
                            {[
                              { score: '0', description: 'Work fails to meet any assessment standards outlined below.' },
                              { score: '1-2', description: 'Response lacks focus and structure, with minimal relevant content.\n• Contains brief, disconnected statements\n• Shows no clear analytical approach\n• Lacks appropriate geographic terminology' },
                              { score: '3-4', description: 'General response with limited development and weak supporting evidence.\n• Includes basic information with poor organization\n• Minimal use of geographic concepts and terminology\n• Limited analytical depth' },
                              { score: '5-6', description: 'Addresses the question partially with some relevant analysis.\n• Shows limited evaluation and reasoning\n• Basic use of geographic terminology\n• Some organization present but inconsistent' },
                              { score: '7-8', description: 'Comprehensive response with strong analytical content.\n• Clear conclusions supported by evidence\n• Appropriate use of geographic concepts\n• Well-structured argument with some evaluation' },
                              { score: '9-10', description: 'Thorough, well-developed response demonstrating deep understanding.\n• Sophisticated analysis with multiple perspectives\n• Excellent use of geographic terminology\n• Clear structure with strong evaluative conclusions' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.score, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 18 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Paper 3 HL Assessment Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Paper 3 HL - Extended Response Assessment (Max Score: 12)</Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Score Range</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Performance Characteristics</Text>
                            </View>
                                     {[
           { score: '0', description: 'Work does not meet the minimum standards described below.' },
           { score: '1-3', description: 'Basic response with significant limitations in scope and development.\n• Contains unconnected factual information\n• Lacks synthesis and evaluative thinking\n• Poor paragraph organization and flow' },
           { score: '4-6', description: 'Partially developed response addressing some aspects of the question.\n• Combines relevant and irrelevant supporting material\n• Shows minimal synthesis with basic conclusions\n• Inconsistent structural organization' },
           { score: '7-9', description: 'Well-developed response covering most question requirements with analytical depth.\n• Presents balanced arguments with some brief development\n• Uses mostly accurate and relevant supporting evidence\n• Shows some paragraph connectivity and logical flow' },
           { score: '10-12', description: 'Comprehensive response fully addressing the question with sophisticated analysis.\n• Demonstrates integrated evidence with clear, well-reasoned arguments\n• Excellent structural organization with strong paragraph cohesion\n• Note: Advanced synthesis not required at this level' }
         ].map((row, idx) => (
           <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
             <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.score, highlightedText)}</Text>
             <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 18 }}>{highlightText(row.description, highlightedText)}</Text>
           </View>
         ))}
       </View>
       
       {/* Paper 3 HL - Part B Assessment Table */}
       <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Paper 3 (HL) - Part B Assessment (Max Mark: 16)</Text>
       
       <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
         <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
           <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
           <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Level Descriptor</Text>
         </View>
         {[
           { score: '0', description: 'The work does not reach a standard described by the descriptors below.' },
           { score: '1-4', description: 'General, lacks focus and structure.\n• Unconnected facts, no synthesis.\n• Weak or no conclusion.' },
           { score: '5-8', description: 'Partially addresses the question with limited links.\n• Some valid but weak perspectives.\n• Basic grouping of ideas.' },
           { score: '9-12', description: 'Addresses most of the question, some evaluation.\n• Multiple guide links listed but not integrated.\n• Good evidence, but paragraph connections weak.' },
           { score: '13-16', description: 'Fully addresses question with evaluated analysis.\n• Logical flow, linked paragraphs.\n• Clear opinion supported by evidence.\n• Explicit links to guide and perspectives.' }
         ].map((row, idx) => (
           <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
             <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.score, highlightedText)}</Text>
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
                title="Geography Tips"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('geographyTips')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'geographyTips' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'geographyTips' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('geographyTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 16 }}>Top 10 Study Tips for Success – Geography</Text>
                      
                      <View style={{ marginBottom: 8 }}>
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', lineHeight: 22 }}>{highlightText("• Familiarize yourself thoroughly with case studies for all themes.\n\n• Use diagrams and maps effectively in your answers.\n\n• Understand command terms and structure answers accordingly.\n\n• Practice past paper questions under timed conditions.\n\n• Keep a glossary of key terms and definitions.\n\n• Choose IA topics that are specific, measurable, and locally relevant.\n\n• Incorporate evaluation and synthesis into essay-style questions.\n\n• Learn how to analyze and interpret graphs, maps, and statistics.\n\n• Plan essays before writing to ensure clarity and organization.\n\n• Use the assessment rubrics to self-assess and refine work.", highlightedText)}</Text>
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
              subject: 'GEOGRAPHY', 
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

export default GeographyScreen; 