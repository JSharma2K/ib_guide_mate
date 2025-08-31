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

const PhysicsScreen = ({ navigation, route }: { navigation: any; route: any }) => {
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
  const physicsTipsAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  // Section keys and content for search
  const sectionContentStrings: Record<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'physicsTips', string> = {
    overview: `Syllabus Overview
The IB Physics course explores the fundamental principles governing the universe through theoretical and experimental approaches. Students develop scientific knowledge and reasoning, while applying critical thinking and inquiry to solve real-world problems. The course emphasizes the scientific method, quantitative skills, and practical investigations.`,
    essentials: `Syllabus Outline and Teaching Hours
SL: 150 hours, HL: 240 hours
- Measurements and uncertainties
- Mechanics
- Thermal physics
- Waves
- Electricity and magnetism
- Circular motion and gravitation
- Atomic, nuclear and particle physics
- Energy production
- Fields (HL only)
- Electromagnetic induction (HL only)
- Quantum and nuclear physics (HL only)
- Option topic (HL only)
- Practical work including Internal Assessment
Assessment Objectives in Practice
AO1: Demonstrate knowledge and understanding of facts, concepts, and principles.
AO2: Apply knowledge to solve problems and interpret data.
AO3: Formulate, analyze and evaluate hypotheses and experimental procedures.
AO4: Demonstrate the ability to collect, process and present scientific information.
Assessment Outline and Weightage
- SL: Paper 1 (20%), Paper 2 (40%), Paper 3 (20%), Internal Assessment (20%)
- HL: Paper 1 (20%), Paper 2 (36%), Paper 3 (24%), Internal Assessment (20%)`,
    coreThemes: `Concepts, Content, and Contexts
Change Mechanics Thermal physics Motion energy transformation
Relationships Waves Fields Electricity Interconnected systems causality
Models Quantum physics Particle theory Predictive tools simplifications
Evidence Measurements Experiments Observations real-world settings
Systems Fields Gravitation Isolated open physical systems
Concepts Content Contexts Change Mechanics Thermal physics Motion energy transformation Relationships Waves Fields Electricity Interconnected systems causality Models Quantum physics Particle theory Predictive tools simplifications Evidence Measurements Experiments Observations real-world settings Systems Fields Gravitation Isolated open physical systems`,
    detailedRubrics: `Detailed Rubrics – Internal Assessment
Personal engagement Shows original thinking innovative approaches genuine curiosity investigation 2 marks
Exploration Clear research focus appropriate scientific background suitable experimental approach 6 marks
Analysis Effective data interpretation appropriate mathematical processing calculations 6 marks
Evaluation Valid conclusions drawn results awareness experimental limitations potential improvements 6 marks
Communication Clear organization appropriate scientific terminology proper citation sources 4 marks
Criterion Description Marks Personal engagement Shows original thinking innovative approaches genuine curiosity investigation Exploration Clear research focus appropriate scientific background suitable experimental approach Analysis Effective data interpretation appropriate mathematical processing calculations Evaluation Valid conclusions drawn results awareness experimental limitations potential improvements Communication Clear organization appropriate scientific terminology proper citation sources`,
    physicsTips: `• Understand vector quantities clearly – especially in kinematics and forces.

• Draw diagrams for every problem – visualizing simplifies solutions.

• Practice IB past papers and focus on data-based questions.

• Memorize and understand core equations; avoid rote cramming.

• Break complex problems into smaller logical steps.

• Revise common misconceptions (e.g., acceleration vs. velocity).

• Use unit conversions and dimensional analysis regularly.

• Understand the purpose of each lab and how to evaluate it critically.

• Time yourself when solving full-length paper sets.

• Join group discussions to test your conceptual clarity.`,
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'physicsTips'> = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'physicsTips'];

  // Full-text blob of Detailed Rubrics content to improve search coverage
  const detailedRubricsSearchContent = `
  Internal Assessment Table Paraphrased
  Research design 6 25
  Data analysis 6 25
  Conclusion 6 25
  Evaluation 6 25
  Total 24 100

  Research design Markbands Paraphrased
  0 Does not meet the basic expectations described below
  1-2 Question is stated without context Notes about how data will be gathered are mentioned but not linked to the question Method steps lack enough detail to repeat the work
  3-4 Question is set within a broad context How relevant data will be gathered is described Method steps mostly allow someone else to repeat the work with few gaps
  5-6 Question is clearly framed within a specific appropriate context How sufficient and relevant data will be gathered is explained Method steps clearly allow repetition of the work

  Data analysis Markbands Paraphrased
  0 Does not meet the basic expectations described below
  1-2 Data recording processing is shown but is unclear or imprecise Little consideration of uncertainties Some relevant processing attempted but with major gaps or errors
  3-4 Recording processing is clear or precise one but not both Evidence of thinking about uncertainties but with notable omissions or inaccuracies Processing related to the question has significant gaps or mistakes
  5-6 Recording and processing are both clear and precise Uncertainties are handled appropriately Processing relevant to the question is carried out carefully and accurately

  Conclusion Markbands Paraphrased
  0 Does not meet the basic expectations described below
  1-2 States a conclusion relevant to the question but not supported by the analysis Any comparison to accepted science is superficial
  3-4 Describes a conclusion relevant to the question but not fully consistent with the analysis Makes some relevant comparison to accepted science
  5-6 Justifies a conclusion relevant to the question and fully consistent with the analysis Supports it with relevant comparison to accepted science

  Evaluation Markbands Paraphrased
  0 Does not meet the basic expectations described below
  1-2 States general weaknesses or limits in the method Lists improvements but only as statements
  3-4 Describes specific weaknesses or limits Describes realistic improvements that relate to those issues
  5-6 Explains the impact of specific weaknesses or limits Explains realistic relevant improvements that address those issues

  External Assessment SL Paraphrased
  Paper 1 1h 30m 45 marks Two booklets taken together 1A 25 marks 25 multiple choice on SL content no penalty for wrong answers and 1B 20 marks questions based on data Checks knowledge understanding and analysis Calculators allowed bring the Physics data booklet school provides copies 36
  Paper 2 1h 30m 50 marks Short answer and extended response on SL content Checks core objectives knowledge understanding analysis Calculators allowed Physics data booklet required school ensures copies 44

  External Assessment HL Paraphrased
  Paper 1 2h 60 marks Two booklets taken together 1A 40 marks 40 multiple choice on SL HL content no penalty for wrong answers and 1B 20 marks questions based on data Checks knowledge understanding and analysis objectives 1-3 Calculators allowed Physics data booklet required school provides copies 36
  Paper 2 2h 30m 90 marks Short answer and extended response on SL HL content Checks objectives 1-3 calculators and Physics data booklet allowed 44
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
      'physicsTips': physicsTipsAnimation,
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
      'physicsTips': 'Physics Tips',
    };
    
    const matches = sectionKeys.filter(key => {
      if (key === 'detailedRubrics') {
        return detailedRubricsSearchContent.toLowerCase().includes(trimmedQuery.toLowerCase()) ||
               sectionTitles[key].toLowerCase().includes(trimmedQuery.toLowerCase());
      }
      return sectionContentStrings[key].toLowerCase().includes(trimmedQuery.toLowerCase()) ||
             sectionTitles[key].toLowerCase().includes(trimmedQuery.toLowerCase());
    });
    
    // Prioritize detailedRubrics if it matches
    const prioritizedMatches = matches.includes('detailedRubrics') 
      ? ['detailedRubrics', ...matches.filter(m => m !== 'detailedRubrics')]
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
      'physicsTips': physicsTipsAnimation,
    }[expandedSection];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    const allSectionKeys = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'physicsTips'];
    allSectionKeys.forEach(key => {
      if (key !== expandedSection) {
        const anim = {
          'overview': overviewAnimation,
          'essentials': essentialsAnimation,
          'coreThemes': coreThemesAnimation,
          'detailedRubrics': detailedRubricsAnimation,
          'physicsTips': physicsTipsAnimation,
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

  const renderAnimatedContent = (section: 'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'physicsTips', content: React.ReactNode) => {
    const animationValue = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'coreThemes': coreThemesAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'physicsTips': physicsTipsAnimation,
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Physics</Text>
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
                  {renderAnimatedContent(section.key as 'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'physicsTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      {section.key === 'overview' && (
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText(sectionContentStrings.overview, highlightedText)}</Text>
                      )}
                      {section.key === 'essentials' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Syllabus Outline and Teaching Hours</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("SL: 150 hours, HL: 240 hours\n- Measurements and uncertainties\n- Mechanics\n- Thermal physics\n- Waves\n- Electricity and magnetism\n- Circular motion and gravitation\n- Atomic, nuclear and particle physics\n- Energy production\n- Fields (HL only)\n- Electromagnetic induction (HL only)\n- Quantum and nuclear physics (HL only)\n- Option topic (HL only)\n- Practical work including Internal Assessment", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Outline and Weightage</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- SL: Paper 1 (20%), Paper 2 (40%), Paper 3 (20%), Internal Assessment (20%)\n- HL: Paper 1 (20%), Paper 2 (36%), Paper 3 (24%), Internal Assessment (20%)", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Objectives in Practice</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("AO1: Demonstrate knowledge and understanding of facts, concepts, and principles.\nAO2: Apply knowledge to solve problems and interpret data.\nAO3: Formulate, analyze and evaluate hypotheses and experimental procedures.\nAO4: Demonstrate the ability to collect, process and present scientific information.", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'coreThemes' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8 }}>Concepts, Content, and Contexts</Text>
                          
                          {/* Concepts, Content, and Contexts Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
                            {/* Header Row */}
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 1.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Concepts</Text>
                              <Text style={{ flex: 1.25, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Content</Text>
                              <Text style={{ flex: 1.25, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Contexts</Text>
                            </View>
                            
                            {/* Data Rows */}
                            {[
                              { concept: 'Change', content: 'Mechanics, Thermal physics', context: 'Motion, energy transformation' },
                              { concept: 'Relationships', content: 'Waves, Fields, Electricity', context: 'Interconnected systems and causality' },
                              { concept: 'Models', content: 'Quantum physics, Particle theory', context: 'Predictive tools and simplifications' },
                              { concept: 'Evidence', content: 'Measurements, Experiments', context: 'Observations in real-world settings' },
                              { concept: 'Systems', content: 'Fields, Gravitation', context: 'Isolated and open physical systems' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.concept, highlightedText)}</Text>
                                <Text style={{ flex: 1.25, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.content, highlightedText)}</Text>
                                <Text style={{ flex: 1.25, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.context, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8 }}>Detailed Rubrics – Internal Assessment</Text>
                          
                          {/* Internal Assessment Table (Paraphrased) */}
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
                          
                          {/* Research design — Markbands (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginTop: 16, marginBottom: 8 }}>Research design — Markbands (Paraphrased)</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 1.0, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Marks</Text>
                              <Text style={{ flex: 4.0, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Level descriptor</Text>
                            </View>
                            {[
                              { band: '0', desc: 'Does not meet the basic expectations described below.' },
                              { band: '1–2', desc: 'Question is stated without context. Notes on how data will be gathered are mentioned but not linked to the question. Method steps lack enough detail to repeat the work.' },
                              { band: '3–4', desc: 'Question is set within a broad context. How relevant data will be gathered is described. Method steps mostly allow someone else to repeat the work with few gaps.' },
                              { band: '5–6', desc: 'Question is clearly framed within a specific, appropriate context. How sufficient and relevant data will be gathered is explained. Method steps clearly allow repetition of the work.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1.0, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.band, highlightedText)}</Text>
                                <Text style={{ flex: 4.0, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.desc, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Data analysis — Markbands (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginTop: 16, marginBottom: 8 }}>Data analysis — Markbands (Paraphrased)</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 1.0, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Marks</Text>
                              <Text style={{ flex: 4.0, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Level descriptor</Text>
                            </View>
                            {[
                              { band: '0', desc: 'Does not meet the basic expectations described below.' },
                              { band: '1–2', desc: 'Data recording/processing is shown but is unclear or imprecise. Little consideration of uncertainties. Some relevant processing attempted but with major gaps or errors.' },
                              { band: '3–4', desc: 'Recording/processing is clear or precise (one but not both). Evidence of thinking about uncertainties, but with notable omissions or inaccuracies. Processing related to the question has significant gaps or mistakes.' },
                              { band: '5–6', desc: 'Recording and processing are both clear and precise. Uncertainties are handled appropriately. Processing relevant to the question is carried out carefully and accurately.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1.0, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.band, highlightedText)}</Text>
                                <Text style={{ flex: 4.0, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.desc, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Conclusion — Markbands (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginTop: 16, marginBottom: 8 }}>Conclusion — Markbands (Paraphrased)</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 1.0, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Marks</Text>
                              <Text style={{ flex: 4.0, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Level descriptor</Text>
                            </View>
                            {[
                              { band: '0', desc: 'Does not meet the basic expectations described below.' },
                              { band: '1–2', desc: 'States a conclusion relevant to the question but not supported by the analysis. Any comparison to accepted science is superficial.' },
                              { band: '3–4', desc: 'Describes a conclusion relevant to the question but not fully consistent with the analysis. Makes some relevant comparison to accepted science.' },
                              { band: '5–6', desc: 'Justifies a conclusion relevant to the question and fully consistent with the analysis. Supports it with relevant comparison to accepted science.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1.0, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.band, highlightedText)}</Text>
                                <Text style={{ flex: 4.0, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.desc, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Evaluation — Markbands (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginTop: 16, marginBottom: 8 }}>Evaluation — Markbands (Paraphrased)</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 1.0, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Marks</Text>
                              <Text style={{ flex: 4.0, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Level descriptor</Text>
                            </View>
                            {[
                              { band: '0', desc: 'Does not meet the basic expectations described below.' },
                              { band: '1–2', desc: 'States general weaknesses or limits in the method. Lists improvements, but only as statements.' },
                              { band: '3–4', desc: 'Describes specific weaknesses or limits. Describes realistic improvements that relate to those issues.' },
                              { band: '5–6', desc: 'Explains the impact of specific weaknesses or limits. Explains realistic, relevant improvements that address those issues.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1.0, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.band, highlightedText)}</Text>
                                <Text style={{ flex: 4.0, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.desc, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* External Assessment — SL (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginTop: 16, marginBottom: 8 }}>External Assessment — SL (Paraphrased)</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 3, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Component & details</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Weight (%)</Text>
                            </View>
                            {/* Paper 1 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF', backgroundColor: 'rgba(126, 195, 255, 0.06)' }}>
                              <View style={{ flex: 3, padding: 12 }}>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular' }}>Paper 1 (1h 30m) — 45 marks</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular' }}>• Two booklets taken together: 1A (25 marks, 25 multiple‑choice on SL content, no penalty for wrong answers) and 1B (20 marks, questions based on data)</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular' }}>• Checks knowledge, understanding and analysis</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular' }}>• Calculators allowed; bring the Physics data booklet (school provides copies)</Text>
                              </View>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>36</Text>
                            </View>
                            {/* Paper 2 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <View style={{ flex: 3, padding: 12 }}>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular' }}>Paper 2 (1h 30m) — 50 marks</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular' }}>• Short‑answer and extended response on SL content</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular' }}>• Checks core objectives (knowledge, understanding, analysis)</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular' }}>• Calculators allowed; Physics data booklet required (school ensures copies)</Text>
                              </View>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>44</Text>
                            </View>
                          </View>
                          
                          {/* External Assessment — HL (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginTop: 16, marginBottom: 8 }}>External Assessment — HL (Paraphrased)</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 3, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Component & details</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Weight (%)</Text>
                            </View>
                            {/* Paper 1 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF', backgroundColor: 'rgba(126, 195, 255, 0.06)' }}>
                              <View style={{ flex: 3, padding: 12 }}>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular' }}>Paper 1 (2h) — 60 marks</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular' }}>• Two booklets taken together: 1A (40 marks, 40 multiple‑choice on SL + HL content, no penalty for wrong answers) and 1B (20 marks, questions based on data)</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular' }}>• Checks knowledge, understanding and analysis (objectives 1–3)</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular' }}>• Calculators allowed; Physics data booklet required (school provides copies)</Text>
                              </View>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>36</Text>
                            </View>
                            {/* Paper 2 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <View style={{ flex: 3, padding: 12 }}>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular' }}>Paper 2 (2h 30m) — 90 marks</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular' }}>• Short‑answer and extended response on SL + HL content</Text>
                                <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular' }}>• Checks objectives 1–3; calculators and Physics data booklet allowed</Text>
                              </View>
                              <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>44</Text>
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
            
            <View>
              <List.Item
                title="Physics Tips"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('physicsTips')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'physicsTips' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'physicsTips' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('physicsTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText(sectionContentStrings.physicsTips, highlightedText)}</Text>
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
              subject: 'PHYSICS', 
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

export default PhysicsScreen; 