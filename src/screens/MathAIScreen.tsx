import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import { Text, Card, List, Searchbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const MathAIScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [highlightedText, setHighlightedText] = useState('');

  // Animation values for each section
  const overviewAnimation = useRef(new Animated.Value(0)).current;
  const topicsAnimation = useRef(new Animated.Value(0)).current;
  const essentialsAnimation = useRef(new Animated.Value(0)).current;
  const rubricsAnimation = useRef(new Animated.Value(0)).current;

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

    const searchableSections = {
      overview: "Mathematics: Applications and Interpretation is a course that focuses on mathematical modeling and the use of technology to solve real-world problems.",
      topics: "Number and Algebra Functions Geometry and Trigonometry Statistics and Probability Calculus",
      essentials: "Syllabus Overview Assessment Outline Internal Assessment Rubrics Assessment Objectives in Practice",
      rubrics: "Detailed Rubrics for Math AI",
    };

    for (const [section, content] of Object.entries(searchableSections)) {
      if (content.toLowerCase().includes(query.toLowerCase())) {
        setExpandedSection(section);
        break;
      }
    }
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
        />

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
                      {highlightText("Mathematics: Applications and Interpretation is a course that focuses on mathematical modeling and the use of technology to solve real-world problems. (Placeholder content for Math AI)")}
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
                      {highlightText("• Number and Algebra\n• Functions\n• Geometry and Trigonometry\n• Statistics and Probability\n• Calculus (Placeholder content for Math AI)")}
                    </Text>
                    <Text style={styles.subsectionTitle}>Additional HL Topics</Text>
                    <Text style={styles.content}>
                      {highlightText("• Discrete Mathematics\n• Further Statistics\n• Further Calculus (Placeholder content for Math AI)")}
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
                        {highlightText("Topics (SL/HL):\n• Placeholder topics for Math AI")}
                      </Text>
                    </View>
                    <Text style={styles.subsectionTitle}>Assessment Outline</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.levelTitle}>Standard Level (SL)</Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Paper 1: XX%\n• Paper 2: XX%\n• Internal Assessment: XX% (Placeholder content for Math AI)")}
                      </Text>
                      <Text style={styles.levelTitle}>Higher Level (HL)</Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Paper 1: XX%\n• Paper 2: XX%\n• Paper 3: XX%\n• Internal Assessment: XX% (Placeholder content for Math AI)")}
                      </Text>
                    </View>
                    <Text style={styles.subsectionTitle}>Internal Assessment Rubrics (20 marks)</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Criterion A: Presentation (4 marks)\n• Criterion B: Mathematical communication (4 marks)\n• Criterion C: Personal engagement (4 marks)\n• Criterion D: Reflection (3 marks)\n• Criterion E: Use of mathematics (5 marks) (Placeholder content for Math AI)")}
                      </Text>
                    </View>
                    <Text style={styles.subsectionTitle}>Assessment Objectives in Practice</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Problem solving\n• Communication\n• Reasoning\n• Technology use\n• Inquiry (Placeholder content for Math AI)")}
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
                        {highlightText("Assessed via mark schemes, not fixed rubrics. (Placeholder content for Math AI)")}
                      </Text>
                      <Text style={styles.criterionTitle}>Rewarded Elements:</Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Mathematical reasoning and accuracy\n• Logical structure and progression\n• Use of correct notation\n• Clear communication of solutions\n• For HL Paper 3: deep problem solving and strategy (Placeholder content for Math AI)")}
                      </Text>
                    </View>
                    <Text style={styles.subsectionTitle}>Internal Assessment (20 marks)</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.criterionTitle}>Criterion A: Presentation (4 marks)</Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• The exploration is well structured and coherent (Placeholder content for Math AI)")}
                      </Text>
                      <Text style={styles.criterionTitle}>Criterion B: Mathematical Communication (4 marks)</Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Appropriate use of mathematical language and notation (Placeholder content for Math AI)")}
                      </Text>
                      <Text style={styles.criterionTitle}>Criterion C: Personal Engagement (4 marks)</Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Evidence of independent thinking\n• Creativity\n• Ownership (Placeholder content for Math AI)")}
                      </Text>
                      <Text style={styles.criterionTitle}>Criterion D: Reflection (3 marks)</Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Critical reflection on results\n• Critical reflection on methods\n• Critical reflection on learning (Placeholder content for Math AI)")}
                      </Text>
                      <Text style={styles.criterionTitle}>Criterion E: Use of Mathematics (5 marks)</Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Correct and relevant mathematical processes\n• Used with sophistication (Placeholder content for Math AI)")}
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

export default MathAIScreen; 