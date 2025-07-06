import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Entry: { userType: 'student' | 'teacher' };
  SubjectGroups: { userType: 'student' | 'teacher' };
  Home: { userType: 'student' | 'teacher'; subjectGroup?: 'english' | 'mathematics' };
  SubjectList: undefined;
  SubjectDetail: { subjectId: string; userType: 'student' | 'teacher' };
  ManageGuides: undefined;
  EnglishALiterature: { userType: 'student' | 'teacher' };
  EnglishALanguageLiterature: { userType: 'student' | 'teacher' };
  EnglishALiteraturePerformance: { userType: 'student' | 'teacher' };
  LanguageAcquisition: { userType: 'student' | 'teacher' };
  LanguageB: { userType: 'student' | 'teacher' };
  LanguageAbInitio: { userType: 'student' | 'teacher' };
  ClassicalLanguages: { userType: 'student' | 'teacher' };
  IndividualsAndSocieties: { userType: 'student' | 'teacher' };
  Philosophy: { userType: 'student' | 'teacher' };
  History: { userType: 'student' | 'teacher' };
  GlobalPolitics: { userType: 'student' | 'teacher' };
  Geography: { userType: 'student' | 'teacher' };
  EnvironmentalSystems: { userType: 'student' | 'teacher' };
  Economics: { userType: 'student' | 'teacher' };
  DigitalSociety: { userType: 'student' | 'teacher' };
  Sciences: { userType: 'student' | 'teacher' };
  Biology: { userType: 'student' | 'teacher' };
  MathAA: { userType: 'student' | 'teacher' };
  MathAI: { userType: 'student' | 'teacher' };
  ExtendedEssay: { userType: 'student' | 'teacher' };
  GradePrediction: { subject: string; userType: 'student' | 'teacher' };
  AddGuide: undefined;
  GuideList: undefined;
  GuideDetail: { guideId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 