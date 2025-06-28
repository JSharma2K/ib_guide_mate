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
    overview: `Language Ab Initio is designed for students with little or no prior experience in the target language. The course focuses on developing basic communicative competence through receptive and productive language skills. Students explore the language through five prescribed themes while developing fundamental vocabulary, grammar, and cultural understanding. The course emphasizes practical communication skills for everyday situations and intercultural awareness.`,
    essentials: `1. Syllabus Outline & Teaching Hours\nSL: 150 hours (Ab Initio is only offered at Standard Level)\n\nCore Themes:\n- Identities: Personal identity, physical and mental health\n- Experiences: School life, daily routines, leisure activities\n- Human Ingenuity: Transport, entertainment, media\n- Social Organization: Family, community, education\n- Sharing the Planet: Environment, travel, global issues\n\n2. Assessment Objectives in Practice\n• Communicate information clearly in familiar situations (Paper 1, IA)\n• Demonstrate understanding of spoken and written texts in familiar contexts (Paper 2, IA)\n• Use language appropriate to audience and purpose in familiar situations (Paper 1, IA)\n• Show awareness of intercultural elements through language use (Paper 1, Paper 2, IA)\n\n3. Assessment Outline & Weightages\n• External Assessment – 75%: Paper 1 (Writing): 25%, Paper 2 (Listening & Reading): 50%\n• Internal Assessment – 25%: Individual Oral based on a visual stimulus\n\n4. Assessment Details\n• Paper 1: Written tasks totaling 250 words based on prescribed themes\n• Paper 2: Listening and Reading comprehension (1hr 30min)\n• Internal Assessment: Individual Oral presentation based on visual stimulus`,
    literature: `Prescribed Themes for Ab Initio\n• Identities – Personal identity, lifestyle choices, physical and mental health\n• Experiences – School experiences, daily routines, leisure and recreation\n• Human Ingenuity – Transport systems, entertainment and media\n• Social Organization – Family structures, community life, education systems\n• Sharing the Planet – Environmental awareness, travel experiences, global citizenship\n\nText Types for Beginners\n• Personal Texts: Simple emails, diary entries, social media posts, personal letters\n• Informational Texts: Brochures, advertisements, simple articles, announcements\n• Interactive Texts: Conversations, interviews, basic presentations`,
    detailedRubrics: `Paper 1 Writing Assessment (Ab Initio)\nLanguage Use: Basic vocabulary and simple grammatical structures appropriate for beginner level (maximum 6 points). Message: Clear communication of simple ideas and information (maximum 6 points). Format and Register: Appropriate text type conventions and basic register awareness (maximum 3 points).\n\nIndividual Oral Assessment (Ab Initio)\nLanguage: Basic vocabulary and simple structures with some accuracy (maximum 6 points). Message: Clear presentation of simple ideas related to visual stimulus (maximum 6 points). Interactive Skills: Basic conversational ability and response to questions (maximum 6 points).`,
    languageTips: `Ab Initio Success Strategies:\n1. Master basic vocabulary for all five prescribed themes systematically\n2. Practice simple sentence structures and common grammatical patterns\n3. Focus on clear communication rather than complex language\n4. Use visual aids and context clues to support understanding\n5. Practice describing images and situations for the oral assessment\n6. Listen to simple authentic materials at beginner level\n7. Write short texts using familiar vocabulary and structures\n8. Learn common phrases and expressions for everyday situations\n9. Practice basic conversations on familiar topics\n10. Build cultural awareness through simple texts and media`,
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
      'literature': 'Literature',
      'detailedRubrics': 'Detailed Rubrics',
      'languageTips': 'Language Acquisition Tips',
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
          {[{ key: 'overview', title: 'Course Overview' }, { key: 'essentials', title: 'Subject Essentials' }, { key: 'literature', title: 'Literature' }, { key: 'detailedRubrics', title: 'Detailed Rubrics' }].map((section, idx, arr) => (
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
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>1. Syllabus Outline & Teaching Hours</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("SL: 150 hours (Ab Initio is only offered at Standard Level)\n\nCore Themes:\n- Identities: Personal identity, physical and mental health\n- Experiences: School life, daily routines, leisure activities\n- Human Ingenuity: Transport, entertainment, media\n- Social Organization: Family, community, education\n- Sharing the Planet: Environment, travel, global issues", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>2. Assessment Objectives in Practice</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Communicate information clearly in familiar situations (Paper 1, IA)\n• Demonstrate understanding of spoken and written texts in familiar contexts (Paper 2, IA)\n• Use language appropriate to audience and purpose in familiar situations (Paper 1, IA)\n• Show awareness of intercultural elements through language use (Paper 1, Paper 2, IA)", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>3. Assessment Outline & Weightages</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• External Assessment – 75%: Paper 1 (Writing): 25%, Paper 2 (Listening & Reading): 50%\n• Internal Assessment – 25%: Individual Oral based on a visual stimulus", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>4. Assessment Details</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Paper 1: Written tasks totaling 250 words based on prescribed themes\n• Paper 2: Listening and Reading comprehension (1hr 30min)\n• Internal Assessment: Individual Oral presentation based on visual stimulus", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'literature' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Prescribed Themes for Ab Initio</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Identities – Personal identity, lifestyle choices, physical and mental health\n• Experiences – School experiences, daily routines, leisure and recreation\n• Human Ingenuity – Transport systems, entertainment and media\n• Social Organization – Family structures, community life, education systems\n• Sharing the Planet – Environmental awareness, travel experiences, global citizenship", highlightedText)}</Text>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Text Types for Beginners</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("• Personal Texts: Simple emails, diary entries, social media posts, personal letters\n• Informational Texts: Brochures, advertisements, simple articles, announcements\n• Interactive Texts: Conversations, interviews, basic presentations", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginBottom: 8, color: '#7EC3FF' }}>Paper 1 Writing Assessment (Ab Initio)</Text>
                          <RubricTable
                            data={[
                              { criterion: 'A: Language Use', summary: 'Basic vocabulary and simple grammatical structures appropriate for beginner level', max: 6 },
                              { criterion: 'B: Message', summary: 'Clear communication of simple ideas and information', max: 6 },
                              { criterion: 'C: Format and Register', summary: 'Appropriate text type conventions and basic register awareness', max: 3 },
                            ]}
                            highlightedText={highlightedText}
                          />
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', marginTop: 24, marginBottom: 8, color: '#7EC3FF' }}>Individual Oral Assessment (Ab Initio)</Text>
                          <RubricTable
                            data={[
                              { criterion: 'A: Language', summary: 'Basic vocabulary and simple structures with some accuracy', max: 6 },
                              { criterion: 'B: Message', summary: 'Clear presentation of simple ideas related to visual stimulus', max: 6 },
                              { criterion: 'C: Interactive Skills', summary: 'Basic conversational ability and response to questions', max: 6 },
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
                title="Language Acquisition Tips"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('languageTips')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'languageTips' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'languageTips' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('languageTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      {[
                        "Master basic vocabulary for all five prescribed themes systematically",
                        "Practice simple sentence structures and common grammatical patterns",
                        "Focus on clear communication rather than complex language",
                        "Use visual aids and context clues to support understanding",
                        "Practice describing images and situations for the oral assessment",
                        "Listen to simple authentic materials at beginner level",
                        "Write short texts using familiar vocabulary and structures",
                        "Learn common phrases and expressions for everyday situations",
                        "Practice basic conversations on familiar topics",
                        "Build cultural awareness through simple texts and media"
                      ].map((tip, idx) => (
                        <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                          <Text style={{ color: '#7EC3FF', fontSize: 16, marginRight: 8, lineHeight: 24, fontFamily: 'ScopeOne-Regular' }}>{idx + 1}.</Text>
                          <Text style={[themeStyles.content, { flex: 1, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF' }]}>{highlightText(tip, highlightedText)}</Text>
                        </View>
                      ))}
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