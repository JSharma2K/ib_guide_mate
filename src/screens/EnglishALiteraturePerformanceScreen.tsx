import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated, StatusBar, ImageBackground } from 'react-native';
import { Text, Card, List, Searchbar, Button as PaperButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, gradientColors, styles as themeStyles } from '../theme/theme';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { Feather } from '@expo/vector-icons';

const highlightText = (text: string, highlightedText: string) => {
  if (!highlightedText) return text;
  const parts = text.split(new RegExp(`(${highlightedText})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === highlightedText.toLowerCase() ?
      <Text key={i} style={themeStyles.highlightedText}>{part}</Text> :
      part
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
        <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.criterion, highlightedText)}</Text>
        <Text style={{ flex: 2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.summary, highlightedText)}</Text>
        <Text style={{ flex: 0.5, color: '#B6B6B6', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular' }}>{highlightText(String(row.max), highlightedText)}</Text>
      </View>
    ))}
  </View>
);

const EnglishALiteraturePerformanceScreen = ({ navigation, route }: { navigation: any; route: any }) => {
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
  const performanceResourcesAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  // Section keys and content for search - UPDATED WITH PRESCRIBED LITERATURE CONTENT
  const sectionContentStrings: Record<'overview' | 'essentials' | 'literature' | 'detailedRubrics' | 'performanceResources', string> = {
    overview: `English A: Literature and Performance is a course that combines the study of literary texts with performance elements. It is designed for students who are interested in exploring literature through both analytical and performative approaches.`,
    essentials: `Syllabus Outline Teaching Hours Total 150 hours SL only Areas Exploration Readers writers texts 50 hrs Time space 50 hrs Intertextuality connecting texts 50 hrs Minimum 5 works 1 translation must include 1 dramatic text Written Assignment 2 other literary forms prose poetry non-fiction Assessment Objectives Practice Objective 1 Know understand interpret Applied all components literary dramatic textual exploration Objective 2 Analyse evaluate Emphasized both written performed components Objective 3 Communicate Through formal writing oral performance Assessment Outline Weightage Paper 1 Comparative Essay 1h45m 30% Compare two works studied one four set questions Written Assignment Dramatic Analysis 2000 words 30% Analyse performed extract dramatic text Internal Assessment IA Transformative Performance Individual Oral 40% 10-min performance non-dramatic extract theatre 15-min oral explanation transformation`,
    literature: `Course Requirements Minimum 5 literary works total 1 work translation must include 1 dramatic text 2 additional literary forms prose poetry non-fiction Areas Exploration Coverage Readers Writers Texts Focus author purpose audience context Time Space Historical periods geographical settings cultural contexts Intertextuality Connecting Texts Relationships between works themes genres influences Dramatic Text Requirements Must include least 1 dramatic work Written Assignment analysis Examples suitable dramatic texts Shakespeare Hamlet Macbeth Romeo Juliet Othello King Lear Caryl Churchill Top Girls Cloud Nine Serious Money Henrik Ibsen Doll House Hedda Gabler Enemy People Tennessee Williams Glass Menagerie Streetcar Named Desire Cat Hot Tin Roof Arthur Miller Death Salesman Crucible All My Sons August Wilson Fences Piano Lesson Ma Rainey Black Bottom Lorraine Hansberry Raisin Sun Tony Kushner Angels America Suzan-Lori Parks Topdog Underdog Contemporary Options Annie Baker Circle Mirror Transformation Flick Lynn Nottage Sweat Ruined Ayad Akhtar Disgraced Translation Works Examples Sophocles Antigone Oedipus Rex Euripides Medea Electra Jean Racine Phaedra Molière Tartuffe Misanthrope Anton Chekhov Cherry Orchard Three Sisters Uncle Vanya Federico García Lorca House Bernarda Alba Blood Wedding Yerma Bertolt Brecht Mother Courage Caucasian Chalk Circle Good Person Szechwan Luigi Pirandello Six Characters Search Author Right You Are Think You Are Additional Literary Forms Poetry Collections Individual poems novels short story collections non-fiction works memoirs essays speeches Global Perspectives Works different time periods geographical regions cultural backgrounds minimum 3 countries regions 2 continents Language Requirements Works originally written English works translation balance contemporary classic texts`,
    detailedRubrics: `Paper 1 Comparative Essay 30 marks Criterion A How well you understand interpret texts comparing Criterion B How effectively analyze literary techniques evaluate impact Criterion C How clearly structured well-organized comparative essay Written Assignment 26 marks Criterion A How well understand dramatic text performance concepts Criterion B How effectively analyze performance choices effects Criterion C How well-structured focused written response Criterion D Quality writing style expression Criterion E How well analyze communicate performance elements Internal Assessment 32 marks Criterion A How well understand text transformation choices Criterion B How effectively analyze evaluate creative decisions Criterion C Quality actual performance theatrical skills Criterion D How clearly communicate structure oral explanation`,
    performanceResources: `Literature Performance Resources Study Tips Combine literary performative insights dual analysis Explain IO piece staged interpreted performance Treat creative transformation task artistic signature Compare contrast texts theme performability Document every decision process journal Plan HL performance showcase thematic depth skill Justify stage directions director would Remember performance interpretation intentional Study major theatre movements support choices Respect time word limits avoid grade penalties`,
  };
  
  const sectionKeys: Array<'overview' | 'essentials' | 'literature' | 'detailedRubrics' | 'performanceResources'> = ['overview', 'essentials', 'literature', 'detailedRubrics', 'performanceResources'];

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const fadeThreshold = 50; // Start fading after 50px scroll
    
    if (scrollY > fadeThreshold) {
      Animated.timing(homeIconOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(homeIconOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const toggleSection = (section: string) => {
    const isExpanding = expandedSection !== section;
    setExpandedSection(isExpanding ? section : null);
    const animationValue = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'literature': literatureAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'performanceResources': performanceResourcesAnimation,
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
    // Trim whitespace from the query for searching and highlighting
    const trimmedQuery = query.trim();
    setHighlightedText(trimmedQuery);
    if (!trimmedQuery) {
      setMatchingSections([]);
      setCurrentMatchIndex(0);
      setExpandedSection(null);
      return;
    }
    
    // Define section titles for matching
    const sectionTitles = {
      'overview': 'Course Overview',
      'essentials': 'Subject Essentials', 
      'literature': 'Prescribed Literature',
      'detailedRubrics': 'Detailed Rubrics',
      'performanceResources': 'Performance Resources'
    };
    
    // Find all sections that match content or title
    const matches = sectionKeys.filter(key =>
      sectionContentStrings[key].toLowerCase().includes(trimmedQuery.toLowerCase()) ||
      sectionTitles[key].toLowerCase().includes(trimmedQuery.toLowerCase())
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
      'performanceResources': performanceResourcesAnimation,
    }[expandedSection];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    // Collapse all other sections
    const allSectionKeys = ['overview', 'essentials', 'literature', 'detailedRubrics', 'performanceResources'];
    allSectionKeys.forEach(key => {
      if (key !== expandedSection) {
        const anim = {
          'overview': overviewAnimation,
          'essentials': essentialsAnimation,
          'literature': literatureAnimation,
          'detailedRubrics': detailedRubricsAnimation,
          'performanceResources': performanceResourcesAnimation,
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

  const renderAnimatedContent = (section: string, content: React.ReactNode) => {
    const animationValue = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'literature': literatureAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'performanceResources': performanceResourcesAnimation,
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
        <Animated.View
          style={{
            opacity: homeIconOpacity,
          }}
        >
          <Feather
            name="home"
            size={20}
            color="#7EC3FF"
            onPress={() => navigation.goBack()}
            style={{ cursor: 'pointer' }}
            accessibilityRole="button"
            accessibilityLabel="Go to Home"
          />
        </Animated.View>
      </View>
      <ScrollView 
        keyboardShouldPersistTaps="handled" 
        contentContainerStyle={{ paddingTop: 112, paddingBottom: 32, paddingHorizontal: 16 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>English A: Literature and Performance</Text>
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
                      {/* Section content logic */}
                      {section.key === 'overview' && (
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText(sectionContentStrings.overview, highlightedText)}</Text>
                      )}
                      {section.key === 'essentials' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>1. Syllabus Outline & Teaching Hours</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("Total: 150 hours (SL only)\n\nAreas of Exploration:\n- Readers, writers and texts – 50 hrs\n- Time and space – 50 hrs\n- Intertextuality: connecting texts – 50 hrs\n\nMinimum 5 works (1 in translation); must include:\n- 1 dramatic text (for Written Assignment)\n- 2+ other literary forms (prose, poetry, non-fiction)", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>2. Assessment Objectives in Practice</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("Objective 1 – Know, understand and interpret:\n- Applied in all components via literary/dramatic/textual exploration\n\nObjective 2 – Analyse and evaluate:\n- Emphasized in both written and performed components\n\nObjective 3 – Communicate:\n- Through formal writing and oral performance", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>3. Assessment Outline & Weightage</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("Paper 1: Comparative Essay (1h45m) – 30%\n- Compare two works studied; one of four set questions\n\nWritten Assignment: Dramatic Analysis (2000 words) – 30%\n- Analyse a performed extract from a dramatic text\n\nInternal Assessment (IA): Transformative Performance + Individual Oral – 40%\n- 10-min performance of non-dramatic extract as theatre\n- 15-min oral explanation of transformation", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          {/* Paper 1 Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginBottom: 8, color: '#7EC3FF' }}>Paper 1: Comparative Essay (30 marks)</Text>
                          <RubricTable
                            data={[
                              { criterion: 'A', summary: 'How well you understand and interpret the texts you are comparing', max: 10 },
                              { criterion: 'B', summary: 'How effectively you analyze literary techniques and evaluate their impact', max: 10 },
                              { criterion: 'C', summary: 'How clearly structured and well-organized your comparative essay is', max: 10 },
                            ]}
                            highlightedText={highlightedText}
                          />
                          
                          {/* Written Assignment Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginTop: 24, marginBottom: 8, color: '#7EC3FF' }}>Written Assignment (26 marks)</Text>
                          <RubricTable
                            data={[
                              { criterion: 'A', summary: 'How well you understand the dramatic text and performance concepts', max: 6 },
                              { criterion: 'B', summary: 'How effectively you analyze performance choices and their effects', max: 6 },
                              { criterion: 'C', summary: 'How well-structured and focused your written response is', max: 6 },
                              { criterion: 'D', summary: 'Quality of your writing style and expression', max: 4 },
                              { criterion: 'E', summary: 'How well you analyze and communicate about performance elements', max: 4 },
                            ]}
                            highlightedText={highlightedText}
                          />
                          
                          {/* Internal Assessment Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginTop: 24, marginBottom: 8, color: '#7EC3FF' }}>Internal Assessment (32 marks)</Text>
                          <RubricTable
                            data={[
                              { criterion: 'A', summary: 'How well you understand the text and transformation choices', max: 8 },
                              { criterion: 'B', summary: 'How effectively you analyze and evaluate your creative decisions', max: 8 },
                              { criterion: 'C', summary: 'Quality of your actual performance and theatrical skills', max: 8 },
                              { criterion: 'D', summary: 'How clearly you communicate and structure your oral explanation', max: 8 },
                            ]}
                            highlightedText={highlightedText}
                          />
                          
                          <Text style={{ 
                            fontSize: 11, 
                            color: 'rgba(255, 255, 255, 0.5)', 
                            fontFamily: 'ScopeOne-Regular', 
                            marginTop: 16, 
                            textAlign: 'center',
                            fontStyle: 'italic'
                          }}>
                            *This is interpreted material for educational guidance and not official assessment criteria.
                          </Text>
                        </View>
                      )}
                      {section.key === 'literature' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>1. Course Requirements</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Minimum 5 literary works total\n• 1 work in translation\n• Must include 1 dramatic text\n• 2+ additional literary forms (prose, poetry, non-fiction)", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>2. Areas of Exploration Coverage</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("Readers, Writers and Texts:\n- Focus on author purpose, audience, and context\n\nTime and Space:\n- Historical periods, geographical settings, cultural contexts\n\nIntertextuality: Connecting Texts:\n- Relationships between works, themes, genres, and influences", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>3. Dramatic Text Requirements</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("Must include at least 1 dramatic work for Written Assignment analysis.\n\nExamples of suitable dramatic texts:", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginTop: 8 }}>{highlightText("Shakespeare: Hamlet, Macbeth, Romeo and Juliet, Othello, King Lear\n\nContemporary Drama:\n• Caryl Churchill: Top Girls, Cloud Nine, Serious Money\n• Henrik Ibsen: A Doll's House, Hedda Gabler, An Enemy of the People\n• Tennessee Williams: The Glass Menagerie, A Streetcar Named Desire\n• Arthur Miller: Death of a Salesman, The Crucible, All My Sons\n• August Wilson: Fences, The Piano Lesson, Ma Rainey's Black Bottom\n• Lorraine Hansberry: A Raisin in the Sun\n• Tony Kushner: Angels in America\n• Suzan-Lori Parks: Topdog/Underdog", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>4. Translation Works Examples</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("Classical Drama:\n• Sophocles: Antigone, Oedipus Rex\n• Euripides: Medea, Electra\n• Jean Racine: Phaedra\n• Molière: Tartuffe, The Misanthrope\n\nModern International Drama:\n• Anton Chekhov: The Cherry Orchard, Three Sisters, Uncle Vanya\n• Federico García Lorca: The House of Bernarda Alba, Blood Wedding\n• Bertolt Brecht: Mother Courage, The Caucasian Chalk Circle\n• Luigi Pirandello: Six Characters in Search of an Author", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>5. Additional Literary Forms</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Poetry collections and individual poems\n• Novels and short story collections\n• Non-fiction works (memoirs, essays, speeches)\n\nGlobal Perspectives:\n• Works from different time periods and geographical regions\n• Cultural backgrounds from minimum 3 countries/regions across 2 continents\n• Balance of contemporary and classic texts\n• Works originally written in English and works in translation", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'performanceResources' && (
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText(sectionContentStrings.performanceResources, highlightedText)}</Text>
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
            <View style={{ padding: 20, paddingBottom: 0 }}>
              <Text style={{ fontSize: 22, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Student Resources</Text>
              <View style={{ height: 2, backgroundColor: '#7EC3FF', marginBottom: 8 }} />
            </View>
            
            {/* Literature and Performance Resources dropdown */}
            <View>
              <List.Item
                title="Literature and Performance"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('performanceResources')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'performanceResources' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'performanceResources' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('performanceResources', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 8 }}>Study Tips for Success</Text>
                      <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', lineHeight: 22 }]}>{highlightText("1. Combine literary and performative insights for dual analysis.\n\n2. Explain how your IO piece is staged and interpreted in performance.\n\n3. Treat the creative transformation task as your artistic signature.\n\n4. Compare and contrast texts for theme and performability.\n\n5. Document every decision in your process journal.", highlightedText)}</Text>
                      <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', lineHeight: 22, marginTop: 8 }]}>{highlightText("6. Plan your HL performance to showcase thematic depth and skill.\n\n7. Justify your stage directions like a director would.\n\n8. Remember, performance is interpretation—be intentional.\n\n9. Study major theatre movements to support your choices.\n\n10. Respect time and word limits to avoid grade penalties.", highlightedText)}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
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
        
        {/* Disclaimer */}
        <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 8 }}>
          <Text style={{
            fontSize: 12,
            color: '#B6B6B6',
            textAlign: 'center',
            lineHeight: 18,
            fontFamily: 'ScopeOne-Regular',
            fontWeight: '400',
          }}>
            This app is not affiliated with or endorsed by the International Baccalaureate Organization.
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default EnglishALiteraturePerformanceScreen; 