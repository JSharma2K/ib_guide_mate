import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated, Platform, ImageBackground } from 'react-native';
import { Text, Card, List, Searchbar, Button as PaperButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, gradientColors, styles as themeStyles } from '../theme/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Feather } from '@expo/vector-icons';

type MathAAScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MathAA'>;

type Props = {
  navigation: MathAAScreenNavigationProp;
  route: any;
};

const MathAAScreen: React.FC<Props> = ({ navigation, route }) => {
  const userType = route?.params?.userType || 'student';
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

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <ImageBackground
      source={require('../../assets/images/entry-bg.png')}
      style={{ flex: 1, width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      {/* Home icon top left */}
      <View style={{ position: 'absolute', top: 56, left: 16, zIndex: 100, flexDirection: 'row', alignItems: 'center' }}>
        <Feather
          name="home"
          size={20}
          color="#7EC3FF"
          onPress={() => navigation.goBack()}
          style={{ cursor: 'pointer' }}
          accessibilityRole="button"
          accessibilityLabel="Go to Home"
        />
      </View>
      <ScrollView contentContainerStyle={{ paddingTop: 112, paddingBottom: 32, paddingHorizontal: 16 }}>
        <Searchbar
          placeholder="Search guide topics..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={{
            backgroundColor: '#22242C',
            borderRadius: 16,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: '#7EC3FF',
            shadowOpacity: 0,
          }}
          inputStyle={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular' }}
          placeholderTextColor="#FFFFFF"
          iconColor="#FFFFFF"
        />
        {matchingSections.length > 1 && (
          <View style={{ alignItems: 'flex-end', marginTop: -16, marginBottom: 16 }}>
            <PaperButton
              mode="outlined"
              onPress={handleNextMatch}
              style={{
                borderRadius: 24,
                backgroundColor: 'transparent',
                minWidth: 120,
                elevation: 2,
                paddingVertical: 4,
                borderWidth: 1,
                borderColor: '#7EC3FF',
              }}
              labelStyle={{ color: '#FFFFFF', fontFamily: 'ScopeOne-Regular', fontSize: 15 }}
            >
              {`Next (${currentMatchIndex + 1}/${matchingSections.length})`}
            </PaperButton>
          </View>
        )}
        <View style={{ borderRadius: 18, borderWidth: 1, borderColor: '#7EC3FF', backgroundColor: 'rgba(182,199,247,0.12)', marginBottom: 24, overflow: 'hidden', paddingHorizontal: 8 }}>
          <View style={{ padding: 20, paddingBottom: 0 }}>
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Mathematics: Analysis and Approaches</Text>
            <Text style={{ fontSize: 16, color: '#8A97A7', fontFamily: 'ScopeOne-Regular', marginBottom: 12 }}>AA (SL/HL)</Text>
            <View style={{ height: 2, backgroundColor: '#7EC3FF', marginBottom: 8 }} />
          </View>
          {/* Dropdowns */}
          {[{ key: 'overview', title: 'Course Overview' }, { key: 'topics', title: 'Topics' }, { key: 'essentials', title: 'Subject Essentials' }, { key: 'rubrics', title: 'Detailed Rubrics' }].map((section, idx, arr) => (
            <View key={section.key}>
              <List.Item
                title={() => (
                  <Text style={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}>
                    {highlightText(section.title)}
                  </Text>
                )}
                onPress={() => toggleSection(section.key)}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === section.key ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === section.key && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent(section.key, (
                    <View style={{ backgroundColor: 'rgba(24,26,32,0.92)', borderRadius: 12, padding: 16, marginTop: 8 }}>
                      {/* Section content logic as before */}
                      {section.key === 'essentials' ? (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Syllabus Overview</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }}>
                            Topics (SL/HL): Number & Algebra (19/39), Functions (21/32), Geometry (25/51), Statistics (27/33), Calculus (28/55)
                          </Text>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 18 }}>Assessment Outline</Text>
                          <Text style={{ ...themeStyles.levelTitle, color: '#7EC3FF', fontFamily: 'ScopeOne-Regular', marginTop: 8 }}>SL:</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }}>- Paper 1 (90m): 40%{"\n"}- Paper 2 (90m): 40%{"\n"}- IA: 20%</Text>
                          <Text style={{ ...themeStyles.levelTitle, color: '#7EC3FF', fontFamily: 'ScopeOne-Regular', marginTop: 12 }}>HL:</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }}>- Paper 1 (120m): 30%{"\n"}- Paper 2 (120m): 30%{"\n"}- Paper 3 (75m): 20%{"\n"}- IA: 20%</Text>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 18 }}>IA Rubrics (20 marks):</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }}>- A: Presentation (4){"\n"}- B: Mathematical communication (4){"\n"}- C: Personal engagement (4){"\n"}- D: Reflection (3){"\n"}- E: Use of mathematics (5)</Text>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 18 }}>Assessment Objectives in Practice:</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }}>- Balanced across problem solving, communication, reasoning, technology use, and inquiry</Text>
                        </View>
                      ) : section.key === 'rubrics' ? (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>{highlightText('--- PAPERS 1, 2, 3 ---')}</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }}>{highlightText('- Assessed via mark schemes, not fixed rubrics.\n- Rewarded elements include:')}</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 12 }}>{highlightText('Mathematical reasoning and accuracy\nLogical structure and progression\nUse of correct notation\nClear communication of solutions\nFor HL Paper 3: deep problem solving and strategy')}</Text>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 18 }}>{highlightText('MATHEMATICS AA & AI: INTERNAL ASSESSMENT (20 marks)')}</Text>
                          <Text style={{ ...themeStyles.levelTitle, color: '#7EC3FF', fontFamily: 'ScopeOne-Regular', marginTop: 8 }}>{highlightText('Criterion A: Presentation 4 marks')}</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 12 }}>{highlightText('- The exploration is well structured and coherent.')}</Text>
                          <Text style={{ ...themeStyles.levelTitle, color: '#7EC3FF', fontFamily: 'ScopeOne-Regular', marginTop: 8 }}>{highlightText('Criterion B: Mathematical Communication 4 marks')}</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 12 }}>{highlightText('- Appropriate use of mathematical language and notation.')}</Text>
                          <Text style={{ ...themeStyles.levelTitle, color: '#7EC3FF', fontFamily: 'ScopeOne-Regular', marginTop: 8 }}>{highlightText('Criterion C: Personal Engagement 4 marks')}</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 12 }}>{highlightText('- Evidence of independent thinking, creativity, and ownership.')}</Text>
                          <Text style={{ ...themeStyles.levelTitle, color: '#7EC3FF', fontFamily: 'ScopeOne-Regular', marginTop: 8 }}>{highlightText('Criterion D: Reflection 3 marks')}</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 12 }}>{highlightText('- Critical reflection on results, methods, and learning.')}</Text>
                          <Text style={{ ...themeStyles.levelTitle, color: '#7EC3FF', fontFamily: 'ScopeOne-Regular', marginTop: 8 }}>{highlightText('Criterion E: Use of Mathematics 5 marks')}</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 12 }}>{highlightText('- Correct and relevant mathematical processes used with sophistication.')}</Text>
                        </View>
                      ) : (
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }}>{highlightText(sectionContentStrings[section.key as keyof typeof sectionContentStrings])}</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
              {idx < arr.length - 1 && (
                <View style={{ height: 2, backgroundColor: '#7EC3FF', alignSelf: 'flex-start', width: 80, borderRadius: 2, marginLeft: 20, marginTop: -4, marginBottom: 8 }} />
              )}
            </View>
          ))}
        </View>
        {userType === 'student' && (
          <View style={{ borderRadius: 16, borderWidth: 1, borderColor: '#7EC3FF', backgroundColor: 'rgba(182,199,247,0.12)', marginBottom: 24, overflow: 'hidden', paddingHorizontal: 8 }}>
            <List.Item
              title="Student-Only Resources"
              titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
              style={{ paddingVertical: 16, paddingLeft: 20 }}
            />
          </View>
        )}
        {userType === 'teacher' && (
          <View style={{ borderRadius: 16, borderWidth: 1, borderColor: '#7EC3FF', backgroundColor: 'rgba(182,199,247,0.12)', marginBottom: 24, overflow: 'hidden', paddingHorizontal: 8 }}>
            <List.Item
              title="Teacher-Only Resources"
              titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
              style={{ paddingVertical: 16, paddingLeft: 20 }}
            />
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  topSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appTitle: {
    fontSize: 38,
    fontFamily: 'Inter_700Bold',
    color: '#FFD700',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#B6B6B6',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Inter_400Regular',
    fontWeight: '400',
    marginBottom: 8,
    opacity: 0.92,
  },
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
    backgroundColor: 'rgba(126,195,255,0.2)',
    color: '#7EC3FF',
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