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

const BusinessManagementScreen = ({ navigation, route }: { navigation: any; route: any }) => {
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
  const businessTipsAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  // Section keys and content for search
  const sectionContentStrings: Record<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'businessTips', string> = {
    overview: `Syllabus Overview\nThe IB Business Management course provides students with a comprehensive understanding of business theory and practice. Students explore how businesses operate in different contexts and cultures, examining organizational behavior, strategy, and decision-making processes. The course emphasizes critical thinking, ethical considerations, and real-world application of business concepts through case studies and practical examples.`,
    essentials: `Assessment Objectives in Practice\n• AO1 – Knowledge and understanding: Demonstrate knowledge of business management tools, theories, and concepts.\n• AO2 – Application and analysis: Apply business management tools, theories, and concepts to given business situations.\n• AO3 – Synthesis and evaluation: Examine business strategies and practices, showing awareness of stakeholder interests and ethical concerns.\n• AO4 – Use and application of skills: Select and use appropriate business management tools, theories, and concepts to analyze business situations.\n\nAssessment Outline & Weightages\n• SL External: Paper 1 (25%), Paper 2 (50%) | Internal: Research Project (25%)\n• HL External: Paper 1 (20%), Paper 2 (40%), Paper 3 (20%) | Internal: Research Project (20%)\n\nInternal and External Assessment Details\n• Paper 1: Section A (10 marks) and Section B (15 marks) based on a business case study (SL/HL).\n• Paper 2: Structured questions based on stimulus material covering all course content (SL/HL).\n• Paper 3 (HL only): Two structured questions from a choice of three (HL only).\n• Internal Assessment (SL & HL): Research project investigating a real business issue or decision.`,
    coreThemes: `Syllabus Outline\n\nUnit 1: Business Organization and Environment – Introduction to business management, types of organizations, organizational objectives, stakeholders, external environment.\n\nUnit 2: Human Resource Management – Human resource planning, organizational structure, leadership and management, motivation, organizational culture, communication.\n\nUnit 3: Finance and Accounts – Sources of finance, costs and revenues, break-even analysis, final accounts, profitability and liquidity ratio analysis, efficiency ratio analysis, investment appraisal.\n\nUnit 4: Marketing – The role of marketing, market research, the four Ps, international marketing.\n\nUnit 5: Operations Management – The role of operations management, production methods, lean production and quality management, location, production planning, research and development.\n\nHL Extension Topics:\n• Strategic planning\n• International business\n• Digital business innovation`,
    detailedRubrics: `Assessment Guidelines – Research Project Evaluation\n\nInternal Assessment – Research Project Scoring (25 marks total)\n\nCriterion A: Knowledge and understanding\nDemonstration of relevant business management knowledge and understanding\nMarks: 0-7\n\nCriterion B: Application\nApplication of business management tools, theories and techniques\nMarks: 0-6\n\nCriterion C: Reasoned arguments\nPresentation of reasoned arguments based on analysis and evaluation\nMarks: 0-6\n\nCriterion D: Structure\nStructure and presentation of the research project\nMarks: 0-3\n\nCriterion E: Individuals and societies\nAwareness of ethical issues and consideration of stakeholder interests\nMarks: 0-3\n\nTotal: 25 marks`,
    businessTips: `Top 10 Study Tips for Success – Business Management\n\n• Master key business theories and models early in the course.\n\n• Stay updated with current business news and case studies.\n\n• Practice applying business tools and theories to real situations.\n\n• Develop strong analytical and evaluation skills for higher marks.\n\n• Understand stakeholder perspectives and ethical considerations.\n\n• Practice writing clear, structured responses with business terminology.\n\n• Choose a focused and manageable topic for your research project.\n\n• Use real business examples to support your arguments.\n\n• Understand the difference between analysis and evaluation in responses.\n\n• Review past papers and mark schemes regularly for exam preparation.`,
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'businessTips'> = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'businessTips'];

  // Full-text blob of Detailed Rubrics content to improve search coverage
  const detailedRubricsSearchContent = `
  Assessment Guidelines Research Project Evaluation
  Internal Assessment Research Project Scoring 25 marks total
  A Knowledge and understanding Demonstration of relevant business management knowledge and understanding 0-7
  B Application Application of business management tools theories and techniques 0-6
  C Reasoned arguments Presentation of reasoned arguments based on analysis and evaluation 0-6
  D Structure Structure and presentation of the research project 0-3
  E Individuals and societies Awareness of ethical issues and consideration of stakeholder interests 0-3
  `;

  const toggleSection = (section: string) => {
    const animationValues = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'coreThemes': coreThemesAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'businessTips': businessTipsAnimation,
    };
    
    if (expandedSection === section) {
      Animated.timing(animationValues[section as keyof typeof animationValues], {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setExpandedSection(null);
    } else {
      if (expandedSection) {
        Animated.timing(animationValues[expandedSection as keyof typeof animationValues], {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
      setExpandedSection(section);
      Animated.timing(animationValues[section as keyof typeof animationValues], {
        toValue: 1,
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
      'businessTips': 'Business Management Tips',
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
      const animationValues = {
        'overview': overviewAnimation,
        'essentials': essentialsAnimation,
        'coreThemes': coreThemesAnimation,
        'detailedRubrics': detailedRubricsAnimation,
        'businessTips': businessTipsAnimation,
      };
      Animated.timing(animationValues[matches[0] as keyof typeof animationValues], {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleNextMatch = () => {
    if (matchingSections.length > 1) {
      const nextIndex = (currentMatchIndex + 1) % matchingSections.length;
      setCurrentMatchIndex(nextIndex);
      const nextSection = matchingSections[nextIndex];
      setExpandedSection(nextSection);
      const animationValues = {
        'overview': overviewAnimation,
        'essentials': essentialsAnimation,
        'coreThemes': coreThemesAnimation,
        'detailedRubrics': detailedRubricsAnimation,
        'businessTips': businessTipsAnimation,
      };
      Animated.timing(animationValues[nextSection as keyof typeof animationValues], {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleScroll = () => {
    Animated.timing(homeIconOpacity, {
      toValue: 0.7,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  // Auto-scroll to matching section when search results change
  useEffect(() => {
    if (matchingSections.length > 0 && expandedSection) {
      const animationValues = {
        'overview': overviewAnimation,
        'essentials': essentialsAnimation,
        'coreThemes': coreThemesAnimation,
        'detailedRubrics': detailedRubricsAnimation,
        'businessTips': businessTipsAnimation,
      };
      
      if (animationValues[expandedSection as keyof typeof animationValues]) {
        Animated.timing(animationValues[expandedSection as keyof typeof animationValues], {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
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
      'businessTips': businessTipsAnimation,
    }[section];
    if (!animationValue) return null;
    
    // Increase max height for detailed rubrics to accommodate all tables
    const maxHeight = section === 'detailedRubrics' ? 3000 : 2000;
    
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Business Management</Text>
            <Text style={{ fontSize: 16, color: '#8A97A7', fontFamily: 'ScopeOne-Regular', marginBottom: 12 }}>Group 3: Individuals and Societies</Text>
            <View style={{ height: 2, backgroundColor: '#7EC3FF', marginBottom: 8 }} />
          </View>
          {/* Dropdowns */}
          {[{ key: 'overview', title: 'Course Overview' }, { key: 'essentials', title: 'Subject Essentials' }, { key: 'coreThemes', title: 'Prescribed Literature' }, { key: 'detailedRubrics', title: 'Detailed Rubrics' }, { key: 'businessTips', title: 'Business Management Tips' }].map((section, idx, arr) => (
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
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• AO1 – Knowledge and understanding: Demonstrate knowledge of business management tools, theories, and concepts.\n• AO2 – Application and analysis: Apply business management tools, theories, and concepts to given business situations.\n• AO3 – Synthesis and evaluation: Examine business strategies and practices, showing awareness of stakeholder interests and ethical concerns.\n• AO4 – Use and application of skills: Select and use appropriate business management tools, theories, and concepts to analyze business situations.", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Outline & Weightages</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• SL External: Paper 1 (25%), Paper 2 (50%) | Internal: Research Project (25%)\n• HL External: Paper 1 (20%), Paper 2 (40%), Paper 3 (20%) | Internal: Research Project (20%)", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Internal and External Assessment Details</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Paper 1: Section A (10 marks) and Section B (15 marks) based on a business case study (SL/HL).\n• Paper 2: Structured questions based on stimulus material covering all course content (SL/HL).\n• Paper 3 (HL only): Two structured questions from a choice of three (HL only).\n• Internal Assessment (SL & HL): Research project investigating a real business issue or decision.", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'coreThemes' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8 }}>Syllabus Outline</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(sectionContentStrings.coreThemes, highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 12 }}>Assessment Guidelines – Research Project Evaluation</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(sectionContentStrings.detailedRubrics, highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'businessTips' && (
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(sectionContentStrings.businessTips, highlightedText)}</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {userType === 'student' && (
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(126, 195, 255, 0.2)',
              borderRadius: 16,
              padding: 20,
              marginTop: 32,
              borderWidth: 1,
              borderColor: '#7EC3FF',
            }}
            onPress={() => navigation.navigate('GradePrediction', { subject: 'BUSINESS_MANAGEMENT', userType })}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#7EC3FF', textAlign: 'center', marginBottom: 8, fontFamily: 'ScopeOne-Regular' }}>
              Grade Prediction
            </Text>
            <Text style={{ color: '#B6B6B6', textAlign: 'center', fontFamily: 'ScopeOne-Regular' }}>
              Predict your final grade based on your current performance across all assessment components.
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

export default BusinessManagementScreen;