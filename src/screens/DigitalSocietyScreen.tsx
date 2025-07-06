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

const DigitalSocietyScreen = ({ navigation, route }: { navigation: any; route: any }) => {
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
  const digitalSocietyTipsAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  // Section keys and content for search
  const sectionContentStrings: Record<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'digitalSocietyTips', string> = {
    overview: `Syllabus Overview\nThe Digital Society course equips students with critical perspectives to explore and evaluate the interactions between individuals, societies, and digital systems. It focuses on the ethical, political, cultural, and societal dimensions of digital interactions and transformations. Through conceptual understandings, inquiry-based learning, and real-world exploration, students engage with the digital world in informed, reflective, and responsible ways.`,
    essentials: `Syllabus Outline and Teaching Hours\nSL: 150 hours\nHL: 240 hours\n\nCore Areas of Exploration\n- Foundations of the digital society\n- Power, politics and digital systems\n- Digital communities and identities\n- Governance, policies and decision-making\n- Digital innovation and sustainability\n\nHL Extension\n- Advanced exploration through HL topic: The future of the digital society\n\nDigital Explorations (IA)\n- Students investigate a real-world digital issue through research and reflection.\n\nAssessment Objectives in Practice\nAO1: Demonstrate knowledge and understanding of key concepts, terms and digital phenomena.\nAO2: Apply digital concepts, perspectives and theories to real-world contexts.\nAO3: Analyse digital issues and interactions using multiple lenses and evidence.\nAO4: Evaluate consequences, implications and assumptions of digital transformations.\n\nAssessment Outline and Weightage\nStandard Level (SL)\n- Paper 1 (Source-based analysis): 30%\n- Paper 2 (Extended response essay): 45%\n- Digital Exploration (Internal Assessment): 25%\n\nHigher Level (HL)\n- Paper 1: 20%\n- Paper 2: 35%\n- Paper 3 (HL Extension on the future of digital society): 20%\n- Digital Exploration (IA): 25%`,
    coreThemes: `Overview of the SL and HL Course: Concepts, Content, and Contexts\n\nConcepts\n• Identity\n• Culture\n• Power\n• Space\n• Time\n• Systems\n• Networks\n• Sustainability\n\nContent\n• Technological foundations\n• Surveillance and privacy\n• Digital activism and politics\n• AI and automation\n• Platform economies\n• Digital inclusion and exclusion\n\nContexts\n• Local digital initiatives\n• Global digital transformations\n• Educational systems\n• Corporate platforms\n• Digital governance models`,
    detailedRubrics: `Assessment Guidelines – Independent Research Project (Digital Exploration)\n\nInternal Assessment – Digital Investigation Scoring (26 marks total)\n\nCriterion A: Topic identification\nClear definition of a contemporary digital challenge with demonstrated relevance\nMarks: 0-4\n\nCriterion B: Investigation methods\nStrategic use of sources and viewpoints to examine the topic thoroughly\nMarks: 0-6\n\nCriterion C: Examination\nComprehensive examination of digital trends and frameworks with contextual connections\nMarks: 0-6\n\nCriterion D: Assessment and reflection\nThoughtful assessment of consequences and underlying assumptions with individual perspective\nMarks: 0-6\n\nCriterion E: Presentation\nClear organization, flow, and proper source attribution\nMarks: 0-4\n\nTotal: 26 marks`,
    digitalSocietyTips: `Top 10 Study Tips for Success – Digital Society\n\n• Master the key concepts (e.g., identity, networks, sustainability) early on.\n\n• Follow emerging digital issues in real time to use in essays and IA.\n\n• Use specific examples and real-world platforms in every response.\n\n• Analyze rather than describe – always ask why and how.\n\n• Connect theoretical ideas with lived digital experiences.\n\n• Practice concise, critical writing for source analysis in Paper 1.\n\n• Prepare structured arguments for Paper 2 using digital perspectives.\n\n• Choose a relevant and manageable issue for your Digital Exploration IA.\n\n• In Paper 3 (HL), speculate thoughtfully on the future, using theory and evidence.\n\n• Review the rubrics frequently and self-assess your work using them.`,
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'digitalSocietyTips'> = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'digitalSocietyTips'];

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
      'digitalSocietyTips': digitalSocietyTipsAnimation,
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
      'digitalSocietyTips': 'Digital Society Tips',
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
      'digitalSocietyTips': digitalSocietyTipsAnimation,
    }[expandedSection];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    const allSectionKeys = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'digitalSocietyTips'];
    allSectionKeys.forEach(key => {
      if (key !== expandedSection) {
        const anim = {
          'overview': overviewAnimation,
          'essentials': essentialsAnimation,
          'coreThemes': coreThemesAnimation,
          'detailedRubrics': detailedRubricsAnimation,
          'digitalSocietyTips': digitalSocietyTipsAnimation,
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

  const renderAnimatedContent = (section: 'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'digitalSocietyTips', content: React.ReactNode) => {
    const animationValue = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'coreThemes': coreThemesAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'digitalSocietyTips': digitalSocietyTipsAnimation,
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Digital Society</Text>
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
                  {renderAnimatedContent(section.key as 'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'digitalSocietyTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      {section.key === 'essentials' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Syllabus Outline and Teaching Hours</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("SL: 150 hours\nHL: 240 hours", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Core Areas of Exploration</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- Foundations of the digital society\n- Power, politics and digital systems\n- Digital communities and identities\n- Governance, policies and decision-making\n- Digital innovation and sustainability", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>HL Extension</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- Advanced exploration through HL topic: The future of the digital society", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Digital Explorations (IA)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- Students investigate a real-world digital issue through research and reflection.", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Objectives in Practice</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("AO1: Demonstrate knowledge and understanding of key concepts, terms and digital phenomena.\nAO2: Apply digital concepts, perspectives and theories to real-world contexts.\nAO3: Analyse digital issues and interactions using multiple lenses and evidence.\nAO4: Evaluate consequences, implications and assumptions of digital transformations.", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Outline and Weightage</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("Standard Level (SL)\n- Paper 1 (Source-based analysis): 30%\n- Paper 2 (Extended response essay): 45%\n- Digital Exploration (Internal Assessment): 25%\n\nHigher Level (HL)\n- Paper 1: 20%\n- Paper 2: 35%\n- Paper 3 (HL Extension on the future of digital society): 20%\n- Digital Exploration (IA): 25%", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'overview' && (
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText(sectionContentStrings.overview, highlightedText)}</Text>
                      )}
                      {section.key === 'coreThemes' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8 }}>Overview of the SL and HL Course: Concepts, Content, and Contexts</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginTop: 16, marginBottom: 8 }}>Concepts</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText("• Identity\n• Culture\n• Power\n• Space\n• Time\n• Systems\n• Networks\n• Sustainability", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginTop: 16, marginBottom: 8 }}>Content</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText("• Technological foundations\n• Surveillance and privacy\n• Digital activism and politics\n• AI and automation\n• Platform economies\n• Digital inclusion and exclusion", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginTop: 16, marginBottom: 8 }}>Contexts</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText("• Local digital initiatives\n• Global digital transformations\n• Educational systems\n• Corporate platforms\n• Digital governance models", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 12 }}>Assessment Guidelines – Independent Research Project (Digital Exploration)</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginBottom: 8 }}>Internal Assessment – Digital Investigation Scoring (26 marks total)</Text>
                          
                          {/* Digital Exploration Rubric Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2, padding: 8 }}>Criterion</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Description</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                            </View>
                            {[
                              { criterion: 'A: Topic identification', description: 'Clear definition of a contemporary digital challenge with demonstrated relevance', marks: '0-4' },
                              { criterion: 'B: Investigation methods', description: 'Strategic use of sources and viewpoints to examine the topic thoroughly', marks: '0-6' },
                              { criterion: 'C: Examination', description: 'Comprehensive examination of digital trends and frameworks with contextual connections', marks: '0-6' },
                              { criterion: 'D: Assessment and reflection', description: 'Thoughtful assessment of consequences and underlying assumptions with individual perspective', marks: '0-6' },
                              { criterion: 'E: Presentation', description: 'Clear organization, flow, and proper source attribution', marks: '0-4' }
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
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>26</Text>
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
                title="Digital Society Tips"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('digitalSocietyTips')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'digitalSocietyTips' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'digitalSocietyTips' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('digitalSocietyTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 16 }}>Top 10 Study Tips for Success – Digital Society</Text>
                      
                      <View style={{ marginBottom: 8 }}>
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', lineHeight: 22 }}>{highlightText("• Master the key concepts (e.g., identity, networks, sustainability) early on.\n\n• Follow emerging digital issues in real time to use in essays and IA.\n\n• Use specific examples and real-world platforms in every response.\n\n• Analyze rather than describe – always ask why and how.\n\n• Connect theoretical ideas with lived digital experiences.\n\n• Practice concise, critical writing for source analysis in Paper 1.\n\n• Prepare structured arguments for Paper 2 using digital perspectives.\n\n• Choose a relevant and manageable issue for your Digital Exploration IA.\n\n• In Paper 3 (HL), speculate thoughtfully on the future, using theory and evidence.\n\n• Review the rubrics frequently and self-assess your work using them.", highlightedText)}</Text>
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
              subject: 'DIGITAL_SOCIETY', 
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

export default DigitalSocietyScreen; 