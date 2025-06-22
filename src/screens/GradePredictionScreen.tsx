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
      'PAPER ONE': 0.30,        // 30%
      'PAPER TWO': 0.20,        // 20%
      'ESSAY': 0.20,            // 20%
      'INTERNAL ASSESSMENT (ORAL)': 0.30  // 30%
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
  },
  'ENGLISH A LIT AND PERF': {
    HL: {
      'TRANSFORMATIVE PERFORMANCE': 0.40,  // 40%
      'PAPER ONE': 0.30,        // 30%
      'WRITTEN ASSIGNMENT': 0.30  // 30%
    },
    SL: {
      'TRANSFORMATIVE PERFORMANCE': 0.40,  // 40%
      'PAPER ONE': 0.30,        // 30%
      'WRITTEN ASSIGNMENT': 0.30  // 30%
    }
  },
  'MATH ANALYSIS': {
    HL: {
      'PAPER ONE': 0.30,        // 30%
      'PAPER TWO': 0.30,        // 30%
      'PAPER THREE': 0.20,      // 20%
      'EXPLORATION': 0.20       // 20%
    },
    SL: {
      'PAPER ONE': 0.40,        // 40%
      'PAPER TWO': 0.40,        // 40%
      'EXPLORATION': 0.20       // 20%
    }
  }
};

// Grade boundaries data from the screenshot
const gradeBoundaries = {
  'ENGLISH A LIT': {
    HL: {
      november: {
        timezone0: {
          ESSAY: { 1: [0, 3], 2: [4, 6], 3: [7, 9], 4: [10, 12], 5: [13, 14], 6: [15, 17], 7: [18, 20] },
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 4], 2: [5, 8], 3: [9, 15], 4: [16, 19], 5: [20, 23], 6: [24, 27], 7: [28, 40] },
          'PAPER TWO': { 1: [0, 3], 2: [4, 6], 3: [7, 9], 4: [10, 13], 5: [14, 17], 6: [18, 21], 7: [22, 30] },
          FINAL: { 1: [0, 12], 2: [13, 24], 3: [25, 39], 4: [40, 51], 5: [52, 62], 6: [63, 75], 7: [76, 100] }
        },
        timezone1: {
          EXPLORATION: { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 11], 5: [12, 14], 6: [15, 16], 7: [17, 20] },
          'PAPER ONE': { 1: [0, 9], 2: [10, 23], 3: [24, 34], 4: [35, 49], 5: [50, 63], 6: [64, 79], 7: [80, 110] },
          'PAPER THREE': { 1: [0, 5], 2: [6, 14], 3: [15, 22], 4: [23, 30], 5: [31, 36], 6: [37, 45], 7: [46, 55] },
          'PAPER TWO': { 1: [0, 9], 2: [10, 22], 3: [23, 33], 4: [34, 48], 5: [49, 62], 6: [63, 78], 7: [79, 110] },
          FINAL: { 1: [0, 9], 2: [10, 22], 3: [23, 34], 4: [35, 48], 5: [49, 61], 6: [62, 75], 7: [76, 100] }
        },
        timezone2: {
          EXPLORATION: { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 11], 5: [12, 14], 6: [15, 16], 7: [17, 20] },
          'PAPER ONE': { 1: [0, 14], 2: [15, 22], 3: [23, 29], 4: [30, 44], 5: [45, 59], 6: [60, 75], 7: [76, 110] },
          'PAPER TWO': { 1: [0, 15], 2: [16, 24], 3: [25, 32], 4: [33, 47], 5: [48, 62], 6: [63, 79], 7: [80, 110] },
          FINAL: { 1: [0, 13], 2: [14, 23], 3: [24, 33], 4: [34, 46], 5: [47, 59], 6: [60, 73], 7: [74, 100] }
        },
        timezone0: {
          EXPLORATION: { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 11], 5: [12, 14], 6: [15, 16], 7: [17, 20] },
          'PAPER ONE': { 1: [0, 17], 2: [18, 31], 3: [32, 42], 4: [43, 57], 5: [58, 71], 6: [72, 85], 7: [86, 110] },
          'PAPER THREE': { 1: [0, 8], 2: [9, 16], 3: [17, 24], 4: [25, 32], 5: [33, 38], 6: [39, 44], 7: [45, 55] },
          'PAPER TWO': { 1: [0, 17], 2: [18, 30], 3: [31, 41], 4: [42, 56], 5: [57, 70], 6: [71, 83], 7: [84, 110] },
          FINAL: { 1: [0, 14], 2: [15, 27], 3: [28, 39], 4: [40, 53], 5: [54, 66], 6: [67, 78], 7: [79, 100] }
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
          'PAPER TWO': { 1: [0, 3], 2: [4, 7], 3: [8, 11], 4: [12, 16], 5: [17, 20], 6: [21, 25], 7: [26, 30] },
          FINAL: { 1: [0, 13], 2: [14, 29], 3: [30, 44], 4: [45, 57], 5: [58, 69], 6: [70, 82], 7: [83, 100] }
        },
        timezone0: {
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 4], 3: [5, 6], 4: [7, 9], 5: [10, 12], 6: [13, 15], 7: [16, 20] },
          'PAPER TWO': { 1: [0, 3], 2: [4, 7], 3: [8, 11], 4: [12, 16], 5: [17, 20], 6: [21, 25], 7: [26, 30] },
          FINAL: { 1: [0, 11], 2: [12, 24], 3: [25, 37], 4: [38, 52], 5: [53, 65], 6: [66, 80], 7: [81, 100] }
        }
      },
      may: {
        timezone1: {
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 19], 4: [20, 22], 5: [23, 25], 6: [26, 28], 7: [29, 32] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 11], 5: [14, 18], 6: [19, 23], 7: [24, 30] },
          'PAPER TWO': { 1: [0, 3], 2: [4, 6], 3: [7, 9], 4: [10, 13], 5: [14, 17], 6: [18, 21], 7: [22, 26] },
          FINAL: { 1: [0, 12], 2: [13, 26], 3: [27, 42], 4: [43, 55], 5: [56, 70], 6: [71, 83], 7: [84, 100] }
        },
        timezone2: {
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 19], 4: [20, 22], 5: [23, 25], 6: [26, 28], 7: [29, 32] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 18], 6: [19, 23], 7: [24, 30] },
          'PAPER TWO': { 1: [0, 2], 2: [3, 5], 3: [6, 9], 4: [10, 13], 5: [14, 18], 6: [19, 22], 7: [23, 26] },
          FINAL: { 1: [0, 12], 2: [13, 26], 3: [27, 42], 4: [43, 55], 5: [56, 70], 6: [71, 83], 7: [84, 100] }
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
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 19], 4: [20, 22], 5: [23, 25], 6: [26, 28], 7: [29, 32] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 18], 6: [19, 23], 7: [24, 30] },
          'PAPER TWO': { 1: [0, 2], 2: [3, 5], 3: [6, 9], 4: [10, 13], 5: [14, 18], 6: [19, 22], 7: [23, 26] },
          FINAL: { 1: [0, 12], 2: [13, 26], 3: [27, 42], 4: [43, 55], 5: [56, 70], 6: [71, 83], 7: [84, 100] }
        },
        timezone2: {
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 19], 4: [20, 22], 5: [23, 25], 6: [26, 28], 7: [29, 32] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 18], 6: [19, 23], 7: [24, 30] },
          'PAPER TWO': { 1: [0, 2], 2: [3, 5], 3: [6, 9], 4: [10, 13], 5: [14, 18], 6: [19, 22], 7: [23, 26] },
          FINAL: { 1: [0, 12], 2: [13, 26], 3: [27, 42], 4: [43, 55], 5: [56, 70], 6: [71, 83], 7: [84, 100] }
        }
      },
      may: {
        timezone1: {
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 19], 4: [20, 22], 5: [23, 25], 6: [26, 28], 7: [29, 32] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 18], 6: [19, 23], 7: [24, 30] },
          'PAPER TWO': { 1: [0, 2], 2: [3, 5], 3: [6, 9], 4: [10, 13], 5: [14, 18], 6: [19, 22], 7: [23, 26] },
          FINAL: { 1: [0, 12], 2: [13, 26], 3: [27, 42], 4: [43, 55], 5: [56, 70], 6: [71, 83], 7: [84, 100] }
        },
        timezone2: {
          'INTERNAL ASSESSMENT (ORAL)': { 1: [0, 6], 2: [7, 12], 3: [13, 19], 4: [20, 22], 5: [23, 25], 6: [26, 28], 7: [29, 32] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 18], 6: [19, 23], 7: [24, 30] },
          'PAPER TWO': { 1: [0, 2], 2: [3, 5], 3: [6, 9], 4: [10, 13], 5: [14, 18], 6: [19, 22], 7: [23, 26] },
          FINAL: { 1: [0, 12], 2: [13, 26], 3: [27, 42], 4: [43, 55], 5: [56, 70], 6: [71, 83], 7: [84, 100] }
        }
      }
    }
  },
  'ENGLISH A LIT AND PERF': {
    HL: {
      november: {
        timezone1: {
          'TRANSFORMATIVE PERFORMANCE': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 4], 3: [5, 6], 4: [7, 9], 5: [10, 12], 6: [13, 15], 7: [16, 20] },
          'WRITTEN ASSIGNMENT': { 1: [0, 3], 2: [4, 7], 3: [8, 11], 4: [12, 16], 5: [17, 20], 6: [21, 25], 7: [26, 30] },
          FINAL: { 1: [0, 11], 2: [12, 24], 3: [25, 37], 4: [38, 52], 5: [53, 65], 6: [66, 80], 7: [81, 100] }
        },
        timezone2: {
          'TRANSFORMATIVE PERFORMANCE': { 1: [0, 6], 2: [7, 12], 3: [13, 18], 4: [19, 23], 5: [24, 28], 6: [29, 33], 7: [34, 40] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 4], 3: [5, 7], 4: [8, 10], 5: [11, 13], 6: [14, 16], 7: [17, 20] },
          'WRITTEN ASSIGNMENT': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 17], 6: [18, 22], 7: [23, 30] },
          FINAL: { 1: [0, 10], 2: [11, 22], 3: [23, 35], 4: [36, 50], 5: [51, 64], 6: [65, 78], 7: [79, 100] }
        }
      },
      may: {
        timezone1: {
          'TRANSFORMATIVE PERFORMANCE': { 1: [0, 6], 2: [7, 12], 3: [13, 19], 4: [20, 22], 5: [23, 25], 6: [26, 28], 7: [29, 32] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 18], 6: [19, 23], 7: [24, 30] },
          'WRITTEN ASSIGNMENT': { 1: [0, 2], 2: [3, 5], 3: [6, 9], 4: [10, 13], 5: [14, 18], 6: [19, 22], 7: [23, 26] },
          FINAL: { 1: [0, 12], 2: [13, 26], 3: [27, 42], 4: [43, 55], 5: [56, 70], 6: [71, 83], 7: [84, 100] }
        },
        timezone2: {
          'TRANSFORMATIVE PERFORMANCE': { 1: [0, 6], 2: [7, 12], 3: [13, 19], 4: [20, 22], 5: [23, 25], 6: [26, 28], 7: [29, 32] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 18], 6: [19, 23], 7: [24, 30] },
          'WRITTEN ASSIGNMENT': { 1: [0, 2], 2: [3, 5], 3: [6, 9], 4: [10, 13], 5: [14, 18], 6: [19, 22], 7: [23, 26] },
          FINAL: { 1: [0, 12], 2: [13, 26], 3: [27, 42], 4: [43, 55], 5: [56, 70], 6: [71, 83], 7: [84, 100] }
        }
      }
    },
    SL: {
      november: {
        timezone1: {
          'TRANSFORMATIVE PERFORMANCE': { 1: [0, 6], 2: [7, 12], 3: [13, 19], 4: [20, 22], 5: [23, 25], 6: [26, 28], 7: [29, 32] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 18], 6: [19, 23], 7: [24, 30] },
          'WRITTEN ASSIGNMENT': { 1: [0, 2], 2: [3, 5], 3: [6, 9], 4: [10, 13], 5: [14, 18], 6: [19, 22], 7: [23, 26] },
          FINAL: { 1: [0, 12], 2: [13, 26], 3: [27, 42], 4: [43, 55], 5: [56, 70], 6: [71, 83], 7: [84, 100] }
        },
        timezone2: {
          'TRANSFORMATIVE PERFORMANCE': { 1: [0, 6], 2: [7, 12], 3: [13, 19], 4: [20, 22], 5: [23, 25], 6: [26, 28], 7: [29, 32] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 18], 6: [19, 23], 7: [24, 30] },
          'WRITTEN ASSIGNMENT': { 1: [0, 2], 2: [3, 5], 3: [6, 9], 4: [10, 13], 5: [14, 18], 6: [19, 22], 7: [23, 26] },
          FINAL: { 1: [0, 12], 2: [13, 26], 3: [27, 42], 4: [43, 55], 5: [56, 70], 6: [71, 83], 7: [84, 100] }
        }
      },
      may: {
        timezone1: {
          'TRANSFORMATIVE PERFORMANCE': { 1: [0, 6], 2: [7, 12], 3: [13, 19], 4: [20, 22], 5: [23, 25], 6: [26, 28], 7: [29, 32] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 18], 6: [19, 23], 7: [24, 30] },
          'WRITTEN ASSIGNMENT': { 1: [0, 2], 2: [3, 5], 3: [6, 9], 4: [10, 13], 5: [14, 18], 6: [19, 22], 7: [23, 26] },
          FINAL: { 1: [0, 12], 2: [13, 26], 3: [27, 42], 4: [43, 55], 5: [56, 70], 6: [71, 83], 7: [84, 100] }
        },
        timezone2: {
          'TRANSFORMATIVE PERFORMANCE': { 1: [0, 6], 2: [7, 12], 3: [13, 19], 4: [20, 22], 5: [23, 25], 6: [26, 28], 7: [29, 32] },
          'PAPER ONE': { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 13], 5: [14, 18], 6: [19, 23], 7: [24, 30] },
          'WRITTEN ASSIGNMENT': { 1: [0, 2], 2: [3, 5], 3: [6, 9], 4: [10, 13], 5: [14, 18], 6: [19, 22], 7: [23, 26] },
          FINAL: { 1: [0, 12], 2: [13, 26], 3: [27, 42], 4: [43, 55], 5: [56, 70], 6: [71, 83], 7: [84, 100] }
        }
      }
    }
  },
  'MATH ANALYSIS': {
    HL: {
      november: {
        timezone1: {
          EXPLORATION: { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 11], 5: [12, 14], 6: [15, 16], 7: [17, 20] },
          'PAPER ONE': { 1: [0, 9], 2: [10, 23], 3: [24, 34], 4: [35, 49], 5: [50, 63], 6: [64, 79], 7: [80, 110] },
          'PAPER TWO': { 1: [0, 9], 2: [10, 22], 3: [23, 33], 4: [34, 48], 5: [49, 62], 6: [63, 78], 7: [79, 110] },
          FINAL: { 1: [0, 9], 2: [10, 22], 3: [23, 34], 4: [35, 48], 5: [49, 61], 6: [62, 75], 7: [76, 100] }
        },
        timezone2: {
          EXPLORATION: { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 11], 5: [12, 14], 6: [15, 16], 7: [17, 20] },
          'PAPER ONE': { 1: [0, 14], 2: [15, 22], 3: [23, 29], 4: [30, 44], 5: [45, 59], 6: [60, 75], 7: [76, 110] },
          'PAPER TWO': { 1: [0, 15], 2: [16, 24], 3: [25, 32], 4: [33, 47], 5: [48, 62], 6: [63, 79], 7: [80, 110] },
          FINAL: { 1: [0, 13], 2: [14, 23], 3: [24, 33], 4: [34, 46], 5: [47, 59], 6: [60, 73], 7: [74, 100] }
        },
        timezone0: {
          EXPLORATION: { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 11], 5: [12, 14], 6: [15, 16], 7: [17, 20] },
          'PAPER ONE': { 1: [0, 17], 2: [18, 31], 3: [32, 42], 4: [43, 57], 5: [58, 71], 6: [72, 85], 7: [86, 110] },
          'PAPER THREE': { 1: [0, 8], 2: [9, 16], 3: [17, 24], 4: [25, 32], 5: [33, 38], 6: [39, 44], 7: [45, 55] },
          'PAPER TWO': { 1: [0, 17], 2: [18, 30], 3: [31, 41], 4: [42, 56], 5: [57, 70], 6: [71, 83], 7: [84, 110] },
          FINAL: { 1: [0, 14], 2: [15, 27], 3: [28, 39], 4: [40, 53], 5: [54, 66], 6: [67, 78], 7: [79, 100] }
        }
      },
      may: {
        timezone1: {
          EXPLORATION: { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 11], 5: [12, 14], 6: [15, 17], 7: [18, 20] },
          'PAPER ONE': { 1: [0, 8], 2: [9, 17], 3: [18, 25], 4: [26, 35], 5: [36, 48], 6: [49, 58], 7: [59, 80] },
          'PAPER TWO': { 1: [0, 7], 2: [8, 16], 3: [17, 24], 4: [25, 35], 5: [36, 48], 6: [49, 58], 7: [59, 80] },
          FINAL: { 1: [0, 9], 2: [10, 21], 3: [22, 32], 4: [33, 46], 5: [47, 62], 6: [63, 75], 7: [76, 100] }
        },
        timezone2: {
          EXPLORATION: { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 11], 5: [12, 14], 6: [15, 17], 7: [18, 20] },
          'PAPER ONE': { 1: [0, 5], 2: [6, 11], 3: [12, 20], 4: [21, 31], 5: [32, 44], 6: [45, 57], 7: [58, 80] },
          'PAPER TWO': { 1: [0, 7], 2: [8, 13], 3: [14, 22], 4: [23, 33], 5: [34, 45], 6: [46, 58], 7: [59, 80] },
          FINAL: { 1: [0, 8], 2: [9, 17], 3: [18, 29], 4: [30, 43], 5: [44, 58], 6: [59, 74], 7: [75, 100] }
        }
      }
    },
    SL: {
      november: {
        timezone1: {
          EXPLORATION: { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 11], 5: [12, 14], 6: [15, 16], 7: [17, 20] },
          'PAPER ONE': { 1: [0, 10], 2: [11, 20], 3: [21, 28], 4: [29, 41], 5: [42, 53], 6: [54, 63], 7: [64, 80] },
          'PAPER TWO': { 1: [0, 10], 2: [11, 20], 3: [21, 28], 4: [29, 41], 5: [42, 52], 6: [53, 61], 7: [62, 80] },
          FINAL: { 1: [0, 12], 2: [13, 25], 3: [26, 36], 4: [37, 52], 5: [53, 66], 6: [67, 79], 7: [80, 100] }
        },
        timezone2: {
          EXPLORATION: { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 11], 5: [12, 14], 6: [15, 17], 7: [18, 20] },
          'PAPER ONE': { 1: [0, 10], 2: [11, 20], 3: [21, 28], 4: [29, 41], 5: [42, 52], 6: [53, 63], 7: [64, 80] },
          'PAPER TWO': { 1: [0, 10], 2: [11, 20], 3: [21, 28], 4: [29, 41], 5: [42, 52], 6: [53, 61], 7: [62, 80] },
          FINAL: { 1: [0, 12], 2: [13, 25], 3: [26, 36], 4: [37, 52], 5: [53, 66], 6: [67, 79], 7: [80, 100] }
        }
      },
      may: {
        timezone1: {
          EXPLORATION: { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 11], 5: [12, 14], 6: [15, 17], 7: [18, 20] },
          'PAPER ONE': { 1: [0, 8], 2: [9, 17], 3: [18, 25], 4: [26, 35], 5: [36, 48], 6: [49, 58], 7: [59, 80] },
          'PAPER TWO': { 1: [0, 7], 2: [8, 16], 3: [17, 24], 4: [25, 35], 5: [36, 48], 6: [49, 58], 7: [59, 80] },
          FINAL: { 1: [0, 9], 2: [10, 21], 3: [22, 32], 4: [33, 46], 5: [47, 62], 6: [63, 75], 7: [76, 100] }
        },
        timezone2: {
          EXPLORATION: { 1: [0, 2], 2: [3, 5], 3: [6, 8], 4: [9, 11], 5: [12, 14], 6: [15, 17], 7: [18, 20] },
          'PAPER ONE': { 1: [0, 5], 2: [6, 11], 3: [12, 20], 4: [21, 31], 5: [32, 44], 6: [45, 57], 7: [58, 80] },
          'PAPER TWO': { 1: [0, 7], 2: [8, 13], 3: [14, 22], 4: [23, 33], 5: [34, 45], 6: [46, 58], 7: [59, 80] },
          FINAL: { 1: [0, 8], 2: [9, 17], 3: [18, 29], 4: [30, 43], 5: [44, 58], 6: [59, 74], 7: [75, 100] }
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
      'PAPER ONE': 30,
      'PAPER TWO': 30
    },
    SL: {
      'INTERNAL ASSESSMENT (ORAL)': 40,
      'PAPER ONE': 30,
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
  },
  'ENGLISH A LIT AND PERF': {
    HL: {
      'TRANSFORMATIVE PERFORMANCE': 32,
      'PAPER ONE': 30,
      'WRITTEN ASSIGNMENT': 26
    },
    SL: {
      'TRANSFORMATIVE PERFORMANCE': 32,
      'PAPER ONE': 30,
      'WRITTEN ASSIGNMENT': 26
    }
  },
  'MATH ANALYSIS': {
    HL: {
      'PAPER ONE': 110,
      'PAPER TWO': 110,
      'PAPER THREE': 55,
      'EXPLORATION': 20
    },
    SL: {
      'PAPER ONE': 80,
      'PAPER TWO': 80,
      'EXPLORATION': 20
    }
  }
};

const GradePredictionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { subject, userType } = route.params;
  const [selectedLevel, setSelectedLevel] = useState<'HL' | 'SL'>(() => {
    return subject === 'ENGLISH A LIT AND PERF' ? 'SL' : 'HL';
  });
  const [selectedTimezone, setSelectedTimezone] = useState<'timezone0' | 'timezone1' | 'timezone2'>('timezone1');
  const [selectedSeason, setSelectedSeason] = useState<'november' | 'may'>(() => {
    return subject === 'ENGLISH A LIT AND PERF' ? 'may' : 'november';
  });
  const [scores, setScores] = useState<Record<string, number>>({});
  const [predictedGrade, setPredictedGrade] = useState<number | null>(null);

  const homeIconOpacity = useRef(new Animated.Value(1)).current;

  const isCombinationAvailable = (level: 'HL' | 'SL', season: 'november' | 'may', timezone: 'timezone0' | 'timezone1' | 'timezone2') => {
    if (subject === 'ENGLISH A LIT AND PERF') {
      return level === 'SL' && season === 'may' && (timezone === 'timezone1' || timezone === 'timezone2');
    }
    
    if (subject === 'MATH ANALYSIS') {
      if (timezone === 'timezone0') {
        return level === 'HL' && season === 'november';
      }
    }
    
    if (timezone === 'timezone0') {
      return subject === 'MATH ANALYSIS' && level === 'HL' && season === 'november';
    }
    
    return true;
  };

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

    const weightageData = paperWeightages[subject as keyof typeof paperWeightages];
    if (!weightageData || !weightageData[selectedLevel]) return null;
    
    const weights = weightageData[selectedLevel];
    const maxScoresData = paperMaxScores[subject as keyof typeof paperMaxScores];
    if (!maxScoresData || !maxScoresData[selectedLevel]) return null;
    
    const maxScores = maxScoresData[selectedLevel];

    let weightedScore = 0;
    
    Object.keys(scores).forEach(paper => {
      const rawScore = scores[paper] || 0;
      const maxScore = maxScores[paper as keyof typeof maxScores] || 1;
      const weight = weights[paper as keyof typeof weights] || 0;
      
      const percentage = (rawScore / maxScore) * 100;
      weightedScore += percentage * weight;
    });

    weightedScore = Math.round(weightedScore * 100) / 100;

    for (let grade = 1; grade <= 7; grade++) {
      const gradeRange = boundaries[grade as keyof typeof boundaries] as [number, number];
      if (gradeRange && weightedScore >= gradeRange[0] && weightedScore <= gradeRange[1]) {
        return grade;
      }
    }

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
          {subject === 'ENGLISH A LIT AND PERF' && (
            <Text style={{ 
              fontSize: 14, 
              color: '#FFA500', 
              fontFamily: 'ScopeOne-Regular',
              textAlign: 'center',
              marginBottom: 8,
              fontStyle: 'italic'
            }}>
              Note: Only May SL boundaries are available for this subject
            </Text>
          )}
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
              {['HL', 'SL'].map((level) => {
                const isAvailable = isCombinationAvailable(level as 'HL' | 'SL', selectedSeason, selectedTimezone);
                const isSelected = selectedLevel === level;
                
                return (
                  <TouchableOpacity
                    key={level}
                    onPress={() => {
                      if (isAvailable) {
                        setSelectedLevel(level as 'HL' | 'SL');
                      }
                    }}
                    disabled={!isAvailable}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: isSelected ? '#7EC3FF' : (isAvailable ? '#444' : '#333'),
                      backgroundColor: isSelected ? 'rgba(126, 195, 255, 0.2)' : (isAvailable ? 'rgba(68, 68, 68, 0.2)' : 'rgba(51, 51, 51, 0.1)'),
                      opacity: isAvailable ? 1 : 0.5,
                    }}
                  >
                    <Text style={{
                      color: isSelected ? '#7EC3FF' : (isAvailable ? '#B6B6B6' : '#666'),
                      fontFamily: 'ScopeOne-Regular',
                      textAlign: 'center',
                      fontWeight: isSelected ? 'bold' : 'normal'
                    }}>
                      {level}
                      {!isAvailable && subject === 'ENGLISH A LIT AND PERF' ? ' (N/A)' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
                { key: 'timezone0', label: 'Timezone 0' },
                { key: 'timezone1', label: 'Timezone 1' },
                { key: 'timezone2', label: 'Timezone 2' }
              ].map((timezone) => {
                const isAvailable = isCombinationAvailable(selectedLevel, selectedSeason, timezone.key as 'timezone0' | 'timezone1' | 'timezone2');
                const isSelected = selectedTimezone === timezone.key;
                
                return (
                  <TouchableOpacity
                    key={timezone.key}
                    onPress={() => {
                      if (isAvailable) {
                        setSelectedTimezone(timezone.key as 'timezone0' | 'timezone1' | 'timezone2');
                      }
                    }}
                    disabled={!isAvailable}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: isSelected ? '#7EC3FF' : (isAvailable ? '#444' : '#333'),
                      backgroundColor: isSelected ? 'rgba(126, 195, 255, 0.2)' : (isAvailable ? 'rgba(68, 68, 68, 0.2)' : 'rgba(51, 51, 51, 0.1)'),
                      opacity: isAvailable ? 1 : 0.5,
                    }}
                  >
                    <Text style={{
                      color: isSelected ? '#7EC3FF' : (isAvailable ? '#B6B6B6' : '#666'),
                      fontFamily: 'ScopeOne-Regular',
                      textAlign: 'center',
                      fontWeight: isSelected ? 'bold' : 'normal'
                    }}>
                      {timezone.label}
                      {!isAvailable && subject === 'ENGLISH A LIT AND PERF' ? ' (N/A)' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
              ].map((season) => {
                const isAvailable = isCombinationAvailable(selectedLevel, season.key as 'november' | 'may', selectedTimezone);
                const isSelected = selectedSeason === season.key;
                
                return (
                  <TouchableOpacity
                    key={season.key}
                    onPress={() => {
                      if (isAvailable) {
                        setSelectedSeason(season.key as 'november' | 'may');
                      }
                    }}
                    disabled={!isAvailable}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: isSelected ? '#7EC3FF' : (isAvailable ? '#444' : '#333'),
                      backgroundColor: isSelected ? 'rgba(126, 195, 255, 0.2)' : (isAvailable ? 'rgba(68, 68, 68, 0.2)' : 'rgba(51, 51, 51, 0.1)'),
                      opacity: isAvailable ? 1 : 0.5,
                    }}
                  >
                    <Text style={{
                      color: isSelected ? '#7EC3FF' : (isAvailable ? '#B6B6B6' : '#666'),
                      fontFamily: 'ScopeOne-Regular',
                      textAlign: 'center',
                      fontWeight: isSelected ? 'bold' : 'normal'
                    }}>
                      {season.label}
                      {!isAvailable && subject === 'ENGLISH A LIT AND PERF' ? ' (N/A)' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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