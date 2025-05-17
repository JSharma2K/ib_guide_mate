import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Entry: undefined;
  Home: { userType: 'student' | 'teacher' } | undefined;
  SubjectList: undefined;
  SubjectDetail: { subjectId: string; userType: 'student' | 'teacher' };
  ManageGuides: undefined;
  EnglishALiterature: { userType: 'student' | 'teacher' };
  MathAA: { userType: 'student' | 'teacher' };
  MathAI: { userType: 'student' | 'teacher' };
  AddGuide: { guideId?: string };
  GuideDetail: { guideId: string };
  GuideList: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 