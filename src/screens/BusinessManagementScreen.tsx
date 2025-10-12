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
    overview: `Syllabus Overview\nThe Business Management course empowers students to become confident, creative, and ethical business leaders. Students explore business functions, decision-making processes, and management tools in a global context. The course revolves around four key interdisciplinary concepts: change, creativity, ethics, and sustainability. Students investigate human resource management, finance, marketing, operations, and strategy. SL and HL students complete an internal assessment project based on a real business issue, with HL students exploring additional extension content and Paper 3. The subject integrates theory and practical applications, preparing students to analyze, evaluate, and communicate business decisions through case studies and real-world challenges.`,
    essentials: `Assessment Objectives in Practice\n• AO1: Demonstrate knowledge and understanding of business management tools, theories, concepts, and problems.\n• AO2: Apply and analyse business tools and concepts to problems and decisions using appropriate data.\n• AO3: Synthesize and evaluate business issues, stakeholder perspectives, and propose recommendations.\n• AO4: Use relevant tools and techniques to communicate structured and reasoned responses effectively.\n\nAssessment Outline & Weightages\n• SL External: Paper 1 (35%), Paper 2 (40%) | Internal: IA (25%)\n• HL External: Paper 1 (30%), Paper 2 (35%), Paper 3 (20%) | Internal: IA (15%)\n\nInternal and External Assessment Details\n• Paper 1: Section A (10 marks) and Section B (15 marks) based on a business case study (SL/HL).\n• Paper 2: Structured questions based on stimulus material covering all course content (SL/HL).\n• Paper 3 (HL only): Two structured questions from a choice of three (HL only).\n• Internal Assessment (SL & HL): Research project investigating a real business issue or decision.`,
    coreThemes: `Business Management Toolkit\nStudents must master and apply these tools across topics:\nFor SL & HL:\n• Decision-making Tools: SWOT Analysis, Ansoff Matrix, Decision Trees, STEEPLE Analysis\n• Financial Tools: Break-even Analysis, Contribution Analysis, Ratios (Liquidity, Profitability, Efficiency)\n• Marketing Tools: BCG Matrix, Product Life Cycle, Boston Matrix\n• Operations Tools: Quality Assurance vs. Quality Control, Supply Chain Diagrams\n• Human Resource Tools: Organizational Charts, Motivation Theories (Maslow, Herzberg, Pink), Recruitment/Training Methods\nHL Only (Extended Toolkit):\n• Gantt Charts – project scheduling and time management\n• Critical Path Analysis (CPA) – identifying minimum time for task completion\n• Porter's Generic Strategies – cost leadership, differentiation, focus\n• Force Field Analysis – understanding driving and restraining forces\n• Linear Regression – forecasting based on trends and relationships\nThese tools must be applied analytically, not just described. Students should reference them in the IA and external assessments (especially Paper 2 and Paper 3).\n\nSyllabus Outline (Organized by Units)\nUnit 1: Introduction to Business Management\n• Functions of business\n• Business types (profit vs non-profit)\n• Organizational objectives\n• Stakeholders\n• Business growth and planning\nUnit 2: Human Resource Management\n• Functions and strategies of HR\n• Organizational structures\n• Leadership styles\n• Motivation theories\n• Recruitment, training, and appraisals\nUnit 3: Finance and Accounts\n• Sources of finance\n• Final accounts and financial ratios\n• Break-even analysis\n• Investment appraisal\nUnit 4: Marketing\n• Market planning and segmentation\n• Product, price, promotion, and place (4 Ps)\n• Branding and international marketing\n• E-commerce\nUnit 5: Operations Management\n• Production methods\n• Lean production\n• Quality management\n• Supply chain\n• Crisis management\nUnit 6: Business Strategy (HL only)\n• Strategic decision-making\n• Tools for strategic analysis\n• Risk management\n• Change management\n\nInternal and External Assessment Details\n• Paper 1: Case-based exam focused on a pre-seen statement (business scenario).\n• Paper 2: Quantitative and qualitative questions on syllabus content and concepts.\n• Paper 3 (HL only): Social enterprise scenario requiring decision-making and recommendation.\n• IA: Business research project based on a real organization. Requires analysis through one key concept.\n\nConcepts and Themes\n• Change: Understanding transformation processes and their drivers.\n• Creativity: Applying innovative solutions in business strategy and operations.\n• Ethics: Navigating moral implications in decision-making and stakeholder impact.\n• Sustainability: Focusing on the triple bottom line—people, planet, and profit.\n\nBusiness Management Toolkit\n• Tools include SWOT, Ansoff Matrix, STEEPLE, Decision Trees, Contribution, Break-even analysis, Gantt Charts (HL), BCG Matrix, and more.\n• HL tools: Porter's Strategies, Critical Path Analysis, Linear Regression, Force Field Analysis.`,
    detailedRubrics: `External Assessment Rubrics\n\nPaper 1 and Paper 2 Extended Response (10 Marks)\nUsed in Section B of both papers.\n\nMarks 0: Does not reach a standard described by the descriptors below.\nMarks 1-2: Little understanding of question demands. Tools/theories used are irrelevant or inaccurate. No arguments made.\nMarks 3-4: Some understanding; mostly superficial use of tools and theories. Arguments mostly unsubstantiated.\nMarks 5-6: Partial understanding; some relevant tools/theories and limited balanced evaluation. Arguments are one-sided.\nMarks 7-8: Mostly addresses the demands; good use of tools and mostly balanced arguments.\nMarks 9-10: Fully addresses question demands with accurate tools, integrated stimulus info, and balanced, substantiated arguments.\n\nPaper 3 (HL Only) Question 3 Rubric (17 Marks)\n\nCriterion A Use of Resource Materials: Integration of case study and supporting resources (4 marks)\nCriterion B Tools & Theories: Effective application of business tools and concepts (4 marks)\nCriterion C Evaluation: Analysis of impact and trade-offs on the business (6 marks)\nCriterion D Sequencing: Logical flow and clarity of action plan (3 marks)\nTotal: 17 marks\n\nInternal Assessment Business Research Project (25 Marks)\n\nCriterion A Key Concept: Connection and integration of concept (e.g., change, ethics) (5 marks)\nCriterion B Supporting Docs: Relevance and diversity of selected source material (4 marks)\nCriterion C Tools & Theories: Selection and application of tools/theories (4 marks)\nCriterion D Analysis & Evaluation: Use of data to explore RQ with integration and depth (5 marks)\nCriterion E Conclusions: Conclusion consistency and link to research question (3 marks)\nCriterion F Structure: Organization, coherence, and clarity of argument (2 marks)\nCriterion G Presentation: Referencing, bibliography, format adherence (2 marks)\nTotal: 25 marks`,
    businessTips: `Top 10 Study Tips for Success\n• 1. Master command terms and know how they map to AO1–AO4.\n• 2. Use real-world case studies in every unit for application-based learning.\n• 3. Develop comfort with finance-based tools: ratios, break-even, and investment appraisal.\n• 4. Use business terminology accurately and consistently in all responses.\n• 5. Practice structuring extended responses (especially for Paper 2 and IA).\n• 6. Map syllabus concepts (change, ethics, creativity, sustainability) to current events.\n• 7. Break down large questions using assessment objectives.\n• 8. Compare multiple stakeholder perspectives in evaluations.\n• 9. For HL, read social enterprise case studies to prep for Paper 3.\n• 10. Choose an IA topic that connects well with one key concept and allows deep evaluation.`,
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'businessTips'> = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'businessTips'];

  // Full-text blob of Detailed Rubrics content to improve search coverage
  const detailedRubricsSearchContent = `
  External Assessment Rubrics Paper 1 Paper 2 Extended Response 10 Marks
  Marks 0 1-2 3-4 5-6 7-8 9-10 understanding question demands tools theories arguments substantiated balanced evaluation
  Paper 3 HL Only Question 3 Rubric 17 Marks
  Criterion A Use of Resource Materials Integration case study supporting resources 4 marks
  Criterion B Tools Theories Effective application business tools concepts 4 marks
  Criterion C Evaluation Analysis impact trade-offs business 6 marks
  Criterion D Sequencing Logical flow clarity action plan 3 marks
  Internal Assessment Business Research Project 25 Marks
  Criterion A Key Concept Connection integration concept change ethics 5 marks
  Criterion B Supporting Docs Relevance diversity selected source material 4 marks
  Criterion C Tools Theories Selection application tools theories 4 marks
  Criterion D Analysis Evaluation Use data explore RQ research question integration depth 5 marks
  Criterion E Conclusions Conclusion consistency link research question 3 marks
  Criterion F Structure Organization coherence clarity argument 2 marks
  Criterion G Presentation Referencing bibliography format adherence 2 marks
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
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 12, fontSize: 16 }}>External Assessment Rubrics</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginTop: 8, marginBottom: 8 }}>Paper One and Paper Two – Extended Response (10 Marks)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 20, marginBottom: 12 }}>{highlightText("Used in Section B of both papers.", highlightedText)}</Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
                            {/* Header Row */}
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Marks</Text>
                              <Text style={{ flex: 4, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Descriptor</Text>
                            </View>
                            
                            {/* Data Rows */}
                            {[
                              { marks: '0', descriptor: 'Does not reach a standard described by the descriptors below.' },
                              { marks: '1-2', descriptor: 'Little understanding of question demands. Tools/theories used are irrelevant or inaccurate. No arguments made.' },
                              { marks: '3-4', descriptor: 'Some understanding; mostly superficial use of tools and theories. Arguments mostly unsubstantiated.' },
                              { marks: '5-6', descriptor: 'Partial understanding; some relevant tools/theories and limited balanced evaluation. Arguments are one-sided.' },
                              { marks: '7-8', descriptor: 'Mostly addresses the demands; good use of tools and mostly balanced arguments.' },
                              { marks: '9-10', descriptor: 'Fully addresses question demands with accurate tools, integrated stimulus info, and balanced, substantiated arguments.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.marks, highlightedText)}</Text>
                                <Text style={{ flex: 4, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.descriptor, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginTop: 16, marginBottom: 8 }}>Paper 3 (HL Only) – Question 3 Rubric (17 Marks)</Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
                            {/* Header Row */}
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Criterion</Text>
                              <Text style={{ flex: 3, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Description</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Max Marks</Text>
                            </View>
                            
                            {/* Data Rows */}
                            {[
                              { criterion: 'A – Use of Resource Materials', description: 'Integration of case study and supporting resources', marks: '4' },
                              { criterion: 'B – Tools & Theories', description: 'Effective application of business tools and concepts', marks: '4' },
                              { criterion: 'C – Evaluation', description: 'Analysis of impact and trade-offs on the business', marks: '6' },
                              { criterion: 'D – Sequencing', description: 'Logical flow and clarity of action plan', marks: '3' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, fontWeight: 'bold' }}>{highlightText(row.criterion, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.description, highlightedText)}</Text>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>{highlightText(row.marks, highlightedText)}</Text>
                              </View>
                            ))}
                            
                            {/* Total Row */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 2, borderColor: '#7EC3FF', backgroundColor: 'rgba(126, 195, 255, 0.1)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Total</Text>
                              <Text style={{ flex: 3, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}> </Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>{highlightText("17", highlightedText)}</Text>
                            </View>
                          </View>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16, marginBottom: 12, fontSize: 16 }}>Internal Assessment (SL/HL) – Business Research Project (25 Marks)</Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
                            {/* Header Row */}
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Criterion</Text>
                              <Text style={{ flex: 3, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Focus</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Max Marks</Text>
                            </View>
                            
                            {/* Data Rows */}
                            {[
                              { criterion: 'A – Key Concept', focus: 'Connection and integration of concept (e.g., change, ethics)', marks: '5' },
                              { criterion: 'B – Supporting Docs', focus: 'Relevance and diversity of selected source material', marks: '4' },
                              { criterion: 'C – Tools & Theories', focus: 'Selection and application of tools/theories', marks: '4' },
                              { criterion: 'D – Analysis & Evaluation', focus: 'Use of data to explore RQ with integration and depth', marks: '5' },
                              { criterion: 'E – Conclusions', focus: 'Conclusion consistency and link to research question', marks: '3' },
                              { criterion: 'F – Structure', focus: 'Organization, coherence, and clarity of argument', marks: '2' },
                              { criterion: 'G – Presentation', focus: 'Referencing, bibliography, format adherence', marks: '2' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 2, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, fontWeight: 'bold' }}>{highlightText(row.criterion, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.focus, highlightedText)}</Text>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>{highlightText(row.marks, highlightedText)}</Text>
                              </View>
                            ))}
                            
                            {/* Total Row */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 2, borderColor: '#7EC3FF', backgroundColor: 'rgba(126, 195, 255, 0.1)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Total</Text>
                              <Text style={{ flex: 3, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}> </Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>{highlightText("25", highlightedText)}</Text>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
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
            
            {/* Business Management Tips dropdown */}
            <View>
              <List.Item
                title="Business Management Tips"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('businessTips')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'businessTips' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'businessTips' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('businessTips', (
                    <View style={{ backgroundColor: 'rgba(24,26,32,0.92)', borderRadius: 12, padding: 16, marginTop: 8 }}>
                      <View>
                        {[
                          "Master command terms and know how they map to AO1–AO4.",
                          "Use real-world case studies in every unit for application-based learning.",
                          "Develop comfort with finance-based tools: ratios, break-even, and investment appraisal.",
                          "Use business terminology accurately and consistently in all responses.",
                          "Practice structuring extended responses (especially for Paper 2 and IA).",
                          "Map syllabus concepts (change, ethics, creativity, sustainability) to current events.",
                          "Break down large questions using assessment objectives.",
                          "Compare multiple stakeholder perspectives in evaluations.",
                          "For HL, read social enterprise case studies to prep for Paper 3.",
                          "Choose an IA topic that connects well with one key concept and allows deep evaluation."
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
        {userType === 'student' && (
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(126, 195, 255, 0.2)',
              borderRadius: 16,
              padding: 20,
              marginTop: 8,
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