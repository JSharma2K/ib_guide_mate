import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Animated, StatusBar, ImageBackground, TouchableOpacity } from 'react-native';
import { Text, Card, List, Searchbar, Button as PaperButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, gradientColors, styles as themeStyles } from '../theme/theme';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Feather } from '@expo/vector-icons';

const escapeRegExp = (input: string) => input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const highlightText = (text: string, highlightedText: string) => {
  if (!highlightedText) return text;
  const safe = escapeRegExp(highlightedText);
  const parts = text.split(new RegExp(`(${safe})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === highlightedText.toLowerCase() ?
      <Text key={i} style={themeStyles.highlightedText}>{part}</Text> :
      part
  );
};

const DigitalSocietyScreen = ({ navigation, route }: { navigation: any; route: any }) => {
  const userType = route?.params?.userType || 'student';
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [highlightedText, setHighlightedText] = useState('');
  const [matchingSections, setMatchingSections] = useState<string[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Animation values for each section
  const overviewAnimation = useRef(new Animated.Value(0)).current;
  const essentialsAnimation = useRef(new Animated.Value(0)).current;
  const coreThemesAnimation = useRef(new Animated.Value(0)).current;
  const detailedRubricsAnimation = useRef(new Animated.Value(0)).current;
  const digitalSocietyTipsAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  // Section keys and content for search
  const sectionContentStrings: Record<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'digitalSocietyTips', string> = {
    overview: `Syllabus Overview\nThe Digital Society course equips students with critical perspectives to explore and evaluate the interactions between individuals, societies, and digital systems. It focuses on the ethical, political, cultural, and societal dimensions of digital interactions and transformations. Through conceptual understandings, inquiry-based learning, and real-world exploration, students engage with the digital world in informed, reflective, and responsible ways.`,
    essentials: `Syllabus Outline and Teaching Hours\nSL: 150 hours\nHL: 240 hours\n\nCore Areas of Exploration\n- Foundations of the digital society\n- Power, politics and digital systems\n- Digital communities and identities\n- Governance, policies and decision-making\n- Digital innovation and sustainability\n\nHL Extension\n- Advanced exploration through HL topic: The future of the digital society\n\nDigital Explorations (IA)\n- Students investigate a real-world digital issue through research and reflection.\n\nAssessment Objectives in Practice\nAO1: Demonstrate knowledge and understanding of key concepts, terms and digital phenomena.\nAO2: Apply digital concepts, perspectives and theories to real-world contexts.\nAO3: Analyse digital issues and interactions using multiple lenses and evidence.\nAO4: Evaluate consequences, implications and assumptions of digital transformations.\n\nAssessment Outline and Weightage\n\nExternal Assessment Details — Standard Level (SL)\n\n• Paper 1\n  Duration: 1 hour 30 minutes\n  Weighting: 40%\n\n• Paper 2\n  Duration: 1 hour 15 minutes\n  Weighting: 30%\n  Note: Paper 2 is the same for SL and HL\n\nSpecial Marking Guidelines:\n\n• Paper 1, Part C\n  In addition to paper-specific analytic markschemes used for all questions, marks for part c are also allocated using markbands. While level descriptors are written in the form of individual bullet points, markbands are applied holistically using a best fit approach.\n\n• Paper 2, Question 4\n  In addition to paper-specific analytic markschemes used for all questions, marks for question 4 are also allocated using markbands. While level descriptors are written in the form of individual bullet points, markbands are applied holistically using a best fit approach.\n\nExternal Assessment Details — Higher Level (HL)\n\n• HL Paper 1\n  Duration: 2 hours 15 minutes\n  Weighting: 35%\n  Note: Students answer questions in two sections\n\n• Paper 2\n  Duration: 1 hour 15 minutes\n  Weighting: 20%\n  Note: Paper 2 is the same for SL and HL\n\n• Paper 3 (HL only)\n  Duration: 1 hour 15 minutes\n  Weighting: 25%`,
    coreThemes: `Overview of the SL and HL Course: Concepts, Content, and Contexts\n\nConcepts\n• Identity\n• Culture\n• Power\n• Space\n• Time\n• Systems\n• Networks\n• Sustainability\n\nContent\n• Technological foundations\n• Surveillance and privacy\n• Digital activism and politics\n• AI and automation\n• Platform economies\n• Digital inclusion and exclusion\n\nContexts\n• Local digital initiatives\n• Global digital transformations\n• Educational systems\n• Corporate platforms\n• Digital governance models`,
    detailedRubrics: `Assessment Guidelines – Internal Assessment Criteria—SL and HL

Internal Assessment – Digital Investigation Scoring (24 marks total)
Duration: 30 hours
Maximum marks: 24 at SL and HL
Weighting: 30% at SL and 20% at HL

Overview
There are five internal assessment criteria for the inquiry project. Criteria marks are applied to project elements as indicated in the table.

Criterion A: Inquiry focus - Inquiry process document - 3 marks
Criterion B: Claims and perspectives - Inquiry process document - 6 marks
Criterion C: Analysis and evaluation - Presentation - 6 marks
Criterion D: Conclusion - Presentation - 6 marks
Criterion E: Communication - Presentation - 3 marks
Total: 24 marks`,
    digitalSocietyTips: `Top 10 Study Tips for Success – Digital Society\n\n• Master the key concepts (e.g., identity, networks, sustainability) early on.\n\n• Follow emerging digital issues in real time to use in essays and IA.\n\n• Use specific examples and real-world platforms in every response.\n\n• Analyze rather than describe – always ask why and how.\n\n• Connect theoretical ideas with lived digital experiences.\n\n• Practice concise, critical writing for source analysis in Paper 1.\n\n• Prepare structured arguments for Paper 2 using digital perspectives.\n\n• Choose a relevant and manageable issue for your Digital Exploration IA.\n\n• In Paper 3 (HL), speculate thoughtfully on the future, using theory and evidence.\n\n• Review the rubrics frequently and self-assess your work using them.`,
  };
  const sectionKeys: Array<'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'digitalSocietyTips'> = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'digitalSocietyTips'];

  // Full-text blob of Detailed Rubrics content to improve search coverage
  const detailedRubricsSearchContent = `
  Assessment Guidelines Internal Assessment Criteria SL and HL
  Internal Assessment Digital Investigation Scoring 24 marks total
  Duration 30 hours Maximum marks 24 at SL and HL Weighting 30% at SL and 20% at HL
  Overview There are five internal assessment criteria for the inquiry project Criteria marks are applied to project elements as indicated in the table
  A Inquiry focus Inquiry process document 3 marks
  B Claims and perspectives Inquiry process document 6 marks
  C Analysis and evaluation Presentation 6 marks
  D Conclusion Presentation 6 marks
  E Communication Presentation 3 marks
  Total 24 marks
  
  Criterion A Inquiry focus 3 marks
  Project element Inquiry process document
  The inquiry process document demonstrates provides an inquiry focus with an explanation of the connection between the inquiry question a specific relevant real-world example as well as course concepts content and contexts
  Resource The focus stage of inquiry includes details about developing and refining an inquiry focus
  Marks Level descriptor
  0 The work does not reach a standard described by the descriptors below
  1 The focus is basic and or incomplete The focus does not include all required elements and or the real-world example is not specific or relevant to the inquiry
  2 The focus is satisfactory The focus includes an inquiry question and a partial explanation of its connection to a specific relevant real-world example and course concepts content and contexts
  3 The focus is well-developed and targeted The focus includes an inquiry question and a thorough explanation of its connection to a specific relevant real-world example and course concepts content and contexts
  
  Criterion B Claims and perspectives 6 marks
  Project element Inquiry process document
  The inquiry process document demonstrates how research was conducted with a discussion of the claims and perspectives for three sources including a justification of their usefulness in the inquiry
  Resource The explore stage of inquiry and course toolkit includes details about claims and perspectives including how to effectively consider a source's origin and purpose meaning and methods as well as corroboration and use
  Marks Level descriptor
  0 The work does not reach a standard described by the descriptors below
  1-2 The discussion of viewpoints and arguments is minimal and mostly just describes what sources say Fewer than three sources are discussed or there is no explanation of why they are useful for the inquiry
  3-4 There is an incomplete discussion of the viewpoints and arguments for each source that includes some explanation of why they are useful for the inquiry but this needs more development
  5-6 There is a complete and detailed discussion of the viewpoints and arguments for each source that includes a clear explanation of why they are useful for the inquiry

  Criterion C Analysis and evaluation 6 marks
  Project element Presentation
  The balance of the presentation consists of the student's own sustained and well-supported analysis and evaluation of impacts and implications of the digital systems for people and communities
  Resource The investigate stage of inquiry includes sample supporting questions useful to consider for analysis and evaluation Additionally the course toolkit provides details about critical and creative thinking relevant to this criterion
  Marks Level descriptor
  0 The work does not reach a standard described by the descriptors below
  1-2 There is minimal examination and judgment which is mostly just descriptive or not closely connected to the inquiry focus
  3-4 The student's examination and judgment of effects and consequences for people and communities is sufficient but this is not always continuous or well-backed by evidence
  5-6 The student's examination and judgment of effects and consequences for people and communities is strong continuous and well-backed by evidence

  Criterion D Conclusion 6 marks
  Project element Presentation
  The presentation concludes by providing further insight reflecting the student's new understanding and ideas about their inquiry focus following analysis and evaluation a discussion of emerging trends and future developments
  Resource The reflect stage of inquiry includes details about offering further insight at the close of inquiry Additionally the course toolkit provides details about critical and creative thinking relevant to this criterion
  Marks Level descriptor
  0 The work does not reach a standard described by the descriptors below
  1-2 The conclusion is minimal with little additional understanding about the inquiry focus Upcoming patterns and future changes are mentioned with minimal or no discussion
  3-4 The conclusion provides sufficient additional understanding about the inquiry focus with an incomplete discussion of upcoming patterns and future changes
  5-6 The conclusion provides strong and well-backed additional understanding about the inquiry focus with a complete and detailed discussion of upcoming patterns and future changes

  Criterion E Communication 3 marks
  Project element Presentation
  The presentation supports understanding through organization of ideas and evidence coherent use of media
  Resource The share stage of inquiry includes details about sharing discoveries with others Additionally the course toolkit provides details about effective communication relevant to this criterion
  Marks Level descriptor
  0 The work does not reach a standard described by the descriptors below
  1 Communication is minimal The presentation's structure and use of media are minimal and do not help understanding
  2 Communication is sufficient The presentation is sufficiently structured and the use of media is sometimes consistent but this is not continuous or only partially helpful in supporting understanding
  3 Communication is strong The presentation is well-structured and consistently uses media to help understanding

  External assessment details SL
  Paper 1
  Duration 1 hour 30 minutes Weighting 40%
  Students answer two of four structured questions that address real-world examples and the common SL and HL syllabus In the third part of each question students may be asked to include as appropriate real-world examples that they have studied during the course
  Each structured question will include the parts outlined below
  Part a 6 marks AO1 Needs knowledge and understanding and may be split into smaller parts
  Part b 6 marks AO2 Needs application and breakdown and may be split into smaller parts
  Part c 8 marks AO3 Needs judgment and combining ideas

  Paper 2
  Duration 1 hour 15 minutes Weighting 30%
  Paper 2 is the same for SL and HL
  Students respond to four questions involving a range of sources that address the common SL and HL syllabus Sources may include text audio visuals data diagrams and or infographics
  The question structure for paper 2 is outlined below
  Q1 2 marks AO1 Needs knowledge and understanding of a source Show by identifying viewpoints or describing infographics diagrams data May be split into parts
  Q2 4 marks AO2 Needs application and breakdown of sources Show by analyzing term usage or explaining viewpoints May be split into parts
  Q3 6 marks AO3 Needs comparing contrasting two sources Show by comparing viewpoints and arguments May use own course knowledge
  Q4 12 marks AO3 Needs judgment and synthesis Bring together sources with course knowledge

  Paper 1 part c
  In addition to paper-specific analytic markschemes used for all questions marks for part c are also allocated using markbands While level descriptors are written in the form of individual bullet points markbands are applied holistically using a best fit approach
  Marks Level descriptor
  0 The work does not reach a standard described by the descriptors below
  1-2 The response shows minimal understanding of the question requirements There is minimal useful knowledge The response is mostly descriptive and consists mainly of unsupported general statements The response has minimal structure or is only a list of items
  3-4 The response shows some understanding of the question requirements Some useful knowledge is shown but this is not always accurate and may not be used properly or effectively The response moves beyond description to include some breakdown but this is not always continuous or effective The response is somewhat structured
  5-6 The response shows sufficient understanding of the question requirements Response shows sufficient and effective breakdown supported with useful and accurate knowledge The response is sufficiently structured
  7-8 The response is focused and shows a thorough understanding of the question requirements Response shows judgment and combining ideas that is effectively and consistently supported with useful and accurate knowledge The response is well-structured and effectively organized

  Paper 2 question 4
  In addition to paper-specific analytic markschemes used for all questions marks for question 4 are also allocated using markbands While level descriptors are written in the form of individual bullet points markbands are applied holistically using a best fit approach
  Marks Level descriptor
  0 The work does not reach a standard described by the descriptors below
  1-3 The response shows minimal understanding of the question requirements There is minimal useful knowledge Evidence from sources is not brought together with the response The response has minimal structure
  4-6 The response shows some understanding of the question requirements Some knowledge is shown but this is not always useful or accurate Evidence from sources is somewhat brought together into the response The response is somewhat structured
  7-9 The response shows sufficient understanding of the question requirements Useful and accurate knowledge is shown with some gaps There is sufficient bringing together of evidence from the sources but this is not always continuous The response is sufficiently structured
  10-12 The response is focused and shows a thorough understanding of the question requirements Useful and accurate knowledge is shown throughout adding insight to the response There is consistent and effective bringing together of evidence from the sources The response is well-structured and effectively organized

  External assessment details HL
  HL paper 1
  Duration 2 hours 15 minutes Weighting 35%
  Students answer questions in two sections
  For Section A students answer two of four structured questions that address real-world examples and the common SL and HL syllabus In the third part of each question students may be asked to include as appropriate real-world examples that they have studied during the course
  For Section B students answer one of two extended response questions based on the HL extension The question structure for HL Paper 1 is outlined below
  Section A Students answer two of four questions as described
  Part a 6 marks AO1 Needs knowledge and understanding and may be split into smaller parts
  Part b 6 marks AO2 Needs application and breakdown and may be split into smaller parts
  Part c 8 marks AO3 Needs judgment and combining ideas
  Section B Students answer one of two questions as described
  12 marks AO3 Extended response question that needs judgment and combining ideas as well as a consideration of counter-arguments related to the HL extension Additional prompts may be provided

  Paper 2
  Duration 1 hour 15 minutes Weighting 20%
  Paper 2 is the same for SL and HL
  Students respond to four questions involving a range of sources that address the common SL and HL syllabus Sources may include text audio visuals data diagrams and or infographics
  The question structure for paper 2 is outlined below
  Q1 2 marks AO1 Q1 needs knowledge and understanding related to a source This can be shown for example by identifying a viewpoint or argument from a source or by describing information about an infographic diagram or data-based source Question may be split into smaller parts
  Q2 4 marks AO2 Q2 needs application and breakdown related to the sources This can be shown for example by breaking down how a term is used or by explaining a viewpoint or argument from a source Question may be split into smaller parts
  Q3 6 marks AO3 Q3 needs comparing and or contrasting two of the sources This may be shown for example by comparing and or contrasting viewpoints and arguments of sources Students may be asked to make use of their own knowledge from the course
  Q4 12 marks AO3 Q4 needs judgment and combining ideas that brings together sources with knowledge from the course

  Paper 3 HL only
  Duration 1 hour 15 minutes Weighting 25%
  Students answer four questions that address an intervention related to an HL extension challenge topic Students will be required to evaluate an intervention and recommend steps for future action
  Knowledge of course concepts content and contexts may be required to address questions Stimulus on paper 3 may include text audio visuals data diagrams and or an infographic
  A pre-release statement will be provided four months in advance of Paper 3
  The pre-release statement will consist of a short description of 250-400 words indicating the real-world nature of a selected challenge topic from the HL extension
  The pre-release may also indicate possible resources terms and approaches to consider for an extended inquiry The pre-released statement should be used by students in extended inquiries into relevant digital interventions in advance of paper 3
  There is no pre-release for the HL extension questions in Section B of paper 1
  The question structure for HL Paper 3 is outlined below
  Q1 4 marks AO1 Q1 needs knowledge and understanding of the intervention and or challenge topic Question may be split into smaller parts
  Q2 6 marks AO2 Q2 needs application and breakdown of the intervention and or the challenge topic Question may be split into smaller parts
  Q3 8 marks AO3 Q3 needs judgment of the intervention and or the challenge topic and may be split into smaller parts
  Q4 12 marks AO3 Q4 needs suggestions for future action related to an intervention and or challenge topic

  HL Paper 1 part c
  In addition to paper-specific analytic markschemes used for all questions marks for part c are also allocated using markbands While level descriptors are written in the form of individual bullet points markbands are applied holistically using a best fit approach
  Marks Level descriptor
  0 The work does not reach a standard described by the descriptors below
  1-2 The response shows minimal understanding of the question requirements There is minimal useful knowledge The response is mostly descriptive and consists mainly of unsupported general statements The response has minimal structure or is only a list of items
  3-4 The response shows some understanding of the question requirements Some useful knowledge is shown but this is not always accurate and may not be used properly or effectively The response moves beyond description to include some breakdown but this is not always continuous or effective The response is somewhat structured
  5-6 The response shows sufficient understanding of the question requirements Response shows sufficient and effective breakdown supported with useful and accurate knowledge The response is sufficiently structured
  7-8 The response is focused and shows a thorough understanding of the question requirements Response shows judgment and combining ideas that is effectively and consistently supported with useful and accurate knowledge The response is well-structured and effectively organized

  Paper 1 Section B
  In addition to paper-specific analytic markschemes used for all questions marks for Section B are also allocated using markbands While level descriptors are written in the form of individual bullet points markbands are applied holistically using a best fit approach
  Marks Level descriptor
  0 The work does not reach a standard described by the descriptors below
  1-3 The response shows minimal understanding of the question requirements There is minimal useful knowledge The response is mostly descriptive and consists mainly of unsupported general statements Counter-arguments are not considered or addressed The response has minimal structure
  4-6 The response shows some understanding of the question requirements Some useful knowledge demonstrated but this is not always accurate and may not be used properly or effectively The response is primarily descriptive with some breakdown but this is not continuous Counter-arguments are only somewhat addressed The response is somewhat structured
  7-9 The response shows sufficient understanding of the question requirements Response shows sufficient and effective breakdown supported with useful and accurate knowledge Counter-arguments are sufficiently addressed The response is sufficiently structured
  10-12 The response is focused and shows a thorough understanding of the question requirements Response shows judgment and combining ideas that is effectively and consistently supported with useful and accurate knowledge Counter-arguments are effectively addressed in the response The response is well-structured and effectively organized

  HL Paper 2 question 4
  In addition to paper-specific analytic markschemes used for all questions marks for question 4 are also allocated using markbands While level descriptors are written in the form of individual bullet points markbands are applied holistically using a best fit approach
  Marks Level descriptor
  0 The work does not reach a standard described by the descriptors below
  1-3 The response shows minimal understanding of the question requirements There is minimal useful knowledge Evidence from sources is not brought together with the response The response has minimal structure
  4-6 The response shows some understanding of the question requirements Some knowledge is demonstrated but this is not always useful or accurate Evidence from sources is somewhat brought together into the response The response is somewhat structured
  7-9 The response shows sufficient understanding of the question requirements Useful and accurate knowledge is demonstrated with some gaps There is sufficient bringing together of evidence from the sources but this is not always continuous The response is sufficiently structured
  10-12 The response is focused and shows a thorough understanding of the question requirements Useful and accurate knowledge is demonstrated throughout adding insight to the response There is consistent and effective bringing together of evidence from the sources The response is well-structured and effectively organized

  Paper 3 question 3
  In addition to paper-specific analytic markschemes used for all questions marks for question 3 are also allocated using markbands While level descriptors are written in the form of individual bullet points markbands are applied holistically using a best fit approach
  Marks Level descriptor
  0 The work does not reach a standard described by the descriptors below
  1-2 The response shows minimal understanding of the question requirements Response is of minimal usefulness The response is descriptive and consists mostly of unsupported general statements The response has minimal structure
  3-4 The response shows some understanding of the question requirements The response is primarily descriptive with some judgment demonstrated but this is not continuous or fully supported The response is somewhat structured
  5-6 The response shows sufficient understanding of the question requirements Response demonstrates sufficient judgment that is useful and supported The response is sufficiently structured
  7-8 The response is focused and shows a thorough understanding of the question requirements Response demonstrates continuous judgment that is useful and well-supported throughout The response is well-structured and effectively organized

  Paper 3 question 4
  In addition to paper-specific analytic markschemes used for all questions marks for question 4 are also allocated using markbands While level descriptors are written in the form of individual bullet points markbands are applied holistically using a best fit approach
  Marks Level descriptor
  0 The work does not reach a standard described by the descriptors below
  1-3 The response shows minimal understanding of the question requirements The response consists mostly of unsupported general statements with minimal useful knowledge No suggestions are presented or those that are presented have only minimal backing The response has minimal structure
  4-6 The response shows some understanding of the question requirements The response demonstrates some knowledge but this is not always useful or accurate and may not be used properly or effectively Suggestions are presented with some backing although this is not continuous and only somewhat helpful The response is somewhat structured
  7-9 The response shows sufficient understanding of the question requirements Response is sufficiently backed with useful and accurate knowledge Suggestions are presented and effectively backed The response is sufficiently structured
  10-12 The response is focused and shows a thorough understanding of the question requirements Response is well-backed throughout with useful and accurate knowledge Suggestions are presented and well-backed with a clear consideration of possible consequences and effects The response is well-structured and effectively organized

  SL Paper 1 Test Layout
  Part A 6 points Basic Show what you know and understand Questions might be split into smaller parts
  Part B 6 points Apply Use what you know to examine and break down information Questions might be split into smaller parts
  Part C 8 points Judge Make judgments and combine different ideas together

  SL HL Paper 2 Test Layout
  Question 1 2 points Basic Show what you know and understand about the given material You might need to identify claims or explain visuals and charts
  Question 2 4 points Apply Use and examine information from the given material You might need to analyze word choices or explain claims
  Question 3 6 points Judge Compare and contrast two different sources You might need to discuss different viewpoints claims and what you learned in class
  Question 4 12 points Judge Make judgments and combine sources with what you learned in class

  HL Paper 1 Section B Test Layout
  12 points Judge Write a longer answer that requires making judgments and combining ideas with opposing arguments May include given materials

  HL Paper 3 Test Layout
  Question 1 4 points Basic Show what you know and understand about future challenges or solutions
  Question 2 6 points Apply Use and examine information about future challenges or solutions
  Question 3 8 points Judge Make judgments about future challenges or solutions
  Question 4 12 points Judge Give suggestions for future actions on challenges or solutions

  Digital Society Project Overview
  A Main Focus Research process document 3
  B Ideas and Viewpoints Research process document 6
  C Examining and Judging Presentation 6
  D Final Thoughts Presentation 6
  E Sharing Your Work Presentation 3

  Criterion A Main Focus
  0 The work does not reach a standard described by the descriptors below
  1 The main topic is unclear or incomplete Missing important parts and not relevant examples
  2 Good focus with some explanation of how it connects to real-world examples and class content
  3 Clear and focused topic with thorough explanation of how it connects to real-world examples and class content

  Criterion B Ideas and Viewpoints
  0 The work does not reach a standard described by the descriptors below
  1-2 Basic discussion of ideas with limited explanation Uses fewer than 3 sources or weak support for arguments
  3-4 Some discussion with partial support for arguments but not fully developed
  5-6 Complete discussion with clear support and reasoning for each source used

  Criterion C Examining and Judging
  0 The work does not reach a standard described by the descriptors below
  1-2 Basic examination and judgment mostly just describing or not staying focused
  3-4 Good but not always consistent or well-backed examination
  5-6 Strong consistent and well-backed examination with proof

  Criterion D Patterns and Future Changes
  0 The work does not reach a standard described by the descriptors below
  1-2 Basic understanding patterns and future changes barely discussed
  3-4 Good understanding some discussion of patterns and changes
  5-6 Strong understanding thorough discussion of patterns and changes

  Criterion E Sharing Your Work
  0 The work does not reach a standard described by the descriptors below
  1 Poor organization and use of media does not help understanding
  2 Good organization and use of media only somewhat helpful
  3 Well-organized and clear use of media that helps understanding
  `;

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
      'coreThemes': coreThemesAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'digitalSocietyTips': digitalSocietyTipsAnimation,
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
      'coreThemes': 'Prescribed Literature',
      'detailedRubrics': 'Detailed Rubrics',
      'digitalSocietyTips': 'Digital Society Tips',
    };
    
    let matches = sectionKeys.filter(key =>
      sectionContentStrings[key].toLowerCase().includes(trimmedQuery.toLowerCase()) ||
      sectionTitles[key].toLowerCase().includes(trimmedQuery.toLowerCase())
    );
    // Include Detailed Rubrics when the full-text blob matches
    if (detailedRubricsSearchContent.toLowerCase().includes(trimmedQuery.toLowerCase()) && !matches.includes('detailedRubrics')) {
      matches = ['detailedRubrics', ...matches];
    }
    // Prioritize opening Detailed Rubrics when present
    if (matches.includes('detailedRubrics')) {
      matches = ['detailedRubrics', ...matches.filter(k => k !== 'detailedRubrics')];
    }
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
      'coreThemes': coreThemesAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'digitalSocietyTips': digitalSocietyTipsAnimation,
    }[expandedSection];
    if (animationValue) {
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    const allSectionKeys = ['overview', 'essentials', 'coreThemes', 'detailedRubrics', 'digitalSocietyTips'];
    allSectionKeys.forEach(key => {
      if (key !== expandedSection) {
        const anim = {
          'overview': overviewAnimation,
          'essentials': essentialsAnimation,
          'coreThemes': coreThemesAnimation,
          'detailedRubrics': detailedRubricsAnimation,
          'digitalSocietyTips': digitalSocietyTipsAnimation,
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

  const renderAnimatedContent = (section: 'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'digitalSocietyTips', content: React.ReactNode) => {
    const animationValue = {
      'overview': overviewAnimation,
      'essentials': essentialsAnimation,
      'coreThemes': coreThemesAnimation,
      'detailedRubrics': detailedRubricsAnimation,
      'digitalSocietyTips': digitalSocietyTipsAnimation,
    }[section];
    if (!animationValue) return null;
    
    // Increase max height for detailed rubrics to accommodate all tables
    const maxHeight = section === 'detailedRubrics' ? 35000 : 3000;
    
    return (
      <Animated.View
        style={{
          maxHeight: animationValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, maxHeight],
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
    return null;
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
            <Text style={{ fontSize: 26, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: '700', marginBottom: 4 }}>Digital Society</Text>
            <Text style={{ fontSize: 16, color: '#8A97A7', fontFamily: 'ScopeOne-Regular', marginBottom: 12 }}>Group 3: Individuals and Societies</Text>
            <View style={{ height: 2, backgroundColor: '#7EC3FF', marginBottom: 8 }} />
          </View>
          {/* Dropdowns */}
          {[{ key: 'overview', title: 'Course Overview' }, { key: 'essentials', title: 'Subject Essentials' }, { key: 'coreThemes', title: 'Prescribed Literature' }, { key: 'detailedRubrics', title: 'Detailed Rubrics' }].map((section, idx, arr) => (
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
                  {renderAnimatedContent(section.key as 'overview' | 'essentials' | 'coreThemes' | 'detailedRubrics' | 'digitalSocietyTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      {section.key === 'essentials' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF' }}>Syllabus Outline and Teaching Hours</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("SL: 150 hours\nHL: 240 hours", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Core Areas of Exploration</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- Foundations of the digital society\n- Power, politics and digital systems\n- Digital communities and identities\n- Governance, policies and decision-making\n- Digital innovation and sustainability", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>HL Extension</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- Advanced exploration through HL topic: The future of the digital society", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Digital Explorations (IA)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("- Students investigate a real-world digital issue through research and reflection.", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Objectives in Practice</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("AO1: Demonstrate knowledge and understanding of key concepts, terms and digital phenomena.\nAO2: Apply digital concepts, perspectives and theories to real-world contexts.\nAO3: Analyse digital issues and interactions using multiple lenses and evidence.\nAO4: Evaluate consequences, implications and assumptions of digital transformations.", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 16 }}>Assessment Outline and Weightage</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 22 }}>{highlightText("External Assessment Details — Standard Level (SL)\n\n• Paper 1\n  Duration: 1 hour 30 minutes\n  Weighting: 40%\n\n• Paper 2\n  Duration: 1 hour 15 minutes\n  Weighting: 30%\n  Note: Paper 2 is the same for SL and HL\n\nSpecial Marking Guidelines:\n\n• Paper 1, Part C\n  In addition to paper-specific analytic markschemes used for all questions, marks for part c are also allocated using markbands. While level descriptors are written in the form of individual bullet points, markbands are applied holistically using a best fit approach.\n\n• Paper 2, Question 4\n  In addition to paper-specific analytic markschemes used for all questions, marks for question 4 are also allocated using markbands. While level descriptors are written in the form of individual bullet points, markbands are applied holistically using a best fit approach.\n\nExternal Assessment Details — Higher Level (HL)\n\n• HL Paper 1\n  Duration: 2 hours 15 minutes\n  Weighting: 35%\n  Note: Students answer questions in two sections\n\n• Paper 2\n  Duration: 1 hour 15 minutes\n  Weighting: 20%\n  Note: Paper 2 is the same for SL and HL\n\n• Paper 3 (HL only)\n  Duration: 1 hour 15 minutes\n  Weighting: 25%", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'overview' && (
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular' }}>{highlightText(sectionContentStrings.overview, highlightedText)}</Text>
                      )}
                      {section.key === 'coreThemes' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 8 }}>Overview of the SL and HL Course: Concepts, Content, and Contexts</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginTop: 16, marginBottom: 8 }}>Concepts</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText("• Identity\n• Culture\n• Power\n• Space\n• Time\n• Systems\n• Networks\n• Sustainability", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginTop: 16, marginBottom: 8 }}>Content</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText("• Technological foundations\n• Surveillance and privacy\n• Digital activism and politics\n• AI and automation\n• Platform economies\n• Digital inclusion and exclusion", highlightedText)}</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 14, marginTop: 16, marginBottom: 8 }}>Contexts</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText("• Local digital initiatives\n• Global digital transformations\n• Educational systems\n• Corporate platforms\n• Digital governance models", highlightedText)}</Text>
                        </View>
                      )}
                      {section.key === 'detailedRubrics' && (
                        <View>
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 12 }}>Internal assessment criteria—SL and HL</Text>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 8 }}>Duration: 30 hours</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 8 }}>Maximum marks: 24 at SL and HL</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>Weighting: 30% at SL and 20% at HL</Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', fontSize: 16, marginBottom: 12 }}>Overview</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            There are five internal assessment criteria for the inquiry project. Criteria marks are applied to project elements as indicated in the table.
                          </Text>

                          {/* Internal Assessment Criteria Table */}
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2, padding: 8 }}>Criterion</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 2.5, padding: 8 }}>Project element</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                            </View>
                            {[
                              { criterion: 'A: Inquiry focus', element: 'Inquiry process document', marks: '3' },
                              { criterion: 'B: Claims and perspectives', element: 'Inquiry process document', marks: '6' },
                              { criterion: 'C: Analysis and evaluation', element: 'Presentation', marks: '6' },
                              { criterion: 'D: Conclusion', element: 'Presentation', marks: '6' },
                              { criterion: 'E: Communication', element: 'Presentation', marks: '3' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 2, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.criterion, highlightedText)}</Text>
                                <Text style={{ flex: 2.5, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.element, highlightedText)}</Text>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular' }}>{highlightText(row.marks, highlightedText)}</Text>
                              </View>
                            ))}
                            <View style={{ flexDirection: 'row', borderTopWidth: 2, borderColor: '#7EC3FF', backgroundColor: 'rgba(182,199,247,0.1)' }}>
                              <Text style={{ flex: 2, color: '#7EC3FF', padding: 8, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>Total</Text>
                              <Text style={{ flex: 2.5, color: '#7EC3FF', padding: 8, fontFamily: 'ScopeOne-Regular' }}> </Text>
                              <Text style={{ flex: 1, color: '#7EC3FF', padding: 8, textAlign: 'center', fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>24 marks</Text>
                            </View>
                          </View>
                          
                          {/* Criterion A: Inquiry Focus Detailed Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Criterion A: Inquiry focus (3 marks)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 8, fontWeight: 'bold' }}>Project element: Inquiry process document</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            The inquiry process document demonstrates provides an inquiry focus with: an explanation of the connection between the inquiry question, a specific, relevant real-world example as well as course concepts, content and contexts.
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 16, backgroundColor: 'rgba(182,199,247,0.05)' }}>
                            <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', padding: 12, fontWeight: 'bold' }}>Resource</Text>
                            <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', paddingHorizontal: 12, paddingBottom: 12 }}>
                              The "focus stage of inquiry" includes details about developing and refining an inquiry focus.
                            </Text>
                          </View>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 4, padding: 8 }}>Level descriptor</Text>
                            </View>
                            {[
                              { marks: '0', description: 'The work does not reach a standard described by the descriptors below.' },
                              { marks: '1', description: 'The focus is basic and/or incomplete.\n\nThe focus does not include all required elements and/or the real-world example is not specific or relevant to the inquiry.' },
                              { marks: '2', description: 'The focus is satisfactory.\n\nThe focus includes an inquiry question and a partial explanation of its connection to a specific, relevant real-world example and course concepts, content and contexts.' },
                              { marks: '3', description: 'The focus is well-developed and targeted.\n\nThe focus includes an inquiry question and a thorough explanation of its connection to a specific, relevant real-world example and course concepts, content and contexts.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.marks, highlightedText)}</Text>
                                <Text style={{ flex: 4, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Criterion B: Claims and Perspectives Detailed Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Criterion B: Claims and perspectives (6 marks)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 8, fontWeight: 'bold' }}>Project element: Inquiry process document</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            The inquiry process document demonstrates how research was conducted with: a discussion of the claims and perspectives for three sources including a justification of their usefulness in the inquiry.
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 16, backgroundColor: 'rgba(182,199,247,0.05)' }}>
                            <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', padding: 12, fontWeight: 'bold' }}>Resource</Text>
                            <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', paddingHorizontal: 12, paddingBottom: 12 }}>
                              The "explore stage of inquiry" and "course toolkit" includes details about claims and perspectives, including how to effectively consider a source's origin and purpose, meaning and methods as well as corroboration and use.
                            </Text>
                          </View>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 4, padding: 8 }}>Level descriptor</Text>
                            </View>
                            {[
                              { marks: '0', description: 'The work does not reach a standard described by the descriptors below.' },
                              { marks: '1–2', description: 'The discussion of viewpoints and arguments is minimal and mostly just describes what sources say. Fewer than three sources are discussed or there is no explanation of why they are useful for the inquiry.' },
                              { marks: '3–4', description: 'There is an incomplete discussion of the viewpoints and arguments for each source that includes some explanation of why they are useful for the inquiry, but this needs more development.' },
                              { marks: '5–6', description: 'There is a complete and detailed discussion of the viewpoints and arguments for each source that includes a clear explanation of why they are useful for the inquiry.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.marks, highlightedText)}</Text>
                                <Text style={{ flex: 4, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Criterion C: Analysis and Evaluation Detailed Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Criterion C: Analysis and evaluation (6 marks)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 8, fontWeight: 'bold' }}>Project element: Presentation</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            The balance of the presentation consists of:{'\n\n'}• the student's own sustained and well-supported analysis and evaluation of impacts and implications of the digital systems for people and communities.
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 16, backgroundColor: 'rgba(182,199,247,0.05)' }}>
                            <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', padding: 12, fontWeight: 'bold' }}>Resource</Text>
                            <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', paddingHorizontal: 12, paddingBottom: 12 }}>
                              The "investigate stage of inquiry" includes sample supporting questions useful to consider for analysis and evaluation. Additionally, the "course toolkit" provides details about critical and creative thinking relevant to this criterion.
                            </Text>
                          </View>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 4, padding: 8 }}>Level descriptor</Text>
                            </View>
                            {[
                              { marks: '0', description: 'The work does not reach a standard described by the descriptors below.' },
                              { marks: '1–2', description: 'There is minimal examination and judgment which is mostly just descriptive or not closely connected to the inquiry focus.' },
                              { marks: '3–4', description: 'The student\'s examination and judgment of effects and consequences for people and communities is sufficient, but this is not always continuous or well-backed by evidence.' },
                              { marks: '5–6', description: 'The student\'s examination and judgment of effects and consequences for people and communities is strong, continuous and well-backed by evidence.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.marks, highlightedText)}</Text>
                                <Text style={{ flex: 4, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Criterion D: Conclusion Detailed Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Criterion D: Conclusion (6 marks)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 8, fontWeight: 'bold' }}>Project element: Presentation</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            The presentation concludes by providing:{'\n\n'}• further insight reflecting the student\'s new understanding and ideas about their inquiry focus following analysis and evaluation{'\n\n'}• a discussion of emerging trends and future developments.
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 16, backgroundColor: 'rgba(182,199,247,0.05)' }}>
                            <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', padding: 12, fontWeight: 'bold' }}>Resource</Text>
                            <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', paddingHorizontal: 12, paddingBottom: 12 }}>
                              The "reflect stage of inquiry" includes details about offering further insight at the close of inquiry. Additionally, the "course toolkit" provides details about critical and creative thinking relevant to this criterion.
                            </Text>
                          </View>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 4, padding: 8 }}>Level descriptor</Text>
                            </View>
                            {[
                              { marks: '0', description: 'The work does not reach a standard described by the descriptors below.' },
                              { marks: '1–2', description: 'The conclusion is minimal with little additional understanding about the inquiry focus. Upcoming patterns and future changes are mentioned with minimal or no discussion.' },
                              { marks: '3–4', description: 'The conclusion provides sufficient additional understanding about the inquiry focus with an incomplete discussion of upcoming patterns and future changes.' },
                              { marks: '5–6', description: 'The conclusion provides strong and well-backed additional understanding about the inquiry focus with a complete and detailed discussion of upcoming patterns and future changes.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.marks, highlightedText)}</Text>
                                <Text style={{ flex: 4, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Criterion E: Communication Detailed Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Criterion E: Communication (3 marks)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 8, fontWeight: 'bold' }}>Project element: Presentation</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            The presentation supports understanding through:{'\n\n'}• organization of ideas and evidence{'\n\n'}• coherent use of media.
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 16, backgroundColor: 'rgba(182,199,247,0.05)' }}>
                            <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', padding: 12, fontWeight: 'bold' }}>Resource</Text>
                            <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', paddingHorizontal: 12, paddingBottom: 12 }}>
                              The "share stage of inquiry" includes details about sharing discoveries with others. Additionally, the "course toolkit" provides details about effective communication relevant to this criterion.
                            </Text>
                          </View>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 4, padding: 8 }}>Level descriptor</Text>
                            </View>
                            {[
                              { marks: '0', description: 'The work does not reach a standard described by the descriptors below.' },
                              { marks: '1', description: 'Communication is minimal.\n\nThe presentation\'s structure and use of media are minimal and do not help understanding.' },
                              { marks: '2', description: 'Communication is sufficient.\n\nThe presentation is sufficiently structured and the use of media is sometimes consistent but this is not continuous or only partially helpful in supporting understanding.' },
                              { marks: '3', description: 'Communication is strong.\n\nThe presentation is well-structured and consistently uses media to help understanding.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.marks, highlightedText)}</Text>
                                <Text style={{ flex: 4, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* External Assessment Section */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 32, marginBottom: 16, fontSize: 18 }}>External assessment details—SL</Text>
                          
                          {/* SL Paper 1 Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Paper 1</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 8, fontWeight: 'bold' }}>Duration: 1 hour 30 minutes</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16, fontWeight: 'bold' }}>Weighting: 40%</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            Students answer two of four structured questions that address real-world examples and the common SL and HL syllabus. In the third part of each question, students may be asked to include, as appropriate, real-world examples that they have studied during the course.
                          </Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            Each structured question will include the parts outlined below.
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1.5, padding: 8 }}>Part / marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>AO level</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Description</Text>
                            </View>
                            {[
                              { part: 'Part a\n6 marks', ao: 'AO1', description: 'Needs knowledge and understanding and may be split into smaller parts.' },
                              { part: 'Part b\n6 marks', ao: 'AO2', description: 'Needs application and breakdown and may be split into smaller parts.' },
                              { part: 'Part c\n8 marks', ao: 'AO3', description: 'Needs judgment and combining ideas.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>{highlightText(row.part, highlightedText)}</Text>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.ao, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* SL/HL Paper 2 Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Paper 2</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 8, fontWeight: 'bold' }}>Duration: 1 hour 15 minutes</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16, fontWeight: 'bold' }}>Weighting: 30%</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16, fontStyle: 'italic' }}>
                            Paper 2 is the same for SL and HL.
                          </Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            Students respond to four questions involving a range of sources that address the common SL and HL syllabus. Sources may include text, audio, visuals, data, diagrams and/or infographics.
                          </Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            The question structure for paper 2 is outlined below.
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1.5, padding: 8 }}>Question / marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>AO level</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Description</Text>
                            </View>
                            {[
                              { question: 'Q1\n2 marks', ao: 'AO1', description: 'Needs knowledge and understanding of a source. Show by identifying viewpoints or describing infographics/diagrams/data.\n\nMay be split into parts.' },
                              { question: 'Q2\n4 marks', ao: 'AO2', description: 'Needs application and breakdown of sources. Show by analyzing term usage or explaining viewpoints.\n\nMay be split into parts.' },
                              { question: 'Q3\n6 marks', ao: 'AO3', description: 'Needs comparing/contrasting two sources. Show by comparing viewpoints and arguments.\n\nMay use own course knowledge.' },
                              { question: 'Q4\n12 marks', ao: 'AO3', description: 'Needs judgment and synthesis. Bring together sources with course knowledge.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>{highlightText(row.question, highlightedText)}</Text>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.ao, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* SL Paper 1, Part C Markbands Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Paper 1, part c</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            In addition to paper-specific analytic markschemes used for all questions, marks for part c are also allocated using markbands. While level descriptors are written in the form of individual bullet points, markbands are applied holistically using a best fit approach.
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 4, padding: 8 }}>Level descriptor</Text>
                            </View>
                            {[
                              { marks: '0', description: 'The work does not reach a standard described by the descriptors below.' },
                              { marks: '1–2', description: '• The response shows minimal understanding of the question requirements.\n\n• There is minimal useful knowledge. The response is mostly descriptive and consists mainly of unsupported general statements.\n\n• The response has minimal structure or is only a list of items.' },
                              { marks: '3–4', description: '• The response shows some understanding of the question requirements.\n\n• Some useful knowledge is shown, but this is not always accurate and may not be used properly or effectively. The response moves beyond description to include some breakdown, but this is not always continuous or effective.\n\n• The response is somewhat structured.' },
                              { marks: '5–6', description: '• The response shows sufficient understanding of the question requirements.\n\n• Response shows sufficient and effective breakdown supported with useful and accurate knowledge.\n\n• The response is sufficiently structured.' },
                              { marks: '7–8', description: '• The response is focused and shows a thorough understanding of the question requirements.\n\n• Response shows judgment and combining ideas that is effectively and consistently supported with useful and accurate knowledge.\n\n• The response is well-structured and effectively organized.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.marks, highlightedText)}</Text>
                                <Text style={{ flex: 4, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Paper 2, Question 4 Markbands Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Paper 2, question 4</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            In addition to paper-specific analytic markschemes used for all questions, marks for question 4 are also allocated using markbands. While level descriptors are written in the form of individual bullet points, markbands are applied holistically using a best fit approach.
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 4, padding: 8 }}>Level descriptor</Text>
                            </View>
                            {[
                              { marks: '0', description: 'The work does not reach a standard described by the descriptors below.' },
                              { marks: '1–3', description: '• The response shows minimal understanding of the question requirements.\n\n• There is minimal useful knowledge.\n\n• Evidence from sources is not brought together with the response.\n\n• The response has minimal structure.' },
                              { marks: '4–6', description: '• The response shows some understanding of the question requirements.\n\n• Some knowledge is shown but this is not always useful or accurate.\n\n• Evidence from sources is somewhat brought together into the response.\n\n• The response is somewhat structured.' },
                              { marks: '7–9', description: '• The response shows sufficient understanding of the question requirements.\n\n• Useful and accurate knowledge is shown with some gaps.\n\n• There is sufficient bringing together of evidence from the sources, but this is not always continuous.\n\n• The response is sufficiently structured.' },
                              { marks: '10–12', description: '• The response is focused and shows a thorough understanding of the question requirements.\n\n• Useful and accurate knowledge is shown throughout, adding insight to the response.\n\n• There is consistent and effective bringing together of evidence from the sources.\n\n• The response is well-structured and effectively organized.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.marks, highlightedText)}</Text>
                                <Text style={{ flex: 4, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* External Assessment HL Section */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 32, marginBottom: 16, fontSize: 18 }}>External assessment details—HL</Text>
                          
                          {/* HL Paper 1 Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>HL paper 1</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 8, fontWeight: 'bold' }}>Duration: 2 hours 15 minutes</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16, fontWeight: 'bold' }}>Weighting: 35%</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            Students answer questions in two sections.
                          </Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            For Section A, students answer two of four structured questions that address real-world examples and the common SL and HL syllabus. In the third part of each question, students may be asked to include, as appropriate, real-world examples that they have studied during the course.
                          </Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            For Section B, students answer one of two extended response questions based on the HL extension. The question structure for HL Paper 1 is outlined below.
                          </Text>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 20, marginBottom: 12, fontSize: 16 }}>Section A:</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            Students answer two of four questions as described.
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 16 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1.5, padding: 8 }}>Part / marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>AO level</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Description</Text>
                            </View>
                            {[
                              { part: 'Part a\n6 marks', ao: 'AO1', description: 'Needs knowledge and understanding and may be split into smaller parts.' },
                              { part: 'Part b\n6 marks', ao: 'AO2', description: 'Needs application and breakdown and may be split into smaller parts.' },
                              { part: 'Part c\n8 marks', ao: 'AO3', description: 'Needs judgment and combining ideas.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>{highlightText(row.part, highlightedText)}</Text>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.ao, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 20, marginBottom: 12, fontSize: 16 }}>Section B:</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            Students answer one of two questions as described.
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1.5, padding: 8 }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>AO level</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Description</Text>
                            </View>
                            {[
                              { marks: '12 marks', ao: 'AO3', description: 'Extended response question that needs judgment and combining ideas as well as a consideration of counter-arguments related to the HL extension. Additional prompts may be provided.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>{highlightText(row.marks, highlightedText)}</Text>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.ao, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* HL Paper 2 Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Paper 2</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 8, fontWeight: 'bold' }}>Duration: 1 hour 15 minutes</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16, fontWeight: 'bold' }}>Weighting: 20%</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16, fontStyle: 'italic' }}>
                            Paper 2 is the same for SL and HL.
                          </Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            Students respond to four questions involving a range of sources that address the common SL and HL syllabus. Sources may include text, audio, visuals, data, diagrams and/or infographics.
                          </Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            The question structure for paper 2 is outlined below.
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1.5, padding: 8 }}>Question / marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>AO level</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Description</Text>
                            </View>
                            {[
                              { question: 'Q1\n2 marks', ao: 'AO1', description: 'Q1 needs knowledge and understanding related to a source. This can be shown, for example, by identifying a viewpoint or argument from a source or by describing information about an infographic, diagram or data-based source.\n\nQuestion may be split into smaller parts.' },
                              { question: 'Q2\n4 marks', ao: 'AO2', description: 'Q2 needs application and breakdown related to the sources. This can be shown, for example, by breaking down how a term is used or by explaining a viewpoint or argument from a source.\n\nQuestion may be split into smaller parts.' },
                              { question: 'Q3\n6 marks', ao: 'AO3', description: 'Q3 needs comparing and/or contrasting two of the sources. This may be shown, for example, by comparing and/or contrasting viewpoints and arguments of sources.\n\nStudents may be asked to make use of their own knowledge from the course.' },
                              { question: 'Q4\n12 marks', ao: 'AO3', description: 'Q4 needs judgment and combining ideas that brings together sources with knowledge from the course.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>{highlightText(row.question, highlightedText)}</Text>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.ao, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* HL Paper 3 Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Paper 3 (HL only)</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 8, fontWeight: 'bold' }}>Duration: 1 hour 15 minutes</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16, fontWeight: 'bold' }}>Weighting: 25%</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            Students answer four questions that address an intervention related to an HL extension challenge topic. Students will be required to evaluate an intervention and recommend steps for future action.
                          </Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            Knowledge of course concepts, content and contexts may be required to address questions. Stimulus on paper 3 may include text, audio, visuals, data, diagrams and/or an infographic.
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 16, backgroundColor: 'rgba(182,199,247,0.05)' }}>
                            <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', padding: 12, fontWeight: 'bold' }}>A pre-release statement will be provided four months in advance of Paper 3.</Text>
                            <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', paddingHorizontal: 12, paddingBottom: 4 }}>
                              The pre-release statement will consist of a short description of 250–400 words indicating the real-world nature of a selected challenge topic from the HL extension.
                            </Text>
                            <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', paddingHorizontal: 12, paddingBottom: 4 }}>
                              The pre-release may also indicate possible resources, terms and approaches to consider for an extended inquiry. The pre-released statement should be used by students in extended inquiries into relevant digital interventions in advance of paper 3.
                            </Text>
                            <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', paddingHorizontal: 12, paddingBottom: 12 }}>
                              There is no pre-release for the HL extension questions in Section B of paper 1.
                            </Text>
                          </View>
                          
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            The question structure for HL Paper 3 is outlined below.
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1.5, padding: 8 }}>Question / marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>AO level</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 3, padding: 8 }}>Description</Text>
                            </View>
                            {[
                              { question: 'Q1\n4 marks', ao: 'AO1', description: 'Q1 needs knowledge and understanding of the intervention and/or challenge topic.\n\nQuestion may be split into smaller parts.' },
                              { question: 'Q2\n6 marks', ao: 'AO2', description: 'Q2 needs application and breakdown of the intervention and/or the challenge topic.\n\nQuestion may be split into smaller parts.' },
                              { question: 'Q3\n8 marks', ao: 'AO3', description: 'Q3 needs judgment of the intervention and/or the challenge topic and may be split into smaller parts.' },
                              { question: 'Q4\n12 marks', ao: 'AO3', description: 'Q4 needs suggestions for future action related to an intervention and/or challenge topic.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1.5, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', fontWeight: 'bold' }}>{highlightText(row.question, highlightedText)}</Text>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center' }}>{highlightText(row.ao, highlightedText)}</Text>
                                <Text style={{ flex: 3, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* HL Paper 1, Part C Markbands Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>HL Paper 1, part c</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            In addition to paper-specific analytic markschemes used for all questions, marks for part c are also allocated using markbands. While level descriptors are written in the form of individual bullet points, markbands are applied holistically using a best fit approach.
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 4, padding: 8 }}>Level descriptor</Text>
                            </View>
                            {[
                              { marks: '0', description: 'The work does not reach a standard described by the descriptors below.' },
                              { marks: '1–2', description: '• The response shows minimal understanding of the question requirements.\n\n• There is minimal useful knowledge. The response is mostly descriptive and consists mainly of unsupported general statements.\n\n• The response has minimal structure or is only a list of items.' },
                              { marks: '3–4', description: '• The response shows some understanding of the question requirements.\n\n• Some useful knowledge is shown, but this is not always accurate and may not be used properly or effectively. The response moves beyond description to include some breakdown, but this is not always continuous or effective.\n\n• The response is somewhat structured.' },
                              { marks: '5–6', description: '• The response shows sufficient understanding of the question requirements.\n\n• Response shows sufficient and effective breakdown supported with useful and accurate knowledge.\n\n• The response is sufficiently structured.' },
                              { marks: '7–8', description: '• The response is focused and shows a thorough understanding of the question requirements.\n\n• Response shows judgment and combining ideas that is effectively and consistently supported with useful and accurate knowledge.\n\n• The response is well-structured and effectively organized.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.marks, highlightedText)}</Text>
                                <Text style={{ flex: 4, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* HL Paper 1, Section B Markbands Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Paper 1, Section B</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            In addition to paper-specific analytic markschemes used for all questions, marks for Section B are also allocated using markbands. While level descriptors are written in the form of individual bullet points, markbands are applied holistically using a best fit approach.
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 4, padding: 8 }}>Level descriptor</Text>
                            </View>
                            {[
                              { marks: '0', description: 'The work does not reach a standard described by the descriptors below.' },
                              { marks: '1–3', description: '• The response shows minimal understanding of the question requirements.\n\n• There is minimal useful knowledge. The response is mostly descriptive and consists mainly of unsupported general statements.\n\n• Counter-arguments are not considered or addressed.\n\n• The response has minimal structure.' },
                              { marks: '4–6', description: '• The response shows some understanding of the question requirements.\n\n• Some useful knowledge demonstrated but this is not always accurate and may not be used properly or effectively. The response is primarily descriptive with some breakdown, but this is not continuous.\n\n• Counter-arguments are only somewhat addressed.\n\n• The response is somewhat structured.' },
                              { marks: '7–9', description: '• The response shows sufficient understanding of the question requirements.\n\n• Response shows sufficient and effective breakdown supported with useful and accurate knowledge.\n\n• Counter-arguments are sufficiently addressed.\n\n• The response is sufficiently structured.' },
                              { marks: '10–12', description: '• The response is focused and shows a thorough understanding of the question requirements.\n\n• Response shows judgment and combining ideas that is effectively and consistently supported with useful and accurate knowledge.\n\n• Counter-arguments are effectively addressed in the response.\n\n• The response is well-structured and effectively organized.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.marks, highlightedText)}</Text>
                                <Text style={{ flex: 4, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* HL Paper 2, Question 4 Markbands Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>HL Paper 2, question 4</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            In addition to paper-specific analytic markschemes used for all questions, marks for question 4 are also allocated using markbands. While level descriptors are written in the form of individual bullet points, markbands are applied holistically using a best fit approach.
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 4, padding: 8 }}>Level descriptor</Text>
                            </View>
                            {[
                              { marks: '0', description: 'The work does not reach a standard described by the descriptors below.' },
                              { marks: '1–3', description: '• The response shows minimal understanding of the question requirements.\n\n• There is minimal useful knowledge.\n\n• Evidence from sources is not brought together with the response.\n\n• The response has minimal structure.' },
                              { marks: '4–6', description: '• The response shows some understanding of the question requirements.\n\n• Some knowledge is demonstrated but this is not always useful or accurate.\n\n• Evidence from sources is somewhat brought together into the response.\n\n• The response is somewhat structured.' },
                              { marks: '7–9', description: '• The response shows sufficient understanding of the question requirements.\n\n• Useful and accurate knowledge is demonstrated with some gaps.\n\n• There is sufficient bringing together of evidence from the sources, but this is not always continuous.\n\n• The response is sufficiently structured.' },
                              { marks: '10–12', description: '• The response is focused and shows a thorough understanding of the question requirements.\n\n• Useful and accurate knowledge is demonstrated throughout, adding insight to the response.\n\n• There is consistent and effective bringing together of evidence from the sources.\n\n• The response is well-structured and effectively organized.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.marks, highlightedText)}</Text>
                                <Text style={{ flex: 4, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Paper 3, Question 3 Markbands Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Paper 3, question 3</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            In addition to paper-specific analytic markschemes used for all questions, marks for question 3 are also allocated using markbands. While level descriptors are written in the form of individual bullet points, markbands are applied holistically using a best fit approach.
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 4, padding: 8 }}>Level descriptor</Text>
                            </View>
                            {[
                              { marks: '0', description: 'The work does not reach a standard described by the descriptors below.' },
                              { marks: '1–2', description: '• The response shows minimal understanding of the question requirements.\n\n• Response is of minimal usefulness. The response is descriptive and consists mostly of unsupported general statements.\n\n• The response has minimal structure.' },
                              { marks: '3–4', description: '• The response shows some understanding of the question requirements.\n\n• The response is primarily descriptive with some judgment demonstrated but this is not continuous or fully supported.\n\n• The response is somewhat structured.' },
                              { marks: '5–6', description: '• The response shows sufficient understanding of the question requirements.\n\n• Response demonstrates sufficient judgment that is useful and supported.\n\n• The response is sufficiently structured.' },
                              { marks: '7–8', description: '• The response is focused and shows a thorough understanding of the question requirements.\n\n• Response demonstrates continuous judgment that is useful and well-supported throughout.\n\n• The response is well-structured and effectively organized.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.marks, highlightedText)}</Text>
                                <Text style={{ flex: 4, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(row.description, highlightedText)}</Text>
                              </View>
                            ))}
                          </View>
                          
                          {/* Paper 3, Question 4 Markbands Table */}
                          <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginTop: 24, marginBottom: 12 }}>Paper 3, question 4</Text>
                          <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#B6B6B6', marginBottom: 16 }}>
                            In addition to paper-specific analytic markschemes used for all questions, marks for question 4 are also allocated using markbands. While level descriptors are written in the form of individual bullet points, markbands are applied holistically using a best fit approach.
                          </Text>
                          
                          <View style={{ borderWidth: 1, borderColor: '#7EC3FF', borderRadius: 8, marginBottom: 8 }}>
                            <View style={{ flexDirection: 'row', backgroundColor: 'rgba(182,199,247,0.18)' }}>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 1, padding: 8, textAlign: 'center' }}>Marks</Text>
                              <Text style={{ ...themeStyles.sectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', flex: 4, padding: 8 }}>Level descriptor</Text>
                            </View>
                            {[
                              { marks: '0', description: 'The work does not reach a standard described by the descriptors below.' },
                              { marks: '1–3', description: '• The response shows minimal understanding of the question requirements.\n\n• The response consists mostly of unsupported general statements with minimal useful knowledge.\n\n• No suggestions are presented or those that are presented have only minimal backing.\n\n• The response has minimal structure.' },
                              { marks: '4–6', description: '• The response shows some understanding of the question requirements.\n\n• The response demonstrates some knowledge, but this is not always useful or accurate and may not be used properly or effectively.\n\n• Suggestions are presented with some backing although this is not continuous and only somewhat helpful.\n\n• The response is somewhat structured.' },
                              { marks: '7–9', description: '• The response shows sufficient understanding of the question requirements.\n\n• Response is sufficiently backed with useful and accurate knowledge.\n\n• Suggestions are presented and effectively backed.\n\n• The response is sufficiently structured.' },
                              { marks: '10–12', description: '• The response is focused and shows a thorough understanding of the question requirements.\n\n• Response is well-backed throughout with useful and accurate knowledge.\n\n• Suggestions are presented and well-backed with a clear consideration of possible consequences and effects.\n\n• The response is well-structured and effectively organized.' }
                            ].map((row, idx) => (
                              <View key={idx} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#7EC3FF' }}>
                                <Text style={{ flex: 1, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', textAlign: 'center', fontWeight: 'bold' }}>{highlightText(row.marks, highlightedText)}</Text>
                                <Text style={{ flex: 4, color: '#B6B6B6', padding: 8, fontFamily: 'ScopeOne-Regular', lineHeight: 20 }}>{highlightText(row.description, highlightedText)}</Text>
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
                title="Digital Society Tips"
                titleStyle={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 18 }}
                onPress={() => toggleSection('digitalSocietyTips')}
                right={props => <List.Icon {...props} icon="chevron-right" color="#FFFFFF" style={{ transform: [{ rotate: expandedSection === 'digitalSocietyTips' ? '90deg' : '0deg' }] }} />}
                style={{ paddingVertical: 8, paddingLeft: 20, backgroundColor: 'transparent' }}
              />
              {expandedSection === 'digitalSocietyTips' && (
                <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
                  {renderAnimatedContent('digitalSocietyTips', (
                    <View style={{ backgroundColor: 'transparent' }}>
                      <Text style={{ ...themeStyles.subsectionTitle, fontFamily: 'ScopeOne-Regular', color: '#7EC3FF', marginBottom: 16 }}>Top 10 Study Tips for Success</Text>
                      
                      <View style={{ marginBottom: 8 }}>
                        <Text style={{ ...themeStyles.content, fontFamily: 'ScopeOne-Regular', color: '#FFFFFF', lineHeight: 22 }}>{highlightText("• Master the key concepts (e.g., identity, networks, sustainability) early on.\n\n• Follow emerging digital issues in real time to use in essays and IA.\n\n• Use specific examples and real-world platforms in every response.\n\n• Analyze rather than describe – always ask why and how.\n\n• Connect theoretical ideas with lived digital experiences.\n\n• Practice concise, critical writing for source analysis in Paper 1.\n\n• Prepare structured arguments for Paper 2 using digital perspectives.\n\n• Choose a relevant and manageable issue for your Digital Exploration IA.\n\n• In Paper 3 (HL), speculate thoughtfully on the future, using theory and evidence.\n\n• Review the rubrics frequently and self-assess your work using them.", highlightedText)}</Text>
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
              subject: 'DIGITAL SOCIETY', 
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

export default DigitalSocietyScreen;
