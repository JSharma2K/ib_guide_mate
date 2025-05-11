import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated, Platform } from 'react-native';
import { Text, Card, List, Searchbar, Button as PaperButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, gradientColors, styles as themeStyles } from '../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

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
      headerStyle: {
        backgroundColor: '#181A20',
      },
      headerTintColor: '#FFD700',
      headerTitleStyle: {
        fontFamily: 'Inter_700Bold',
        fontSize: 22,
        color: '#FFD700',
      },
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

  return (
    <View style={[themeStyles.container, { backgroundColor: '#181A20' }]}>
      <ScrollView>
        <LinearGradient
          colors={["#22304A", "#181A20"]}
          style={[themeStyles.gradient, { paddingTop: Platform.OS === 'android' ? 60 : 80, paddingHorizontal: 20, paddingBottom: 24 }]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <Searchbar
            placeholder="Search content..."
            onChangeText={handleSearch}
            value={searchQuery}
            style={[themeStyles.searchBar, { backgroundColor: 'rgba(34, 48, 74, 0.7)' }]}
            inputStyle={{ color: theme.colors.primary }}
            placeholderTextColor={theme.colors.primary}
            iconColor={theme.colors.primary}
          />
          {matchingSections.length > 1 && (
            <View style={{ alignItems: 'flex-end', marginBottom: 8 }}>
              <PaperButton
                mode="contained"
                onPress={handleNextMatch}
                style={{
                  borderRadius: 24,
                  backgroundColor: theme.colors.primary,
                  marginTop: 4,
                  minWidth: 120,
                  elevation: 2,
                }}
                labelStyle={{ color: theme.colors.background, fontWeight: 'bold' }}
              >
                {`Next (${currentMatchIndex + 1}/${matchingSections.length})`}
              </PaperButton>
            </View>
          )}
          <Card style={themeStyles.card}>
            <Card.Content>
              <Text style={themeStyles.title}>Mathematics: Applications and Interpretation</Text>
              <Text style={themeStyles.subtitle}>Group 5: Mathematics</Text>
              <List.Section>
                <List.Accordion
                  title="Course Overview"
                  expanded={expandedSection === 'overview'}
                  onPress={() => toggleSection('overview')}
                  titleStyle={themeStyles.sectionTitle}
                >
                  {renderAnimatedContent('overview',
                    <View style={themeStyles.sectionContent}>
                      <Text style={themeStyles.content}>
                        {highlightText(sectionContentStrings.overview)}
                      </Text>
                    </View>
                  )}
                </List.Accordion>

                <List.Accordion
                  title="Topics"
                  expanded={expandedSection === 'topics'}
                  onPress={() => toggleSection('topics')}
                  titleStyle={themeStyles.sectionTitle}
                >
                  {renderAnimatedContent('topics',
                    <View style={themeStyles.sectionContent}>
                      <Text style={themeStyles.subsectionTitle}>Core Topics</Text>
                      <Text style={themeStyles.content}>
                        {highlightText("• Number and Algebra\n• Functions\n• Geometry and Trigonometry\n• Statistics and Probability\n• Calculus")}
                      </Text>
                      <Text style={themeStyles.subsectionTitle}>Additional HL Topics</Text>
                      <Text style={themeStyles.content}>
                        {highlightText("• Discrete Mathematics\n• Further Statistics\n• Further Calculus")}
                      </Text>
                    </View>
                  )}
                </List.Accordion>

                <List.Accordion
                  title="Subject Essentials"
                  expanded={expandedSection === 'essentials'}
                  onPress={() => toggleSection('essentials')}
                  titleStyle={themeStyles.sectionTitle}
                >
                  {renderAnimatedContent('essentials',
                    <View style={themeStyles.sectionContent}>
                      <Text style={themeStyles.subsectionTitle}>Syllabus Overview</Text>
                      <View style={themeStyles.criterionContainer}>
                        <Text style={themeStyles.content}>{highlightText("Topics (SL/HL):")}</Text>
                        <Text style={themeStyles.criterionDescription}>{highlightText("• Number & Algebra (16/29)\n• Functions (31/42)\n• Geometry (18/46)\n• Statistics (36/52)\n• Calculus (19/41)")}</Text>
                      </View>
                      <Text style={themeStyles.subsectionTitle}>Assessment Outline</Text>
                      <View style={themeStyles.criterionContainer}>
                        <Text style={themeStyles.levelTitle}>Standard Level (SL)</Text>
                        <Text style={themeStyles.criterionDescription}>{highlightText("• Paper 1 (90m): 40%\n• Paper 2 (90m): 40%\n• IA: 20%")}</Text>
                        <Text style={themeStyles.levelTitle}>Higher Level (HL)</Text>
                        <Text style={themeStyles.criterionDescription}>{highlightText("• Paper 1 (120m): 30%\n• Paper 2 (120m): 30%\n• Paper 3 (75m): 20%\n• IA: 20%")}</Text>
                      </View>
                      <Text style={themeStyles.subsectionTitle}>IA Rubrics (same as AA)</Text>
                      <View style={themeStyles.criterionContainer}>
                        <Text style={themeStyles.criterionDescription}>{highlightText("• A: Presentation (4)")}</Text>
                        <Text style={themeStyles.criterionDescription}>{highlightText("• B: Mathematical communication (4)")}</Text>
                        <Text style={themeStyles.criterionDescription}>{highlightText("• C: Personal engagement (4)")}</Text>
                        <Text style={themeStyles.criterionDescription}>{highlightText("• D: Reflection (3)")}</Text>
                        <Text style={themeStyles.criterionDescription}>{highlightText("• E: Use of mathematics (5)")}</Text>
                      </View>
                      <Text style={themeStyles.subsectionTitle}>Assessment Objectives in Practice</Text>
                      <View style={themeStyles.criterionContainer}>
                        <Text style={themeStyles.criterionDescription}>{highlightText("• Emphasis on technology, modeling, and real-world applications")}</Text>
                      </View>
                    </View>
                  )}
                </List.Accordion>

                <List.Accordion
                  title="Detailed Rubrics"
                  expanded={expandedSection === 'rubrics'}
                  onPress={() => toggleSection('rubrics')}
                  titleStyle={themeStyles.sectionTitle}
                >
                  {renderAnimatedContent('rubrics',
                    <View style={themeStyles.sectionContent}>
                      <Text style={themeStyles.subsectionTitle}>PAPERS 1, 2, 3</Text>
                      <View style={themeStyles.criterionContainer}>
                        <Text style={themeStyles.criterionDescription}>{highlightText("Also marked via detailed schemes.")}</Text>
                        <Text style={themeStyles.criterionDescription}>{highlightText("Rewarded elements include:")}</Text>
                        <Text style={themeStyles.criterionDescription}>{highlightText("• Real-world application")}</Text>
                        <Text style={themeStyles.criterionDescription}>{highlightText("• Correct use of technology (GDC)")}</Text>
                        <Text style={themeStyles.criterionDescription}>{highlightText("• Modeling and interpretation")}</Text>
                        <Text style={themeStyles.criterionDescription}>{highlightText("• Accuracy and reasoning")}</Text>
                        <Text style={themeStyles.criterionDescription}>{highlightText("• For HL Paper 3: emphasis on extended contextual problems")}</Text>
                      </View>
                      <Text style={themeStyles.subsectionTitle}>MATHEMATICS AA & AI: INTERNAL ASSESSMENT (20 marks)</Text>
                      <View style={themeStyles.criterionContainer}>
                        <Text style={themeStyles.criterionTitle}>{highlightText("Criterion A: Presentation (4 marks)")}</Text>
                        <Text style={themeStyles.criterionDescription}>{highlightText("The exploration is well structured and coherent.")}</Text>
                        <Text style={themeStyles.criterionTitle}>{highlightText("Criterion B: Mathematical Communication (4 marks)")}</Text>
                        <Text style={themeStyles.criterionDescription}>{highlightText("Appropriate use of mathematical language and notation.")}</Text>
                        <Text style={themeStyles.criterionTitle}>{highlightText("Criterion C: Personal Engagement (4 marks)")}</Text>
                        <Text style={themeStyles.criterionDescription}>{highlightText("Evidence of independent thinking, creativity, and ownership.")}</Text>
                        <Text style={themeStyles.criterionTitle}>{highlightText("Criterion D: Reflection (3 marks)")}</Text>
                        <Text style={themeStyles.criterionDescription}>{highlightText("Critical reflection on results, methods, and learning.")}</Text>
                        <Text style={themeStyles.criterionTitle}>{highlightText("Criterion E: Use of Mathematics (5 marks)")}</Text>
                        <Text style={themeStyles.criterionDescription}>{highlightText("Correct and relevant mathematical processes used with sophistication.")}</Text>
                      </View>
                    </View>
                  )}
                </List.Accordion>
              </List.Section>
            </Card.Content>
          </Card>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

export default MathAIScreen; 