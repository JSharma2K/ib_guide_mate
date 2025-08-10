import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated, StatusBar, ImageBackground, TouchableOpacity } from 'react-native';
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
      <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.4, padding: 8 }}>Criterion</Text>
      <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.1, padding: 8 }}>Descriptor Summary</Text>
      <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Max</Text>
    </View>
    {data.map((row, idx) => (
      <View key={idx} style={{ flexDirection: 'row', borderTopWidth: idx === 0 ? 0 : 1, borderColor: '#7EC3FF' }}>
        <Text style={{ flex: 2.4, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.criterion, highlightedText)}</Text>
        <Text style={{ flex: 2.1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.summary, highlightedText)}</Text>
        <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular' }}>{highlightText(String(row.max), highlightedText)}</Text>
      </View>
    ))}
  </View>
);

const ClassicalLanguagesScreen = ({ navigation, route }: { navigation: any; route: any }) => {
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
  const classicalTipsAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  // Section keys and content for search
  const sectionContentStrings: Record<'overview' | 'essentials' | 'literature' | 'detailedRubrics' | 'classicalTips', string> = {
    overview: `The Classical Languages course enables students to read and engage with Latin or Classical Greek literature in its original form. It fosters an integrated understanding of language, literature, and culture. Students develop proficiency in grammar and syntax, literary analysis, and contextual knowledge of the ancient world. The course uses three key areas of exploration: Meaning, Form and Language; Text, Author and Audience; and Time, Space and Culture. These act as interpretative lenses to deepen inquiry. At HL, students also complete a creative composition task in the classical language, while both HL and SL students produce a research dossier. The distinction between SL and HL lies in the number and complexity of texts studied, the assessment components, and the expectation of original composition at HL.`,
    essentials: `Assessment Objectives in Practice\n• Demonstrate understanding of classical language and texts through translation and analysis (Papers 1 & 2, IA).\n• Interpret and analyse texts in their historical and cultural contexts (Paper 2, IA, HL composition).\n• Synthesize evidence from primary, secondary and reference sources (All components).\n• Construct arguments supported by relevant textual analysis (Paper 2, Research Dossier, HL composition rationale).\n\nAssessment Outline & Weightages\n• SL External: Paper 1 (35%), Paper 2 (40%)\n• SL Internal: Research Dossier (25%)\n• HL External: Paper 1 (30%), Paper 2 (35%)\n• HL Internal: Research Dossier (20%), HL Composition (15%)`,
    literature: `Internal and External Assessment Details\n• Paper 1: Unseen text analysis for SL/HL with short answers and translation.\n• Paper 2: Analysis of prepared core text; includes extended response and contextual questions.\n• Research Dossier: Inquiry-based project using classical texts and sources to address a research question.\n• HL Composition: Original prose piece in classical language with rationale and references.\n\nAreas of Exploration\n• 1. Meaning, Form, and Language: Explore syntax, diction, and literary technique to interpret meaning.\n• 2. Text, Author, and Audience: Understand how authors shape meaning and how different audiences interpret texts.\n• 3. Time, Space, and Culture: Analyze texts in their historical, political, and social contexts across time periods.\n\nPrescribed Core and Companion Texts\n• SL: One core text (either prose or verse), HL: Two core texts (one prose, one verse).\n• Both SL and HL: Any two companion texts that offer different literary forms and styles.\n• Examples – Latin Core: Cicero, Livy, Vergil, Ovid | Greek Core: Thucydides, Antiphon, Homer, Euripides\n• Companion texts are not assessed directly but enrich understanding and support IA and Paper 2.`,
    detailedRubrics: `Paper 1 – Unseen Text Analysis; Paper 2 – Core Text Analysis; Research Dossier; HL Composition.\n\nTranslation Markbands (SL & HL): holistic quality of translation, vocabulary, syntax, morphology, accuracy, clarity.\nGuided analysis (HL): analysis of textual features and author choices, use of relevant evidence.\nExtended response (SL & HL): Criterion A (knowledge, understanding, use of evidence), Criterion B (analysis and evaluation).\nHL Composition: Criterion A (introduction/intentions: form, meaning, audience, purpose), Criterion B (language and communication), Criterion C (rationale – use of sources), Criterion D (rationale – explanation of choices).`,
    classicalTips: `1. Build daily vocabulary and grammar habits using flashcards and scaffolded translations.\n\n2. Translate and retranslate core and companion texts for deeper syntactic understanding.\n\n3. Practice identifying stylistic devices and rhetorical techniques in prepared texts.\n\n4. Annotate texts with literary, cultural, and historical notes to support Paper 2 responses.\n\n5. Develop source organization strategies early for the Research Dossier.\n\n6. For HL, plan compositions in English first, then translate ideas with accurate classical structure.\n\n7. Use past Paper 1 unseen texts weekly for practice with dictionary support.\n\n8. Link study with TOK and CAS by reflecting on how classical ideas resonate in today's world.\n\n9. Compare interpretations with peers to explore multiple viewpoints.\n\n10. Use maps, timelines, and glossaries to contextualize characters, settings, and themes.`,
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'literature' | 'detailedRubrics' | 'classicalTips'> = ['overview', 'essentials', 'literature', 'detailedRubrics', 'classicalTips'];

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const fadeThreshold = 50;
    
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
      'classicalTips': classicalTipsAnimation,
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
    const trimmedQuery = query.trim();
    setHighlightedText(trimmedQuery);
    if (!trimmedQuery) {
      setMatchingSections([]);
      setCurrentMatchIndex(0);
      setExpandedSection(null);
      return;
    }
    
    const sectionTitles = {
      'overview': 'Course Overview',
      'essentials': 'Subject Essentials', 
      'literature': 'Prescribed Literature',
      'detailedRubrics': 'Detailed Rubrics',
      'classicalTips': 'Classical Languages Tips',
    };
    
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

  useEffect(() => {
    if (matchingSections.length > 0) {
      setExpandedSection(matchingSections[currentMatchIndex]);
    } else {
      setExpandedSection(null);
    }
  }, [currentMatchIndex, matchingSections]);

  useEffect(() => {
    if (!expandedSection) return;
    const animationValue = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'literature': literatureAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'classicalTips': classicalTipsAnimation,
    }[expandedSection];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    const allSectionKeys = ['overview', 'essentials', 'literature', 'detailedRubrics', 'classicalTips'];
    allSectionKeys.forEach(key => {
      if (key !== expandedSection) {
        const anim = {
          'overview': overviewAnimation,
          'essentials': essentialsAnimation,
          'literature': literatureAnimation,
          'detailedRubrics': detailedRubricsAnimation,
          'classicalTips': classicalTipsAnimation,
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
      'classicalTips': classicalTipsAnimation,
    }[section];
    if (!animationValue) return null;
    return (
      <Animated.View
        style={{
          maxHeight: animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 7000],
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Classical Languages</Text>
            <Text style={{ fontSize: 16, color: '#8A97A7', fontFamily: 'ScopeOne-Regular', marginBottom: 12 }}>Group 2: Language Acquisition - Latin & Ancient Greek</Text>
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
                      {section.key === 'overview' && (
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText(sectionContentStrings.overview, highlightedText)}</Text>
                      )}
                      {section.key === 'essentials' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Assessment Objectives in Practice</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Demonstrate understanding of classical language and texts through translation and analysis (Papers 1 & 2, IA).\n• Interpret and analyse texts in their historical and cultural contexts (Paper 2, IA, HL composition).\n• Synthesize evidence from primary, secondary and reference sources (All components).\n• Construct arguments supported by relevant textual analysis (Paper 2, Research Dossier, HL composition rationale).", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Outline & Weightages</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• SL External: Paper 1 (35%), Paper 2 (40%)\n• SL Internal: Research Dossier (25%)\n• HL External: Paper 1 (30%), Paper 2 (35%)\n• HL Internal: Research Dossier (20%), HL Composition (15%)", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'literature' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Internal and External Assessment Details</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Paper 1: Unseen text analysis for SL/HL with short answers and translation.\n• Paper 2: Analysis of prepared core text; includes extended response and contextual questions.\n• Research Dossier: Inquiry-based project using classical texts and sources to address a research question.\n• HL Composition: Original prose piece in classical language with rationale and references.", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Areas of Exploration</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• 1. Meaning, Form, and Language: Explore syntax, diction, and literary technique to interpret meaning.\n• 2. Text, Author, and Audience: Understand how authors shape meaning and how different audiences interpret texts.\n• 3. Time, Space, and Culture: Analyze texts in their historical, political, and social contexts across time periods.", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Prescribed Core and Companion Texts</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• SL: One core text (either prose or verse), HL: Two core texts (one prose, one verse).\n• Both SL and HL: Any two companion texts that offer different literary forms and styles.\n• Examples – Latin Core: Cicero, Livy, Vergil, Ovid | Greek Core: Thucydides, Antiphon, Homer, Euripides\n• Companion texts are not assessed directly but enrich understanding and support IA and Paper 2.", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          <RubricTable
                            data={[
                              { criterion: 'Paper 1: Unseen Text Analysis', summary: 'Assessment of language comprehension, structural understanding, and textual interpretation skills', max: 30 },
                              { criterion: 'Paper 2: Core Text Analysis', summary: 'Deep examination of prepared texts through extended analytical writing demonstrating literary and cultural insights', max: 35 },
                              { criterion: 'Research Dossier: Independent Investigation', summary: 'Evaluation of research methodology, source quality, organizational structure, and critical thinking skills', max: 25 },
                              { criterion: 'HL Composition: Creative Writing', summary: 'Assessment of classical language proficiency, creative expression, and fulfillment of compositional goals', max: 15 },
                            ]}
                            highlightedText={highlightedText}
                          />
                          
                          {/* Paper 1 — Translation (SL) Markbands (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Paper 1 — Translation (SL) Markbands (Paraphrased)</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3.2, padding: 8 }}>Level descriptor</Text>
                            </View>
                            {[
                              { band: '0', desc: 'Does not meet the basic expectations described below.' },
                              { band: '1–2', desc: 'Translation does not clearly convey the meaning. Frequent word/grammar issues throughout.' },
                              { band: '3–4', desc: 'General meaning comes across, but notable word/grammar issues remain.' },
                              { band: '5–6', desc: 'Accurately communicates the meaning. Word choice and grammar issues, if present, do not affect understanding.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.band, highlightedText)}</Text>
                                <Text style={{ flex: 3.2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.desc, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Paper 1 — Translation (HL) Markbands (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Paper 1 — Translation (HL) Markbands (Paraphrased)</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3.2, padding: 8 }}>Level descriptor</Text>
                            </View>
                            {[
                              { band: '0', desc: 'Does not meet the basic expectations described below.' },
                              { band: '1–2', desc: 'Meaning is not clearly communicated. Frequent vocabulary/grammar issues across the translation.' },
                              { band: '3–4', desc: 'General meaning is conveyed, but key vocabulary/grammar mistakes persist.' },
                              { band: '5–6', desc: 'Accurately conveys the meaning of the original text. Vocabulary/grammar issues, if present, do not reduce clarity.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.band, highlightedText)}</Text>
                                <Text style={{ flex: 3.2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.desc, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>

                          {/* Paper 1 — HL Precision Sub‑marks (Paraphrased) */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1.2, padding: 8 }}>Domain</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3.0, padding: 8 }}>Description</Text>
                            </View>
                            {[
                              { domain: 'Vocabulary', marks: '2–4 (text‑dependent)', desc: 'Credit for context‑appropriate word/phrase choices.' },
                              { domain: 'Syntax and morphology', marks: '6–8 (text‑dependent)', desc: 'Credit for accurate structure (case, tense, agreement, etc.), even if a word choice is imperfect.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1.2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.domain, highlightedText)}</Text>
                                <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.marks, highlightedText)}</Text>
                                <Text style={{ flex: 3.0, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.desc, highlightedText)}</Text>
                              </View>
                            ))}
                                                    </View>
  
                          {/* Paper 1 — Guided analysis (HL) Markbands (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Paper 1 — Guided analysis (HL) Markbands (Paraphrased)</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3.2, padding: 8 }}>Description</Text>
                            </View>
                            {[
                              { band: '0', desc: 'Does not meet the basic expectations described below.' },
                              { band: '1–2', desc: 'Mostly describes or summarizes examples with little analysis of features or author choices. Evidence is irrelevant or misunderstood.' },
                              { band: '3–4', desc: 'Some analysis of features/author choices and how they shape meaning, but relies on description. Evidence is only partly relevant or understood.' },
                              { band: '5–6', desc: 'Plausible analysis throughout; draws conclusions from evidence. Evidence is relevant and correctly understood.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.band, highlightedText)}</Text>
                                <Text style={{ flex: 3.2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.desc, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>

                          {/* Paper 2 — Extended Response (HL) Criterion A (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Paper 2 — Extended Response (HL): Criterion A</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3.2, padding: 8 }}>Description</Text>
                            </View>
                            {[
                              { band: '0', desc: 'Does not meet the basic expectations described below.' },
                              { band: '1–2', desc: 'Shows little knowledge or understanding of the core text/context. Evidence beyond the core text is not used meaningfully.' },
                              { band: '3–4', desc: 'Shows some knowledge/understanding with partial relevance. Some evidence beyond the core text is included.' },
                              { band: '5–6', desc: 'Shows good knowledge/understanding of the core text and context. Uses well‑chosen examples from beyond the core text that directly support the response.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.band, highlightedText)}</Text>
                                <Text style={{ flex: 3.2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.desc, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>

                          {/* Paper 2 — Extended Response (SL) Criterion A (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Paper 2 — Extended Response: Criterion A (Knowledge, understanding, use of evidence)</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3.2, padding: 8 }}>Description</Text>
                            </View>
                            {[
                              { band: '0', desc: 'Does not meet the basic expectations described below.' },
                              { band: '1–2', desc: 'Shows little grasp of the core text or its context. Evidence from outside the core text is not used in a meaningful way.' },
                              { band: '3–4', desc: 'Shows some understanding of the core text and its context. Includes some evidence from beyond the core text with partial relevance.' },
                              { band: '5–6', desc: 'Shows good understanding of the core text and its context. Uses relevant examples from beyond the core text that directly support the response.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.band, highlightedText)}</Text>
                                <Text style={{ flex: 3.2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.desc, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>

                          {/* Paper 2 — Extended Response (SL) Criterion B (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Paper 2 — Extended Response: Criterion B (Analysis and evaluation)</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3.2, padding: 8 }}>Description</Text>
                            </View>
                            {[
                              { band: '0', desc: 'Does not meet the basic expectations described below.' },
                              { band: '1–2', desc: 'Mostly description with little relevant analysis of language features or broader author choices. Little or no evaluation of effects.' },
                              { band: '3–4', desc: 'Some appropriate analysis of features and author choices, but relies on description. Some evaluation of how choices shape meaning/effect.' },
                              { band: '5–6', desc: 'Appropriate and sometimes convincing analysis of features and broader choices. Effective evaluation of how choices shape meaning/effect.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.band, highlightedText)}</Text>
                                <Text style={{ flex: 3.2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.desc, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>

                          {/* HL Composition — Criterion A (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>HL Composition — Criterion A: Introduction and intentions</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3.2, padding: 8 }}>Level descriptor</Text>
                            </View>
                            {[
                              { band: '0', desc: 'Does not meet the basic expectations described below.' },
                              { band: '1', desc: 'Introduction does not clearly set out form, meaning, audience, and purpose, or how these elements connect to the goals.' },
                              { band: '2', desc: 'Introduction outlines form, meaning, audience, and purpose and suggests how they should connect to the goals.' },
                              { band: '3', desc: 'Introduction clearly sets out form, meaning, audience, and purpose and specifies how they connect to achieve the goals.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.band, highlightedText)}</Text>
                                <Text style={{ flex: 3.2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.desc, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>

                          {/* HL Composition — Criterion B (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>HL Composition — Criterion B: Language and communication</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3.2, padding: 8 }}>Level descriptor</Text>
                            </View>
                            {[
                              { band: '0', desc: 'Does not meet the basic expectations described below.' },
                              { band: '1–2', desc: 'Meaning is not communicated effectively. Frequent vocabulary/grammar errors that interfere with reading.' },
                              { band: '3–4', desc: 'Generally communicates the intended meaning. Errors are isolated but still affect clarity at points.' },
                              { band: '5–6', desc: 'Communicates the intended meaning effectively. Vocabulary/grammar errors do not reduce clarity.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.band, highlightedText)}</Text>
                                <Text style={{ flex: 3.2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.desc, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>

                          {/* HL Composition — Criterion C (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>HL Composition — Criterion C: Rationale — use of sources</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3.2, padding: 8 }}>Level descriptor</Text>
                            </View>
                            {[
                              { band: '0', desc: 'Does not meet the basic expectations described below.' },
                              { band: '1–2', desc: 'Shows little engagement with sources relevant to the task (including those in the classical language). Limited understanding of sources.' },
                              { band: '3–4', desc: 'Engagement with sources is narrow; includes some relevant sources (including classical) with partial understanding.' },
                              { band: '5–6', desc: 'Consistent engagement with relevant sources (including classical) and a general understanding of those sources.' },
                              { band: '7–8', desc: 'Broad/deep engagement with relevant sources (including classical) and thorough understanding of those sources.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.band, highlightedText)}</Text>
                                <Text style={{ flex: 3.2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.desc, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>

                          {/* HL Composition — Criterion D (Paraphrased) */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>HL Composition — Criterion D: Rationale — explanation of choices</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3.2, padding: 8 }}>Level descriptor</Text>
                            </View>
                            {[
                              { band: '0', desc: 'Does not meet the basic expectations described below.' },
                              { band: '1–2', desc: 'Rationale rarely focuses on choices relevant to the stated intentions; mainly lists choices with few reasons.' },
                              { band: '3–4', desc: 'Sometimes focuses on relevant choices; outlines choices with brief accounts or summaries of reasons.' },
                              { band: '5–6', desc: 'Generally focuses on relevant choices; describes choices with some detail and supporting reasons.' },
                              { band: '7–8', desc: 'Almost always focuses on relevant choices; explains choices with thorough accounts and detailed reasons.' },
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.band, highlightedText)}</Text>
                                <Text style={{ flex: 3.2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.desc, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
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
            <View style={{ padding: 20, paddingBottom: 0 }}>
              <Text style={{ fontSize: 22, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Student Resources</Text>
              <View style={{ height: 2, backgroundColor: '#7EC3FF', marginBottom: 8 }} />
            </View>
            
            <View>
              <List.Item
                title="Classical Languages Tips"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('classicalTips')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'classicalTips' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'classicalTips' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('classicalTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>1. Build daily vocabulary and grammar habits</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Use flashcards and scaffolded translations for consistent practice", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>2. Translate and retranslate core texts</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Work with core and companion texts for deeper syntactic understanding", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>3. Practice identifying literary techniques</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Focus on stylistic devices and rhetorical techniques in prepared texts", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>4. Annotate texts thoroughly</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Add literary, cultural, and historical notes to support Paper 2 responses", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>5. Develop source organization strategies</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Start early for the Research Dossier and maintain organized notes", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>6. Plan HL compositions strategically</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Plan compositions in English first, then translate ideas with accurate classical structure", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>7. Practice with past Paper 1 texts</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Use past unseen texts weekly for practice with dictionary support", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>8. Link study with TOK and CAS</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Reflect on how classical ideas resonate in today's world", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>9. Compare interpretations with peers</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Explore multiple viewpoints to deepen understanding", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 8 }}>
                        <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>10. Use contextual resources</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Use maps, timelines, and glossaries to contextualize characters, settings, and themes", highlightedText)}</Text>
                      </View>
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
        
        <TouchableOpacity
          style={{
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#7EC3FF',
            backgroundColor: 'rgba(126, 195, 255, 0.1)',
            marginBottom: 24,
            overflow: 'hidden',
          }}
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate('GradePrediction', { 
              subject: 'CLASSICAL LANGUAGES', 
              userType: userType 
            });
          }}
        >
          <LinearGradient
            colors={['rgba(126, 195, 255, 0.15)', 'rgba(126, 195, 255, 0.05)']}
            style={{ padding: 20 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="trending-up" size={24} color="#7EC3FF" style={{ marginRight: 12 }} />
              <Text style={{
                fontSize: 18,
                color: '#7EC3FF',
                fontFamily: 'ScopeOne-Regular',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                Predict Your Grade
              </Text>
            </View>
            <Text style={{
              fontSize: 14,
              color: '#B6B6B6',
              fontFamily: 'ScopeOne-Regular',
              textAlign: 'center',
              marginTop: 8
            }}>
              Get an estimate of your final grade based on your current performance
            </Text>
          </LinearGradient>
        </TouchableOpacity>

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

export default ClassicalLanguagesScreen; 