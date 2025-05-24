import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated, StatusBar } from 'react-native';
import { Text, Card, List, Searchbar, Button as PaperButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, gradientColors, styles as themeStyles } from '../theme/theme';

const EnglishALiteratureScreen = ({ navigation, route }) => {
  const userType = route?.params?.userType || 'student';
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [highlightedText, setHighlightedText] = useState('');
  const [matchingSections, setMatchingSections] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Animation values for each section
  const overviewAnimation = useRef(new Animated.Value(0)).current;
  const essentialsAnimation = useRef(new Animated.Value(0)).current;
  const literatureAnimation = useRef(new Animated.Value(0)).current;
  const detailedRubricsAnimation = useRef(new Animated.Value(0)).current;

  // Section keys and content for search
  const detailedRubricsSearchText = [
    // Paper 1
    'A Understanding & Interpretation 5',
    'B Analysis & Evaluation 5',
    'C Focus & Organization 5',
    'D Language 5',
    // Paper 2
    'A Knowledge & Understanding 10',
    'B Analysis & Evaluation 10',
    'C Focus & Organization 10',
    // Individual Oral
    'A Knowledge, Understanding & Interpretation 10',
    'B Analysis & Evaluation 10',
    'C Focus & Organization 10',
    'D Language 10',
    // Literature and Performance - Paper 1
    'A Knowledge & Interpretation 10',
    'B Analysis & Evaluation 10',
    'C Focus & Organization 5',
    'D Language 5',
    // Literature and Performance - Written Assignment
    'A Knowledge & Understanding 6',
    'B Analysis & Evaluation 6',
    'C Focus & Organization 6',
    'D Language 4',
    'E Performance Analysis & Communication 4',
    // Literature and Performance - Internal Assessment
    'A Knowledge & Understanding 8',
    'B Analysis & Evaluation 8',
    'C Performance Skills 8',
    'D Oral Communication 8',
    // SSST Paper 1
    'A Understanding & Interpretation 5',
    'B Analysis & Evaluation 5',
    'C Focus & Organization 5',
    'D Language 5',
    // SSST Paper 2
    'A Knowledge & Understanding 10',
    'B Analysis & Evaluation 10',
    'C Focus & Organization 10',
    // SSST Individual Oral
    'A Knowledge, Understanding & Interpretation 10',
    'B Analysis & Evaluation 10',
    'C Focus & Organization 10',
    'D Language 10',
  ].join(' ');

  const sectionContentStrings: Record<'overview' | 'essentials' | 'literature' | 'detailedRubrics', string> = {
    overview: `English A: Literature is a course that focuses on the study of literary texts. It is designed for students who are interested in developing their understanding of literature and literary criticism. The course emphasizes the development of critical thinking and analytical skills through the study of a wide range of literary works from different periods, styles, and genres.`,
    essentials: `Course Overview\n• Standard Level (SL): 4 works\n• Higher Level (HL): 6 works\nAreas of Exploration\n• Readers-Writers-Texts\n• Time and Space\n• Intertextuality\nAssessment Outline\nSL:\n• Paper 1 (1h15m): 35%\n• Paper 2 (1h45m): 35%\n• Individual Oral (15 min): 30%\nHL:\n• Paper 1 (2h15m): 35%\n• Paper 2 (1h45m): 25%\n• Individual Oral: 20%\n• HL Essay: 20%\nRubrics\n• Paper 1 & 2: Criteria A-D (5-10 marks each)\n• IO: Criteria A-D (10 marks each)\n• HL Essay: Criteria A-D (5 marks each)\nAssessment Objectives in Practice\n• Problem solving\n• Communication\n• Reasoning\n• Technology use\n• Inquiry`,
    literature: `Works in Translation\n• Study of works originally written in languages other than English\n• Focus on cultural and historical context\n• Development of intercultural understanding\nWorks in English\n• Study of works written in English\n• Focus on literary techniques and devices\n• Development of critical analysis skills`,
    detailedRubrics: detailedRubricsSearchText,
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

  const RubricTable = ({ data, highlightedText }: { data: { criterion: string; summary: string; max: number }[]; highlightedText: string }) => (
    <View style={{ borderWidth: 1, borderColor: '#FFD700', borderRadius: 8, marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', backgroundColor: '#22242C' }}>
        <Text style={[themeStyles.sectionTitle, { flex: 1, padding: 8 }]}>Criterion</Text>
        <Text style={[themeStyles.sectionTitle, { flex: 2, padding: 8 }]}>Descriptor Summary</Text>
        <Text style={[themeStyles.sectionTitle, { flex: 0.5, padding: 8, textAlign: 'center' }]}>Max</Text>
      </View>
      {data.map((row, idx) => (
        <View key={idx} style={{ flexDirection: 'row', borderTopWidth: idx === 0 ? 0 : 1, borderColor: '#FFD700' }}>
          <Text style={{ flex: 1, color: '#FFD700', padding: 8 }}>{highlightText(row.criterion)}</Text>
          <Text style={{ flex: 2, color: '#B6B6B6', padding: 8 }}>{highlightText(row.summary)}</Text>
          <Text style={{ flex: 0.5, color: '#FFD700', padding: 8, textAlign: 'center' }}>{highlightText(String(row.max))}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={[themeStyles.container, { backgroundColor: '#181A20' }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView>
      <LinearGradient
          colors={["#22304A", "#181A20"]}
          style={[themeStyles.gradient, { paddingTop: 60 }]}
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
                labelStyle={{ color: theme.colors.background, fontWeight: 700 }}
            >
              {`Next (${currentMatchIndex + 1}/${matchingSections.length})`}
            </PaperButton>
          </View>
        )}
          <Card style={[themeStyles.card, { backgroundColor: 'rgba(34, 48, 74, 0.7)' }]}>
          <Card.Content>
              <Text style={themeStyles.title}>English A: Literature</Text>
              <Text style={themeStyles.subtitle}>Group 1: Studies in Language and Literature</Text>
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
                title="Subject Essentials"
                expanded={expandedSection === 'essentials'}
                onPress={() => toggleSection('essentials')}
                  titleStyle={themeStyles.sectionTitle}
              >
                {renderAnimatedContent('essentials',
                    <View style={themeStyles.sectionContent}>
                      <Text style={themeStyles.subsectionTitle}>Course Overview</Text>
                      <Text style={themeStyles.content}>
                      {highlightText("• Standard Level (SL): 4 works\n• Higher Level (HL): 6 works\n\nAreas of Exploration:\n• Readers-Writers-Texts\n• Time and Space\n• Intertextuality")}
                    </Text>

                      <Text style={themeStyles.subsectionTitle}>Assessment Outline</Text>
                      <Text style={themeStyles.levelTitle}>Standard Level (SL)</Text>
                      <Text style={themeStyles.content}>
                      {highlightText("• Paper 1 (1h15m): 35%\n• Paper 2 (1h45m): 35%\n• Individual Oral (15 min): 30%")}
                    </Text>
                      <Text style={themeStyles.levelTitle}>Higher Level (HL)</Text>
                      <Text style={themeStyles.content}>
                      {highlightText("• Paper 1 (2h15m): 35%\n• Paper 2 (1h45m): 25%\n• Individual Oral: 20%\n• HL Essay: 20%")}
                    </Text>

                      <Text style={themeStyles.subsectionTitle}>Rubrics</Text>
                      <Text style={themeStyles.content}>
                      {highlightText("• Paper 1 & 2: Criteria A-D (5-10 marks each)\n• IO: Criteria A-D (10 marks each)\n• HL Essay: Criteria A-D (5 marks each)")}
                    </Text>
                  </View>
                )}
              </List.Accordion>

              <List.Accordion
                title="Prescribed Literature"
                expanded={expandedSection === 'literature'}
                onPress={() => toggleSection('literature')}
                  titleStyle={themeStyles.sectionTitle}
              >
                {renderAnimatedContent('literature',
                    <View style={themeStyles.sectionContent}>
                      <Text style={themeStyles.subsectionTitle}>Works in Translation</Text>
                      <Text style={themeStyles.content}>
                      {highlightText("• Study of works originally written in languages other than English\n• Focus on cultural and historical context\n• Development of intercultural understanding")}
                    </Text>
                      <Text style={themeStyles.subsectionTitle}>Works in English</Text>
                      <Text style={themeStyles.content}>
                      {highlightText("• Study of works written in English\n• Focus on literary techniques and devices\n• Development of critical analysis skills")}
                    </Text>
                  </View>
                )}
              </List.Accordion>

              <List.Accordion
                title="Detailed Rubrics"
                expanded={expandedSection === 'detailedRubrics'}
                onPress={() => toggleSection('detailedRubrics')}
                  titleStyle={themeStyles.sectionTitle}
              >
                  <View style={{ padding: 16 }}>
                    {/* Paper 1 Table */}
                    <Text style={[themeStyles.subsectionTitle, { marginBottom: 8 }]}>Language A: Literature - Paper 1</Text>
                    <RubricTable
                      data={[
                        { criterion: 'A', summary: 'Understanding & Interpretation', max: 5 },
                        { criterion: 'B', summary: 'Analysis & Evaluation', max: 5 },
                        { criterion: 'C', summary: 'Focus & Organization', max: 5 },
                        { criterion: 'D', summary: 'Language', max: 5 },
                      ]}
                      highlightedText={highlightedText}
                    />
                    {/* Paper 2 Table */}
                    <Text style={[themeStyles.subsectionTitle, { marginTop: 24, marginBottom: 8 }]}>Language A: Literature - Paper 2</Text>
                    <RubricTable
                      data={[
                        { criterion: 'A', summary: 'Knowledge & Understanding', max: 10 },
                        { criterion: 'B', summary: 'Analysis & Evaluation', max: 10 },
                        { criterion: 'C', summary: 'Focus & Organization', max: 10 },
                      ]}
                      highlightedText={highlightedText}
                    />
                    {/* Individual Oral Table */}
                    <Text style={[themeStyles.subsectionTitle, { marginTop: 24, marginBottom: 8 }]}>Language A: Literature - Individual Oral</Text>
                    <RubricTable
                      data={[
                        { criterion: 'A', summary: 'Knowledge, Understanding & Interpretation', max: 10 },
                        { criterion: 'B', summary: 'Analysis & Evaluation', max: 10 },
                        { criterion: 'C', summary: 'Focus & Organization', max: 10 },
                        { criterion: 'D', summary: 'Language', max: 10 },
                      ]}
                      highlightedText={highlightedText}
                    />
                    {/* Literature and Performance - Written Assignment Table */}
                    <Text style={[themeStyles.subsectionTitle, { marginTop: 24, marginBottom: 8 }]}>Literature and Performance - Written Assignment</Text>
                    <RubricTable
                      data={[
                        { criterion: 'A', summary: 'Knowledge & Understanding', max: 6 },
                        { criterion: 'B', summary: 'Analysis & Evaluation', max: 6 },
                        { criterion: 'C', summary: 'Focus & Organization', max: 6 },
                        { criterion: 'D', summary: 'Language', max: 4 },
                        { criterion: 'E', summary: 'Performance Analysis & Communication', max: 4 },
                      ]}
                      highlightedText={highlightedText}
                    />
                    {/* Literature and Performance - Internal Assessment Table */}
                    <Text style={[themeStyles.subsectionTitle, { marginTop: 24, marginBottom: 8 }]}>Literature and Performance - Internal Assessment</Text>
                    <RubricTable
                      data={[
                        { criterion: 'A', summary: 'Knowledge & Understanding', max: 8 },
                        { criterion: 'B', summary: 'Analysis & Evaluation', max: 8 },
                        { criterion: 'C', summary: 'Performance Skills', max: 8 },
                        { criterion: 'D', summary: 'Oral Communication', max: 8 },
                      ]}
                      highlightedText={highlightedText}
                    />
                    {/* SSST: Language A Literature - Paper 1 Table */}
                    <Text style={[themeStyles.subsectionTitle, { marginTop: 24, marginBottom: 8 }]}>SSST: Language A Literature - Paper 1</Text>
                    <RubricTable
                      data={[
                        { criterion: 'A', summary: 'Understanding & Interpretation', max: 5 },
                        { criterion: 'B', summary: 'Analysis & Evaluation', max: 5 },
                        { criterion: 'C', summary: 'Focus & Organization', max: 5 },
                        { criterion: 'D', summary: 'Language', max: 5 },
                      ]}
                      highlightedText={highlightedText}
                    />
                    {/* SSST: Language A Literature - Paper 2 Table */}
                    <Text style={[themeStyles.subsectionTitle, { marginTop: 24, marginBottom: 8 }]}>SSST: Language A Literature - Paper 2</Text>
                    <RubricTable
                      data={[
                        { criterion: 'A', summary: 'Knowledge & Understanding', max: 10 },
                        { criterion: 'B', summary: 'Analysis & Evaluation', max: 10 },
                        { criterion: 'C', summary: 'Focus & Organization', max: 10 },
                      ]}
                      highlightedText={highlightedText}
                    />
                    {/* SSST: Language A Literature - Individual Oral Table */}
                    <Text style={[themeStyles.subsectionTitle, { marginTop: 24, marginBottom: 8 }]}>SSST: Language A Literature - Individual Oral</Text>
                    <RubricTable
                      data={[
                        { criterion: 'A', summary: 'Knowledge, Understanding & Interpretation', max: 10 },
                        { criterion: 'B', summary: 'Analysis & Evaluation', max: 10 },
                        { criterion: 'C', summary: 'Focus & Organization', max: 10 },
                        { criterion: 'D', summary: 'Language', max: 10 },
                      ]}
                      highlightedText={highlightedText}
                    />
                  </View>
              </List.Accordion>
            </List.Section>
          </Card.Content>
        </Card>
          {/* Example: show a teacher-only dropdown */}
          {userType === 'teacher' && (
            <List.Accordion
              title="Teacher-Only Resources"
              titleStyle={themeStyles.sectionTitle}
            >
              <View style={{ padding: 16 }}>
                <Text style={themeStyles.content}>This dropdown is only visible to teachers.</Text>
              </View>
            </List.Accordion>
          )}
          {/* Example: show a student-only dropdown */}
          {userType === 'student' && (
            <List.Accordion
              title="Student-Only Resources"
              titleStyle={themeStyles.sectionTitle}
            >
              <View style={{ padding: 16 }}>
                <Text style={themeStyles.content}>This dropdown is only visible to students.</Text>
              </View>
            </List.Accordion>
          )}
      </LinearGradient>
    </ScrollView>
    </View>
  );
};

export default EnglishALiteratureScreen; 