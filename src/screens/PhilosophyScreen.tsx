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
    coreThemes: `Core Themes (SL and HL)\n• Being Human: What does it mean to be human? Explores consciousness, personal identity, free will, and human nature\n• Knowledge and Technology: Examines the nature of knowledge, truth, and the impact of technology on human understanding\n\nHL Additional Themes (choose one)\n• Philosophy and Contemporary Society: Applied ethics, political philosophy, and social justice\n• Truth and Reality: Metaphysics, philosophy of science, and theories of truth\n• Philosophy of Religion: Arguments for God's existence, problem of evil, and religious experience\n\nPhilosophical Skills Development\n• Argument analysis and construction\n• Critical evaluation of philosophical positions\n• Clear and precise philosophical writing\n• Application of philosophical concepts to contemporary issues\n• Understanding different philosophical traditions and perspectives`,
    detailedRubrics: `Paper 1 – Philosophical Analysis\nAnalysis of an unseen philosophical text with focus on argument structure and evaluation.\nTotal Marks: 25 (SL), 20 (HL)\n\nPaper 2 – Essay Questions\nStructured essay responses on core and optional themes demonstrating philosophical understanding.\nTotal Marks: 25 (SL), 25 (HL)\n\nPaper 3 – Guided Analysis (HL only)\nDetailed analysis of philosophical text with structured questions and extended response.\nTotal Marks: 20\n\nPhilosophical Analysis (Internal Assessment)\nIndependent investigation of philosophical problem with reasoned analysis and evaluation.\nTotal Marks: 20`,
    philosophyTips: `1. Develop strong argument analysis skills\n• Practice identifying premises, conclusions, and logical structures in philosophical texts\n• Learn to evaluate the validity and soundness of arguments\n\n2. Master philosophical writing techniques\n• Write clearly and precisely, avoiding unnecessary jargon\n• Structure arguments logically with clear premises and conclusions\n\n3. Engage deeply with core philosophical texts\n• Read primary sources carefully and multiple times\n• Take detailed notes on key concepts and arguments\n\n4. Practice philosophical questioning\n• Ask fundamental questions about assumptions and beliefs\n• Explore different perspectives on philosophical problems\n\n5. Connect philosophy to contemporary issues\n• Apply philosophical concepts to current events and ethical dilemmas\n• Consider how philosophical theories relate to modern technology and society\n\n6. Develop critical thinking skills\n• Question your own beliefs and assumptions\n• Consider counterarguments and alternative viewpoints\n\n7. Use examples effectively\n• Support abstract concepts with concrete examples\n• Draw from various cultures and philosophical traditions\n\n8. Practice timed writing\n• Develop skill in organizing thoughts quickly under exam conditions\n• Practice writing philosophical essays within time constraints\n\n9. Engage in philosophical dialogue\n• Discuss philosophical questions with peers and teachers\n• Learn to articulate and defend your philosophical positions\n\n10. Stay curious and open-minded\n• Approach philosophical problems with genuine curiosity\n• Be willing to change your mind when presented with compelling arguments`,
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'philosophyTips'> = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'philosophyTips'];

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
      'coreThemes': 'Core Themes & Skills',
      'detailedRubrics': 'Detailed Rubrics',
      'philosophyTips': 'Philosophy Tips',
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Philosophy</Text>
            <Text style={{ fontSize: 16, color: '#8A97A7', fontFamily: 'ScopeOne-Regular', marginBottom: 12 }}>Group 3: Individuals and Societies</Text>
            <View style={{ height: 2, backgroundColor: '#7EC3FF', marginBottom: 8 }} />
          </View>
          {/* Dropdowns */}
          {[{ key: 'overview', title: 'Course Overview' }, { key: 'essentials', title: 'Subject Essentials' }, { key: 'coreThemes', title: 'Core Themes & Skills' }, { key: 'detailedRubrics', title: 'Detailed Rubrics' }].map((section, idx, arr) => (
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
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("SL – 150 hours | HL – 240 hours\n- Core theme: Being Human\n- Optional themes (e.g., Aesthetics, Epistemology, Ethics, Philosophy of Religion, Political Philosophy)\n- Prescribed text (chosen from the IB-approved list)\n- Internal assessment: Philosophical analysis of a non-philosophical stimulus\n- HL extension: Exploration of the nature of philosophical activity", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Objectives in Practice</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("AO1: Demonstrate knowledge and understanding of philosophical content.\nAO2: Analyze philosophical concepts, positions, and arguments.\nAO3: Construct and evaluate philosophical arguments.\nAO4 (HL only): Demonstrate understanding of the nature, function, and methodology of philosophy.", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Outline and Weightage</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("Standard Level (SL):\n- Paper 1 (Core theme and one optional theme): 50%\n- Internal Assessment (Philosophical analysis): 25%\n- Paper 2 (Prescribed text): 25%\n\nHigher Level (HL):\n- Paper 1 (Core theme and one optional theme): 40%\n- Internal Assessment: 20%\n- Paper 2 (Prescribed text): 20%\n- Paper 3 (HL extension): 20%", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'coreThemes' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Core Themes (SL and HL)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Being Human: What does it mean to be human? Explores consciousness, personal identity, free will, and human nature\n• Knowledge and Technology: Examines the nature of knowledge, truth, and the impact of technology on human understanding", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>HL Additional Themes (choose one)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Philosophy and Contemporary Society: Applied ethics, political philosophy, and social justice\n• Truth and Reality: Metaphysics, philosophy of science, and theories of truth\n• Philosophy of Religion: Arguments for God's existence, problem of evil, and religious experience", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Philosophical Skills Development</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Argument analysis and construction\n• Critical evaluation of philosophical positions\n• Clear and precise philosophical writing\n• Application of philosophical concepts to contemporary issues\n• Understanding different philosophical traditions and perspectives", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          <RubricTable
                            data={[
                              { criterion: 'Paper 1: Philosophical Analysis', summary: 'Analysis of unseen philosophical text with focus on argument structure and evaluation', max: 25 },
                              { criterion: 'Paper 2: Essay Questions', summary: 'Structured essay responses on core and optional themes demonstrating philosophical understanding', max: 25 },
                              { criterion: 'Paper 3: Guided Analysis (HL)', summary: 'Detailed analysis of philosophical text with structured questions and extended response', max: 20 },
                              { criterion: 'Philosophical Analysis (IA)', summary: 'Independent investigation of philosophical problem with reasoned analysis and evaluation', max: 20 },
                            ]}
                            highlightedText={highlightedText}
                          />
                          
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
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>1. Develop strong argument analysis skills</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Practice identifying premises, conclusions, and logical structures in philosophical texts\n• Learn to evaluate the validity and soundness of arguments", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>2. Master philosophical writing techniques</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Write clearly and precisely, avoiding unnecessary jargon\n• Structure arguments logically with clear premises and conclusions", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>3. Engage deeply with core philosophical texts</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Read primary sources carefully and multiple times\n• Take detailed notes on key concepts and arguments", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>4. Practice philosophical questioning</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Ask fundamental questions about assumptions and beliefs\n• Explore different perspectives on philosophical problems", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>5. Connect philosophy to contemporary issues</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Apply philosophical concepts to current events and ethical dilemmas\n• Consider how philosophical theories relate to modern technology and society", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>6. Develop critical thinking skills</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Question your own beliefs and assumptions\n• Consider counterarguments and alternative viewpoints", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>7. Use examples effectively</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Support abstract concepts with concrete examples\n• Draw from various cultures and philosophical traditions", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>8. Practice timed writing</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Develop skill in organizing thoughts quickly under exam conditions\n• Practice writing philosophical essays within time constraints", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>9. Engage in philosophical dialogue</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Discuss philosophical questions with peers and teachers\n• Learn to articulate and defend your philosophical positions", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 8 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>10. Stay curious and open-minded</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Approach philosophical problems with genuine curiosity\n• Be willing to change your mind when presented with compelling arguments", highlightedText)}</Text>
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