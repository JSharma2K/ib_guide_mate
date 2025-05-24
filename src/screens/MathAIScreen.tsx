import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated, Platform, ImageBackground } from 'react-native';
import { Text, Card, List, Searchbar, Button as PaperButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, gradientColors, styles as themeStyles } from '../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

type MathAIScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MathAI'>;

type Props = {
  navigation: MathAIScreenNavigationProp;
};

const MathAIScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [highlightedText, setHighlightedText] = useState('');
  const [matchingSections, setMatchingSections] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Animation values for each section
  const overviewAnimation = useRef(new Animated.Value(0)).current;
  const topicsAnimation = useRef(new Animated.Value(0)).current;
  const essentialsAnimation = useRef(new Animated.Value(0)).current;
  const rubricsAnimation = useRef(new Animated.Value(0)).current;

  const sectionContentStrings: Record<'overview' | 'topics' | 'essentials' | 'rubrics', string> = {
    overview: `Mathematics: Applications and Interpretation is a course that focuses on mathematical modeling and the use of technology to solve real-world problems.`,
    topics: `• Number and Algebra\n• Functions\n• Geometry and Trigonometry\n• Statistics and Probability\n• Calculus\n• Discrete Mathematics\n• Further Statistics\n• Further Calculus` ,
    essentials: `Topics (SL/HL):\n• Number & Algebra (16/29)\n• Functions (31/42)\n• Geometry (18/46)\n• Statistics (36/52)\n• Calculus (19/41)\nAssessment Outline\n• Paper 1 (90m): 40%\n• Paper 2 (90m): 40%\n• IA: 20%\n• Paper 1 (120m): 30%\n• Paper 2 (120m): 30%\n• Paper 3 (75m): 20%\n• IA: 20%\nIA Rubrics (same as AA)\n• A: Presentation (4)\n• B: Mathematical communication (4)\n• C: Personal engagement (4)\n• D: Reflection (3)\n• E: Use of mathematics (5)\nAssessment Objectives in Practice\n• Emphasis on technology, modeling, and real-world applications`,
    rubrics: `PAPERS 1, 2, 3\nAlso marked via detailed schemes.\nRewarded elements include:\n• Real-world application\n• Correct use of technology (GDC)\n• Modeling and interpretation\n• Accuracy and reasoning\n• For HL Paper 3: emphasis on extended contextual problems\nMATHEMATICS AA & AI: INTERNAL ASSESSMENT (20 marks)\nCriterion A: Presentation (4 marks)\nThe exploration is well structured and coherent.\nCriterion B: Mathematical Communication (4 marks)\nAppropriate use of mathematical language and notation.\nCriterion C: Personal Engagement (4 marks)\nEvidence of independent thinking, creativity, and ownership.\nCriterion D: Reflection (3 marks)\nCritical reflection on results, methods, and learning.\nCriterion E: Use of Mathematics (5 marks)\nCorrect and relevant mathematical processes used with sophistication.`
  };
  const sectionKeys: Array<'overview' | 'topics' | 'essentials' | 'rubrics'> = ['overview', 'topics', 'essentials', 'rubrics'];

  const toggleSection = (section: string) => {
    const isExpanding = expandedSection !== section;
    setExpandedSection(isExpanding ? section : null);
    const animationValue = {
      'overview': overviewAnimation,
      'topics': topicsAnimation,
      'essentials': essentialsAnimation,
      'rubrics': rubricsAnimation,
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
    setHighlightedText(query);
    if (!query) {
      setMatchingSections([]);
      setCurrentMatchIndex(0);
      setExpandedSection(null);
      return;
    }
    // Find all sections that match
    const matches = sectionKeys.filter(key =>
      sectionContentStrings[key].toLowerCase().includes(query.toLowerCase())
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

  // Ensure expandedSection always matches the current match, even on first search
  React.useEffect(() => {
    if (matchingSections.length > 0) {
      setExpandedSection(matchingSections[currentMatchIndex]);
    } else {
      setExpandedSection(null);
    }
  }, [currentMatchIndex, matchingSections]);

  // When expandedSection changes, trigger the animation for that section
  React.useEffect(() => {
    if (!expandedSection) return;
    const animationValue = {
      'overview': overviewAnimation,
      'topics': topicsAnimation,
      'essentials': essentialsAnimation,
      'rubrics': rubricsAnimation,
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
          'overview': overviewAnimation,
          'topics': topicsAnimation,
          'essentials': essentialsAnimation,
          'rubrics': rubricsAnimation,
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

  const highlightText = (text: string) => {
    if (!highlightedText) return text;
    const parts = text.split(new RegExp(`(${highlightedText})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlightedText.toLowerCase() ?
        <Text key={i} style={themeStyles.highlightedText}>{part}</Text> :
        part
    );
  };

  const renderAnimatedContent = (section: string, content: React.ReactNode) => {
    const animationValue = {
      'overview': overviewAnimation,
      'topics': topicsAnimation,
      'essentials': essentialsAnimation,
      'rubrics': rubricsAnimation,
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
      {/* Home icon top left */}
      <View style={{ position: 'absolute', top: 56, left: 16, zIndex: 100, flexDirection: 'row', alignItems: 'center' }}>
        <Feather
          name="home"
          size={20}
          color="#7EC3FF"
          onPress={() => navigation.goBack()}
          style={{ cursor: 'pointer' }}
          accessibilityRole="button"
          accessibilityLabel="Go to Home"
        />
      </View>
      <ScrollView contentContainerStyle={{ paddingTop: 112, paddingBottom: 32, paddingHorizontal: 16 }}>
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>Mathematics: Applications and Interpretation</Text>
            <Text style={{ fontSize: 16, color: '#8A97A7', fontFamily: 'ScopeOne-Regular', marginBottom: 12 }}>Group 5: Mathematics</Text>
            <View style={{ height: 2, backgroundColor: '#7EC3FF', marginBottom: 8 }} />
          </View>
          {/* Dropdowns */}
          {[{ key: 'overview', title: 'Course Overview' }, { key: 'topics', title: 'Topics' }, { key: 'essentials', title: 'Subject Essentials' }, { key: 'rubrics', title: 'Detailed Rubrics' }].map((section, idx, arr) => (
            <View key={section.key}>
              <List.Item
                title={() => (
                  <Text style={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}>
                    {highlightText(section.title)}
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
                      {section.key === 'overview' && (
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }}>{highlightText(sectionContentStrings.overview)}</Text>
                      )}
                      {section.key === 'topics' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Core Topics</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }}>{highlightText("• Number and Algebra\n• Functions\n• Geometry and Trigonometry\n• Statistics and Probability\n• Calculus")}</Text>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Additional HL Topics</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }}>{highlightText("• Discrete Mathematics\n• Further Statistics\n• Further Calculus")}</Text>
                        </View>
                      )}
                      {section.key === 'essentials' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Syllabus Overview</Text>
                          <View style={themeStyles.criterionContainer}>
                            <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }}>{highlightText("Topics (SL/HL):")}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Number & Algebra (16/29)\n• Functions (31/42)\n• Geometry (18/46)\n• Statistics (36/52)\n• Calculus (19/41)")}</Text>
                          </View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Assessment Outline</Text>
                          <View style={themeStyles.criterionContainer}>
                            <Text style={{ ...themeStyles.levelTitle, color: '#7EC3FF', fontFamily: 'ScopeOne-Regular' }}>Standard Level (SL)</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Paper 1 (90m): 40%\n• Paper 2 (90m): 40%\n• IA: 20%")}</Text>
                            <Text style={{ ...themeStyles.levelTitle, color: '#7EC3FF', fontFamily: 'ScopeOne-Regular' }}>Higher Level (HL)</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Paper 1 (120m): 30%\n• Paper 2 (120m): 30%\n• Paper 3 (75m): 20%\n• IA: 20%")}</Text>
                          </View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>IA Rubrics (same as AA)</Text>
                          <View style={themeStyles.criterionContainer}>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• A: Presentation (4)")}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• B: Mathematical communication (4)")}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• C: Personal engagement (4)")}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• D: Reflection (3)")}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• E: Use of mathematics (5)")}</Text>
                          </View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Assessment Objectives in Practice</Text>
                          <View style={themeStyles.criterionContainer}>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Emphasis on technology, modeling, and real-world applications")}</Text>
                          </View>
                        </View>
                      )}
                      {section.key === 'rubrics' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>PAPERS 1, 2, 3</Text>
                          <View style={themeStyles.criterionContainer}>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("Also marked via detailed schemes.")}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("Rewarded elements include:")}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Real-world application")}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Correct use of technology (GDC)")}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Modeling and interpretation")}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Accuracy and reasoning")}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• For HL Paper 3: emphasis on extended contextual problems")}</Text>
                          </View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>MATHEMATICS AA & AI: INTERNAL ASSESSMENT (20 marks)</Text>
                          <View style={themeStyles.criterionContainer}>
                            <Text style={{ ...themeStyles.criterionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>{highlightText("Criterion A: Presentation (4 marks)")}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("The exploration is well structured and coherent.")}</Text>
                            <Text style={{ ...themeStyles.criterionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>{highlightText("Criterion B: Mathematical Communication (4 marks)")}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("Appropriate use of mathematical language and notation.")}</Text>
                            <Text style={{ ...themeStyles.criterionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>{highlightText("Criterion C: Personal Engagement (4 marks)")}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("Evidence of independent thinking, creativity, and ownership.")}</Text>
                            <Text style={{ ...themeStyles.criterionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>{highlightText("Criterion D: Reflection (3 marks)")}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("Critical reflection on results, methods, and learning.")}</Text>
                            <Text style={{ ...themeStyles.criterionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>{highlightText("Criterion E: Use of Mathematics (5 marks)")}</Text>
                            <Text style={{ ...themeStyles.criterionDescription, fontFamily: 'ScopeOne-Regular' }}>{highlightText("Correct and relevant mathematical processes used with sophistication.")}</Text>
                          </View>
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
      </ScrollView>
    </ImageBackground>
  );
};

export default MathAIScreen; 