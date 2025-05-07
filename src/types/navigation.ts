import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  GuideList: undefined;
  GuideDetail: { guideId: string };
  AddGuide: { guideId?: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 