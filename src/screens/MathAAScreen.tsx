import React, { useState, useCallback, useRef } from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import { Text, Card, List, Divider, Searchbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const MathAAScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [highlightedText, setHighlightedText] = useState('');

  // Animation values for each section
  const overviewAnimation = useRef(new Animated.Value(0)).current;
  const essentialsAnimation = useRef(new Animated.Value(0)).current;
  const topicsAnimation = useRef(new Animated.Value(0)).current;
  const assessmentAnimation = useRef(new Animated.Value(0)).current;

  const toggleSection = (section: string) => {
    const isExpanding = expandedSection !== section;
    setExpandedSection(isExpanding ? section : null);

    const animationValue = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'topics': topicsAnimation,
      'assessment': assessmentAnimation,
    }[section];

    Animated.timing(animationValue, {
      toValue: isExpanding ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setHighlightedText(query);

    const searchableSections = {
      overview: "Mathematics: Analysis and Approaches is a course that focuses on developing mathematical knowledge, concepts, and principles. It is designed for students who enjoy developing mathematical arguments and problem-solving skills.",
      essentials: "Standard Level (SL): 4 works Higher Level (HL): 6 works Areas of Exploration: Readers-Writers-Texts Time and Space Intertextuality",
      topics: "Number and Algebra Functions Geometry and Trigonometry Statistics and Probability Calculus",
      assessment: "Paper 1: No calculator allowed Paper 2: Calculator allowed Internal Assessment: Mathematical Exploration"
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
      'essentials': essentialsAnimation,
      'topics': topicsAnimation,
      'assessment': assessmentAnimation,
    }[section];

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
                title="Subject Essentials"
                expanded={expandedSection === 'essentials'}
                onPress={() => toggleSection('essentials')}
                titleStyle={styles.sectionTitle}
              >
                {renderAnimatedContent('essentials',
                  <View style={styles.sectionContent}>
                    <Text style={styles.subsectionTitle}>Course Structure</Text>
                    <Text style={styles.content}>
                      {highlightText("• Standard Level (SL): 150 hours\n• Higher Level (HL): 240 hours\n\nKey Features:\n• Focus on mathematical reasoning\n• Development of problem-solving skills\n• Application of mathematics to real-world situations")}
                    </Text>

                    <Text style={styles.subsectionTitle}>Assessment Structure</Text>
                    <Text style={styles.content}>
                      {highlightText("Standard Level (SL):\n• External Assessment: 80%\n• Internal Assessment: 20%\n\nHigher Level (HL):\n• External Assessment: 80%\n• Internal Assessment: 20%")}
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
                title="Assessment Details"
                expanded={expandedSection === 'assessment'}
                onPress={() => toggleSection('assessment')}
                titleStyle={styles.sectionTitle}
              >
                {renderAnimatedContent('assessment',
                  <View style={styles.sectionContent}>
                    <Text style={styles.subsectionTitle}>External Assessment</Text>
                    <Text style={styles.content}>
                      {highlightText("Paper 1:\n• No calculator allowed\n• Short and extended response questions\n• 90 minutes (SL) / 120 minutes (HL)\n\nPaper 2:\n• Calculator allowed\n• Short and extended response questions\n• 90 minutes (SL) / 120 minutes (HL)")}
                    </Text>

                    <Text style={styles.subsectionTitle}>Internal Assessment</Text>
                    <Text style={styles.content}>
                      {highlightText("Mathematical Exploration:\n• Individual investigation\n• 20 hours\n• Written report of 12-20 pages")}
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
  highlightedText: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    color: '#FFD700',
    fontWeight: 'bold',
  },
});

export default MathAAScreen; 