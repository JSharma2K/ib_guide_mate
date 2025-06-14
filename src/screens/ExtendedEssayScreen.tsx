import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated, Platform, StatusBar, ImageBackground, TouchableOpacity } from 'react-native';
import { Text, Card, List, Searchbar, Button as PaperButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, gradientColors, styles as themeStyles } from '../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ExtendedEssay'>;
  route: {
    params: {
      userType: 'student' | 'teacher';
    };
  };
};

const sectionContentStrings: Record<string, string> = {
  purpose:
    `The Extended Essay (EE) is a core component of the IB Diploma Programme. It is an independent, self-directed piece of research, culminating in a 4,000-word paper. The EE provides students with an opportunity to investigate a topic of special interest, develop research and writing skills, and experience the process of academic discovery.\n\n- Independent 4,000-word academic essay exploring a topic of personal interest.\n- Prepares students for university-level research and writing.\n- Supports development of inquiry, critical thinking, self-management, and reflection skills.\n- Assessed externally and contributes up to 3 points with ToK.\n- Approximately 40 hours of student effort, with 3 mandatory reflection sessions (including viva voce).`,
  objectives:
    `Assessment Objectives:\n• Engage in independent research on a focused topic\n• Formulate a clear research question\n• Develop an argument and support it with evidence\n• Communicate ideas effectively in academic writing\n• Reflect on the research process and learning\n\n- Knowledge & Understanding: Demonstrate command of topic, concepts, terminology, and methods.\n- Application & Analysis: Apply relevant methods and analyze findings effectively.\n- Synthesis & Evaluation: Discuss findings critically and construct a clear line of argument.\n- Communication: Structure the essay formally and cite sources with academic integrity.`,
  pathways:
    `Pathways:\n• Choose a subject and topic that aligns with your interests\n• Develop a research question in consultation with a supervisor\n• Conduct research using a variety of sources\n• Draft, revise, and finalize the essay with supervisor feedback\n• Submit the final essay and complete the reflection process\n\n- Subject-Focused: Based on one DP subject the student is studying.\n- Interdisciplinary: Integrates methods, theories, or perspectives from two DP subjects.\n- Interdisciplinary EEs must align with one of five frameworks:\n1. Power, equality, justice\n2. Culture, identity, expression\n3. Movement, time, space\n4. Evidence, measurement, innovation\n5. Sustainability, development, change`,
  roles:
    `Student:\n- Select topic, draft focused research question, complete RPPF.\n- Demonstrate academic honesty and original thinking.\n\nSupervisor:\n- Support through at least 3 reflection sessions.\n- Give one round of feedback on a draft.\n- Complete supervisor report.\n\nCoordinator:\n- Manage resources, deadlines, and documentation for EE program.`,
  integrity:
    `Academic Integrity & Support:\n- Students must consistently cite sources using an accepted format (APA, MLA, etc.).\n- The RPPF (max 500 words) is assessed under Criterion E and must be completed honestly.\n- Plagiarism, collusion, and improper referencing may result in the loss of the IB diploma.\n- Supervisors and schools play a role in teaching citation, ethical research, and reflection practices.`,
  rubric2027:
    `Assessment Rubric (2027): A Framework for the Essay Clarity and relevance of the research question appropriateness of the methodology and structure 6 marks. B Knowledge and Understanding Understanding of the topic subject-specific terminology and academic context 6 marks. C Analysis and Line of Argument Quality of the research critical analysis and logical consistency of the argument 6 marks. D Discussion and Evaluation Depth of discussion significance of the findings evaluation of research outcomes 8 marks. E Engagement RPPF Evidence of intellectual initiative self-reflection and personal engagement with the process 4 marks.`,
};

const sectionKeys: Array<'purpose' | 'objectives' | 'pathways' | 'roles' | 'integrity' | 'rubric2027'> = [
  'purpose',
  'objectives',
  'pathways',
  'roles',
  'integrity',
  'rubric2027',
];

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
      <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1.8, padding: 8, fontSize: 14 }} numberOfLines={1}>Criterion</Text>
      <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.8, padding: 8, fontSize: 14 }}>What It Assesses</Text>
      <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1.2, padding: 8, textAlign: 'center', fontSize: 14 }} numberOfLines={1}>Marks</Text>
    </View>
    {data.map((row, idx) => (
      <View key={idx} style={{ flexDirection: 'row', borderTopWidth: idx === 0 ? 0 : 1, borderColor: '#7EC3FF' }}>
        <Text style={{ flex: 1.8, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.criterion, highlightedText)}</Text>
        <Text style={{ flex: 2.8, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(row.summary, highlightedText)}</Text>
        <Text style={{ flex: 1.2, color: '#B6B6B6', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular', fontSize: 13 }}>{highlightText(String(row.max), highlightedText)}</Text>
      </View>
    ))}
    {/* Total row */}
    <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF', backgroundColor: '#232B4D' }}>
      <Text style={{ flex: 1.8, color: '#7EC3FF', padding: 8, fontFamily: 'ScopeOne-Regular', fontWeight: '700' as const, fontSize: 13 }}>Total</Text>
      <Text style={{ flex: 2.8, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', fontSize: 13 }}> </Text>
      <Text style={{ flex: 1.2, color: '#7EC3FF', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular', fontWeight: '700' as const, fontSize: 13 }}>30</Text>
    </View>
  </View>
);

const ExtendedEssayScreen: React.FC<Props> = ({ navigation, route }) => {
  const userType = route?.params?.userType || 'student';
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [highlightedText, setHighlightedText] = useState('');
  const [matchingSections, setMatchingSections] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Animation values for each section
  const purposeAnimation = useRef(new Animated.Value(0)).current;
  const objectivesAnimation = useRef(new Animated.Value(0)).current;
  const pathwaysAnimation = useRef(new Animated.Value(0)).current;
  const rolesAnimation = useRef(new Animated.Value(0)).current;
  const integrityAnimation = useRef(new Animated.Value(0)).current;
  const rubric2027Animation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  const toggleSection = (section: string) => {
    const isExpanding = expandedSection !== section;
    setExpandedSection(isExpanding ? section : null);
    const animationValue = {
      'purpose': purposeAnimation,
      'objectives': objectivesAnimation,
      'pathways': pathwaysAnimation,
      'roles': rolesAnimation,
      'integrity': integrityAnimation,
      'rubric2027': rubric2027Animation,
    }[section];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: isExpanding ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const dropdownSections = [
    { key: 'purpose', title: 'Purpose & Overview' },
    { key: 'objectives', title: 'Assessment Objectives' },
    { key: 'pathways', title: 'Pathways' },
    { key: 'roles', title: 'Key Roles' },
    { key: 'integrity', title: 'Academic Integrity & Support' },
    { key: 'rubric2027', title: 'Assessment Rubric (2027)' },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Trim whitespace from the query for searching and highlighting
    const trimmedQuery = query.trim();
    setHighlightedText(trimmedQuery);
    if (!trimmedQuery) {
      setMatchingSections([]);
      setCurrentMatchIndex(0);
      setExpandedSection(null);
      return;
    }
    // Find all sections that match content or title
    const matches = dropdownSections
      .filter(section =>
        sectionContentStrings[section.key].toLowerCase().includes(trimmedQuery.toLowerCase()) ||
        section.title.toLowerCase().includes(trimmedQuery.toLowerCase())
      )
      .map(section => section.key);
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

  // Ensure expandedSection always matches the current match, even on first search
  useEffect(() => {
    if (matchingSections.length > 0) {
      setExpandedSection(matchingSections[currentMatchIndex]);
    } else {
      setExpandedSection(null);
    }
  }, [currentMatchIndex, matchingSections]);

  // When expandedSection changes, trigger the animation for that section
  useEffect(() => {
    if (!expandedSection) return;
    const animationValue = {
      'purpose': purposeAnimation,
      'objectives': objectivesAnimation,
      'pathways': pathwaysAnimation,
      'roles': rolesAnimation,
      'integrity': integrityAnimation,
      'rubric2027': rubric2027Animation,
    }[expandedSection];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    // Collapse all other sections
    sectionKeys.forEach(key => {
      if (key !== expandedSection) {
        const anim = {
          'purpose': purposeAnimation,
          'objectives': objectivesAnimation,
          'pathways': pathwaysAnimation,
          'roles': rolesAnimation,
          'integrity': integrityAnimation,
          'rubric2027': rubric2027Animation,
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

  let [fontsLoaded] = useFonts({
    'ScopeOne-Regular': require('../../assets/fonts/ScopeOne-Regular.ttf'),
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const renderAnimatedContent = (section: string, content: React.ReactNode) => {
    const animationValue = {
      'purpose': purposeAnimation,
      'objectives': objectivesAnimation,
      'pathways': pathwaysAnimation,
      'roles': rolesAnimation,
      'integrity': integrityAnimation,
      'rubric2027': rubric2027Animation,
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
        {content}
      </Animated.View>
    );
  };

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const fadeThreshold = 50; // Start fading after 50px scroll
    
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

  return (
    <ImageBackground
      source={require('../../assets/images/entry-bg.png')}
      style={{ flex: 1, width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      {/* Home icon top left */}
      <Animated.View style={{ position: 'absolute', top: 56, left: 16, zIndex: 100, flexDirection: 'row', alignItems: 'center', opacity: homeIconOpacity }}>
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
      <ScrollView 
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>Extended Essay</Text>
            <Text style={{ fontSize: 16, color: '#8A97A7', fontFamily: 'ScopeOne-Regular', marginBottom: 12 }}>Core Component</Text>
            <View style={{ height: 2, backgroundColor: '#7EC3FF', marginBottom: 8 }} />
          </View>
          {/* Dropdowns */}
          {dropdownSections.map((section, idx, arr) => (
            <View key={section.key}>
              <List.Item
                title={() => (
                  <Text style={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}>
                    {highlightText(section.title, highlightedText)}
                  </Text>
                )}
                onPress={() => toggleSection(section.key)}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === section.key ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === section.key && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent(section.key, (
                    <View style={{ backgroundColor: 'rgba(24,26,32,0.92)', borderRadius: 12, padding: 16, marginTop: 8 }}>
                      {/* Section content logic as before */}
                      {section.key === 'purpose' && (
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }}>{highlightText(sectionContentStrings.purpose.split('\n\n')[0], highlightedText)}</Text>
                      )}
                      {section.key === 'purpose' && (
                        <View style={{ marginTop: 12 }}>
                          {sectionContentStrings.purpose.split('\n\n')[1]?.split('\n').map((line, idx) => (
                            <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
                              <Text style={{ color: '#7EC3FF', fontSize: 18, marginRight: 8, lineHeight: 24 }}>•</Text>
                              <Text style={[themeStyles.content, { flex: 1, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }]}>{highlightText(line.replace(/^\- /, ''), highlightedText)}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                      {section.key === 'objectives' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>{highlightText(sectionContentStrings.objectives.split('\n\n')[0].split('\n')[0], highlightedText)}</Text>
                          <View style={{ marginTop: 4 }}>
                            {sectionContentStrings.objectives.split('\n\n')[0].split('\n').slice(1).map((line, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
                                <Text style={{ color: '#7EC3FF', fontSize: 18, marginRight: 8, lineHeight: 24 }}>•</Text>
                                <Text style={[themeStyles.content, { flex: 1, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }]}>{highlightText(line.replace(/^\- /, ''), highlightedText)}</Text>
                              </View>
                            ))}
                            {sectionContentStrings.objectives.split('\n\n')[1]?.split('\n').map((line, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
                                <Text style={{ color: '#7EC3FF', fontSize: 18, marginRight: 8, lineHeight: 24 }}>•</Text>
                                <Text style={[themeStyles.content, { flex: 1, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }]}>{highlightText(line.replace(/^\- /, ''), highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                      {section.key === 'pathways' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>{highlightText(sectionContentStrings.pathways.split('\n\n')[0].split('\n')[0], highlightedText)}</Text>
                          <View style={{ marginTop: 4 }}>
                            {sectionContentStrings.pathways.split('\n\n')[0].split('\n').slice(1).map((line, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
                                <Text style={{ color: '#7EC3FF', fontSize: 18, marginRight: 8, lineHeight: 24 }}>•</Text>
                                <Text style={[themeStyles.content, { flex: 1, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }]}>{highlightText(line.replace(/^\- /, ''), highlightedText)}</Text>
                              </View>
                            ))}
                            {sectionContentStrings.pathways.split('\n\n')[1]?.split('\n').map((line, idx, arr) => {
                              if (line.match(/^\d+\./)) {
                                return (
                                  <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4, marginLeft: 24 }}>
                                    <Text style={{ color: '#7EC3FF', fontSize: 16, marginRight: 8, lineHeight: 24 }}>{line.match(/^\d+/)?.[0]}.</Text>
                                    <Text style={[themeStyles.content, { flex: 1, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }]}>{highlightText(line.replace(/^\d+\. /, ''), highlightedText)}</Text>
                                  </View>
                                );
                              }
                              return null;
                            })}
                          </View>
                        </View>
                      )}
                      {section.key === 'roles' && (
                        <View>
                          {sectionContentStrings.roles.split('\n\n').map((section, idx) => {
                            const [role, ...points] = section.split('\n');
                            return (
                              <View key={idx} style={{ marginBottom: 12 }}>
                                <Text style={[themeStyles.subsectionTitle, { marginTop: idx === 0 ? 0 : 8, marginBottom: 6, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }]}>{highlightText(role.replace(':', ''), highlightedText)}</Text>
                                {points.map((line, i) => (
                                  <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
                                    <Text style={{ color: '#7EC3FF', fontSize: 18, marginRight: 8, lineHeight: 24 }}>•</Text>
                                    <Text style={[themeStyles.content, { flex: 1, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }]}>{highlightText(line.replace(/^\- /, ''), highlightedText)}</Text>
                                  </View>
                                ))}
                              </View>
                            );
                          })}
                        </View>
                      )}
                      {section.key === 'integrity' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>{highlightText(sectionContentStrings.integrity.split('\n')[0], highlightedText)}</Text>
                          <View style={{ marginTop: 4 }}>
                            {sectionContentStrings.integrity.split('\n').slice(1).map((line, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
                                <Text style={{ color: '#7EC3FF', fontSize: 18, marginRight: 8, lineHeight: 24 }}>•</Text>
                                <Text style={[themeStyles.content, { flex: 1, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }]}>{highlightText(line.replace(/^\- /, ''), highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}
                      {section.key === 'rubric2027' && (
                        <View style={{ padding: 16 }}>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 8 }}>Assessment Rubric (2027)</Text>
                          <RubricTable
                            data={[
                              { criterion: 'A: Framework for the Essay', summary: 'How well you structure your research question and organize your essay methodology', max: 6 },
                              { criterion: 'B: Knowledge and Understanding', summary: 'Your grasp of the subject matter and use of appropriate academic language', max: 6 },
                              { criterion: 'C: Analysis and Line of Argument', summary: 'The strength of your research methods and how logically you present your argument', max: 6 },
                              { criterion: 'D: Discussion and Evaluation', summary: 'How thoroughly you explore your findings and assess the importance of your results', max: 8 },
                              { criterion: 'E: Engagement (RPPF)', summary: 'Evidence of your personal curiosity, independent thinking, and reflection on your learning journey', max: 4 },
                            ]}
                            highlightedText={highlightedText}
                          />
                          <Text style={{
                            fontSize: 12,
                            color: '#8A97A7',
                            textAlign: 'center',
                            lineHeight: 16,
                            fontFamily: 'ScopeOne-Regular',
                            marginTop: 12,
                            fontStyle: 'italic',
                          }}>
                            Note: These are interpreted descriptions for educational guidance and not official assessment criteria.
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
        {/* Add separate Student-Only Resources section */}
        {userType === 'student' && (
          <View style={{ borderRadius: 16, borderWidth: 1, borderColor: '#7EC3FF', backgroundColor: 'rgba(182,199,247,0.12)', marginBottom: 24, overflow: 'hidden', paddingHorizontal: 8 }}>
            <List.Item
              title="Student-Only Resources"
              titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
              style={{ paddingVertical: 16, paddingLeft: 20 }}
            />
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
        
        {/* Predict Your Grade Button */}
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
            // TODO: Navigate to grade prediction screen
            console.log('Navigate to grade prediction');
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

        {/* Disclaimer */}
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

export default ExtendedEssayScreen; 