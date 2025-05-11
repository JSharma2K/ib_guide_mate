import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  SubjectList: undefined;
  SubjectDetail: { subjectId: string };
  ManageGuides: undefined;
  EnglishALiterature: undefined;
  MathAA: undefined;
  MathAI: undefined;
  AddGuide: { guideId?: string };
  GuideDetail: { guideId: string };
  GuideList: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 