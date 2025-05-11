import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import { Text, Card, List, Searchbar, Button as PaperButton, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const EnglishALiteratureScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [highlightedText, setHighlightedText] = useState('');
  const [matchingSections, setMatchingSections] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const theme = useTheme();

  // Animation values for each section
  const overviewAnimation = useRef(new Animated.Value(0)).current;
  const essentialsAnimation = useRef(new Animated.Value(0)).current;
  const literatureAnimation = useRef(new Animated.Value(0)).current;
  const detailedRubricsAnimation = useRef(new Animated.Value(0)).current;

  // Section keys and content for search
  const sectionContentStrings: Record<'overview' | 'essentials' | 'literature' | 'detailedRubrics', string> = {
    overview: `English A: Literature is a course that focuses on the study of literary texts. It is designed for students who are interested in developing their understanding of literature and literary criticism. The course emphasizes the development of critical thinking and analytical skills through the study of a wide range of literary works from different periods, styles, and genres.`,
    essentials: `Course Overview\n• Standard Level (SL): 4 works\n• Higher Level (HL): 6 works\nAreas of Exploration\n• Readers-Writers-Texts\n• Time and Space\n• Intertextuality\nAssessment Outline\nSL:\n• Paper 1 (1h15m): 35%\n• Paper 2 (1h45m): 35%\n• Individual Oral (15 min): 30%\nHL:\n• Paper 1 (2h15m): 35%\n• Paper 2 (1h45m): 25%\n• Individual Oral: 20%\n• HL Essay: 20%\nRubrics\n• Paper 1 & 2: Criteria A-D (5-10 marks each)\n• IO: Criteria A-D (10 marks each)\n• HL Essay: Criteria A-D (5 marks each)\nAssessment Objectives in Practice\n• Problem solving\n• Communication\n• Reasoning\n• Technology use\n• Inquiry`,
    literature: `Works in Translation\n• Study of works originally written in languages other than English\n• Focus on cultural and historical context\n• Development of intercultural understanding\nWorks in English\n• Study of works written in English\n• Focus on literary techniques and devices\n• Development of critical analysis skills`,
    detailedRubrics: `Paper 1 (20 marks)\nCriterion A: Understanding and Interpretation (5 marks)\n• Insightful interpretation of the text\n• Clear understanding of meaning and purpose\nCriterion B: Analysis and Evaluation (5 marks)\n• Effective analysis of stylistic features\n• Analysis of literary devices\n• Understanding of impact on the reader\nCriterion C: Focus and Organization (5 marks)\n• Ideas are clearly structured\n• Logical development of arguments\n• Coherent presentation\nCriterion D: Language (5 marks)\n• Clear, varied, and accurate language\n• Appropriate for literary analysis\nPaper 2 (30 marks)\nCriterion A: Knowledge, Understanding and Interpretation (10 marks)\nCriterion B: Analysis and Evaluation (10 marks)\nCriterion C: Focus and Organization (10 marks)\nIndividual Oral (40 marks)\nCriterion A: Knowledge, Understanding and Interpretation (10 marks)\nCriterion B: Analysis and Evaluation (10 marks)\nCriterion C: Focus and Organization (10 marks)\nCriterion D: Language (10 marks)\nHL Essay (20 marks)\nCriterion A: Knowledge, Understanding and Interpretation (5 marks)\nCriterion B: Analysis and Evaluation (5 marks)\nCriterion C: Focus, Organization and Development (5 marks)\nCriterion D: Language (5 marks)`
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'literature' | 'detailedRubrics'> = ['overview', 'essentials', 'literature', 'detailedRubrics'];

  const toggleSection = (section: string) => {
    const isExpanding = expandedSection !== section;
    setExpandedSection(isExpanding ? section : null);
    const animationValue = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'literature': literatureAnimation,
      'detailedRubrics': detailedRubricsAnimation,
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
      'essentials': essentialsAnimation,
      'literature': literatureAnimation,
      'detailedRubrics': detailedRubricsAnimation,
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
          'essentials': essentialsAnimation,
          'literature': literatureAnimation,
          'detailedRubrics': detailedRubricsAnimation,
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
      'essentials': essentialsAnimation,
      'literature': literatureAnimation,
      'detailedRubrics': detailedRubricsAnimation,
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
            <Text style={styles.title}>English A: Literature</Text>
            <Text style={styles.subtitle}>Group 1: Studies in Language and Literature</Text>
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
                      {highlightText("English A: Literature is a course that focuses on the study of literary texts. It is designed for students who are interested in developing their understanding of literature and literary criticism. The course emphasizes the development of critical thinking and analytical skills through the study of a wide range of literary works from different periods, styles, and genres.")}
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
                    <Text style={styles.subsectionTitle}>Course Overview</Text>
                    <Text style={styles.content}>
                      {highlightText("• Standard Level (SL): 4 works\n• Higher Level (HL): 6 works\n\nAreas of Exploration:\n• Readers-Writers-Texts\n• Time and Space\n• Intertextuality")}
                    </Text>

                    <Text style={styles.subsectionTitle}>Assessment Outline</Text>
                    <Text style={styles.levelTitle}>Standard Level (SL)</Text>
                    <Text style={styles.content}>
                      {highlightText("• Paper 1 (1h15m): 35%\n• Paper 2 (1h45m): 35%\n• Individual Oral (15 min): 30%")}
                    </Text>
                    <Text style={styles.levelTitle}>Higher Level (HL)</Text>
                    <Text style={styles.content}>
                      {highlightText("• Paper 1 (2h15m): 35%\n• Paper 2 (1h45m): 25%\n• Individual Oral: 20%\n• HL Essay: 20%")}
                    </Text>

                    <Text style={styles.subsectionTitle}>Rubrics</Text>
                    <Text style={styles.content}>
                      {highlightText("• Paper 1 & 2: Criteria A-D (5-10 marks each)\n• IO: Criteria A-D (10 marks each)\n• HL Essay: Criteria A-D (5 marks each)")}
                    </Text>
                  </View>
                )}
              </List.Accordion>

              <List.Accordion
                title="Prescribed Literature"
                expanded={expandedSection === 'literature'}
                onPress={() => toggleSection('literature')}
                titleStyle={styles.sectionTitle}
              >
                {renderAnimatedContent('literature',
                  <View style={styles.sectionContent}>
                    <Text style={styles.subsectionTitle}>Works in Translation</Text>
                    <Text style={styles.content}>
                      {highlightText("• Study of works originally written in languages other than English\n• Focus on cultural and historical context\n• Development of intercultural understanding")}
                    </Text>
                    <Text style={styles.subsectionTitle}>Works in English</Text>
                    <Text style={styles.content}>
                      {highlightText("• Study of works written in English\n• Focus on literary techniques and devices\n• Development of critical analysis skills")}
                    </Text>
                  </View>
                )}
              </List.Accordion>

              <List.Accordion
                title="Detailed Rubrics"
                expanded={expandedSection === 'detailedRubrics'}
                onPress={() => toggleSection('detailedRubrics')}
                titleStyle={styles.sectionTitle}
              >
                {renderAnimatedContent('detailedRubrics',
                  <View style={styles.sectionContent}>
                    {/* PAPER 1 */}
                    <Text style={styles.subsectionTitle}>Paper 1 (20 marks)</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.criterionTitle}>{highlightText("Criterion A: Understanding and Interpretation (5 marks)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("Insightful interpretation of the text with a clear understanding of meaning and purpose.")}</Text>
                      <Text style={styles.criterionTitle}>{highlightText("Criterion B: Analysis and Evaluation (5 marks)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("Effective analysis of stylistic features, literary devices, and their impact on the reader.")}</Text>
                      <Text style={styles.criterionTitle}>{highlightText("Criterion C: Focus and Organization (5 marks)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("Ideas are clearly structured, logically developed, and coherently presented.")}</Text>
                      <Text style={styles.criterionTitle}>{highlightText("Criterion D: Language (5 marks)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("Uses clear, varied, and accurate language appropriate for literary analysis.")}</Text>
                    </View>
                    {/* PAPER 2 */}
                    <Text style={styles.subsectionTitle}>Paper 2 (30 marks)</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.criterionDescription}>{highlightText("Criterion A: Knowledge, Understanding and Interpretation (10 marks)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("Criterion B: Analysis and Evaluation (10 marks)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("Criterion C: Focus and Organization (10 marks)")}</Text>
                    </View>
                    {/* INDIVIDUAL ORAL */}
                    <Text style={styles.subsectionTitle}>Individual Oral (40 marks)</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.criterionDescription}>{highlightText("Criterion A: Knowledge, Understanding and Interpretation (10 marks)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("Criterion B: Analysis and Evaluation (10 marks)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("Criterion C: Focus and Organization (10 marks)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("Criterion D: Language (10 marks)")}</Text>
                    </View>
                    {/* HL ESSAY */}
                    <Text style={styles.subsectionTitle}>HL Essay (20 marks)</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.criterionDescription}>{highlightText("Criterion A: Knowledge, Understanding and Interpretation (5 marks)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("Criterion B: Analysis and Evaluation (5 marks)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("Criterion C: Focus, Organization and Development (5 marks)")}</Text>
                      <Text style={styles.criterionDescription}>{highlightText("Criterion D: Language (5 marks)")}</Text>
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

export default EnglishALiteratureScreen; 