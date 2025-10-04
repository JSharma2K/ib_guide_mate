import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated, StatusBar, ImageBackground, TouchableOpacity } from 'react-native';
import { Text, Card, List, Searchbar, Button as PaperButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, gradientColors, styles as themeStyles } from '../theme/theme';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
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

const ChemistryScreen = ({ navigation, route }: { navigation: any; route: any }) => {
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
  const chemistryTipsAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  // Section keys and content for search
  const sectionContentStrings: Record<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'chemistryTips', string> = {
    overview: `The Chemistry course develops students' understanding of chemical principles, scientific methodology, and real-world applications. Through practical work and conceptual knowledge, students explore the behavior of matter, chemical reactions, and energy changes. This course also promotes inquiry and investigation through experimental design.`,
    essentials: `**Course Structure and Teaching Hours**\nStandard Level: 150 hours, Higher Level: 240 hours\n- Stoichiometric relationships\n- Atomic structure\n- Periodicity\n- Chemical bonding and structure\n- Energetics/thermochemistry\n- Chemical kinetics\n- Equilibrium\n- Acids and bases\n- Redox processes\n- Organic chemistry\n- Measurement and data processing (Analytical techniques for Higher Level)\n- Option topic (Higher Level only)\n- Practical work including Individual Investigation\n\n**Learning Objectives in Practice**\nLO1: Demonstrate knowledge and understanding of facts, concepts, and theories.\nLO2: Apply knowledge to solve problems, interpret data and predict outcomes.\nLO3: Formulate, analyze and evaluate hypotheses and experimental procedures.\nLO4: Demonstrate the ability to collect, process and present scientific information.\n\n**Assessment Structure and Weightings**\nStandard Level: Paper 1 (20%), Paper 2 (40%), Paper 3 (20%), Individual Investigation (20%)\nHigher Level: Paper 1 (20%), Paper 2 (36%), Paper 3 (24%), Individual Investigation (20%)`,
    coreThemes: `Overview of the Course: Concepts, Content, and Contexts\n\nStructure: Atomic structure, Periodicity, Bonding - Periodic trends and atomic models\nChange: Energetics, Kinetics, Equilibrium - Thermodynamics and rates\nIdentity: Organic Chemistry, Redox - Structure-based identification\nMeasurement: Analytical techniques - Quantitative chemistry in context\nInteraction: Acids & bases, Redox - Chemical reactions in real life\n\nConcepts Content Contexts Structure Atomic Periodicity Bonding Periodic trends atomic models Change Energetics Kinetics Equilibrium Thermodynamics rates Identity Organic Chemistry Redox Structure-based identification Measurement Analytical techniques Quantitative chemistry context Interaction Acids bases Redox Chemical reactions real life`,
    detailedRubrics: `Assessment Framework - Individual Investigation\n\nStudent engagement: Shows personal curiosity, original thinking, and authentic interest in the topic - 2 marks\nInvestigation design: Clear research focus with solid theoretical foundation and suitable experimental approach - 6 marks\nData analysis: Effective processing and interpretation of results with appropriate mathematical treatment - 6 marks\nEvaluation: Evidence-based conclusions with thoughtful discussion of study limitations and potential improvements - 6 marks\nCommunication: Clear organization, appropriate scientific terminology, and proper source attribution - 4 marks\nTotal: 24 marks\n\nCriterion Description Marks Student engagement Investigation design Data analysis Evaluation Communication personal curiosity original thinking authentic interest research focus theoretical foundation experimental approach processing interpretation results mathematical treatment evidence-based conclusions limitations improvements organization scientific terminology source attribution`,
    chemistryTips: `• Master stoichiometric conversions and chemical equation balancing.

• Use flashcards for periodic trends and organic reactions.

• Regularly practice IB-style data-based and calculation questions.

• Review practicals to understand how lab techniques support concepts.

• Apply concepts to real-world examples for better retention.

• Highlight common misconceptions in bonding, energetics, and equilibrium.

• Use flowcharts for reaction mechanisms and topic interlinking.

• Understand command terms—especially explain, compare, and evaluate.

• Time yourself with practice papers for each paper format.

• Maintain a revision journal and review errors actively.`,
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'chemistryTips'> = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'chemistryTips'];

  // Full-text blob of Detailed Rubrics content to improve search coverage
  const detailedRubricsSearchContent = `
  Internal assessment
  Research design 6 25
  Data analysis 6 25
  Conclusion 6 25
  Evaluation 6 25
  Total 24 100

  Research design Markbands Paraphrased
  0 Does not meet the basic expectations described below
  1-2 Question is stated without context Notes about how data will be gathered are mentioned but not connected to the question Method steps lack enough detail to repeat the work
  3-4 Question is placed within a broad context How relevant data will be gathered is described Method steps mostly allow someone else to repeat the work with few gaps
  5-6 Question is clearly framed within a specific appropriate context How sufficient and relevant data will be gathered is explained Method steps clearly allow repetition of the work

  Data analysis Markbands Paraphrased
  0 Does not meet the basic expectations described below
  1-2 Data recording processing is shown but is unclear or imprecise Little consideration of uncertainties Some relevant processing attempted but with major gaps or errors
  3-4 Recording processing is clear or precise one but not both Evidence of thinking about uncertainties but with notable omissions or inaccuracies Processing relevant to the question is done but has significant gaps or mistakes
  5-6 Recording and processing are both clear and precise Uncertainties are handled appropriately Processing relevant to the question is carried out carefully and accurately

  Conclusion Markbands Paraphrased
  0 Does not meet the basic expectations described below
  1-2 States a conclusion that fits the question but is not supported by the analysis Any comparison to accepted science is superficial
  3-4 Describes a conclusion that fits the question but is not fully consistent with the analysis Makes some relevant comparison to accepted science
  5-6 Justifies a conclusion that fits the question and fully matches the analysis Supports it with relevant comparison to accepted science

  Evaluation Markbands Paraphrased
  0 Does not meet the basic expectations described below
  1-2 States general weaknesses or limits in the method Lists improvements but only as statements
  3-4 Describes specific weaknesses or limits Describes realistic improvements that relate to those issues
  5-6 Explains the impact of specific weaknesses or limits Explains realistic relevant improvements that address those issues

  Assessment Outline SL Paraphrased
  External assessment 3 hours
  Paper 1 1 hour 30 minutes Paper 1A Multiple choice questions Paper 1B Data based questions Total 55 marks
  Paper 2 1 hour 30 minutes Short answer and extended response questions Total 50 marks 44%
  Paper 1 combined weighting 36%
  External assessment total 80%
  Internal assessment 10 hours One task a scientific investigation Marked by the school and checked by external moderators at the end of the course Total 24 marks 20%

  Assessment Outline HL Paraphrased
  External assessment 4 hours 30 minutes
  Paper 1 2 hours Paper 1A Multiple choice questions Paper 1B Data based questions Total 75 marks
  Paper 2 2 hours 30 minutes Short answer and extended response questions Total 90 marks 44%
  Paper 1 combined weighting 36%
  External assessment total 80%
  Internal assessment 10 hours One task a scientific investigation Marked by the school and checked by external moderators at the end of the course Total 24 marks 20%
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
      'chemistryTips': chemistryTipsAnimation,
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
      'chemistryTips': 'Chemistry Tips',
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
      'chemistryTips': chemistryTipsAnimation,
    }[expandedSection];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    const allSectionKeys = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'chemistryTips'];
    allSectionKeys.forEach(key => {
      if (key !== expandedSection) {
        const anim = {
          'overview': overviewAnimation,
          'essentials': essentialsAnimation,
          'coreThemes': coreThemesAnimation,
          'detailedRubrics': detailedRubricsAnimation,
          'chemistryTips': chemistryTipsAnimation,
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

  const renderAnimatedContent = (section: 'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'chemistryTips', content: React.ReactNode) => {
    const animationValue = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'coreThemes': coreThemesAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'chemistryTips': chemistryTipsAnimation,
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Chemistry</Text>
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
                  {renderAnimatedContent(section.key as 'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'chemistryTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      {section.key === 'overview' && (
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText(sectionContentStrings.overview, highlightedText)}</Text>
                      )}
                      {section.key === 'essentials' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Course Structure and Teaching Hours</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("Standard Level: 150 hours, Higher Level: 240 hours\n- Stoichiometric relationships\n- Atomic structure\n- Periodicity\n- Chemical bonding and structure\n- Energetics/thermochemistry\n- Chemical kinetics\n- Equilibrium\n- Acids and bases\n- Redox processes\n- Organic chemistry\n- Measurement and data processing (Analytical techniques for Higher Level)\n- Option topic (Higher Level only)\n- Practical work including Individual Investigation", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Learning Objectives in Practice</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("LO1: Demonstrate knowledge and understanding of facts, concepts, and theories.\nLO2: Apply knowledge to solve problems, interpret data and predict outcomes.\nLO3: Formulate, analyze and evaluate hypotheses and experimental procedures.\nLO4: Demonstrate the ability to collect, process and present scientific information.", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Structure and Weightings</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("Standard Level:\n• Paper 1: Multiple choice questions – 20%\n• Paper 2: Data-based and short/extended response questions – 40%\n• Paper 3: Data-based and practical skills questions – 20%\n• Internal Assessment: Individual investigation – 20%\n\nHigher Level:\n• Paper 1: Multiple choice questions – 20%\n• Paper 2: Short and extended response questions – 36%\n• Paper 3: Data-based and practical skills questions – 24%\n• Internal Assessment: Individual investigation – 20%", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'coreThemes' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8 }}>Overview of the Course: Concepts, Content, and Contexts</Text>
                          
                          {/* First Table - Concepts, Content, and Contexts */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
                            {/* Header Row */}
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Concepts</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Content</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Contexts</Text>
                            </View>
                            
                            {/* Data Rows */}
                            {[
                              { concept: 'Structure', content: 'Atomic structure, Periodicity, Bonding', context: 'Periodic trends and atomic models' },
                              { concept: 'Change', content: 'Energetics, Kinetics, Equilibrium', context: 'Thermodynamics and rates' },
                              { concept: 'Identity', content: 'Organic Chemistry, Redox', context: 'Structure-based identification' },
                              { concept: 'Measurement', content: 'Analytical techniques', context: 'Quantitative chemistry in context' },
                              { concept: 'Interaction', content: 'Acids & bases, Redox', context: 'Chemical reactions in real life' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.concept, highlightedText)}</Text>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.content, highlightedText)}</Text>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.context, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8 }}>Internal assessment</Text>
                          
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
                            {/* Header Row */}
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 1.0, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Marks</Text>
                              <Text style={{ flex: 4.0, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Level descriptor</Text>
                            </View>
                            {[
                              { band: '0', desc: 'Does not meet the basic expectations described below.' },
                              { band: '1–2', desc: 'Question is stated without context. Notes about how data will be gathered are mentioned but not connected to the question. Method steps lack enough detail to repeat the work.' },
                              { band: '3–4', desc: 'Question is placed within a broad context. How relevant data will be gathered is described. Method steps mostly allow someone else to repeat the work with few gaps.' },
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
                              { band: '3–4', desc: 'Recording/processing is clear or precise (one but not both). Evidence of thinking about uncertainties, but with notable omissions or inaccuracies. Processing relevant to the question is done but has significant gaps or mistakes.' },
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
                              { band: '1–2', desc: 'States a conclusion that fits the question but is not supported by the analysis. Any comparison to accepted science is superficial.' },
                              { band: '3–4', desc: 'Describes a conclusion that fits the question but is not fully consistent with the analysis. Makes some relevant comparison to accepted science.' },
                              { band: '5–6', desc: 'Justifies a conclusion that fits the question and fully matches the analysis. Supports it with relevant comparison to accepted science.' },
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
                          
                          {/* Assessment Outline — SL (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginTop: 16, marginBottom: 8 }}>Assessment Outline — SL (Paraphrased)</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 3, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Assessment Component</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Weighting</Text>
                            </View>
                            {/* External Assessment */}
                            <View style={{ borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: '600' }}>External assessment (3 hours)</Text>
                              <View style={{ borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular' }}>Paper 1 (1 hour 30 minutes)</Text>
                                <Text style={{ color: '#B6B6B6', paddingHorizontal: 12, fontFamily: 'ScopeOne-Regular' }}>• Paper 1A — Multiple‑choice questions</Text>
                                <Text style={{ color: '#B6B6B6', paddingHorizontal: 12, fontFamily: 'ScopeOne-Regular' }}>• Paper 1B — Data‑based questions</Text>
                                <Text style={{ color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontStyle: 'italic' }}>(Total 55 marks)</Text>
                              </View>
                              <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF', backgroundColor: 'rgba(126, 195, 255, 0.06)' }}>
                                <View style={{ flex: 3 }}>
                                  <Text style={{ color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular' }}>Paper 2 (1 hour 30 minutes)</Text>
                                  <Text style={{ color: '#B6B6B6', paddingHorizontal: 12, fontFamily: 'ScopeOne-Regular' }}>• Short‑answer and extended‑response questions</Text>
                                  <Text style={{ color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontStyle: 'italic' }}>(Total 50 marks)</Text>
                                </View>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>44%</Text>
                              </View>
                              <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <View style={{ flex: 3 }}>
                                  <Text style={{ color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular' }}>Paper 1 combined weighting</Text>
                                </View>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>36%</Text>
                              </View>
                              <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <View style={{ flex: 3 }}>
                                  <Text style={{ color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: '600' }}>External assessment total</Text>
                                </View>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>80%</Text>
                              </View>
                            </View>
                            {/* Internal Assessment */}
                            <View style={{ borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 3 }}>
                                  <Text style={{ color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: '600' }}>Internal assessment (10 hours)</Text>
                                  <Text style={{ color: '#B6B6B6', paddingHorizontal: 12, fontFamily: 'ScopeOne-Regular' }}>• One task: a scientific investigation</Text>
                                  <Text style={{ color: '#B6B6B6', paddingHorizontal: 12, fontFamily: 'ScopeOne-Regular' }}>• Marked by the school and checked by external moderators at the end of the course</Text>
                                  <Text style={{ color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontStyle: 'italic' }}>(Total 24 marks)</Text>
                                </View>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>20%</Text>
                              </View>
                            </View>
                          </View>
                          
                          {/* Assessment Outline — HL (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginTop: 16, marginBottom: 8 }}>Assessment Outline — HL (Paraphrased)</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 3, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Assessment Component</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Weighting</Text>
                            </View>
                            {/* External Assessment */}
                            <View style={{ borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: '600' }}>External assessment (4 hours 30 minutes)</Text>
                              <View style={{ borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular' }}>Paper 1 (2 hours)</Text>
                                <Text style={{ color: '#B6B6B6', paddingHorizontal: 12, fontFamily: 'ScopeOne-Regular' }}>• Paper 1A — Multiple‑choice questions</Text>
                                <Text style={{ color: '#B6B6B6', paddingHorizontal: 12, fontFamily: 'ScopeOne-Regular' }}>• Paper 1B — Data‑based questions</Text>
                                <Text style={{ color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontStyle: 'italic' }}>(Total 75 marks)</Text>
                              </View>
                              <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF', backgroundColor: 'rgba(126, 195, 255, 0.06)' }}>
                                <View style={{ flex: 3 }}>
                                  <Text style={{ color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular' }}>Paper 2 (2 hours 30 minutes)</Text>
                                  <Text style={{ color: '#B6B6B6', paddingHorizontal: 12, fontFamily: 'ScopeOne-Regular' }}>• Short‑answer and extended‑response questions</Text>
                                  <Text style={{ color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontStyle: 'italic' }}>(Total 90 marks)</Text>
                                </View>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>44%</Text>
                              </View>
                              <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <View style={{ flex: 3 }}>
                                  <Text style={{ color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular' }}>Paper 1 combined weighting</Text>
                                </View>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>36%</Text>
                              </View>
                              <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <View style={{ flex: 3 }}>
                                  <Text style={{ color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: '600' }}>External assessment total</Text>
                                </View>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>80%</Text>
                              </View>
                            </View>
                            {/* Internal Assessment */}
                            <View style={{ borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 3 }}>
                                  <Text style={{ color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: '600' }}>Internal assessment (10 hours)</Text>
                                  <Text style={{ color: '#B6B6B6', paddingHorizontal: 12, fontFamily: 'ScopeOne-Regular' }}>• One task: a scientific investigation</Text>
                                  <Text style={{ color: '#B6B6B6', paddingHorizontal: 12, fontFamily: 'ScopeOne-Regular' }}>• Marked by the school and checked by external moderators at the end of the course</Text>
                                  <Text style={{ color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontStyle: 'italic' }}>(Total 24 marks)</Text>
                                </View>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>20%</Text>
                              </View>
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
                title="Chemistry Tips"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('chemistryTips')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'chemistryTips' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'chemistryTips' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('chemistryTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText(sectionContentStrings.chemistryTips, highlightedText)}</Text>
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
              subject: 'CHEMISTRY', 
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

export default ChemistryScreen; 