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

const EconomicsScreen = ({ navigation, route }: { navigation: any; route: any }) => {
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
  const economicsTipsAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  // Section keys and content for search
  const sectionContentStrings: Record<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'economicsTips', string> = {
    overview: `Syllabus Overview\nThe IB Economics course encourages critical engagement with real-world economic issues through theoretical frameworks, data analysis, and key economic concepts. It is structured into four main units: Introduction to Economics, Microeconomics, Macroeconomics, and The Global Economy. The course incorporates nine key concepts: scarcity, choice, efficiency, equity, economic well-being, sustainability, change, interdependence, and intervention. HL students study additional extension content and Paper 3 with a quantitative focus.`,
    essentials: `Assessment Objectives in Practice\n• AO1 – Knowledge and understanding: Demonstrate knowledge of economic content, models, and real-world issues.\n• AO2 – Application and analysis: Apply theories to data, explain economic outcomes, and analyze relationships.\n• AO3 – Synthesis and evaluation: Discuss theories, construct arguments, evaluate data, and make policy recommendations.\n• AO4 – Use and application of skills: Produce structured responses using economic terms, diagrams, and calculations.\n\nAssessment Outline & Weightages\n• SL External: Paper 1 (30%), Paper 2 (40%) | Internal: Portfolio (30%)\n• HL External: Paper 1 (20%), Paper 2 (30%), Paper 3 (30%) | Internal: Portfolio (20%)\n\nInternal and External Assessment Details\n• Paper 1: Two structured essay questions (a & b) from micro and macroeconomics (SL/HL).\n• Paper 2: Data response question from micro/macro/global economy, based on unseen stimulus (SL/HL).\n• Paper 3 (HL only): Quantitative response paper requiring calculations and diagrammatic analysis.\n• Internal Assessment (SL & HL): Portfolio of three commentaries analyzing recent news articles using economic theory.`,
    coreThemes: `Syllabus Outline\n\nUnit 1: Introduction to Economics – Basic economic concepts, models, PPC, circular flow of income.\n\nUnit 2: Microeconomics – Demand/supply, elasticity, market failure, government intervention, HL: market power.\n\nUnit 3: Macroeconomics – AD/AS, economic objectives, policies, inequality, HL: advanced calculations.\n\nUnit 4: Global Economy – Trade, exchange rates, BoP, protectionism, development, HL: integration and calculations.`,
    detailedRubrics: `Assessment Guidelines – Essay Response Evaluation\n\nPaper 1 – Comprehensive Response Scoring (25 marks)\n\nEach question is structured as:\n• Part (a) (10 marks)\n• Part (b) (15 marks)\n\nPart (a) – 10 Marks Scoring Guide\n\n1-2 marks: Minimal comprehension; economic concepts and terminology are unclear or inappropriate.\n\n3-4 marks: Basic comprehension; fundamental economic principles outlined; restricted use of terminology.\n\n5-6 marks: Adequate comprehension; some visual aids and terminology; incomplete organization.\n\n7-8 marks: Strong comprehension; appropriate examples; visual aids mostly accurate; well-organized response.\n\n9-10 marks: Outstanding comprehension; concepts, examples, and visual aids are appropriate and thoroughly developed.\n\nPaper 3 (HL Only) – Quantitative Analysis Scoring (17 marks)\n\nCriterion A: Source material utilization\nIntegration of case study and supporting resources\nMarks: 4\n\nCriterion B: Analytical frameworks and concepts\nEffective application of analytical tools and economic principles\nMarks: 4\n\nCriterion C: Critical assessment\nAnalysis of consequences and alternative approaches for the organization\nMarks: 6\n\nCriterion D: Logical organization\nCoherent progression and clarity of strategic recommendations\nMarks: 3\n\nTotal: 17 marks\n\nPortfolio Assessment (SL/HL) – Independent Research Project (25 marks)\n\nCriterion A: Core principle integration\nConnection and application of fundamental concepts (e.g., sustainability, ethics)\nMarks: 5\n\nCriterion B: Reference materials\nRelevance and variety of selected source documentation\nMarks: 4\n\nCriterion C: Analytical methods and frameworks\nSelection and implementation of theoretical approaches\nMarks: 4\n\nCriterion D: Data interpretation and evaluation\nUtilization of information to investigate research focus with depth and integration\nMarks: 5\n\nCriterion E: Summary findings\nConclusion alignment and connection to research objectives\nMarks: 3\n\nCriterion F: Organization and structure\nCoherence, logical flow, and clarity of presentation\nMarks: 2\n\nCriterion G: Academic formatting\nCitation standards, bibliography, and format compliance\nMarks: 2\n\nTotal: 25 marks`,
    economicsTips: `Top 10 Study Tips for Success\n\n• 1. Know all diagrams—practice drawing and explaining them clearly.\n\n• 2. Practice writing concise, structured responses using economic terms.\n\n• 3. Link real-world examples to every major concept.\n\n• 4. Use command terms to guide answer structure (e.g., evaluate, explain, distinguish).\n\n• 5. Practice numerical and diagrammatic skills regularly for Paper 3 (HL).\n\n• 6. Build your IA portfolio early with diverse article types.\n\n• 7. Compare different schools of thought in macroeconomics.\n\n• 8. Master definitions and calculations for elasticity, multiplier, GDP, etc.\n\n• 9. Integrate the 9 key concepts into your analysis.\n\n• 10. Plan essay responses with clear thesis, argument, examples, and evaluation.`,
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'economicsTips'> = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'economicsTips'];

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
      'economicsTips': economicsTipsAnimation,
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
      'economicsTips': 'Economics Tips',
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
      'economicsTips': economicsTipsAnimation,
    }[expandedSection];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    const allSectionKeys = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'economicsTips'];
    allSectionKeys.forEach(key => {
      if (key !== expandedSection) {
        const anim = {
          'overview': overviewAnimation,
          'essentials': essentialsAnimation,
          'coreThemes': coreThemesAnimation,
          'detailedRubrics': detailedRubricsAnimation,
          'economicsTips': economicsTipsAnimation,
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
      'economicsTips': economicsTipsAnimation,
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Economics</Text>
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
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Assessment Objectives in Practice</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• AO1 – Knowledge and understanding: Demonstrate knowledge of economic content, models, and real-world issues.\n• AO2 – Application and analysis: Apply theories to data, explain economic outcomes, and analyze relationships.\n• AO3 – Synthesis and evaluation: Discuss theories, construct arguments, evaluate data, and make policy recommendations.\n• AO4 – Use and application of skills: Produce structured responses using economic terms, diagrams, and calculations.", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Outline & Weightages</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• SL External: Paper 1 (30%), Paper 2 (40%) | Internal: Portfolio (30%)\n• HL External: Paper 1 (20%), Paper 2 (30%), Paper 3 (30%) | Internal: Portfolio (20%)", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Internal and External Assessment Details</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Paper 1: Two structured essay questions (a & b) from micro and macroeconomics (SL/HL).\n• Paper 2: Data response question from micro/macro/global economy, based on unseen stimulus (SL/HL).\n• Paper 3 (HL only): Quantitative response paper requiring calculations and diagrammatic analysis.\n• Internal Assessment (SL & HL): Portfolio of three commentaries analyzing recent news articles using economic theory.", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'coreThemes' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8 }}>Syllabus Outline</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText("Unit 1: Introduction to Economics – Basic economic concepts, models, PPC, circular flow of income.\n\nUnit 2: Microeconomics – Demand/supply, elasticity, market failure, government intervention, HL: market power.\n\nUnit 3: Macroeconomics – AD/AS, economic objectives, policies, inequality, HL: advanced calculations.\n\nUnit 4: Global Economy – Trade, exchange rates, BoP, protectionism, development, HL: integration and calculations.", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 12 }}>Assessment Guidelines – Essay Response Evaluation</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginBottom: 8 }}>Paper 1 – Comprehensive Response Scoring (25 marks)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 20, marginBottom: 12 }}>{highlightText("Each question is structured as:\n• Part (a) (10 marks)\n• Part (b) (15 marks)", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginBottom: 8 }}>Part (a) – 10 Marks Scoring Guide</Text>
                          
                          {/* Paper 1 Rubric Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Performance Descriptor</Text>
                            </View>
                            {[
                              { marks: '1-2', description: 'Minimal comprehension; economic concepts and terminology are unclear or inappropriate.' },
                              { marks: '3-4', description: 'Basic comprehension; fundamental economic principles outlined; restricted use of terminology.' },
                              { marks: '5-6', description: 'Adequate comprehension; some visual aids and terminology; incomplete organization.' },
                              { marks: '7-8', description: 'Strong comprehension; appropriate examples; visual aids mostly accurate; well-organized response.' },
                              { marks: '9-10', description: 'Outstanding comprehension; concepts, examples, and visual aids are appropriate and thoroughly developed.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.marks, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginTop: 20, marginBottom: 8 }}>Paper 3 (HL Only) – Quantitative Analysis Scoring (17 marks)</Text>
                          
                          {/* Paper 3 Rubric Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2, padding: 8 }}>Criterion</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Description</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Max Marks</Text>
                            </View>
                            {[
                              { criterion: 'A: Source material utilization', description: 'Integration of case study and supporting resources', marks: '4' },
                              { criterion: 'B: Analytical frameworks and concepts', description: 'Effective application of analytical tools and economic principles', marks: '4' },
                              { criterion: 'C: Critical assessment', description: 'Analysis of consequences and alternative approaches for the organization', marks: '6' },
                              { criterion: 'D: Logical organization', description: 'Coherent progression and clarity of strategic recommendations', marks: '3' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.criterion, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.description, highlightedText)}</Text>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.marks, highlightedText)}</Text>
                              </View>
                            ))}
                            <View style={{ flexDirection: 'row', borderTopWidth: 2, borderColor: '#7EC3FF', backgroundColor: 'rgba(182,199,247,0.1)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 8, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Total</Text>
                              <Text style={{ flex: 3, color: '#7EC3FF', padding: 8, fontFamily: 'ScopeOne-Regular' }}> </Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>17</Text>
                            </View>
                          </View>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginTop: 20, marginBottom: 8 }}>Portfolio Assessment (SL/HL) – Independent Research Project (25 marks)</Text>
                          
                          {/* Portfolio Assessment Rubric Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2, padding: 8 }}>Criterion</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Focus</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Max Marks</Text>
                            </View>
                            {[
                              { criterion: 'A: Core principle integration', focus: 'Connection and application of fundamental concepts (e.g., sustainability, ethics)', marks: '5' },
                              { criterion: 'B: Reference materials', focus: 'Relevance and variety of selected source documentation', marks: '4' },
                              { criterion: 'C: Analytical methods and frameworks', focus: 'Selection and implementation of theoretical approaches', marks: '4' },
                              { criterion: 'D: Data interpretation and evaluation', focus: 'Utilization of information to investigate research focus with depth and integration', marks: '5' },
                              { criterion: 'E: Summary findings', focus: 'Conclusion alignment and connection to research objectives', marks: '3' },
                              { criterion: 'F: Organization and structure', focus: 'Coherence, logical flow, and clarity of presentation', marks: '2' },
                              { criterion: 'G: Academic formatting', focus: 'Citation standards, bibliography, and format compliance', marks: '2' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.criterion, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.focus, highlightedText)}</Text>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.marks, highlightedText)}</Text>
                              </View>
                            ))}
                            <View style={{ flexDirection: 'row', borderTopWidth: 2, borderColor: '#7EC3FF', backgroundColor: 'rgba(182,199,247,0.1)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 8, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Total</Text>
                              <Text style={{ flex: 3, color: '#7EC3FF', padding: 8, fontFamily: 'ScopeOne-Regular' }}> </Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>25</Text>
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
                title="Economics Tips"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('economicsTips')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'economicsTips' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'economicsTips' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('economicsTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 16 }}>Top 10 Study Tips for Success</Text>
                      
                      <View style={{ marginBottom: 8 }}>
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', lineHeight: 22 }}>{highlightText("• 1. Know all diagrams—practice drawing and explaining them clearly.\n\n• 2. Practice writing concise, structured responses using economic terms.\n\n• 3. Link real-world examples to every major concept.\n\n• 4. Use command terms to guide answer structure (e.g., evaluate, explain, distinguish).\n\n• 5. Practice numerical and diagrammatic skills regularly for Paper 3 (HL).\n\n• 6. Build your IA portfolio early with diverse article types.\n\n• 7. Compare different schools of thought in macroeconomics.\n\n• 8. Master definitions and calculations for elasticity, multiplier, GDP, etc.\n\n• 9. Integrate the 9 key concepts into your analysis.\n\n• 10. Plan essay responses with clear thesis, argument, examples, and evaluation.", highlightedText)}</Text>
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
              subject: 'ECONOMICS', 
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

export default EconomicsScreen; 