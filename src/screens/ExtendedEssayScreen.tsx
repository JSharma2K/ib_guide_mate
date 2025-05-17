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
  'purpose' | 'objectives' | 'pathways' | 'roles' | 'integrity',
  string
> = {
  purpose:
    `The Extended Essay (EE) is a core component of the IB Diploma Programme. It is an independent, self-directed piece of research, culminating in a 4,000-word paper. The EE provides students with an opportunity to investigate a topic of special interest, develop research and writing skills, and experience the process of academic discovery.`,
  objectives:
    `Assessment Objectives:
• Engage in independent research on a focused topic
• Formulate a clear research question
• Develop an argument and support it with evidence
• Communicate ideas effectively in academic writing
• Reflect on the research process and learning`,
  pathways:
    `Pathways:
• Choose a subject and topic that aligns with your interests
• Develop a research question in consultation with a supervisor
• Conduct research using a variety of sources
• Draft, revise, and finalize the essay with supervisor feedback
• Submit the final essay and complete the reflection process`,
  roles:
    `Key Roles:
• Student: Selects topic, conducts research, writes essay, reflects on process
• Supervisor: Guides student, provides feedback, ensures academic integrity
• Coordinator: Oversees EE process, supports students and supervisors`,
  integrity:
    `Academic Integrity & Support:
• All work must be the student's own
• Proper citation and referencing are required
• Plagiarism and academic misconduct are strictly prohibited
• Support is available from supervisors, coordinators, and school resources
• Use of research and writing tools is encouraged, but must be acknowledged`
};

const sectionKeys: Array<'purpose' | 'objectives' | 'pathways' | 'roles' | 'integrity'> = [
  'purpose',
  'objectives',
  'pathways',
  'roles',
  'integrity',
];

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
                      <Text style={themeStyles.content}>{highlightText(sectionContentStrings.purpose)}</Text>
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
                      <Text style={themeStyles.content}>{highlightText(sectionContentStrings.objectives)}</Text>
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
                      <Text style={themeStyles.content}>{highlightText(sectionContentStrings.pathways)}</Text>
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
                      <Text style={themeStyles.content}>{highlightText(sectionContentStrings.roles)}</Text>
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
                      <Text style={themeStyles.content}>{highlightText(sectionContentStrings.integrity)}</Text>
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