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

const EnvironmentalSystemsScreen = ({ navigation, route }: { navigation: any; route: any }) => {
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
  const essTipsAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  // Section keys and content for search
  const sectionContentStrings: Record<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'essTips', string> = {
    overview: `The Environmental Systems and Societies (ESS) course provides students with a coherent perspective on the environment. It combines scientific exploration with ethical awareness and policy-based problem solving. Students explore ecological processes, evaluate environmental problems, and assess solutions using systems thinking and sustainability concepts.`,
    essentials: `Syllabus Outline and Teaching Hours\nSL/HL – 150 hours\n- Foundations of environmental systems and societies\n- Ecosystems and ecology\n- Biodiversity and conservation\n- Water and aquatic food production systems and societies\n- Soil systems and terrestrial food production systems and societies\n- Atmospheric systems and societies\n- Climate change and energy production\n- Human systems and resource use\n- Practical scheme of work (hands-on investigations, fieldwork)\n\nAssessment Objectives in Practice\nAO1: Demonstrate knowledge and understanding of environmental issues, systems, and terminology.\nAO2: Apply knowledge and understanding to analyze environmental issues and solve problems.\nAO3: Synthesize, evaluate and reflect upon environmental data, scenarios, and policies.\nAO4: Demonstrate the use of skills in practical and investigative work.\n\nAssessment Outline and Weightage\nStandard Level (SL):\n- Paper 1 (Case study): 25%\n- Paper 2 (Short and extended response): 50%\n- Internal Assessment (Individual investigation): 25%`,
    coreThemes: `Overview of the Course: Concepts, Content, and Contexts\n\nConcepts:\nSystems - Systems and models - Local and global environmental challenges\nSustainability - Sustainability, natural capital - Resource consumption and environmental degradation\nStewardship - Conservation, environmental ethics - Human responsibilities and policy implications\nChange - Climate change, ecological succession - Historical and future trends in biodiversity\nEquity - Access to resources - Global inequalities and environmental justice\n\nContent:\nSystems and models\nSustainability, natural capital\nConservation, environmental ethics\nClimate change, ecological succession\nAccess to resources\n\nContexts:\nLocal and global environmental challenges\nResource consumption and environmental degradation\nHuman responsibilities and policy implications\nHistorical and future trends in biodiversity\nGlobal inequalities and environmental justice`,
    detailedRubrics: `Assessment Guidelines – Individual Investigation\n\nCriterion A: Investigation planning\nClarity of research focus and development of investigation objectives\nMarks: 6\n\nCriterion B: Data gathering and analysis\nSuitability of methods and analytical approaches employed\nMarks: 6\n\nCriterion C: Results interpretation and evaluation\nAnalysis of findings and demonstration of critical reasoning\nMarks: 6\n\nCriterion D: Real-world connections\nBroader environmental relevance and practical implications\nMarks: 6\n\nCriterion E: Student involvement\nIndividual initiative, understanding, and dedication\nMarks: 6`,
    essTips: `Top 10 Study Tips for Success – Environmental Systems and Societies\n\n• Master the key concepts of systems, models, and sustainability.\n\n• Use diagrams to represent flows, feedback loops, and models.\n\n• Regularly practice past paper questions on data-based analysis.\n\n• Link theory with real-world environmental case studies.\n\n• Understand terminology and use it precisely in assessments.\n\n• Engage with current environmental news and debates.\n\n• Keep clear, detailed notes during practical investigations.\n\n• Apply systems thinking in analyzing environmental problems.\n\n• Reflect on human impacts from ethical and economic perspectives.\n\n• Review IA criteria while planning and writing your report.`,
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'essTips'> = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'essTips'];

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
      'essTips': essTipsAnimation,
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
      'essTips': 'ESS Tips',
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
      'essTips': essTipsAnimation,
    }[expandedSection];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    const allSectionKeys = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'essTips'];
    allSectionKeys.forEach(key => {
      if (key !== expandedSection) {
        const anim = {
          'overview': overviewAnimation,
          'essentials': essentialsAnimation,
          'coreThemes': coreThemesAnimation,
          'detailedRubrics': detailedRubricsAnimation,
          'essTips': essTipsAnimation,
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
      'essTips': essTipsAnimation,
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Environmental Systems and Societies</Text>
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
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("SL/HL – 150 hours", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Core Topics</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Foundations of environmental systems and societies\n• Ecosystems and ecology\n• Biodiversity and conservation\n• Water and aquatic food production systems and societies\n• Soil systems and terrestrial food production systems and societies\n• Atmospheric systems and societies\n• Climate change and energy production\n• Human systems and resource use\n• Practical scheme of work (hands-on investigations, fieldwork)", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Objectives in Practice</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• AO1: Demonstrate knowledge and understanding of environmental issues, systems, and terminology.\n• AO2: Apply knowledge and understanding to analyze environmental issues and solve problems.\n• AO3: Synthesize, evaluate and reflect upon environmental data, scenarios, and policies.\n• AO4: Demonstrate the use of skills in practical and investigative work.", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Outline and Weightage</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginBottom: 8 }}>{highlightText("Standard Level (SL):\n• Paper 1 (Case study): 25%\n• Paper 2 (Short and extended response): 50%\n• Internal Assessment (Individual investigation): 25%", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'coreThemes' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 16 }}>Overview of the Course: Concepts, Content, and Contexts</Text>
                          
                          {/* Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            {/* Table Header */}
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 12, fontSize: 14, fontWeight: 'bold' }}>Concepts</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 12, fontSize: 14, fontWeight: 'bold' }}>Content</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 12, fontSize: 14, fontWeight: 'bold' }}>Contexts</Text>
                            </View>
                            
                            {/* Table Rows */}
                            {[
                              { concept: 'Systems', content: 'Systems and models', context: 'Local and global environmental challenges' },
                              { concept: 'Sustainability', content: 'Sustainability, natural capital', context: 'Resource consumption and environmental degradation' },
                              { concept: 'Stewardship', content: 'Conservation, environmental ethics', context: 'Human responsibilities and policy implications' },
                              { concept: 'Change', content: 'Climate change, ecological succession', context: 'Historical and future trends in biodiversity' },
                              { concept: 'Equity', content: 'Access to resources', context: 'Global inequalities and environmental justice' }
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
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 12 }}>Assessment Guidelines – Individual Investigation</Text>
                          
                          {/* Internal Assessment Rubric Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.2, padding: 8 }}>Criterion</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.8, padding: 8 }}>Description</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Marks</Text>
                            </View>
                            {[
                              { criterion: 'A: Investigation planning', description: 'Clarity of research focus and development of investigation objectives', marks: '6' },
                              { criterion: 'B: Data gathering and analysis', description: 'Suitability of methods and analytical approaches employed', marks: '6' },
                              { criterion: 'C: Results interpretation and evaluation', description: 'Analysis of findings and demonstration of critical reasoning', marks: '6' },
                              { criterion: 'D: Real-world connections', description: 'Broader environmental relevance and practical implications', marks: '6' },
                              { criterion: 'E: Student involvement', description: 'Individual initiative, understanding, and dedication', marks: '6' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 2.2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.criterion, highlightedText)}</Text>
                                <Text style={{ flex: 2.8, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.description, highlightedText)}</Text>
                                <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.marks, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Criterion A: Research question and inquiry Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Criterion A: Research Question and Inquiry (Max 4 marks)</Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Level Descriptor</Text>
                            </View>
                                                         {[
                               { score: '0', description: 'The report does not reach a standard described by the descriptors below.' },
                               { score: '1-2', description: 'Talks about a nearby or worldwide environmental topic with mistakes or missing parts.\n• Asks a main question but it is not clear or does not fit well with the topic.\n• Shows little background reading or preparation.' },
                               { score: '3-4', description: 'Clearly explains a nearby or worldwide environmental topic with good background reading.\n• Asks a clear main question that directly relates to the chosen topic or problem.\n• Strong connection between the main question and the environmental situation.' }
                             ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.score, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 18 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Criterion B: Strategy Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Criterion B: Strategy (Max 4 marks)</Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Level Descriptor</Text>
                            </View>
                                                         {[
                               { score: '0', description: 'The report does not reach a standard described by the descriptors below.' },
                               { score: '1-2', description: 'Mentions a solution for an environmental problem connected to the main question.\n• Points out disagreements between different viewpoints (money, social, cultural, political, or environmental concerns).\n• Shows basic awareness of what different groups of people think.' },
                               { score: '3-4', description: 'Explains a solution for the problem with good reasons why it would work.\n• Clearly shows how the solution creates disagreements between different viewpoints.\n• Shows understanding of complicated relationships between different groups and what they give up.' }
                             ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.score, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 18 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Criterion C: Method Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Criterion C: Method (Max 4 marks)</Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Level Descriptor</Text>
                            </View>
                                                         {[
                               { score: '0', description: 'The report does not reach a standard described by the descriptors below.' },
                               { score: '1-2', description: 'Explains a process that others cannot easily follow or copy.\n• Does not collect enough information to properly answer the main question.\n• The steps are unclear and lack important details needed to repeat the work.' },
                               { score: '3-4', description: 'Explains a clear process that others can follow step-by-step.\n• Collects enough information to thoroughly answer the main question.\n• The steps are detailed and well-organized for others to understand and repeat.' }
                             ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.score, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 18 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Criterion D: Treatment of data Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Criterion D: Working with Data (Max 6 marks)</Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Level Descriptor</Text>
                            </View>
                            {[
                              { score: '0', description: 'The report does not reach a standard described by the descriptors below.' },
                              { score: '1-2', description: 'Writing is hard to understand.\n• Working with information contains big mistakes.\n• Results do not answer the main question.' },
                              { score: '3-4', description: 'Writing is easy to understand.\n• Working with information has small mistakes.\n• Results do not completely answer the main question.' },
                              { score: '5-6', description: 'Writing is easy to understand and has good detail.\n• Working with information is done correctly.\n• Results completely answer the main question.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.score, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 18 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Criterion E: Analysis and conclusion Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Criterion E: Understanding Results and Final Thoughts (Max 6 marks)</Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Level Descriptor</Text>
                            </View>
                            {[
                              { score: '0', description: 'The report does not reach a standard described by the descriptors below.' },
                              { score: '1-2', description: 'Points out patterns or trends in the information.\n• Final thoughts are not backed up by the work done or do not answer the main question.\n• Limited understanding of what the results mean.' },
                              { score: '3-4', description: 'Explains trends and discusses problems with accuracy, reliability, and uncertainty.\n• Final thoughts are somewhat backed up by the work.\n• Shows partial understanding of result limitations and meanings.' },
                              { score: '5-6', description: 'Clearly explains trends and fully discusses how accurate and reliable the results are.\n• Final thoughts are completely backed up by the detailed work done.\n• Shows full understanding of what results mean and their limitations.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.score, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 18 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Criterion F: Evaluation Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Criterion F: Looking Back and Moving Forward (Max 6 marks)</Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Level Descriptor</Text>
                            </View>
                            {[
                              { score: '0', description: 'The report does not reach a standard described by the descriptors below.' },
                              { score: '1-2', description: 'Mentions general problems with the approach used.\n• Lists basic ways to make the work better.\n• Points out unanswered questions without much detail.' },
                              { score: '3-4', description: 'Explains problems and ways to improve the work with some detail.\n• Lists unanswered questions that came up during the study.\n• Shows understanding of what could be done differently.' },
                              { score: '5-6', description: 'Carefully examines specific problems and suggests detailed improvements.\n• Clearly explains how unanswered questions affect the final thoughts.\n• Shows deep understanding of study limitations and future research possibilities.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.score, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 18 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* External Assessment Markbands Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>External Assessment Markbands – SL (Paper 2 Section B Essay)</Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Level Descriptor</Text>
                            </View>
                                                         {[
                               { score: '0', description: 'The work does not reach a standard described by the descriptors below.' },
                               { score: '1-3', description: 'Minimal understanding of environmental concepts or systems issues.\n• Disconnected statements with poor structure.\n• Weak terminology usage and unclear examples.\n• Absent or vague conclusions.' },
                               { score: '4-6', description: 'Basic understanding with appropriate terminology and examples.\n• Limited explanations with some structural organization.\n• Some balanced perspectives and basic conclusions presented.' },
                               { score: '7-9', description: 'Strong understanding with precise terminology and relevant examples.\n• Well-developed analysis with logical structure.\n• Balanced evaluation leading to sound conclusions.' }
                             ].map((row, idx) => (
                               <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                 <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.score, highlightedText)}</Text>
                                 <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 18 }}>{highlightText(row.description, highlightedText)}</Text>
                               </View>
                             ))}
                           </View>
                           
                           {/* External Assessment Markbands HL Table */}
                           <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>External Assessment Markbands – HL (Paper 2 Section B Essay)</Text>
                           
                           <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                             <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                               <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                               <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Level Descriptor</Text>
                             </View>
                             {[
                               { score: '0', description: 'The work does not reach a standard described by the descriptors below.' },
                               { score: '1-3', description: 'Minimal understanding of environmental systems concepts or HL content.\n• Fragmented knowledge with poor structure.\n• Weak examples and unsupported judgments.' },
                               { score: '4-6', description: 'Basic understanding with appropriate terminology and some examples.\n• Limited explanations with basic organization.\n• Some conclusions supported by limited arguments.' },
                               { score: '7-9', description: 'Strong understanding with precise terminology and well-explained examples.\n• Thorough analysis with logical structure.\n• Well-supported and reflective conclusions.' }
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
                title="ESS Tips"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('essTips')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'essTips' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'essTips' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('essTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 16 }}>Top 10 Study Tips for Success – Environmental Systems and Societies</Text>
                      
                      <View style={{ marginBottom: 8 }}>
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', lineHeight: 22 }}>{highlightText("• Master the key concepts of systems, models, and sustainability.\n\n• Use diagrams to represent flows, feedback loops, and models.\n\n• Regularly practice past paper questions on data-based analysis.\n\n• Link theory with real-world environmental case studies.\n\n• Understand terminology and use it precisely in assessments.\n\n• Engage with current environmental news and debates.\n\n• Keep clear, detailed notes during practical investigations.\n\n• Apply systems thinking in analyzing environmental problems.\n\n• Reflect on human impacts from ethical and economic perspectives.\n\n• Review IA criteria while planning and writing your report.", highlightedText)}</Text>
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
              subject: 'ESS', 
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

export default EnvironmentalSystemsScreen; 