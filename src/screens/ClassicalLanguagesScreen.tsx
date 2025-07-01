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
    detailedRubrics: `Paper 1 – Unseen Text Analysis\nAssessment of language comprehension, structural understanding, and textual interpretation skills.\nTotal Marks: 30\n\nPaper 2 – Core Text Analysis\nDeep examination of prepared texts through extended analytical writing demonstrating literary and cultural insights.\nTotal Marks: 35\n\nResearch Dossier – Independent Investigation\nEvaluation of research methodology, source quality, organizational structure, and critical thinking skills.\nTotal Marks: 25\n\nHL Composition – Creative Writing\nAssessment of classical language proficiency, creative expression, and fulfillment of compositional goals.\nTotal Marks: To be determined`,
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