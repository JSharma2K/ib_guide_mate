import React, { useState, useCallback, useRef } from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import { Text, Card, List, Divider, Searchbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const EnglishALiteratureScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [highlightedText, setHighlightedText] = useState('');

  // Animation values for each section
  const overviewAnimation = useRef(new Animated.Value(0)).current;
  const essentialsAnimation = useRef(new Animated.Value(0)).current;
  const literatureAnimation = useRef(new Animated.Value(0)).current;
  const detailedRubricsAnimation = useRef(new Animated.Value(0)).current;

  const toggleSection = (section: string) => {
    const isExpanding = expandedSection !== section;
    setExpandedSection(isExpanding ? section : null);

    // Get the animation value for the current section
    const animationValue = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'literature': literatureAnimation,
      'detailedRubrics': detailedRubricsAnimation,
    }[section];

    // Animate the section
    Animated.timing(animationValue, {
      toValue: isExpanding ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setHighlightedText(query);

    // Define searchable sections and their content
    const searchableSections = {
      overview: "English A: Literature is a course that focuses on the study of literary texts. It is designed for students who are interested in developing their understanding of literature and literary criticism.",
      essentials: "Standard Level (SL): 4 works Higher Level (HL): 6 works Areas of Exploration: Readers-Writers-Texts Time and Space Intertextuality",
      literature: "Works in Translation Study of works originally written in languages other than English Focus on cultural and historical context Development of intercultural understanding Works in English Study of works written in English Focus on literary techniques and devices Development of critical analysis skills",
      detailedRubrics: "Paper 1 Understanding and Interpretation Analysis and Evaluation Focus and Organization Language Paper 2 Knowledge Understanding and Interpretation Analysis and Evaluation Focus and Organization Individual Oral Knowledge Understanding and Interpretation Analysis and Evaluation Focus and Organization Language HL Essay Knowledge Understanding and Interpretation Analysis and Evaluation Focus Organization and Development Language"
    };

    // Find the section containing the search query
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
      'essentials': essentialsAnimation,
      'literature': literatureAnimation,
      'detailedRubrics': detailedRubricsAnimation,
    }[section];

    return (
      <Animated.View
        style={{
          maxHeight: animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1000], // Adjust this value based on your content
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
                      {highlightText("English A: Literature is a course that focuses on the study of literary texts. It is designed for students who are interested in developing their understanding of literature and literary criticism.")}
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
                      {highlightText("• Paper 1 (1h 15m): 35%\n• Paper 2 (1h 45m): 35%\n• Individual Oral (15 min): 30%")}
                    </Text>

                    <Text style={styles.levelTitle}>Higher Level (HL)</Text>
                    <Text style={styles.content}>
                      {highlightText("• Paper 1 (2h 15m): 35%\n• Paper 2 (1h 45m): 25%\n• Individual Oral: 20%\n• HL Essay: 20%")}
                    </Text>

                    <Text style={styles.subsectionTitle}>Rubrics</Text>
                    <Text style={styles.content}>
                      {highlightText("• Paper 1 & 2: Criteria A-D (5-10 marks each)\n• Individual Oral: Criteria A-D (10 marks each)\n• HL Essay: Criteria A-D (5 marks each)")}
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
                    <Text style={styles.subsectionTitle}>Paper 1 (20 marks)</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.criterionTitle}>
                        {highlightText("Criterion A: Understanding and Interpretation (5 marks)")}
                      </Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Insightful interpretation of the text\n• Clear understanding of meaning and purpose")}
                      </Text>

                      <Text style={styles.criterionTitle}>
                        {highlightText("Criterion B: Analysis and Evaluation (5 marks)")}
                      </Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Effective analysis of stylistic features\n• Analysis of literary devices\n• Understanding of impact on the reader")}
                      </Text>

                      <Text style={styles.criterionTitle}>
                        {highlightText("Criterion C: Focus and Organization (5 marks)")}
                      </Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Ideas are clearly structured\n• Logical development of arguments\n• Coherent presentation")}
                      </Text>

                      <Text style={styles.criterionTitle}>
                        {highlightText("Criterion D: Language (5 marks)")}
                      </Text>
                      <Text style={styles.criterionDescription}>
                        {highlightText("• Clear, varied, and accurate language\n• Appropriate for literary analysis")}
                      </Text>
                    </View>

                    <Text style={styles.subsectionTitle}>Paper 2 (30 marks)</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.criterionTitle}>Criterion A: Knowledge, Understanding and Interpretation (10 marks)</Text>
                      <Text style={styles.criterionTitle}>Criterion B: Analysis and Evaluation (10 marks)</Text>
                      <Text style={styles.criterionTitle}>Criterion C: Focus and Organization (10 marks)</Text>
                    </View>

                    <Text style={styles.subsectionTitle}>Individual Oral (40 marks)</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.criterionTitle}>Criterion A: Knowledge, Understanding and Interpretation (10 marks)</Text>
                      <Text style={styles.criterionTitle}>Criterion B: Analysis and Evaluation (10 marks)</Text>
                      <Text style={styles.criterionTitle}>Criterion C: Focus and Organization (10 marks)</Text>
                      <Text style={styles.criterionTitle}>Criterion D: Language (10 marks)</Text>
                    </View>

                    <Text style={styles.subsectionTitle}>HL Essay (20 marks)</Text>
                    <View style={styles.criterionContainer}>
                      <Text style={styles.criterionTitle}>Criterion A: Knowledge, Understanding and Interpretation (5 marks)</Text>
                      <Text style={styles.criterionTitle}>Criterion B: Analysis and Evaluation (5 marks)</Text>
                      <Text style={styles.criterionTitle}>Criterion C: Focus, Organization and Development (5 marks)</Text>
                      <Text style={styles.criterionTitle}>Criterion D: Language (5 marks)</Text>
                    </View>
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
  levelTitle: {
    fontSize: 16,
    color: '#FFD700',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Montserrat_700Bold',
    fontStyle: 'italic',
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
  highlightedText: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    color: '#FFD700',
    fontWeight: 'bold',
  },
});

export default EnglishALiteratureScreen; 