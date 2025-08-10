import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated, StatusBar, ImageBackground, TouchableOpacity } from 'react-native';
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

const SportsExerciseHealthScienceScreen = ({ navigation, route }: { navigation: any; route: any }) => {
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
  const sehsTipsAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  // Section keys and content for search
  const sectionContentStrings: Record<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'sehsTips', string> = {
    overview: `Syllabus Overview
The SEHS course incorporates the disciplines of anatomy and physiology, biomechanics, psychology, and nutrition, which are studied in the context of sport, exercise, and health. The course aims to provide students with an understanding of the scientific principles that underlie physical performance, the ability to apply these principles, and the opportunity to undertake practical work.`,
    essentials: `Syllabus Outline and Teaching Hours
SL: 150 hours
HL: 240 hours

Core (SL+HL):
1. Anatomy (13 hours)
2. Exercise Physiology (16 hours)
3. Energy Systems (13 hours)
4. Movement Analysis (11 hours)
5. Skill in Sports (15 hours)
6. Measurement and Evaluation (6 hours)

Additional HL Topics:
1. Further Anatomy (7 hours)
2. The Endocrine System (6 hours)
3. Fatigue (6 hours)
4. Friction and Drag (4 hours)
5. Skill Acquisition and Analysis (8 hours)
6. Genetics and Athletic Performance (4 hours)
7. Exercise and Immunity (6 hours)

Assessment Objectives in Practice
AO1: Demonstrate knowledge and understanding of facts, concepts, and terminology.
AO2: Apply knowledge and understanding.
AO3: Construct, analyse and evaluate information.
AO4: Demonstrate the appropriate use of research, experimental and practical techniques.

Assessment Outline and Weightage
SL:
Paper 1 (20%) - Multiple choice on the core
Paper 2 (35%) - Data-based, short-answer and extended-response questions on core
Paper 3 (20%) - Short-answer and extended-response on Option
Internal Assessment (25%) - Practical investigation

HL:
Paper 1 (20%) - Multiple choice on the core
Paper 2 (25%) - Data-based, short-answer and extended-response questions on core and AHL
Paper 3 (35%) - Short-answer and extended-response on Option
Internal Assessment (20%) - Practical investigation`,
    coreThemes: `Concepts, Content and Contexts
Concepts:
- Health and performance
- Training and recovery
- Biomechanics
- Nutrition
- Psychology in sport

Content:
- Anatomy, physiology, biomechanics, nutrition, psychology
- Experimentation and research methodology

Contexts:
- Application to real-world sporting contexts
- Use of practical investigation
- Integration of ethical, social, and cultural issues

Concepts Content Contexts Health performance Training recovery Biomechanics Nutrition Psychology sport Anatomy physiology biomechanics nutrition psychology Experimentation research methodology Application real-world sporting contexts Use practical investigation Integration ethical social cultural issues`,
    detailedRubrics: `Internal Assessment (IA) – Individual Investigation
Total Marks: 24
Weight: SL – 25%, HL – 20%

Personal engagement Demonstrates personal involvement initiative genuine interest topic 2 marks
Exploration Includes background rationale clear research question relevant scientific context Method appropriate addresses research question 6 marks
Analysis Data analyzed using appropriate techniques trends patterns interpreted logically 6 marks
Evaluation Discusses strengths weaknesses improvements limitations Conclusion consistent data 6 marks
Communication Report structured logically appropriate use scientific terminology consistent referencing format 4 marks

Paper 1 (SL & HL) – Multiple Choice
SL: 30 mins | HL: 40 mins
Assesses knowledge and understanding (AO1).
No rubric – marked objectively.

Paper 2 – Short Answer and Data-based Questions
SL: 1 hour 15 mins | HL: 2 hours 15 mins
Assesses application, analysis, and evaluation skills.

Basic Knowledge Remembering key facts about human body systems, exercise science principles, and health concepts.
Problem Solving Using scientific knowledge to analyze new situations, interpret data charts, and work through step-by-step problems.
Critical Thinking Drawing conclusions from evidence, questioning research findings, and recognizing study limitations.
Scientific Writing Presenting ideas clearly using proper terminology, creating effective charts and graphs, and expressing thoughts logically.

Criterion Marks Description Personal engagement Demonstrates personal involvement initiative genuine interest topic Exploration Includes background rationale clear research question relevant scientific context Method appropriate addresses research question Analysis Data analyzed using appropriate techniques trends patterns interpreted logically Evaluation Discusses strengths weaknesses improvements limitations Conclusion consistent data Communication Report structured logically appropriate use scientific terminology consistent referencing format Paper 1 Multiple Choice SL 30 mins HL 40 mins Assesses knowledge understanding AO1 No rubric marked objectively Paper 2 Short Answer Data-based Questions SL 1 hour 15 mins HL 2 hours 15 mins Assesses application analysis evaluation skills Basic Knowledge Remembering key facts human body systems exercise science principles health concepts Problem Solving Using scientific knowledge analyze new situations interpret data charts work through step-by-step problems Critical Thinking Drawing conclusions evidence questioning research findings recognizing study limitations Scientific Writing Presenting ideas clearly using proper terminology creating effective charts graphs expressing thoughts logically AO1 Knowledge understanding Recalling explaining scientific facts concepts processes AO2 Application Applying knowledge unfamiliar scenarios analyzing data solving structured problems AO3 Synthesis Evaluation Interpreting results evaluating hypotheses identifying limitations AO4 Communication Using appropriate scientific vocabulary formats graphs tables clarity expression Scoring Levels Performance Standards Applied data analysis questions essay-style responses Level 0 Missing completely off-topic response Level 1-2 Simple facts remembered shows confusion disorganized writing not very relevant Level 3-4 Decent grasp topics tries apply knowledge organized shallow analysis Level 5-6 Strong comprehension practical application well-structured answers showing deeper thinking Level 7-8 Exceptional mastery comprehensive responses demonstrating analysis connections logical flow Paper 3 Option Topic SL HL Brief Questions Checks detailed knowledge chosen specialty area Answers should direct precise factually correct Long-form Questions Demands combining multiple ideas real examples critical assessment Emphasis logical structure strong reasoning`,
    sehsTips: `1. Master the foundational concepts in anatomy and physiology.

2. Use diagrams to reinforce biomechanical processes.

3. Practice interpreting data and graphs from past paper 2s.

4. Memorize key terms and their application through flashcards.

5. Link theory to sport examples in your extended responses.

6. Break down practical IA into clear sections with evidence.

7. Use real-world sports events for case study references.

8. Understand command terms used in questions.

9. Work with peers to simulate paper 3 question discussions.

10. Keep up with recent sports science developments.`,
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'sehsTips'> = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'sehsTips'];

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
      'sehsTips': sehsTipsAnimation,
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
      'sehsTips': 'SEHS Tips',
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
      'sehsTips': sehsTipsAnimation,
    }[expandedSection];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    const allSectionKeys = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'sehsTips'];
    allSectionKeys.forEach(key => {
      if (key !== expandedSection) {
        const anim = {
          'overview': overviewAnimation,
          'essentials': essentialsAnimation,
          'coreThemes': coreThemesAnimation,
          'detailedRubrics': detailedRubricsAnimation,
          'sehsTips': sehsTipsAnimation,
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

  const renderAnimatedContent = (section: 'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'sehsTips', content: React.ReactNode) => {
    const animationValue = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'coreThemes': coreThemesAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'sehsTips': sehsTipsAnimation,
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Sports, Exercise and Health Science</Text>
            <Text style={{ fontSize: 16, color: '#8A97A7', fontFamily: 'ScopeOne-Regular', marginBottom: 12 }}>Group 4: Sciences</Text>
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
                  {renderAnimatedContent(section.key as 'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'sehsTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      {section.key === 'overview' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 8 }}>Syllabus Overview</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText("The SEHS course incorporates the disciplines of anatomy and physiology, biomechanics, psychology, and nutrition, which are studied in the context of sport, exercise, and health. The course aims to provide students with an understanding of the scientific principles that underlie physical performance, the ability to apply these principles, and the opportunity to undertake practical work.", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'essentials' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Syllabus Outline and Teaching Hours</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("SL: 150 hours\nHL: 240 hours", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Core (SL+HL):</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("1. Anatomy (13 hours)\n2. Exercise Physiology (16 hours)\n3. Energy Systems (13 hours)\n4. Movement Analysis (11 hours)\n5. Skill in Sports (15 hours)\n6. Measurement and Evaluation (6 hours)", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Additional HL Topics:</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("1. Further Anatomy (7 hours)\n2. The Endocrine System (6 hours)\n3. Fatigue (6 hours)\n4. Friction and Drag (4 hours)\n5. Skill Acquisition and Analysis (8 hours)\n6. Genetics and Athletic Performance (4 hours)\n7. Exercise and Immunity (6 hours)", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Objectives in Practice</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("AO1: Demonstrate knowledge and understanding of facts, concepts, and terminology.\nAO2: Apply knowledge and understanding.\nAO3: Construct, analyse and evaluate information.\nAO4: Demonstrate the appropriate use of research, experimental and practical techniques.", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Outline and Weightage</Text>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginTop: 8 }}>SL:</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("Paper 1 (20%) - Multiple choice on the core\nPaper 2 (35%) - Data-based, short-answer and extended-response questions on core\nPaper 3 (20%) - Short-answer and extended-response on Option\nInternal Assessment (25%) - Practical investigation", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginTop: 12 }}>HL:</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("Paper 1 (20%) - Multiple choice on the core\nPaper 2 (25%) - Data-based, short-answer and extended-response questions on core and AHL\nPaper 3 (35%) - Short-answer and extended-response on Option\nInternal Assessment (20%) - Practical investigation", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'coreThemes' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8 }}>Concepts, Content and Contexts</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginTop: 16 }}>Concepts:</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- Health and performance\n- Training and recovery\n- Biomechanics\n- Nutrition\n- Psychology in sport", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginTop: 16 }}>Content:</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- Anatomy, physiology, biomechanics, nutrition, psychology\n- Experimentation and research methodology", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginTop: 16 }}>Contexts:</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- Application to real-world sporting contexts\n- Use of practical investigation\n- Integration of ethical, social, and cultural issues", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8 }}>Internal Assessment (IA) – Individual Investigation</Text>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginBottom: 16 }}>
                            {highlightText("Total Marks: 24\nWeight: SL – 25%, HL – 20%", highlightedText)}
                          </Text>
                          
                          {/* Internal Assessment Rubric Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
                            {/* Header Row */}
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 2.0, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Criterion</Text>
                              <Text style={{ flex: 1.6, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Max marks</Text>
                              <Text style={{ flex: 1.4, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Weight (%)</Text>
                            </View>
                            {/* Data Rows */}
                            {[
                              { criterion: 'Research design', max: '6', weight: '25' },
                              { criterion: 'Data analysis', max: '6', weight: '25' },
                              { criterion: 'Conclusion', max: '6', weight: '25' },
                              { criterion: 'Evaluation', max: '6', weight: '25' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 2.0, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.criterion, highlightedText)}</Text>
                                <Text style={{ flex: 1.6, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>{highlightText(row.max, highlightedText)}</Text>
                                <Text style={{ flex: 1.4, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>{highlightText(row.weight, highlightedText)}</Text>
                              </View>
                            ))}
                            {/* Total Row */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 2, borderColor: '#7EC3FF', backgroundColor: 'rgba(126, 195, 255, 0.1)' }}>
                              <Text style={{ flex: 2.0, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Total</Text>
                              <Text style={{ flex: 1.6, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>24</Text>
                              <Text style={{ flex: 1.4, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>100</Text>
                            </View>
                          </View>
                          
                          {/* Paper 1 (SL & HL) – Multiple Choice */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8, marginTop: 32 }}>Paper 1 (SL & HL) – Multiple Choice</Text>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>
                            {highlightText("SL: 30 mins | HL: 40 mins\nAssesses knowledge and understanding (AO1).\nNo rubric – marked objectively.", highlightedText)}
                          </Text>
                          
                          {/* Paper 2 (Short Answer and Data-based Questions) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8, marginTop: 32 }}>Paper 2 – Short Answer and Data-based Questions</Text>
                          
                          {/* Paper 2 – Criteria vs Explanation (Paraphrased) */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Criteria</Text>
                              <Text style={{ flex: 3, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Explanation</Text>
                            </View>
                            {[
                              { criterion: 'AO1: Knowledge and understanding', explanation: 'Recall and explain key scientific facts, ideas, and processes.' },
                              { criterion: 'AO2: Application', explanation: 'Apply knowledge to new situations, analyze data, and solve structured problems.' },
                              { criterion: 'AO3: Synthesis and evaluation', explanation: 'Interpret results, judge explanations, and identify limits in methods or data.' },
                              { criterion: 'AO4: Communication', explanation: 'Use clear scientific language and formats (e.g., graphs/tables) with readable structure.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.criterion, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.explanation, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>

                          {/* Paper 2 – Markbands and Expected Levels (Paraphrased) */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Level</Text>
                              <Text style={{ flex: 4, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Descriptors</Text>
                            </View>
                            {[
                              { level: '0', descriptor: 'No answer or off-topic.' },
                              { level: '1–2', descriptor: 'Basic recall, limited grasp, weak structure, little relevance.' },
                              { level: '3–4', descriptor: 'Adequate knowledge, some application, basic structure, lacks depth.' },
                              { level: '5–6', descriptor: 'Good understanding with clear application; organized responses with some critical thinking.' },
                              { level: '7–8', descriptor: 'Excellent understanding; well‑developed answers showing synthesis, analysis, and coherent organization.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>{highlightText(row.level, highlightedText)}</Text>
                                <Text style={{ flex: 4, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.descriptor, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>

                          {/* Paper 3 – Option Topic (SL & HL, Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8, marginTop: 32 }}>Paper 3 – Option Topic (SL & HL)</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Question Type</Text>
                              <Text style={{ flex: 3, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Criteria</Text>
                            </View>
                            {[
                              { questionType: 'Short Answer', criteria: 'Tests focused knowledge from the chosen option. Clear, concise, accurate responses.' },
                              { questionType: 'Extended Response', criteria: 'Requires linking ideas, examples, and evaluation. Emphasize coherence and a reasoned argument.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.questionType, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.criteria, highlightedText)}</Text>
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
                title="SEHS Tips"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('sehsTips')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'sehsTips' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'sehsTips' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('sehsTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText(sectionContentStrings.sehsTips, highlightedText)}</Text>
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
              subject: 'SPORTS_EXERCISE_HEALTH_SCIENCE', 
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

export default SportsExerciseHealthScienceScreen; 