import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  SubjectList: undefined;
  SubjectDetail: { subjectId: string };
  ManageGuides: undefined;
  EnglishALiterature: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 