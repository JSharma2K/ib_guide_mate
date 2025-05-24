import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated, StatusBar, ImageBackground } from 'react-native';
import { Text, Card, List, Searchbar, Button as PaperButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, gradientColors, styles as themeStyles } from '../theme/theme';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { Feather } from '@expo/vector-icons';

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
      headerShown: false,
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
        <View style={{ backgroundColor: 'rgba(24,26,32,0.92)', borderRadius: 12, padding: 16, marginTop: 8 }}>
          {content}
        </View>
      </Animated.View>
    );
  };

  const RubricTable = ({ data, highlightedText }: { data: { criterion: string; summary: string; max: number }[]; highlightedText: string }) => (
    <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
        <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1.6, padding: 8 }}>Criterion</Text>
        <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.3, padding: 8 }}>Descriptor Summary</Text>
        <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Max</Text>
      </View>
      {data.map((row, idx) => (
        <View key={idx} style={{ flexDirection: 'row', borderTopWidth: idx === 0 ? 0 : 1, borderColor: '#7EC3FF' }}>
          <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.criterion)}</Text>
          <Text style={{ flex: 2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.summary)}</Text>
          <Text style={{ flex: 0.5, color: '#B6B6B6', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular' }}>{highlightText(String(row.max))}</Text>
        </View>
      ))}
    </View>
  );

  let [fontsLoaded] = useFonts({
    'ScopeOne-Regular': require('../../assets/fonts/ScopeOne-Regular.ttf'),
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ImageBackground
      source={require('../../assets/images/entry-bg.png')}
      style={{ flex: 1, width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      {/* Custom back arrow and Home label */}
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
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: 112, paddingBottom: 32, paddingHorizontal: 16 }}>
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>English A: Literature</Text>
            <Text style={{ fontSize: 16, color: '#8A97A7', fontFamily: 'ScopeOne-Regular', marginBottom: 12 }}>Group 1: Studies in Language and Literature</Text>
            <View style={{ height: 2, backgroundColor: '#7EC3FF', marginBottom: 8 }} />
          </View>
          {/* Dropdowns */}
          {[{ key: 'overview', title: 'Course Overview' }, { key: 'essentials', title: 'Subject Essentials' }, { key: 'literature', title: 'Prescribed Literature' }, { key: 'detailedRubrics', title: 'Detailed Rubrics' }].map((section, idx, arr) => (
            <View key={section.key}>
              <List.Item
                title={section.title}
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection(section.key)}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === section.key ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === section.key && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent(section.key, (
                    <View style={{ backgroundColor: 'transparent' }}>
                      {/* Section content logic as before */}
                      {section.key === 'overview' && (
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText(sectionContentStrings.overview)}</Text>
                      )}
                      {section.key === 'essentials' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Course Overview</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Standard Level (SL): 4 works\n• Higher Level (HL): 6 works\n\nAreas of Exploration:\n• Readers-Writers-Texts\n• Time and Space\n• Intertextuality")}</Text>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Assessment Outline</Text>
                          <Text style={{ ...themeStyles.levelTitle, color: '#7EC3FF', fontFamily: 'ScopeOne-Regular' }}>Standard Level (SL)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Paper 1 (1h15m): 35%\n• Paper 2 (1h45m): 35%\n• Individual Oral (15 min): 30%")}</Text>
                          <Text style={{ ...themeStyles.levelTitle, color: '#7EC3FF', fontFamily: 'ScopeOne-Regular' }}>Higher Level (HL)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Paper 1 (2h15m): 35%\n• Paper 2 (1h45m): 25%\n• Individual Oral: 20%\n• HL Essay: 20%")}</Text>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Rubrics</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Paper 1 & 2: Criteria A-D (5-10 marks each)\n• IO: Criteria A-D (10 marks each)\n• HL Essay: Criteria A-D (5 marks each)")}</Text>
                        </View>
                      )}
                      {section.key === 'literature' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Works in Translation</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Study of works originally written in languages other than English\n• Focus on cultural and historical context\n• Development of intercultural understanding")}</Text>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Works in English</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText("• Study of works written in English\n• Focus on literary techniques and devices\n• Development of critical analysis skills")}</Text>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          {/* Paper 1 Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginBottom: 8, color: '#7EC3FF' }}>Language A: Literature - Paper 1</Text>
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
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginTop: 24, marginBottom: 8, color: '#7EC3FF' }}>Language A: Literature - Paper 2</Text>
                          <RubricTable
                            data={[
                              { criterion: 'A', summary: 'Knowledge & Understanding', max: 10 },
                              { criterion: 'B', summary: 'Analysis & Evaluation', max: 10 },
                              { criterion: 'C', summary: 'Focus & Organization', max: 10 },
                            ]}
                            highlightedText={highlightedText}
                          />
                          {/* Individual Oral Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginTop: 24, marginBottom: 8, color: '#7EC3FF' }}>Language A: Literature - Individual Oral</Text>
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
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginTop: 24, marginBottom: 8, color: '#7EC3FF' }}>Literature and Performance - Written Assignment</Text>
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
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginTop: 24, marginBottom: 8, color: '#7EC3FF' }}>Literature and Performance - Internal Assessment</Text>
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
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginTop: 24, marginBottom: 8, color: '#7EC3FF' }}>SSST: Language A Literature - Paper 1</Text>
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
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginTop: 24, marginBottom: 8, color: '#7EC3FF' }}>SSST: Language A Literature - Paper 2</Text>
                          <RubricTable
                            data={[
                              { criterion: 'A', summary: 'Knowledge & Understanding', max: 10 },
                              { criterion: 'B', summary: 'Analysis & Evaluation', max: 10 },
                              { criterion: 'C', summary: 'Focus & Organization', max: 10 },
                            ]}
                            highlightedText={highlightedText}
                          />
                          {/* SSST: Language A Literature - Individual Oral Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginTop: 24, marginBottom: 8, color: '#7EC3FF' }}>SSST: Language A Literature - Individual Oral</Text>
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

export default EnglishALiteratureScreen; 