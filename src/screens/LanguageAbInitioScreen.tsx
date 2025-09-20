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

const LanguageAbInitioScreen = ({ navigation, route }: { navigation: any; route: any }) => {
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
  const languageTipsAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  // Section keys and content for search
  const sectionContentStrings: Record<'overview' | 'essentials' | 'literature' | 'detailedRubrics' | 'languageTips', string> = {
    overview: `Language ab initio is a Standard Level (SL) course designed for students with little to no prior experience in the target language. It spans a total of 150 hours and develops receptive, productive, and interactive skills through a communicative approach. Students explore five prescribed themes—identities, experiences, human ingenuity, social organization, and sharing the planet—through language-based tasks that emphasize understanding and expression in real-life contexts. The course promotes language acquisition, intercultural understanding, and international-mindedness through authentic use of the language in varied contexts.`,
    essentials: `Assessment Objectives in Practice\n1. Demonstrate an understanding of a range of written, audio, visual, and audio-visual texts. This includes identifying purpose, main ideas, supporting details, and drawing conclusions from authentic materials.\n2. Demonstrate an ability to engage with the text by identifying ideas, opinions, and attitudes, and by showing awareness of stylistic features.\n3. Produce clear and accurate communication through written and spoken forms. This includes appropriate use of vocabulary, grammar, register, and organization across a range of text types.\n4. Communicate and interact effectively in a range of situations using appropriate language to express personal ideas and respond to questions or prompts.\n\nAssessment Outline & Weightages\n• External Assessment: 75%\n• - Paper 1 (Writing, 1 hr): 25%\n• - Paper 2 (Listening & Reading, 1 hr 45 min): 50%\n• Internal Assessment (Individual Oral): 25%\n\nInternal and External Assessment Details\n• Paper 1: Two written tasks (70–150 words each), assessed on language, message, and conceptual understanding.\n• Paper 2: Three listening and three reading texts, comprehension questions in target language.\n• Internal: 7–10 min oral exam with stimulus and general conversation based on themes.`,
    literature: `Prescribed Themes and Topics\n• Identities: Personal attributes, relationships, eating/drinking, well-being.\n• Experiences: Routine, leisure, holidays, festivals.\n• Human Ingenuity: Transport, entertainment, media, tech.\n• Social Organization: Neighbourhood, education, workplace, social issues.\n• Sharing the Planet: Climate, geography, environment, global issues.\n\nText Types and Categories\n• Personal Texts: Blog, diary, postcard, message, etc.\n• Professional Texts: Email, report, proposal, CV.\n• Mass Media Texts: News article, review, podcast, social post.`,
    detailedRubrics: `Paper 1 – Writing (Productive Skills)\nStudents produce two written tasks from a choice of three, based on visual or written prompts.\nTotal Marks: 30\n\nCriterion A: Language - Correct use of words and sentence structure suitable for the writing task. Mistakes do not prevent understanding.\nCriterion B: Message - Ideas are relevant and well-developed. Content fits the situation, goal, and intended readers.\nCriterion C: Conceptual Understanding - Proper use of text format requirements including layout, organization, style, and tone.\nTOTAL (Per Task): Each written task is assessed individually using all 3 criteria. (15 × 2 = 30 marks)\n\nPaper 2 – Reading and Listening (Receptive Skills)\nThis consists of:\n• Three listening texts (response in target language)\n• Three reading texts (response in target language)\nNo specific rubrics apply here as answers are mostly objective (e.g., multiple-choice, short-answer, gap-fill). Total score is based on correct responses:\n• Paper 2 Listening: ~25 marks\n• Paper 2 Reading: ~25 marks\n\nInternal Assessment – Individual Oral\nBased on a visual stimulus and conversation, this assesses interactive and productive speaking.\nTotal Marks: 30\nCriterion A: Language - Correct pronunciation, word choice, and speaking fluency. Grammar and vocabulary match the task level.\nCriterion B: Message - Clear expression of relevant thoughts. Good structure and logical organization of spoken content.\nCriterion B1: Message—visual stimulus - How relevant are the ideas to the selected stimulus How well does the candidate engage with the stimulus in the presentation How well are the ideas linked to the target culture(s).\nCriterion B2: Message—conversation - How relevant are the ideas in the conversation How appropriately and thoroughly does the candidate respond to the questions in the conversation To what depth are the questions answered.\nCriterion C: Interactive skills—communication - To what extent does the candidate understand and interact How well can the candidate express ideas How well can the candidate maintain a conversation.\nTOTAL: Composite of all three criteria.`,
    languageTips: `1. Master the Prescribed Themes\n• Familiarize yourself with the 5 core themes: identities, experiences, human ingenuity, social organization, and sharing the planet.\n• Build vocabulary around these themes and practice applying them in context.\n\n2. Practice Text Types Early and Often\n• Learn the conventions of blogs, articles, emails, diary entries, etc.\n• Practice writing in these formats using IB-style prompts.\n• Structure is key: greet, close, format, and tone must align with the type.\n\n3. Focus on Language Accuracy for Paper 1\n• Grammar, vocabulary, and sentence structure are scored directly (Criterion A).\n• Use spaced repetition tools (like Quizlet or Anki) to reinforce verb conjugations and essential vocab.\n• Self-correct old work and understand your frequent errors.\n\n4. Plan Before You Write\n• Spend 3–5 minutes brainstorming and outlining your response.\n• Make sure you answer the prompt directly and maintain a clear structure throughout your task.\n\n5. Use Model Answers Strategically\n• Study model responses and highlight examples of good grammar, linking phrases, and transitions.\n• Mimic these in your own practice until you gain fluency.\n\n6. Improve Listening Through Exposure\n• Watch YouTube videos, news clips, or podcasts in the target language.\n• Use subtitles and slow playback to start, then gradually remove support.\n• Practice summarizing what you heard orally or in writing.\n\n7. Train for Reading Speed and Accuracy\n• Skim first, then scan for details. Practice answering comprehension questions quickly.\n• Annotate texts to track keywords, opinions, time references, and unfamiliar vocabulary.\n\n8. Be Strategic in Your Oral Practice\n• Practice responding spontaneously using common visual stimulus formats.\n• Record yourself, listen back, and improve clarity, flow, and range.\n• Rehearse transitions ("in my opinion...", "however...") to sustain interaction.\n\n9. Focus on Personal Engagement\n• For both the IA and writing tasks, personalize your responses with your interests, hobbies, or background. It adds depth and helps fulfill the message criterion.\n\n10. Simulate Exam Conditions Regularly\n• Practice past Paper 1 and Paper 2 under timed settings.\n• For orals, simulate the exam environment with a partner or teacher.`,
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'literature' | 'detailedRubrics' | 'languageTips'> = ['overview', 'essentials', 'literature', 'detailedRubrics', 'languageTips'];

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
      'languageTips': languageTipsAnimation,
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
      'languageTips': 'Language Ab Initio Tips',
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
      'languageTips': languageTipsAnimation,
    }[expandedSection];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    const allSectionKeys = ['overview', 'essentials', 'literature', 'detailedRubrics', 'languageTips'];
    allSectionKeys.forEach(key => {
      if (key !== expandedSection) {
        const anim = {
          'overview': overviewAnimation,
          'essentials': essentialsAnimation,
          'literature': literatureAnimation,
          'detailedRubrics': detailedRubricsAnimation,
          'languageTips': languageTipsAnimation,
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
      'languageTips': languageTipsAnimation,
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Language Ab Initio</Text>
            <Text style={{ fontSize: 16, color: '#8A97A7', fontFamily: 'ScopeOne-Regular', marginBottom: 12 }}>Group 2: Language Acquisition - Ready Reckoner</Text>
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
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("1. Demonstrate an understanding of a range of written, audio, visual, and audio-visual texts. This includes identifying purpose, main ideas, supporting details, and drawing conclusions from authentic materials.\n2. Demonstrate an ability to engage with the text by identifying ideas, opinions, and attitudes, and by showing awareness of stylistic features.\n3. Produce clear and accurate communication through written and spoken forms. This includes appropriate use of vocabulary, grammar, register, and organization across a range of text types.\n4. Communicate and interact effectively in a range of situations using appropriate language to express personal ideas and respond to questions or prompts.", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Outline & Weightages</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• External Assessment: 75%\n• - Paper 1 (Writing, 1 hr): 25%\n• - Paper 2 (Listening & Reading, 1 hr 45 min): 50%\n• Internal Assessment (Individual Oral): 25%", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Internal and External Assessment Details</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Paper 1: Two written tasks (70–150 words each), assessed on language, message, and conceptual understanding.\n• Paper 2: Three listening and three reading texts, comprehension questions in target language.\n• Internal: 7–10 min oral exam with stimulus and general conversation based on themes.", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'literature' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Prescribed Themes and Topics</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Identities: Personal attributes, relationships, eating/drinking, well-being.\n• Experiences: Routine, leisure, holidays, festivals.\n• Human Ingenuity: Transport, entertainment, media, tech.\n• Social Organization: Neighbourhood, education, workplace, social issues.\n• Sharing the Planet: Climate, geography, environment, global issues.", highlightedText)}</Text>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Text Types and Categories</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Personal Texts: Blog, diary, postcard, message, etc.\n• Professional Texts: Email, report, proposal, CV.\n• Mass Media Texts: News article, review, podcast, social post.", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginBottom: 8, color: '#7EC3FF' }}>Paper 1 – Writing (Productive Skills)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginBottom: 12 }}>{highlightText("Students produce two written tasks from a choice of three, based on visual or written prompts.\nTotal Marks: 30", highlightedText)}</Text>
                          <RubricTable
                            data={[
                              { criterion: 'A: Language', summary: 'Correct use of words and sentence structure suitable for the writing task. Mistakes do not prevent understanding.', max: 6 },
                              { criterion: 'B: Message', summary: 'Ideas are relevant and well-developed. Content fits the situation, goal, and intended readers.', max: 6 },
                              { criterion: 'C: Conceptual Understanding', summary: 'Proper use of text format requirements including layout, organization, style, and tone.', max: 3 },
                            ]}
                            highlightedText={highlightedText}
                          />
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginBottom: 16, fontStyle: 'italic' }}>{highlightText("TOTAL (Per Task): Each written task is assessed individually using all 3 criteria. (15 × 2 = 30 marks)", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginTop: 24, marginBottom: 8, color: '#7EC3FF' }}>Paper 2 – Reading and Listening (Receptive Skills)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("This consists of:\n• Three listening texts (response in target language)\n• Three reading texts (response in target language)\n\nNo specific rubrics apply here as answers are mostly objective (e.g., multiple-choice, short-answer, gap-fill). Total score is based on correct responses:\n• Paper 2 Listening: ~25 marks\n• Paper 2 Reading: ~25 marks", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginTop: 24, marginBottom: 8, color: '#7EC3FF' }}>Internal Assessment – Individual Oral</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginBottom: 12 }}>{highlightText("Based on a visual stimulus and conversation, this assesses interactive and productive speaking.\nTotal Marks: 30", highlightedText)}</Text>
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.4, padding: 8 }}>Criterion</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.1, padding: 8 }}>Descriptor Summary</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 0.8, padding: 8, textAlign: 'center' }}>Max</Text>
                            </View>
                            
                            {/* Criterion A */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2.4, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('A: Language', highlightedText)}</Text>
                              <Text style={{ flex: 2.1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('Correct pronunciation, word choice, and speaking fluency. Grammar and vocabulary match the task level.', highlightedText)}</Text>
                              <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular' }}>{highlightText('12', highlightedText)}</Text>
                            </View>
                            
                            {/* Criterion B */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2.4, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('B: Message', highlightedText)}</Text>
                              <Text style={{ flex: 2.1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('Clear expression of relevant thoughts. Good structure and logical organization of spoken content.', highlightedText)}</Text>
                              <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular' }}>{highlightText('12', highlightedText)}</Text>
                            </View>
                            
                            {/* Criterion B1 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2.4, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', paddingLeft: 24 }}>{highlightText('B1: Message—visual stimulus', highlightedText)}</Text>
                              <Text style={{ flex: 2.1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('How relevant are the ideas to the selected stimulus?\nHow well does the candidate engage with the stimulus in the presentation?\nHow well are the ideas linked to the target culture(s)?', highlightedText)}</Text>
                              <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular' }}>{highlightText('6', highlightedText)}</Text>
                            </View>
                            
                            {/* Criterion B2 */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2.4, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', paddingLeft: 24 }}>{highlightText('B2: Message—conversation', highlightedText)}</Text>
                              <Text style={{ flex: 2.1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('How relevant are the ideas in the conversation?\nHow appropriately and thoroughly does the candidate respond to the questions in the conversation?\nTo what depth are the questions answered?', highlightedText)}</Text>
                              <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular' }}>{highlightText('6', highlightedText)}</Text>
                            </View>
                            
                            {/* Criterion C */}
                            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                              <Text style={{ flex: 2.4, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('C: Interactive skills—communication', highlightedText)}</Text>
                              <Text style={{ flex: 2.1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText('To what extent does the candidate understand and interact?\nHow well can the candidate express ideas?\nHow well can the candidate maintain a conversation?', highlightedText)}</Text>
                              <Text style={{ flex: 0.8, color: '#B6B6B6', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular' }}>{highlightText('6', highlightedText)}</Text>
                            </View>
                          </View>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22, marginTop: 8, fontStyle: 'italic' }}>{highlightText("TOTAL: Composite of all three criteria.", highlightedText)}</Text>
                          
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
                title="Language Ab Initio Tips"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('languageTips')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'languageTips' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'languageTips' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('languageTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>1. Master the Prescribed Themes</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Familiarize yourself with the 5 core themes: identities, experiences, human ingenuity, social organization, and sharing the planet.\n• Build vocabulary around these themes and practice applying them in context.", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>2. Practice Text Types Early and Often</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Learn the conventions of blogs, articles, emails, diary entries, etc.\n• Practice writing in these formats using IB-style prompts.\n• Structure is key: greet, close, format, and tone must align with the type.", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>3. Focus on Language Accuracy for Paper 1</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Grammar, vocabulary, and sentence structure are scored directly (Criterion A).\n• Use spaced repetition tools (like Quizlet or Anki) to reinforce verb conjugations and essential vocab.\n• Self-correct old work and understand your frequent errors.", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>4. Plan Before You Write</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Spend 3–5 minutes brainstorming and outlining your response.\n• Make sure you answer the prompt directly and maintain a clear structure throughout your task.", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>5. Use Model Answers Strategically</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Study model responses and highlight examples of good grammar, linking phrases, and transitions.\n• Mimic these in your own practice until you gain fluency.", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>6. Improve Listening Through Exposure</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Watch YouTube videos, news clips, or podcasts in the target language.\n• Use subtitles and slow playback to start, then gradually remove support.\n• Practice summarizing what you heard orally or in writing.", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>7. Train for Reading Speed and Accuracy</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Skim first, then scan for details. Practice answering comprehension questions quickly.\n• Annotate texts to track keywords, opinions, time references, and unfamiliar vocabulary.", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>8. Be Strategic in Your Oral Practice</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Practice responding spontaneously using common visual stimulus formats.\n• Record yourself, listen back, and improve clarity, flow, and range.\n• Rehearse transitions (\"in my opinion...\", \"however...\") to sustain interaction.", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 12 }}>
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>9. Focus on Personal Engagement</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• For both the IA and writing tasks, personalize your responses with your interests, hobbies, or background. It adds depth and helps fulfill the message criterion.", highlightedText)}</Text>
                      </View>
                      
                      <View style={{ marginBottom: 8 }}>
                        <Text style={{ color: '#7EC3FF', fontSize: 16, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 4 }}>10. Simulate Exam Conditions Regularly</Text>
                        <Text style={[themeStyles.content, { fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', marginLeft: 8, lineHeight: 20 }]}>{highlightText("• Practice past Paper 1 and Paper 2 under timed settings.\n• For orals, simulate the exam environment with a partner or teacher.", highlightedText)}</Text>
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
              subject: 'LANGUAGE AB INITIO', 
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

export default LanguageAbInitioScreen; 