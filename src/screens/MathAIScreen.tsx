import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import { Text, Card, List, Searchbar, Button as PaperButton, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const MathAIScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [highlightedText, setHighlightedText] = useState('');
  const [matchingSections, setMatchingSections] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const theme = useTheme();

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

  const highlightText = (text: string) => {
    if (!highlightedText) return text;
    const parts = text.split(new RegExp(`(${highlightedText})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlightedText.toLowerCase() ?
        <Text key={i} style={styles.highlightedText}>{part}</Text> :
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
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#232B4D", "#1A237E", "#121933"]}
        style={styles.gradient}
      >
        <Searchbar
          placeholder="Search content..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={{ color: '#FFD700' }}
          placeholderTextColor="#FFD700"
          iconColor="#FFD700"
        />
        {matchingSections.length > 1 && (
          <View style={{ alignItems: 'flex-end', marginBottom: 8 }}>
            <PaperButton
              mode="contained"
              onPress={handleNextMatch}
              style={{
                borderRadius: 24,
                backgroundColor: '#FFD700',
                marginTop: 4,
                minWidth: 120,
                elevation: 2,
              }}
              labelStyle={{ color: theme.colors.primary, fontWeight: 'bold' }}
            >
              {`Next (${currentMatchIndex + 1}/${matchingSections.length})`}
            </PaperButton>
          </View>
        )}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Mathematics: Applications and Interpretation</Text>
            <Text style={styles.subtitle}>Group 5: Mathematics</Text>
            <List.Section>
              <List.Accordion
                title="Course Overview"
                expanded={expandedSection === 'overview'}
                onPress={() => toggleSection('overview')}
                titleStyle={styles.sectionTitle}
              >
                {renderAnimatedContent('overview',
                  <View style={styles.sectionContent}>
                    <Text style={styles.content}>
                      {highlightText("Mathematics: Applications and Interpretation is a course that focuses on mathematical modeling and the use of technology to solve real-world problems.")}
                    </Text>
                  </View>
                )}
              </List.Accordion>

              <List.Accordion
                title="Topics"
                expanded={expandedSection === 'topics'}
                onPress={() => toggleSection('topics')}
                titleStyle={styles.sectionTitle}
              >
                {renderAnimatedContent('topics',
                  <View style={styles.sectionContent}>
                    <Text style={styles.subsectionTitle}>Core Topics</Text>
                    <Text style={styles.content}>
                      {highlightText("• Number and Algebra\n• Functions\n• Geometry and Trigonometry\n• Statistics and Probability\n• Calculus")}
                    </Text>
                    <Text style={styles.subsectionTitle}>Additional HL Topics</Text>
                    <Text style={styles.content}>
                      {highlightText("• Discrete Mathematics\n• Further Statistics\n• Further Calculus")}
                    </Text>
                  </View>
                )}
              </List.Accordion>

              <List.Accordion
                title="Subject Essentials"
                expanded={expandedSection === 'essentials'}
                onPress={() => toggleSection('essentials')}
                titleStyle={styles.sectionTitle}
              >
                {renderAnimatedContent('essentials',
                  <View style={styles.sectionContent}>
                    <Text style={styles.subsectionTitle}>Syllabus Overview</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.content}>{highlightText("Topics (SL/HL):")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("• Number & Algebra (16/29)\n• Functions (31/42)\n• Geometry (18/46)\n• Statistics (36/52)\n• Calculus (19/41)")}</Text>
                    </View>
                    <Text style={styles.subsectionTitle}>Assessment Outline</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.levelTitle}>Standard Level (SL)</Text>
                      <Text style={styles.criterionDescription}>{highlightText("• Paper 1 (90m): 40%\n• Paper 2 (90m): 40%\n• IA: 20%")}</Text>
                      <Text style={styles.levelTitle}>Higher Level (HL)</Text>
                      <Text style={styles.criterionDescription}>{highlightText("• Paper 1 (120m): 30%\n• Paper 2 (120m): 30%\n• Paper 3 (75m): 20%\n• IA: 20%")}</Text>
                    </View>
                    <Text style={styles.subsectionTitle}>IA Rubrics (same as AA)</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.criterionDescription}>{highlightText("• A: Presentation (4)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("• B: Mathematical communication (4)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("• C: Personal engagement (4)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("• D: Reflection (3)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("• E: Use of mathematics (5)")}</Text>
                    </View>
                    <Text style={styles.subsectionTitle}>Assessment Objectives in Practice</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.criterionDescription}>{highlightText("• Emphasis on technology, modeling, and real-world applications")}</Text>
                    </View>
                  </View>
                )}
              </List.Accordion>

              <List.Accordion
                title="Detailed Rubrics"
                expanded={expandedSection === 'rubrics'}
                onPress={() => toggleSection('rubrics')}
                titleStyle={styles.sectionTitle}
              >
                {renderAnimatedContent('rubrics',
                  <View style={styles.sectionContent}>
                    <Text style={styles.subsectionTitle}>PAPERS 1, 2, 3</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.criterionDescription}>{highlightText("Also marked via detailed schemes.")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("Rewarded elements include:")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("• Real-world application")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("• Correct use of technology (GDC)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("• Modeling and interpretation")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("• Accuracy and reasoning")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("• For HL Paper 3: emphasis on extended contextual problems")}</Text>
                    </View>
                    <Text style={styles.subsectionTitle}>MATHEMATICS AA & AI: INTERNAL ASSESSMENT (20 marks)</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.criterionTitle}>{highlightText("Criterion A: Presentation (4 marks)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("The exploration is well structured and coherent.")}</Text>
                      <Text style={styles.criterionTitle}>{highlightText("Criterion B: Mathematical Communication (4 marks)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("Appropriate use of mathematical language and notation.")}</Text>
                      <Text style={styles.criterionTitle}>{highlightText("Criterion C: Personal Engagement (4 marks)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("Evidence of independent thinking, creativity, and ownership.")}</Text>
                      <Text style={styles.criterionTitle}>{highlightText("Criterion D: Reflection (3 marks)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("Critical reflection on results, methods, and learning.")}</Text>
                      <Text style={styles.criterionTitle}>{highlightText("Criterion E: Use of Mathematics (5 marks)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("Correct and relevant mathematical processes used with sophistication.")}</Text>
                    </View>
                  </View>
                )}
              </List.Accordion>
            </List.Section>
          </Card.Content>
        </Card>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
    fontFamily: 'Montserrat_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#E0D8C3',
    marginBottom: 24,
    fontFamily: 'Montserrat_400Regular',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFD700',
    fontFamily: 'Montserrat_700Bold',
  },
  subsectionTitle: {
    fontSize: 18,
    color: '#FFD700',
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 8,
  },
  levelTitle: {
    fontSize: 16,
    color: '#E0D8C3',
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 8,
  },
  sectionContent: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 8,
  },
  content: {
    fontSize: 16,
    color: '#E0D8C3',
    lineHeight: 24,
    fontFamily: 'Montserrat_400Regular',
  },
  highlightedText: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    color: '#FFD700',
    fontWeight: 'bold',
  },
  criterionContainer: {
    marginBottom: 16,
  },
  criterionTitle: {
    fontSize: 16,
    color: '#FFD700',
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 4,
  },
  criterionDescription: {
    fontSize: 16,
    color: '#E0D8C3',
    fontFamily: 'Montserrat_400Regular',
  },
});

export default MathAIScreen; 