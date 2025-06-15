import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Text, ImageBackground, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

type Props = {
  navigation: any;
  route: {
    params: {
      subject: string;
      userType: 'student' | 'teacher';
    };
  };
};

// Paper weightages for different subjects and levels
const paperWeightages = {
  'ENGLISH A LIT': {
    HL: {
      'PAPER ONE': 0.35,        // 35%
      'PAPER TWO': 0.25,        // 25%
      'ESSAY': 0.20,            // 20%
      'INTERNAL ASSESSMENT (ORAL)': 0.20  // 20%
    },
    SL: {
      'PAPER ONE': 0.35,        // 35%
      'PAPER TWO': 0.35,        // 35%
      'INTERNAL ASSESSMENT (ORAL)': 0.30  // 30%
    }
  },
  'ENGLISH A LAL': {
    HL: {
      'PAPER ONE': 0.35,        // 35%
      'PAPER TWO': 0.25,        // 25%
      'ESSAY': 0.20,            // 20%
      'INTERNAL ASSESSMENT (ORAL)': 0.20  // 20%
    },
    SL: {
      'PAPER ONE': 0.35,        // 35%
      'PAPER TWO': 0.35,        // 35%
      'INTERNAL ASSESSMENT (ORAL)': 0.30  // 30%
    }
  }
};

// Grade boundaries data from the screenshot
const gradeBoundaries = {
  'ENGLISH A LIT': {
    HL: {
      november: {
        timezone1: {
          ESSAY: { 1: [0, 3], 2: [4, 6], 3: [7, 9], 4: [10, 12], 5: [13, 14], 6: [15, 17], 7: [18, 20] },
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 4], 2: [5, 8], 3: [9, 15], 4: [16, 19], 5: [20, 23], 6: [24, 27], 7: [28, 40] },
          'PAPER TWO': { 1: [0, 3], 2: [4, 6], 3: [7, 9], 4: [10, 13], 5: [14, 17], 6: [18, 21], 7: [22, 30] },
          FINAL: { 1: [0, 12], 2: [13, 24], 3: [25, 39], 4: [40, 51], 5: [52, 62], 6: [63, 75], 7: [76, 100] }
        },
        timezone2: {
          ESSAY: { 1: [0, 3], 2: [4, 6], 3: [7, 9], 4: [10, 12], 5: [13, 14], 6: [15, 17], 7: [18, 20] },
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 5], 2: [6, 10], 3: [11, 15], 4: [16, 20], 5: [21, 24], 6: [25, 29], 7: [30, 40] },
          'PAPER TWO': { 1: [0, 3], 2: [4, 7], 3: [8, 11], 4: [12, 16], 5: [17, 20], 6: [21, 25], 7: [26, 30] },
          FINAL: { 1: [0, 13], 2: [14, 27], 3: [28, 40], 4: [41, 54], 5: [55, 66], 6: [67, 80], 7: [81, 100] }
        }
      },
      may: {
        timezone1: {
          ESSAY: { 1: [0, 3], 2: [4, 6], 3: [7, 9], 4: [10, 12], 5: [13, 14], 6: [15, 17], 7: [18, 20] },
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 6], 2: [7, 12], 3: [13, 15], 4: [16, 20], 5: [21, 26], 6: [27, 31], 7: [32, 40] },
          'PAPER TWO': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 17], 6: [18, 22], 7: [23, 30] },
          FINAL: { 1: [0, 13], 2: [14, 27], 3: [28, 38], 4: [39, 52], 5: [53, 65], 6: [66, 79], 7: [80, 100] }
        },
        timezone2: {
          ESSAY: { 1: [0, 3], 2: [4, 6], 3: [7, 9], 4: [10, 12], 5: [13, 14], 6: [15, 17], 7: [18, 20] },
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 7], 2: [8, 14], 3: [15, 16], 4: [17, 21], 5: [22, 25], 6: [26, 30], 7: [31, 40] },
          'PAPER TWO': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 18], 6: [19, 23], 7: [24, 30] },
          FINAL: { 1: [0, 14], 2: [15, 28], 3: [29, 39], 4: [40, 53], 5: [54, 65], 6: [66, 79], 7: [80, 100] }
        }
      }
    },
    SL: {
      november: {
        timezone1: {
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 4], 3: [5, 6], 4: [7, 9], 5: [10, 12], 6: [13, 15], 7: [16, 20] },
          'PAPER TWO': { 1: [0, 3], 2: [4, 7], 3: [8, 11], 4: [12, 16], 5: [17, 20], 6: [21, 25], 7: [26, 30] },
          FINAL: { 1: [0, 11], 2: [12, 24], 3: [25, 37], 4: [38, 52], 5: [53, 65], 6: [66, 80], 7: [81, 100] }
        },
        timezone2: {
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 4], 3: [5, 7], 4: [8, 10], 5: [11, 13], 6: [14, 16], 7: [17, 20] },
          'PAPER TWO': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 17], 6: [18, 22], 7: [23, 30] },
          FINAL: { 1: [0, 10], 2: [11, 22], 3: [23, 35], 4: [36, 50], 5: [51, 64], 6: [65, 78], 7: [79, 100] }
        }
      },
      may: {
        timezone1: {
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 1], 2: [2, 3], 3: [4, 6], 4: [7, 9], 5: [10, 11], 6: [12, 14], 7: [15, 20] },
          'PAPER TWO': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 17], 6: [18, 22], 7: [23, 30] },
          FINAL: { 1: [0, 9], 2: [10, 20], 3: [21, 33], 4: [34, 48], 5: [49, 60], 6: [61, 75], 7: [76, 100] }
        },
        timezone2: {
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 3], 2: [4, 6], 3: [7, 8], 4: [9, 10], 5: [11, 12], 6: [13, 14], 7: [15, 20] },
          'PAPER TWO': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 18], 6: [19, 23], 7: [24, 30] },
          FINAL: { 1: [0, 12], 2: [13, 25], 3: [26, 37], 4: [38, 50], 5: [51, 63], 6: [64, 76], 7: [77, 100] }
        }
      }
    }
  },
  'ENGLISH A LAL': {
    HL: {
      november: {
        timezone1: {
          ESSAY: { 1: [0, 3], 2: [4, 6], 3: [7, 9], 4: [10, 12], 5: [13, 14], 6: [15, 17], 7: [18, 20] },
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 27], 6: [28, 32], 7: [33, 40] },
          'PAPER TWO': { 1: [0, 3], 2: [4, 6], 3: [7, 9], 4: [10, 13], 5: [14, 17], 6: [18, 21], 7: [22, 30] },
          FINAL: { 1: [0, 14], 2: [15, 27], 3: [28, 41], 4: [42, 54], 5: [55, 66], 6: [67, 79], 7: [80, 100] }
        },
        timezone2: {
          ESSAY: { 1: [0, 3], 2: [4, 6], 3: [7, 9], 4: [10, 12], 5: [13, 14], 6: [15, 17], 7: [18, 20] },
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 5], 2: [6, 11], 3: [12, 17], 4: [18, 22], 5: [23, 27], 6: [28, 32], 7: [33, 40] },
          'PAPER TWO': { 1: [0, 3], 2: [4, 7], 3: [8, 11], 4: [12, 16], 5: [17, 20], 6: [21, 25], 7: [26, 30] },
          FINAL: { 1: [0, 13], 2: [14, 27], 3: [28, 42], 4: [43, 56], 5: [57, 68], 6: [69, 82], 7: [83, 100] }
        }
      },
      may: {
        timezone1: {
          ESSAY: { 1: [0, 3], 2: [4, 6], 3: [7, 9], 4: [10, 12], 5: [13, 14], 6: [15, 17], 7: [18, 20] },
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 5], 2: [6, 10], 3: [11, 16], 4: [17, 20], 5: [21, 25], 6: [26, 29], 7: [30, 40] },
          'PAPER TWO': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 17], 6: [18, 22], 7: [23, 30] },
          FINAL: { 1: [0, 12], 2: [13, 25], 3: [26, 39], 4: [40, 52], 5: [53, 64], 6: [65, 77], 7: [78, 100] }
        },
        timezone2: {
          ESSAY: { 1: [0, 3], 2: [4, 6], 3: [7, 9], 4: [10, 12], 5: [13, 14], 6: [15, 17], 7: [18, 20] },
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 4], 2: [5, 9], 3: [10, 15], 4: [16, 20], 5: [21, 25], 6: [26, 30], 7: [31, 40] },
          'PAPER TWO': { 1: [0, 3], 2: [4, 7], 3: [8, 11], 4: [12, 16], 5: [17, 20], 6: [21, 25], 7: [26, 30] },
          FINAL: { 1: [0, 11], 2: [12, 24], 3: [25, 38], 4: [39, 52], 5: [53, 65], 6: [66, 79], 7: [80, 100] }
        }
      }
    },
    SL: {
      november: {
        timezone1: {
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 11], 5: [12, 13], 6: [14, 16], 7: [17, 20] },
          'PAPER TWO': { 1: [0, 3], 2: [4, 6], 3: [7, 9], 4: [10, 13], 5: [14, 17], 6: [18, 21], 7: [22, 30] },
          FINAL: { 1: [0, 11], 2: [12, 25], 3: [26, 38], 4: [39, 52], 5: [53, 64], 6: [65, 77], 7: [78, 100] }
        },
        timezone2: {
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 3], 2: [4, 7], 3: [8, 10], 4: [11, 12], 5: [13, 14], 6: [15, 16], 7: [17, 20] },
          'PAPER TWO': { 1: [0, 3], 2: [4, 7], 3: [8, 11], 4: [12, 16], 5: [17, 20], 6: [21, 25], 7: [26, 30] },
          FINAL: { 1: [0, 13], 2: [14, 29], 3: [30, 44], 4: [45, 57], 5: [58, 69], 6: [70, 82], 7: [83, 100] }
        }
      },
      may: {
        timezone1: {
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 4], 3: [5, 7], 4: [8, 10], 5: [11, 13], 6: [14, 16], 7: [17, 20] },
          'PAPER TWO': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 17], 6: [18, 22], 7: [23, 30] },
          FINAL: { 1: [0, 10], 2: [11, 22], 3: [23, 35], 4: [36, 50], 5: [51, 64], 6: [65, 78], 7: [79, 100] }
        },
        timezone2: {
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 4], 3: [5, 7], 4: [8, 10], 5: [11, 13], 6: [14, 16], 7: [17, 20] },
          'PAPER TWO': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 18], 6: [19, 23], 7: [24, 30] },
          FINAL: { 1: [0, 10], 2: [11, 22], 3: [23, 35], 4: [36, 50], 5: [51, 65], 6: [66, 80], 7: [81, 100] }
        }
      }
    }
  }
};

const paperMaxScores = {
  'ENGLISH A LIT': {
    HL: {
      ESSAY: 20,
      'INTERNAL ASSESSMENT (ORAL)': 40,
      'PAPER ONE': 40,
      'PAPER TWO': 30
    },
    SL: {
      'INTERNAL ASSESSMENT (ORAL)': 40,
      'PAPER ONE': 20,
      'PAPER TWO': 30
    }
  },
  'ENGLISH A LAL': {
    HL: {
      ESSAY: 20,
      'INTERNAL ASSESSMENT (ORAL)': 40,
      'PAPER ONE': 40,
      'PAPER TWO': 30
    },
    SL: {
      'INTERNAL ASSESSMENT (ORAL)': 40,
      'PAPER ONE': 20,
      'PAPER TWO': 30
    }
  }
};

const GradePredictionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { subject, userType } = route.params;
  const [selectedLevel, setSelectedLevel] = useState<'HL' | 'SL'>('HL');
  const [selectedTimezone, setSelectedTimezone] = useState<'timezone1' | 'timezone2'>('timezone1');
  const [selectedSeason, setSelectedSeason] = useState<'november' | 'may'>('november');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [predictedGrade, setPredictedGrade] = useState<number | null>(null);

  // Animation value for home icon fade
  const homeIconOpacity = useRef(new Animated.Value(1)).current;

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

  const calculatePredictedGrade = () => {
    const subjectData = gradeBoundaries[subject as keyof typeof gradeBoundaries];
    if (!subjectData) return null;
    
    const levelData = subjectData[selectedLevel];
    if (!levelData) return null;
    
    const seasonData = levelData[selectedSeason];
    if (!seasonData) return null;
    
    const timezoneData = seasonData[selectedTimezone];
    if (!timezoneData) return null;
    
    const boundaries = timezoneData.FINAL;
    if (!boundaries) return null;

    // Get weightages for this subject and level
    const weightageData = paperWeightages[subject as keyof typeof paperWeightages];
    if (!weightageData || !weightageData[selectedLevel]) return null;
    
    const weights = weightageData[selectedLevel];
    const maxScoresData = paperMaxScores[subject as keyof typeof paperMaxScores];
    if (!maxScoresData || !maxScoresData[selectedLevel]) return null;
    
    const maxScores = maxScoresData[selectedLevel];

    // Calculate weighted score out of 100
    let weightedScore = 0;
    
    Object.keys(scores).forEach(paper => {
      const rawScore = scores[paper] || 0;
      const maxScore = maxScores[paper as keyof typeof maxScores] || 1;
      const weight = weights[paper as keyof typeof weights] || 0;
      
      // Convert to percentage and apply weight
      const percentage = (rawScore / maxScore) * 100;
      weightedScore += percentage * weight;
    });

    // Round the weighted score to avoid precision issues
    weightedScore = Math.round(weightedScore * 100) / 100;

    // Debug log to help identify issues
    console.log(`Weighted Score: ${weightedScore}%, Selected: ${selectedLevel} ${selectedSeason} ${selectedTimezone}`);

    // Find grade based on weighted score - check from grade 1 to 7
    for (let grade = 1; grade <= 7; grade++) {
      const gradeRange = boundaries[grade as keyof typeof boundaries] as [number, number];
      if (gradeRange && weightedScore >= gradeRange[0] && weightedScore <= gradeRange[1]) {
        return grade;
      }
    }

    // Fallback: if no exact match found, find the closest grade
    // This handles edge cases where rounding might cause issues
    let closestGrade = 1;
    let minDistance = Infinity;
    
    for (let grade = 1; grade <= 7; grade++) {
      const gradeRange = boundaries[grade as keyof typeof boundaries] as [number, number];
      if (gradeRange) {
        const midPoint = (gradeRange[0] + gradeRange[1]) / 2;
        const distance = Math.abs(weightedScore - midPoint);
        if (distance < minDistance) {
          minDistance = distance;
          closestGrade = grade;
        }
      }
    }
    
    return closestGrade;
  };

  const calculateWeightedScore = () => {
    const weightageData = paperWeightages[subject as keyof typeof paperWeightages];
    if (!weightageData || !weightageData[selectedLevel]) return 0;
    
    const weights = weightageData[selectedLevel];
    const maxScoresData = paperMaxScores[subject as keyof typeof paperMaxScores];
    if (!maxScoresData || !maxScoresData[selectedLevel]) return 0;
    
    const maxScores = maxScoresData[selectedLevel];

    let weightedScore = 0;
    
    Object.keys(scores).forEach(paper => {
      const rawScore = scores[paper] || 0;
      const maxScore = maxScores[paper as keyof typeof maxScores] || 1;
      const weight = weights[paper as keyof typeof weights] || 0;
      
      // Convert to percentage and apply weight
      const percentage = (rawScore / maxScore) * 100;
      weightedScore += percentage * weight;
    });

    return Math.round(weightedScore * 10) / 10; // Round to 1 decimal place
  };

  // Update scores when level changes
  useEffect(() => {
    const subjectData = paperMaxScores[subject as keyof typeof paperMaxScores];
    if (subjectData && subjectData[selectedLevel]) {
      const papers = Object.keys(subjectData[selectedLevel]);
      const newScores: Record<string, number> = {};
      papers.forEach(paper => {
        newScores[paper] = 0;
      });
      setScores(newScores);
    }
  }, [selectedLevel, selectedSeason, subject]);

  useEffect(() => {
    const grade = calculatePredictedGrade();
    setPredictedGrade(grade);
  }, [scores, selectedLevel, selectedTimezone, selectedSeason]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  let [fontsLoaded] = useFonts({
    'ScopeOne-Regular': require('../../assets/fonts/ScopeOne-Regular.ttf'),
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const subjectData = paperMaxScores[subject as keyof typeof paperMaxScores];
  const maxScores = subjectData?.[selectedLevel];
  const papers = maxScores ? Object.keys(maxScores) : [];
  const totalMaxScore = maxScores ? Object.values(maxScores).reduce((sum, score) => sum + score, 0) : 0;

  return (
    <ImageBackground
      source={require('../../assets/images/entry-bg.png')}
      style={{ flex: 1, width: '100%', height: '100%' }}
      resizeMode="cover"
    >
      {/* Home icon top left */}
      <Animated.View style={{ position: 'absolute', top: 56, left: 16, zIndex: 100, flexDirection: 'row', alignItems: 'center', opacity: homeIconOpacity }}>
        <Feather
          name="arrow-left"
          size={20}
          color="#7EC3FF"
          onPress={() => navigation.goBack()}
          style={{ cursor: 'pointer' }}
          accessibilityRole="button"
          accessibilityLabel="Go Back"
        />
      </Animated.View>

      <ScrollView 
        contentContainerStyle={{ paddingTop: 112, paddingBottom: 32, paddingHorizontal: 16 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={{ marginBottom: 32, alignItems: 'center' }}>
          <Text style={{ 
            fontSize: 26, 
            color: '#fff', 
            fontFamily: 'ScopeOne-Regular', 
            fontWeight: 'bold', 
            marginBottom: 8,
            textAlign: 'center'
          }}>
            Grade Prediction
          </Text>
          <Text style={{ 
            fontSize: 18, 
            color: '#7EC3FF', 
            fontFamily: 'ScopeOne-Regular',
            textAlign: 'center',
            marginBottom: 8
          }}>
            {subject}
          </Text>
        </View>

        {/* Level Selection */}
        <View style={{ 
          borderRadius: 16, 
          borderWidth: 1, 
          borderColor: '#7EC3FF', 
          backgroundColor: 'rgba(182,199,247,0.12)', 
          marginBottom: 24, 
          overflow: 'hidden' 
        }}>
          <View style={{ padding: 20, paddingBottom: 16 }}>
            <Text style={{ fontSize: 18, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 16 }}>
              Select Level
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {['HL', 'SL'].map((level) => (
                <TouchableOpacity
                  key={level}
                  onPress={() => setSelectedLevel(level as 'HL' | 'SL')}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: selectedLevel === level ? '#7EC3FF' : '#444',
                    backgroundColor: selectedLevel === level ? 'rgba(126, 195, 255, 0.2)' : 'rgba(68, 68, 68, 0.2)',
                  }}
                >
                  <Text style={{
                    color: selectedLevel === level ? '#7EC3FF' : '#B6B6B6',
                    fontFamily: 'ScopeOne-Regular',
                    textAlign: 'center',
                    fontWeight: selectedLevel === level ? 'bold' : 'normal'
                  }}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Timezone Selection */}
        <View style={{ 
          borderRadius: 16, 
          borderWidth: 1, 
          borderColor: '#7EC3FF', 
          backgroundColor: 'rgba(182,199,247,0.12)', 
          marginBottom: 24, 
          overflow: 'hidden' 
        }}>
          <View style={{ padding: 20, paddingBottom: 16 }}>
            <Text style={{ fontSize: 18, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 16 }}>
              Select Timezone
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {[
                { key: 'timezone1', label: 'Timezone 1' },
                { key: 'timezone2', label: 'Timezone 2' }
              ].map((timezone) => (
                <TouchableOpacity
                  key={timezone.key}
                  onPress={() => setSelectedTimezone(timezone.key as 'timezone1' | 'timezone2')}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: selectedTimezone === timezone.key ? '#7EC3FF' : '#444',
                    backgroundColor: selectedTimezone === timezone.key ? 'rgba(126, 195, 255, 0.2)' : 'rgba(68, 68, 68, 0.2)',
                  }}
                >
                  <Text style={{
                    color: selectedTimezone === timezone.key ? '#7EC3FF' : '#B6B6B6',
                    fontFamily: 'ScopeOne-Regular',
                    textAlign: 'center',
                    fontWeight: selectedTimezone === timezone.key ? 'bold' : 'normal'
                  }}>
                    {timezone.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Examination Season Selection */}
        <View style={{ 
          borderRadius: 16, 
          borderWidth: 1, 
          borderColor: '#7EC3FF', 
          backgroundColor: 'rgba(182,199,247,0.12)', 
          marginBottom: 24, 
          overflow: 'hidden' 
        }}>
          <View style={{ padding: 20, paddingBottom: 16 }}>
            <Text style={{ fontSize: 18, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 16 }}>
              Select Examination Season
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {[
                { key: 'november', label: 'November' },
                { key: 'may', label: 'May' }
              ].map((season) => (
                <TouchableOpacity
                  key={season.key}
                  onPress={() => setSelectedSeason(season.key as 'november' | 'may')}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: selectedSeason === season.key ? '#7EC3FF' : '#444',
                    backgroundColor: selectedSeason === season.key ? 'rgba(126, 195, 255, 0.2)' : 'rgba(68, 68, 68, 0.2)',
                  }}
                >
                  <Text style={{
                    color: selectedSeason === season.key ? '#7EC3FF' : '#B6B6B6',
                    fontFamily: 'ScopeOne-Regular',
                    textAlign: 'center',
                    fontWeight: selectedSeason === season.key ? 'bold' : 'normal'
                  }}>
                    {season.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Paper Scores */}
        <View style={{ 
          borderRadius: 16, 
          borderWidth: 1, 
          borderColor: '#7EC3FF', 
          backgroundColor: 'rgba(182,199,247,0.12)', 
          marginBottom: 24, 
          overflow: 'hidden' 
        }}>
          <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, color: '#fff', fontFamily: 'ScopeOne-Regular', fontWeight: 'bold', marginBottom: 20 }}>
              Enter Your Scores
            </Text>
            
            {papers.map((paper) => {
              const weightageData = paperWeightages[subject as keyof typeof paperWeightages];
              const weight = weightageData?.[selectedLevel]?.[paper as keyof typeof weightageData[typeof selectedLevel]] || 0;
              const rawScore = scores[paper] || 0;
              const maxScore = maxScores?.[paper as keyof typeof maxScores] || 0;
              const percentage = maxScore > 0 ? (rawScore / maxScore) * 100 : 0;
              const contribution = percentage * weight;
              
              return (
                <View key={paper} style={{ marginBottom: 24 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ color: '#7EC3FF', fontFamily: 'ScopeOne-Regular', fontSize: 16, flex: 1 }}>
                      {paper}
                    </Text>
                    <Text style={{ color: '#fff', fontFamily: 'ScopeOne-Regular', fontSize: 16, fontWeight: 'bold' }}>
                      {rawScore} / {maxScore}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 14 }}>
                      Weight: {Math.round(weight * 100)}%
                    </Text>
                    <Text style={{ color: '#B6B6B6', fontFamily: 'ScopeOne-Regular', fontSize: 14 }}>
                      Contributes: {contribution.toFixed(1)}%
                    </Text>
                  </View>
                  <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={0}
                    maximumValue={maxScores?.[paper as keyof typeof maxScores] || 0}
                    value={scores[paper] || 0}
                    onValueChange={(value: number) => setScores(prev => ({ ...prev, [paper]: Math.round(value) }))}
                    minimumTrackTintColor="#7EC3FF"
                    maximumTrackTintColor="#444"
                  />
                </View>
              );
            })}
          </View>
        </View>

        {/* Predicted Grade */}
        <View style={{ 
          borderRadius: 16, 
          borderWidth: 1, 
          borderColor: '#7EC3FF', 
          backgroundColor: 'rgba(182,199,247,0.12)', 
          marginBottom: 24, 
          overflow: 'hidden' 
        }}>
          <LinearGradient
            colors={['rgba(126, 195, 255, 0.15)', 'rgba(126, 195, 255, 0.05)']}
            style={{ padding: 24 }}
          >
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 18, color: '#7EC3FF', fontFamily: 'ScopeOne-Regular', marginBottom: 12 }}>
                Predicted Grade
              </Text>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                borderWidth: 3,
                borderColor: '#7EC3FF',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(126, 195, 255, 0.1)'
              }}>
                <Text style={{ 
                  fontSize: 36, 
                  color: '#7EC3FF', 
                  fontFamily: 'ScopeOne-Regular', 
                  fontWeight: 'bold' 
                }}>
                  {predictedGrade || '-'}
                </Text>
              </View>
              <Text style={{ 
                fontSize: 14, 
                color: '#B6B6B6', 
                fontFamily: 'ScopeOne-Regular', 
                textAlign: 'center',
                marginTop: 12
              }}>
                Weighted Score: {calculateWeightedScore()}%
              </Text>
            </View>
          </LinearGradient>
        </View>

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
            This prediction is based on historical grade boundaries and is for guidance only.
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default GradePredictionScreen; 