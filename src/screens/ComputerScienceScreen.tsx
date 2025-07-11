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

const ComputerScienceScreen = ({ navigation, route }: { navigation: any; route: any }) => {
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
  const computerScienceTipsAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  // Section keys and content for search
  const sectionContentStrings: Record<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'computerScienceTips', string> = {
    overview: `The IB Computer Science course aims to develop computational thinking, problem-solving, and software development skills. It focuses on the interactions between people, systems, and societies and explores ethical issues linked to the impact of computing.`,
    essentials: `**Syllabus Outline and Teaching Hours**\n- System fundamentals\n- Computer organization\n- Networks\n- Computational thinking, problem-solving, and programming\nHL Extension: Abstract data structures, Resource management, Control\nOptions: Databases, Modelling and simulation, Web science, Object-oriented programming\n\n**Assessment Outline and Weightage**\nSL: Paper 1 (45%), Paper 2 (25%), Internal Assessment (30%)\nHL: Paper 1 (40%), Paper 2 (20%), Paper 3 (20%), Internal Assessment (20%)\n\n**Assessment Objectives in Practice**\nAO1: Demonstrate knowledge and understanding of specified content.\nAO2: Apply and use knowledge to solve problems.\nAO3: Construct, analyze, and evaluate solutions.\nAO4: Demonstrate practical and communication skills.`,
    coreThemes: `Overview of the Course: Concepts, Content, and Contexts\n\nAbstraction: Data structures, modeling - Database and system design\nSystem Thinking: Computer systems, networks - Distributed computing\nDesign: Programming, UI/UX - Software development\nLogic: Boolean algebra, logic gates - Hardware and circuits\n\nConcepts Content Contexts Abstraction Data structures modeling Database system design System Thinking Computer systems networks Distributed computing Design Programming UI UX Software development Logic Boolean algebra logic gates Hardware circuits`,
    detailedRubrics: `Primary Assessment – Foundation Topics (Standard and Advanced Level)\n\nWeighting: Standard – 45%, Advanced – 40%\nStructure:\n• Part A: Brief responses and organized questions on foundation topics\n• Part B: Single comprehensive response question on foundation topics\n\nContent mastery: Shows precise and applicable understanding of fundamental curriculum\nKnowledge implementation: Uses theoretical comprehension to address or clarify challenges\nEvaluation and integration: Examines situations or issues and combines logical responses\nExpression: Conveys concepts through suitable vocabulary, visual aids, and structures (such as process diagrams, code representation)\n\nSecondary Assessment – Specialized Topics (Standard and Advanced Level)\n\nWeighting: Standard – 25%, Advanced – 20%\nStructure: Organized questions on selected specialization (such as Object-Oriented Programming, Web Development, Database Systems, Modeling)\n\nSpecialized understanding: Shows comprehensive grasp of the selected specialization material\nTechnical application: Implements understanding in different situations with precise solutions and logic\nTechnical methodology: Shows application of principles including algorithms, system architecture, programming examples, etc.\nCritical assessment: Evaluates consequences, compromises, or efficiency of a system or approach from various viewpoints\n\nTertiary Assessment – Scenario Analysis (Advanced Level Only)\n\nWeighting: Advanced – 20%\nStructure: Built on pre-distributed scenario analysis (organized questions)\n\nScenario comprehension: Shows understanding of systems and concepts relevant to the scenario analysis\nCurriculum integration: Implements foundation and advanced level material appropriately to the scenario\nAnalytical reasoning: Assesses system operations, connections, or consequences within the provided context\nStructured communication: Delivers organized, well-supported responses using suitable technical vocabulary and logic\n\nInternal Assessment Rubric\n\nProject initiation: Establishes the challenge and determines the boundaries and success standards\nApproach summary: Details the methodology incorporating processes and frameworks\nTechnical execution: Shows programming competencies and development procedures\nOutput assessment: Evaluates the standard and performance of the completed solution\nCritical review: Analyzes achievement standards and identifies potential improvements\n\nAssessment Content mastery precise applicable understanding fundamental curriculum Knowledge implementation theoretical comprehension address clarify challenges Evaluation integration examines situations issues combines logical responses Expression conveys concepts suitable vocabulary visual aids structures process diagrams code representation Secondary Assessment Specialized Topics Weighting Standard Advanced Structure Organized questions selected specialization Object-Oriented Programming Web Development Database Systems Modeling Specialized understanding comprehensive grasp selected specialization material Technical application implements understanding different situations precise solutions logic Technical methodology application principles algorithms system architecture programming examples Critical assessment evaluates consequences compromises efficiency system approach various viewpoints Tertiary Assessment Scenario Analysis Advanced Level Only pre-distributed scenario analysis organized questions Scenario comprehension understanding systems concepts relevant scenario analysis Curriculum integration implements foundation advanced level material appropriately scenario Analytical reasoning assesses system operations connections consequences provided context Structured communication delivers organized well-supported responses suitable technical vocabulary logic Internal Assessment Rubric Project initiation establishes challenge determines boundaries success standards Approach summary details methodology incorporating processes frameworks Technical execution shows programming competencies development procedures Output assessment evaluates standard performance completed solution Critical review analyzes achievement standards identifies potential improvements`,
    computerScienceTips: `• Focus on mastering basic logic and flowcharts.

• Practice Python or Java coding challenges regularly.

• Understand the architecture of computer systems and memory types.

• Draw and simulate logic gates and circuits.

• Use flashcards for key terms and acronyms.

• Review past papers and practice explaining code logic.

• Plan your internal assessment early with a clear problem statement.

• Make your pseudocode and annotations very clear.

• Use UML diagrams to map out software design.

• Join coding communities or GitHub projects to build experience.`,
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'computerScienceTips'> = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'computerScienceTips'];

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
      'computerScienceTips': computerScienceTipsAnimation,
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
      'computerScienceTips': 'Computer Science Tips',
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
      'computerScienceTips': computerScienceTipsAnimation,
    }[expandedSection];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    const allSectionKeys = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'computerScienceTips'];
    allSectionKeys.forEach(key => {
      if (key !== expandedSection) {
        const anim = {
          'overview': overviewAnimation,
          'essentials': essentialsAnimation,
          'coreThemes': coreThemesAnimation,
          'detailedRubrics': detailedRubricsAnimation,
          'computerScienceTips': computerScienceTipsAnimation,
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

  const renderAnimatedContent = (section: 'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'computerScienceTips', content: React.ReactNode) => {
    const animationValue = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'coreThemes': coreThemesAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'computerScienceTips': computerScienceTipsAnimation,
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Computer Science</Text>
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
                  {renderAnimatedContent(section.key as 'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'computerScienceTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      {section.key === 'overview' && (
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText(sectionContentStrings.overview, highlightedText)}</Text>
                      )}
                      {section.key === 'essentials' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Syllabus Outline and Teaching Hours</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- System fundamentals\n- Computer organization\n- Networks\n- Computational thinking, problem-solving, and programming\nHL Extension: Abstract data structures, Resource management, Control\nOptions: Databases, Modelling and simulation, Web science, Object-oriented programming", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Outline and Weightage</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("SL: Paper 1 (45%), Paper 2 (25%), Internal Assessment (30%)\nHL: Paper 1 (40%), Paper 2 (20%), Paper 3 (20%), Internal Assessment (20%)", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Objectives in Practice</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("AO1: Demonstrate knowledge and understanding of specified content.\nAO2: Apply and use knowledge to solve problems.\nAO3: Construct, analyze, and evaluate solutions.\nAO4: Demonstrate practical and communication skills.", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'coreThemes' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8 }}>Overview of the Course: Concepts, Content, and Contexts</Text>
                          
                          {/* Concepts, Content, and Contexts Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
                            {/* Header Row */}
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Concepts</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Content</Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Contexts</Text>
                            </View>
                            
                            {/* Data Rows */}
                            {[
                              { concept: 'Abstraction', content: 'Data structures, modeling', context: 'Database and system design' },
                              { concept: 'System Thinking', content: 'Computer systems, networks', context: 'Distributed computing' },
                              { concept: 'Design', content: 'Programming, UI/UX', context: 'Software development' },
                              { concept: 'Logic', content: 'Boolean algebra, logic gates', context: 'Hardware and circuits' }
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
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8 }}>Primary Assessment – Foundation Topics (Standard and Advanced Level)</Text>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', marginBottom: 16 }}>
                            {highlightText("Weighting: Standard – 45%, Advanced – 40%", highlightedText)}
                          </Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginBottom: 8 }}>Structure:</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', marginBottom: 16 }}>
                            {highlightText("• Part A: Brief responses and organized questions on foundation topics\n• Part B: Single comprehensive response question on foundation topics", highlightedText)}
                          </Text>
                          
                          {/* Paper 1 Assessment Criteria Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
                            {/* Header Row */}
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 2.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Assessment Area</Text>
                              <Text style={{ flex: 2.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Expected Performance</Text>
                            </View>
                            
                            {/* Data Rows */}
                            {[
                              { criterion: 'Content mastery', description: 'Shows precise and applicable understanding of fundamental curriculum' },
                              { criterion: 'Knowledge implementation', description: 'Uses theoretical comprehension to address or clarify challenges' },
                              { criterion: 'Evaluation and integration', description: 'Examines situations or issues and combines logical responses' },
                              { criterion: 'Expression', description: 'Conveys concepts through suitable vocabulary, visual aids, and structures (such as process diagrams, code representation)' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 2.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.criterion, highlightedText)}</Text>
                                <Text style={{ flex: 2.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Paper 2 Section */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8, marginTop: 32 }}>Secondary Assessment – Specialized Topics (Standard and Advanced Level)</Text>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', marginBottom: 16 }}>
                            {highlightText("Weighting: Standard – 25%, Advanced – 20%", highlightedText)}
                          </Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginBottom: 8 }}>Structure:</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', marginBottom: 16 }}>
                            {highlightText("Organized questions on selected specialization (such as Object-Oriented Programming, Web Development, Database Systems, Modeling)", highlightedText)}
                          </Text>
                          
                          {/* Paper 2 Assessment Criteria Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
                            {/* Header Row */}
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 2.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Assessment Area</Text>
                              <Text style={{ flex: 2.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Expected Performance</Text>
                            </View>
                            
                            {/* Data Rows */}
                            {[
                              { criterion: 'Specialized understanding', description: 'Shows comprehensive grasp of the selected specialization material' },
                              { criterion: 'Technical application', description: 'Implements understanding in different situations with precise solutions and logic' },
                              { criterion: 'Technical methodology', description: 'Shows application of principles including algorithms, system architecture, programming examples, etc.' },
                              { criterion: 'Critical assessment', description: 'Evaluates consequences, compromises, or efficiency of a system or approach from various viewpoints' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 2.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.criterion, highlightedText)}</Text>
                                <Text style={{ flex: 2.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Paper 3 Section */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8, marginTop: 32 }}>Tertiary Assessment – Scenario Analysis (Advanced Level Only)</Text>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', marginBottom: 16 }}>
                            {highlightText("Weighting: Advanced – 20%", highlightedText)}
                          </Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginBottom: 8 }}>Structure:</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', marginBottom: 16 }}>
                            {highlightText("Built on pre-distributed scenario analysis (organized questions)", highlightedText)}
                          </Text>
                          
                          {/* Paper 3 Assessment Criteria Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
                            {/* Header Row */}
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                              <Text style={{ flex: 2.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Assessment Area</Text>
                              <Text style={{ flex: 2.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Expected Performance</Text>
                            </View>
                            
                            {/* Data Rows */}
                            {[
                              { criterion: 'Scenario comprehension', description: 'Shows understanding of systems and concepts relevant to the scenario analysis' },
                              { criterion: 'Curriculum integration', description: 'Implements foundation and advanced level material appropriately to the scenario' },
                              { criterion: 'Analytical reasoning', description: 'Assesses system operations, connections, or consequences within the provided context' },
                              { criterion: 'Structured communication', description: 'Delivers organized, well-supported responses using suitable technical vocabulary and logic' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 2.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.criterion, highlightedText)}</Text>
                                <Text style={{ flex: 2.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.description, highlightedText)}</Text>
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
                            
                            {/* Internal Assessment Section */}
                            <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8, marginTop: 32 }}>Internal Assessment Rubric</Text>
                            
                            {/* Internal Assessment Rubric Table */}
                            <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, overflow: 'hidden', marginTop: 16 }}>
                              {/* Header Row */}
                              <View style={{ flexDirection: 'row', backgroundColor: 'rgba(126, 195, 255, 0.2)' }}>
                                <Text style={{ flex: 2.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Criterion</Text>
                                <Text style={{ flex: 2.5, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Description</Text>
                                <Text style={{ flex: 1, color: '#7EC3FF', padding: 12, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', textAlign: 'center' }}>Marks</Text>
                              </View>
                              
                              {/* Data Rows */}
                              {[
                                { criterion: 'Project initiation', description: 'Establishes the challenge and determines the boundaries and success standards', marks: '6' },
                                { criterion: 'Approach summary', description: 'Details the methodology incorporating processes and frameworks', marks: '6' },
                                { criterion: 'Technical execution', description: 'Shows programming competencies and development procedures', marks: '12' },
                                { criterion: 'Output assessment', description: 'Evaluates the standard and performance of the completed solution', marks: '4' },
                                { criterion: 'Critical review', description: 'Analyzes achievement standards and identifies potential improvements', marks: '6' }
                              ].map((row, idx) => (
                                <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                  <Text style={{ flex: 2.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.criterion, highlightedText)}</Text>
                                  <Text style={{ flex: 2.5, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.description, highlightedText)}</Text>
                                  <Text style={{ flex: 1, color: '#B6B6B6', padding: 12, fontFamily: 'ScopeOne-Regular', fontSize: 13, textAlign: 'center' }}>{highlightText(row.marks, highlightedText)}</Text>
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
                title="Computer Science Tips"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('computerScienceTips')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'computerScienceTips' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'computerScienceTips' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('computerScienceTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText(sectionContentStrings.computerScienceTips, highlightedText)}</Text>
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
              subject: 'COMPUTER_SCIENCE', 
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

export default ComputerScienceScreen; 