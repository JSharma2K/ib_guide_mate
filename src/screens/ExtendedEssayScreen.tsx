import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated, Platform, StatusBar } from 'react-native';
import { Text, Card, List, Searchbar, Button as PaperButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, gradientColors, styles as themeStyles } from '../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ExtendedEssay'>;
  route: {
    params: {
      userType: 'student' | 'teacher';
    };
  };
};

const sectionContentStrings: Record<
  'purpose' | 'objectives' | 'pathways' | 'roles' | 'integrity' | 'rubric2027',
  string
> = {
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
    `The 2027 Extended Essay assessment rubric will be available here.`,
};

const sectionKeys: Array<'purpose' | 'objectives' | 'pathways' | 'roles' | 'integrity' | 'rubric2027'> = [
  'purpose',
  'objectives',
  'pathways',
  'roles',
  'integrity',
  'rubric2027',
];

const Rubric2027Table = ({ highlightedText }: { highlightedText: string }) => (
  <View style={{ borderWidth: 1, borderColor: '#FFD700', borderRadius: 8, marginBottom: 8 }}>
    <View style={{ flexDirection: 'row', backgroundColor: '#22242C' }}>
      <Text style={[themeStyles.sectionTitle, { flex: 1, padding: 8 }]}>Criterion</Text>
      <Text style={[themeStyles.sectionTitle, { flex: 2, padding: 8 }]}>What It Assesses</Text>
      <Text style={[themeStyles.sectionTitle, { flex: 0.5, padding: 8, textAlign: 'center' }]}>Max Marks</Text>
    </View>
    {[
      {
        criterion: 'A: Framework for the Essay',
        assesses: 'Clarity and relevance of the research question, appropriateness of the methodology and structure.',
        max: 6,
      },
      {
        criterion: 'B: Knowledge and Understanding',
        assesses: 'Understanding of the topic, subject-specific terminology, and academic context.',
        max: 6,
      },
      {
        criterion: 'C: Analysis and Line of Argument',
        assesses: 'Quality of the research, critical analysis, and logical consistency of the argument.',
        max: 6,
      },
      {
        criterion: 'D: Discussion and Evaluation',
        assesses: 'Depth of discussion, significance of the findings, evaluation of research outcomes.',
        max: 8,
      },
      {
        criterion: 'E: Engagement (RPPF)',
        assesses: 'Evidence of intellectual initiative, self-reflection, and personal engagement with the process.',
        max: 4,
      },
    ].map((row, idx) => (
      <View key={idx} style={{ flexDirection: 'row', borderTopWidth: idx === 0 ? 0 : 1, borderColor: '#FFD700' }}>
        <Text style={{ flex: 1, color: '#FFD700', padding: 8 }}>{highlightedText ? highlightText(row.criterion) : row.criterion}</Text>
        <Text style={{ flex: 2, color: '#B6B6B6', padding: 8 }}>{highlightedText ? highlightText(row.assesses) : row.assesses}</Text>
        <Text style={{ flex: 0.5, color: '#FFD700', padding: 8, textAlign: 'center' }}>{row.max}</Text>
      </View>
    ))}
    {/* Total row */}
    <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#FFD700', backgroundColor: '#232B4D' }}>
      <Text style={{ flex: 1, color: '#FFD700', padding: 8, fontWeight: '700' }}>Total</Text>
      <Text style={{ flex: 2, color: '#B6B6B6', padding: 8 }}></Text>
      <Text style={{ flex: 0.5, color: '#FFD700', padding: 8, textAlign: 'center', fontWeight: '700' }}>30</Text>
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

  const toggleSection = (section: string) => {
    const isExpanding = expandedSection !== section;
    setExpandedSection(isExpanding ? section : null);
    const animationValue = {
      'purpose': purposeAnimation,
      'objectives': objectivesAnimation,
      'pathways': pathwaysAnimation,
      'roles': rolesAnimation,
      'integrity': integrityAnimation,
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
      'purpose': purposeAnimation,
      'objectives': objectivesAnimation,
      'pathways': pathwaysAnimation,
      'roles': rolesAnimation,
      'integrity': integrityAnimation,
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
      'purpose': purposeAnimation,
      'objectives': objectivesAnimation,
      'pathways': pathwaysAnimation,
      'roles': rolesAnimation,
      'integrity': integrityAnimation,
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
      <StatusBar barStyle="light-content" />
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
                }}
                labelStyle={{ color: theme.colors.background, fontWeight: 700 }}
              >
                {`Next (${currentMatchIndex + 1}/${matchingSections.length})`}
              </PaperButton>
            </View>
          )}
          <Card style={[themeStyles.card, { backgroundColor: 'rgba(34, 48, 74, 0.7)' }]}>
            <Card.Content>
              <Text style={themeStyles.title}>Extended Essay</Text>
              <Text style={themeStyles.subtitle}>Core Component</Text>
              <List.Section>
                <List.Accordion
                  title="Purpose & Overview"
                  expanded={expandedSection === 'purpose'}
                  onPress={() => toggleSection('purpose')}
                  titleStyle={themeStyles.sectionTitle}
                >
                  {renderAnimatedContent('purpose',
                    <View style={themeStyles.sectionContent}>
                      <Text style={themeStyles.content}>{highlightText(sectionContentStrings.purpose.split('\n\n')[0])}</Text>
                      <View style={{ marginTop: 12 }}>
                        {sectionContentStrings.purpose.split('\n\n')[1]?.split('\n').map((line, idx) => (
                          <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
                            <Text style={{ color: '#FFD700', fontSize: 18, marginRight: 8, lineHeight: 24 }}>•</Text>
                            <Text style={[themeStyles.content, { flex: 1 }]}>{highlightText(line.replace(/^\- /, ''))}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </List.Accordion>
                <List.Accordion
                  title="Assessment Objectives"
                  expanded={expandedSection === 'objectives'}
                  onPress={() => toggleSection('objectives')}
                  titleStyle={themeStyles.sectionTitle}
                >
                  {renderAnimatedContent('objectives',
                    <View style={themeStyles.sectionContent}>
                      <Text style={themeStyles.subsectionTitle}>{highlightText(sectionContentStrings.objectives.split('\n\n')[0].split('\n')[0])}</Text>
                      <View style={{ marginTop: 4 }}>
                        {sectionContentStrings.objectives.split('\n\n')[0].split('\n').slice(1).map((line, idx) => (
                          <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
                            <Text style={{ color: '#FFD700', fontSize: 18, marginRight: 8, lineHeight: 24 }}>•</Text>
                            <Text style={[themeStyles.content, { flex: 1 }]}>{highlightText(line.replace(/^\- /, ''))}</Text>
                          </View>
                        ))}
                        {sectionContentStrings.objectives.split('\n\n')[1]?.split('\n').map((line, idx) => (
                          <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
                            <Text style={{ color: '#FFD700', fontSize: 18, marginRight: 8, lineHeight: 24 }}>•</Text>
                            <Text style={[themeStyles.content, { flex: 1 }]}>{highlightText(line.replace(/^\- /, ''))}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </List.Accordion>
                <List.Accordion
                  title="Pathways"
                  expanded={expandedSection === 'pathways'}
                  onPress={() => toggleSection('pathways')}
                  titleStyle={themeStyles.sectionTitle}
                >
                  {renderAnimatedContent('pathways',
                    <View style={themeStyles.sectionContent}>
                      <Text style={themeStyles.subsectionTitle}>{highlightText(sectionContentStrings.pathways.split('\n\n')[0].split('\n')[0])}</Text>
                      <View style={{ marginTop: 4 }}>
                        {sectionContentStrings.pathways.split('\n\n')[0].split('\n').slice(1).map((line, idx) => (
                          <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
                            <Text style={{ color: '#FFD700', fontSize: 18, marginRight: 8, lineHeight: 24 }}>•</Text>
                            <Text style={[themeStyles.content, { flex: 1 }]}>{highlightText(line.replace(/^\- /, ''))}</Text>
                          </View>
                        ))}
                        {sectionContentStrings.pathways.split('\n\n')[1]?.split('\n').map((line, idx, arr) => {
                          if (line.match(/^\d+\./)) {
                            return (
                              <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4, marginLeft: 24 }}>
                                <Text style={{ color: '#FFD700', fontSize: 16, marginRight: 8, lineHeight: 24 }}>{line.match(/^\d+/)?.[0]}.</Text>
                                <Text style={[themeStyles.content, { flex: 1 }]}>{highlightText(line.replace(/^\d+\. /, ''))}</Text>
                              </View>
                            );
                          } else if (line.startsWith('- ')) {
                            return (
                              <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
                                <Text style={{ color: '#FFD700', fontSize: 18, marginRight: 8, lineHeight: 24 }}>•</Text>
                                <Text style={[themeStyles.content, { flex: 1 }]}>{highlightText(line.replace(/^\- /, ''))}</Text>
                              </View>
                            );
                          }
                          return null;
                        })}
                      </View>
                    </View>
                  )}
                </List.Accordion>
                <List.Accordion
                  title="Key Roles"
                  expanded={expandedSection === 'roles'}
                  onPress={() => toggleSection('roles')}
                  titleStyle={themeStyles.sectionTitle}
                >
                  {renderAnimatedContent('roles',
                    <View style={themeStyles.sectionContent}>
                      {sectionContentStrings.roles.split('\n\n').map((section, idx) => {
                        const [role, ...points] = section.split('\n');
                        return (
                          <View key={idx} style={{ marginBottom: 12 }}>
                            <Text style={[themeStyles.subsectionTitle, { marginTop: idx === 0 ? 0 : 8, marginBottom: 6 }]}>{role.replace(':', '')}</Text>
                            {points.map((line, i) => (
                              <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
                                <Text style={{ color: '#FFD700', fontSize: 18, marginRight: 8, lineHeight: 24 }}>•</Text>
                                <Text style={[themeStyles.content, { flex: 1 }]}>{highlightText(line.replace(/^\- /, ''))}</Text>
                              </View>
                            ))}
                          </View>
                        );
                      })}
                    </View>
                  )}
                </List.Accordion>
                <List.Accordion
                  title="Academic Integrity & Support"
                  expanded={expandedSection === 'integrity'}
                  onPress={() => toggleSection('integrity')}
                  titleStyle={themeStyles.sectionTitle}
                >
                  {renderAnimatedContent('integrity',
                    <View style={themeStyles.sectionContent}>
                      <Text style={themeStyles.subsectionTitle}>{highlightText(sectionContentStrings.integrity.split('\n')[0])}</Text>
                      <View style={{ marginTop: 4 }}>
                        {sectionContentStrings.integrity.split('\n').slice(1).map((line, idx) => (
                          <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
                            <Text style={{ color: '#FFD700', fontSize: 18, marginRight: 8, lineHeight: 24 }}>•</Text>
                            <Text style={[themeStyles.content, { flex: 1 }]}>{highlightText(line.replace(/^\- /, ''))}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </List.Accordion>
                <List.Accordion
                  title="Assessment Rubric (2027)"
                  expanded={expandedSection === 'rubric2027'}
                  onPress={() => toggleSection('rubric2027')}
                  titleStyle={themeStyles.sectionTitle}
                >
                  {renderAnimatedContent('rubric2027',
                    <View style={themeStyles.sectionContent}>
                      <Rubric2027Table highlightedText={highlightedText} />
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

export default ExtendedEssayScreen; 