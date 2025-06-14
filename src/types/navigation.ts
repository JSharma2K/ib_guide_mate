import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Entry: undefined;
  SubjectGroups: { userType: 'student' | 'teacher' };
  Home: { userType: 'student' | 'teacher'; subjectGroup?: 'english' | 'mathematics' } | undefined;
  SubjectList: undefined;
  SubjectDetail: { subjectId: string; userType: 'student' | 'teacher' };
  ManageGuides: undefined;
  EnglishALiterature: { userType: 'student' | 'teacher' };
  EnglishALiteraturePerformance: { userType: 'student' | 'teacher' };
  EnglishALanguageLiterature: { userType: 'student' | 'teacher' };
  MathAA: { userType: 'student' | 'teacher' };
  MathAI: { userType: 'student' | 'teacher' };
  AddGuide: { guideId?: string };
  GuideDetail: { guideId: string };
  GuideList: undefined;
  ExtendedEssay: { userType: 'student' | 'teacher' };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 