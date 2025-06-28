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
    overview: `Classical Languages is a Standard Level (SL) course available for Latin and Ancient Greek. The course is designed for students who wish to study these foundational languages of Western civilization. Students develop reading comprehension skills through the study of original texts from ancient authors, gaining insight into classical culture, history, and thought. The course emphasizes linguistic analysis, cultural understanding, and the enduring influence of classical languages on modern languages and literature.`,
    essentials: `Course Structure & Teaching Hours\nSL: 150 hours (Classical Languages is only offered at Standard Level)\n\nLanguage Options:\n- Latin: Study of Roman literature, history, and culture\n- Ancient Greek: Study of Greek literature, philosophy, and culture\n\nAssessment Objectives\n1. Demonstrate understanding of classical texts through accurate translation and interpretation\n2. Show knowledge of classical culture, history, and civilization\n3. Analyze linguistic features and literary techniques in original texts\n4. Make connections between classical and modern languages and cultures\n\nAssessment Outline & Weightages\n• External Assessment: 75%\n• - Paper 1 (Translation and comprehension, 1 hr 30 min): 50%\n• - Paper 2 (Prose composition and cultural topics, 1 hr 30 min): 25%\n• Internal Assessment (Individual study): 25%\n\nAssessment Details\n• Paper 1: Translation of unseen passages and comprehension questions\n• Paper 2: Prose composition and questions on classical civilization\n• Internal Assessment: Individual study on an aspect of classical culture or literature`,
    literature: `Classical Authors and Texts\n• Latin: Selections from authors such as Caesar, Cicero, Virgil, Ovid, Livy, and Tacitus\n• Ancient Greek: Selections from authors such as Homer, Herodotus, Sophocles, Plato, and Thucydides\n\nLiterary Genres\n• Epic Poetry: Heroic narratives and mythological stories\n• Historical Writing: Accounts of wars, politics, and social developments\n• Oratory: Speeches and rhetorical works\n• Drama: Tragedies and comedies from classical theater\n• Philosophy: Ethical, political, and metaphysical treatises\n\nCultural Contexts\n• Roman History: Republic, Empire, and social structures\n• Greek Civilization: City-states, philosophy, and democratic ideals\n• Mythology: Gods, heroes, and legendary narratives\n• Daily Life: Social customs, religious practices, and cultural values`,
    detailedRubrics: `Paper 1 – Translation and Comprehension\nTranslation of unseen passages from classical authors with comprehension questions.\nTotal Marks: 50\n\nTranslation Assessment: Accuracy of translation demonstrating understanding of grammar, vocabulary, and context. Recognition of literary and stylistic features.\nComprehension Assessment: Understanding of content, themes, and cultural context. Analysis of literary techniques and historical significance.\n\nPaper 2 – Prose Composition and Cultural Topics\nProse composition exercises and questions on classical civilization.\nTotal Marks: 25\n\nComposition Assessment: Accurate use of classical language grammar and syntax. Appropriate vocabulary and style for the target language.\nCultural Knowledge: Understanding of classical history, literature, and civilization. Analysis of cultural practices and their modern relevance.\n\nInternal Assessment – Individual Study\nIndependent research project on an aspect of classical culture or literature.\nTotal Marks: 25\n\nResearch Quality: Depth of investigation and use of primary and secondary sources. Original analysis and interpretation.\nPresentation: Clear organization and effective communication of findings. Proper citation and academic writing standards.`,
    classicalTips: `1. Master Grammar Fundamentals\n• Focus on noun declensions, verb conjugations, and syntax patterns\n• Use systematic charts and regular practice to memorize forms\n• Understand how grammar affects meaning in translation\n\n2. Build Vocabulary Strategically\n• Learn word families and etymological connections\n• Study derivatives in modern languages to reinforce memory\n• Focus on high-frequency words that appear in multiple texts\n\n3. Practice Translation Techniques\n• Read passages multiple times before translating\n• Identify grammatical structures before attempting word-for-word translation\n• Aim for natural English that captures the original meaning\n\n4. Study Cultural Context\n• Read about historical periods and social structures\n• Understand religious practices and mythological references\n• Connect literary works to their historical and cultural background\n\n5. Analyze Literary Features\n• Identify poetic devices, rhetorical techniques, and stylistic elements\n• Understand genre conventions and authorial style\n• Practice explaining how form contributes to meaning\n\n6. Use Commentaries and Resources\n• Consult scholarly commentaries for difficult passages\n• Use dictionaries and grammar references effectively\n• Study with annotated editions for additional context\n\n7. Develop Research Skills\n• Learn to use primary sources and academic databases\n• Practice proper citation methods for classical texts\n• Develop skills in comparative analysis and interpretation\n\n8. Practice Prose Composition\n• Start with simple sentences and gradually increase complexity\n• Focus on accuracy over sophistication in early stages\n• Study model compositions and imitate successful patterns\n\n9. Connect to Modern Languages\n• Identify Latin and Greek roots in English and other languages\n• Study how classical languages influenced modern literature\n• Understand the continuing relevance of classical culture\n\n10. Engage with Original Texts\n• Read widely in both languages to develop familiarity\n• Practice sight-reading to improve fluency\n• Appreciate the literary and intellectual achievements of classical authors`,
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
      'literature': 'Classical Literature',
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
          {[{ key: 'overview', title: 'Course Overview' }, { key: 'essentials', title: 'Subject Essentials' }, { key: 'literature', title: 'Classical Literature' }, { key: 'detailedRubrics', title: 'Detailed Rubrics' }].map((section, idx, arr) => (
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
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Course Structure & Teaching Hours</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("SL: 150 hours (Classical Languages is only offered at Standard Level)\n\nLanguage Options:\n- Latin: Study of Roman literature, history, and culture\n- Ancient Greek: Study of Greek literature, philosophy, and culture", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Objectives</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("1. Demonstrate understanding of classical texts through accurate translation and interpretation\n2. Show knowledge of classical culture, history, and civilization\n3. Analyze linguistic features and literary techniques in original texts\n4. Make connections between classical and modern languages and cultures", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Outline & Weightages</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• External Assessment: 75%\n• - Paper 1 (Translation and comprehension, 1 hr 30 min): 50%\n• - Paper 2 (Prose composition and cultural topics, 1 hr 30 min): 25%\n• Internal Assessment (Individual study): 25%", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Details</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Paper 1: Translation of unseen passages and comprehension questions\n• Paper 2: Prose composition and questions on classical civilization\n• Internal Assessment: Individual study on an aspect of classical culture or literature", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'literature' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Classical Authors and Texts</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Latin: Selections from authors such as Caesar, Cicero, Virgil, Ovid, Livy, and Tacitus\n• Ancient Greek: Selections from authors such as Homer, Herodotus, Sophocles, Plato, and Thucydides", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Literary Genres</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Epic Poetry: Heroic narratives and mythological stories\n• Historical Writing: Accounts of wars, politics, and social developments\n• Oratory: Speeches and rhetorical works\n• Drama: Tragedies and comedies from classical theater\n• Philosophy: Ethical, political, and metaphysical treatises", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Cultural Contexts</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Roman History: Republic, Empire, and social structures\n• Greek Civilization: City-states, philosophy, and democratic ideals\n• Mythology: Gods, heroes, and legendary narratives\n• Daily Life: Social customs, religious practices, and cultural values", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginBottom: 8, color: '#7EC3FF' }}>Paper 1 – Translation and Comprehension</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginBottom: 12 }}>{highlightText("Translation of unseen passages from classical authors with comprehension questions.\nTotal Marks: 50", highlightedText)}</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("Translation Assessment: Accuracy of translation demonstrating understanding of grammar, vocabulary, and context. Recognition of literary and stylistic features.\n\nComprehension Assessment: Understanding of content, themes, and cultural context. Analysis of literary techniques and historical significance.", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginTop: 24, marginBottom: 8, color: '#7EC3FF' }}>Paper 2 – Prose Composition and Cultural Topics</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginBottom: 12 }}>{highlightText("Prose composition exercises and questions on classical civilization.\nTotal Marks: 25", highlightedText)}</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("Composition Assessment: Accurate use of classical language grammar and syntax. Appropriate vocabulary and style for the target language.\n\nCultural Knowledge: Understanding of classical history, literature, and civilization. Analysis of cultural practices and their modern relevance.", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginTop: 24, marginBottom: 8, color: '#7EC3FF' }}>Internal Assessment – Individual Study</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginBottom: 12 }}>{highlightText("Independent research project on an aspect of classical culture or literature.\nTotal Marks: 25", highlightedText)}</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("Research Quality: Depth of investigation and use of primary and secondary sources. Original analysis and interpretation.\n\nPresentation: Clear organization and effective communication of findings. Proper citation and academic writing standards.", highlightedText)}</Text>
                          
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
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>1. Master Grammar Fundamentals</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Focus on noun declensions, verb conjugations, and syntax patterns\n• Use systematic charts and regular practice to memorize forms\n• Understand how grammar affects meaning in translation", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>2. Build Vocabulary Strategically</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Learn word families and etymological connections\n• Study derivatives in modern languages to reinforce memory\n• Focus on high-frequency words that appear in multiple texts", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>3. Practice Translation Techniques</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Read passages multiple times before translating\n• Identify grammatical structures before attempting word-for-word translation\n• Aim for natural English that captures the original meaning", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>4. Study Cultural Context</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Read about historical periods and social structures\n• Understand religious practices and mythological references\n• Connect literary works to their historical and cultural background", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>5. Analyze Literary Features</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Identify poetic devices, rhetorical techniques, and stylistic elements\n• Understand genre conventions and authorial style\n• Practice explaining how form contributes to meaning", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>6. Use Commentaries and Resources</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Consult scholarly commentaries for difficult passages\n• Use dictionaries and grammar references effectively\n• Study with annotated editions for additional context", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>7. Develop Research Skills</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Learn to use primary sources and academic databases\n• Practice proper citation methods for classical texts\n• Develop skills in comparative analysis and interpretation", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>8. Practice Prose Composition</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Start with simple sentences and gradually increase complexity\n• Focus on accuracy over sophistication in early stages\n• Study model compositions and imitate successful patterns", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>9. Connect to Modern Languages</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Identify Latin and Greek roots in English and other languages\n• Study how classical languages influenced modern literature\n• Understand the continuing relevance of classical culture", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 8 }}>
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>10. Engage with Original Texts</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Read widely in both languages to develop familiarity\n• Practice sight-reading to improve fluency\n• Appreciate the literary and intellectual achievements of classical authors", highlightedText)}</Text>
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