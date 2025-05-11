import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Animated, Button } from 'react-native';
import { Text, Card, List, Searchbar, Button as PaperButton, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const MathAAScreen = () => {
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
    overview: `Mathematics: Analysis and Approaches is a course that focuses on developing mathematical knowledge, concepts, and principles. It is designed for students who enjoy developing mathematical arguments and problem-solving skills.`,
    topics: `• Number and Algebra\n• Functions\n• Geometry and Trigonometry\n• Statistics and Probability\n• Calculus\n• Complex Numbers\n• Vectors` ,
    essentials: `Topics (SL/HL):\n• Number & Algebra (19/39)\n• Functions (21/32)\n• Geometry (25/51)\n• Statistics (27/33)\n• Calculus (28/55)\nAssessment Outline\n• Paper 1 (90m): 40%\n• Paper 2 (90m): 40%\n• Internal Assessment: 20%\n• Paper 1 (120m): 30%\n• Paper 2 (120m): 30%\n• Paper 3 (75m): 20%\n• Internal Assessment: 20%\nInternal Assessment Rubrics (20 marks)\n• Criterion A: Presentation (4 marks)\n• Criterion B: Mathematical communication (4 marks)\n• Criterion C: Personal engagement (4 marks)\n• Criterion D: Reflection (3 marks)\n• Criterion E: Use of mathematics (5 marks)\nAssessment Objectives in Practice\n• Problem solving\n• Communication\n• Reasoning\n• Technology use\n• Inquiry`,
    rubrics: `Assessed via mark schemes, not fixed rubrics.\nRewarded Elements:\n• Mathematical reasoning and accuracy\n• Logical structure and progression\n• Use of correct notation\n• Clear communication of solutions\n• For HL Paper 3: deep problem solving and strategy\nInternal Assessment (20 marks)\n• Criterion A: Presentation (4 marks)\n• Criterion B: Mathematical Communication (4 marks)\n• Criterion C: Personal Engagement (4 marks)\n• Criterion D: Reflection (3 marks)\n• Criterion E: Use of Mathematics (5 marks)`
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
            outputRange: [0, 1000],
          }),
          opacity: animationValue,
          overflow: 'hidden',
        }}
      >
        {content}
      </Animated.View>
    );
  };

  // Ensure expandedSection always matches the current match, even on first search
  React.useEffect(() => {
    if (matchingSections.length > 0) {
      // Always expand the current match
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
            <Text style={styles.title}>Mathematics: Analysis and Approaches</Text>
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
                      {highlightText("Mathematics: Analysis and Approaches is a course that focuses on developing mathematical knowledge, concepts, and principles. It is designed for students who enjoy developing mathematical arguments and problem-solving skills.")}
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
                      {highlightText("• Complex Numbers\n• Vectors\n• Statistics and Probability\n• Calculus")}
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
                      <Text style={styles.content}>
                        {highlightText("Topics (SL/HL):")}
                      </Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Number & Algebra (19/39)\n• Functions (21/32)\n• Geometry (25/51)\n• Statistics (27/33)\n• Calculus (28/55)")}
                      </Text>
                    </View>

                    <Text style={styles.subsectionTitle}>Assessment Outline</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.levelTitle}>Standard Level (SL)</Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Paper 1 (90m): 40%\n• Paper 2 (90m): 40%\n• Internal Assessment: 20%")}
                      </Text>

                      <Text style={styles.levelTitle}>Higher Level (HL)</Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Paper 1 (120m): 30%\n• Paper 2 (120m): 30%\n• Paper 3 (75m): 20%\n• Internal Assessment: 20%")}
                      </Text>
                    </View>

                    <Text style={styles.subsectionTitle}>Internal Assessment Rubrics (20 marks)</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Criterion A: Presentation (4 marks)\n• Criterion B: Mathematical communication (4 marks)\n• Criterion C: Personal engagement (4 marks)\n• Criterion D: Reflection (3 marks)\n• Criterion E: Use of mathematics (5 marks)")}
                      </Text>
                    </View>

                    <Text style={styles.subsectionTitle}>Assessment Objectives in Practice</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Problem solving\n• Communication\n• Reasoning\n• Technology use\n• Inquiry")}
                      </Text>
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
                    <Text style={styles.subsectionTitle}>Papers 1, 2, 3</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.content}>
                        {highlightText("Assessed via mark schemes, not fixed rubrics.")}
                      </Text>
                      <Text style={styles.criterionTitle}>Rewarded Elements:</Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Mathematical reasoning and accuracy\n• Logical structure and progression\n• Use of correct notation\n• Clear communication of solutions\n• For HL Paper 3: deep problem solving and strategy")}
                      </Text>
                    </View>

                    <Text style={styles.subsectionTitle}>Internal Assessment (20 marks)</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.criterionTitle}>Criterion A: Presentation (4 marks)</Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• The exploration is well structured and coherent")}
                      </Text>

                      <Text style={styles.criterionTitle}>Criterion B: Mathematical Communication (4 marks)</Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Appropriate use of mathematical language and notation")}
                      </Text>

                      <Text style={styles.criterionTitle}>Criterion C: Personal Engagement (4 marks)</Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Evidence of independent thinking\n• Creativity\n• Ownership")}
                      </Text>

                      <Text style={styles.criterionTitle}>Criterion D: Reflection (3 marks)</Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Critical reflection on results\n• Critical reflection on methods\n• Critical reflection on learning")}
                      </Text>

                      <Text style={styles.criterionTitle}>Criterion E: Use of Mathematics (5 marks)</Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Correct and relevant mathematical processes\n• Used with sophistication")}
                      </Text>
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
    fontSize: 16,
    color: '#FFD700',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Montserrat_700Bold',
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
    marginTop: 8,
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
  },
  criterionTitle: {
    fontSize: 15,
    color: '#FFD700',
    marginTop: 12,
    marginBottom: 4,
    fontFamily: 'Montserrat_700Bold',
  },
  criterionDescription: {
    fontSize: 14,
    color: '#E0D8C3',
    marginLeft: 8,
    marginBottom: 8,
    lineHeight: 20,
    fontFamily: 'Montserrat_400Regular',
  },
  levelTitle: {
    fontSize: 15,
    color: '#FFD700',
    marginTop: 12,
    marginBottom: 4,
    fontFamily: 'Montserrat_700Bold',
  },
});

export default MathAAScreen; 