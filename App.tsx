import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

// Import screens (we'll create these next)
import HomeScreen from './src/screens/HomeScreen';
import SubjectGroupsScreen from './src/screens/SubjectGroupsScreen';
import SubjectListScreen from './src/screens/SubjectListScreen';
import SubjectDetailScreen from './src/screens/SubjectDetailScreen';
import ManageGuidesScreen from './src/screens/ManageGuidesScreen';
import EnglishALiteratureScreen from './src/screens/EnglishALiteratureScreen';
import EnglishALiteraturePerformanceScreen from './src/screens/EnglishALiteraturePerformanceScreen';
import EnglishALanguageLiteratureScreen from './src/screens/EnglishALanguageLiteratureScreen';
import LanguageAcquisitionScreen from './src/screens/LanguageAcquisitionScreen';
import LanguageBScreen from './src/screens/LanguageBScreen';
import LanguageAbInitioScreen from './src/screens/LanguageAbInitioScreen';
import MathAAScreen from './src/screens/MathAAScreen';
import MathAIScreen from './src/screens/MathAIScreen';
import EntryScreen from './src/screens/EntryScreen';
import ExtendedEssayScreen from './src/screens/ExtendedEssayScreen';
import GradePredictionScreen from './src/screens/GradePredictionScreen';
import ClassicalLanguagesScreen from './src/screens/ClassicalLanguagesScreen';
import IndividualsAndSocietiesScreen from './src/screens/IndividualsAndSocietiesScreen';
import PhilosophyScreen from './src/screens/PhilosophyScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import GlobalPoliticsScreen from './src/screens/GlobalPoliticsScreen';
import GeographyScreen from './src/screens/GeographyScreen';
import EnvironmentalSystemsScreen from './src/screens/EnvironmentalSystemsScreen';
import EconomicsScreen from './src/screens/EconomicsScreen';
import DigitalSocietyScreen from './src/screens/DigitalSocietyScreen';
import SciencesScreen from './src/screens/SciencesScreen';
import BiologyScreen from './src/screens/BiologyScreen';
import ChemistryScreen from './src/screens/ChemistryScreen';
import ComputerScienceScreen from './src/screens/ComputerScienceScreen';
import PhysicsScreen from './src/screens/PhysicsScreen';
import SportsExerciseHealthScienceScreen from './src/screens/SportsExerciseHealthScienceScreen';
import TheArtsScreen from './src/screens/TheArtsScreen';
import DanceScreen from './src/screens/DanceScreen';

const { DarkTheme } = adaptNavigationTheme({
  reactNavigationDark: NavigationDarkTheme,
});

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#1A237E', // Dark blue
    secondary: '#FFD700', // Gold
    background: '#121212',
    surface: '#1E1E1E',
    error: '#CF6679',
    onPrimary: '#FFD700', // Gold text on primary
    onSecondary: '#1A237E', // Dark blue text on secondary
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    onError: '#000000',
  },
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer
          theme={{
            ...DarkTheme,
            colors: {
              ...DarkTheme.colors,
              background: '#181A20',
            },
          }}
        >
          <Stack.Navigator
            initialRouteName="Entry"
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: theme.colors.onPrimary,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerShadowVisible: false,
              contentStyle: {
                backgroundColor: '#181A20',
              },
              animation: 'fade',
            }}
          >
            <Stack.Screen 
              name="Entry" 
              component={EntryScreen} 
              options={{ title: 'IB GuideMate', headerShown: false }}
            />
            <Stack.Screen 
              name="SubjectGroups" 
              component={SubjectGroupsScreen} 
              options={{ title: 'Subject Groups', headerShown: false }}
            />
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ 
                title: 'Subjects',
                headerShown: false,
              }}
            />
            <Stack.Screen 
              name="SubjectList" 
              component={SubjectListScreen} 
              options={{ title: 'Subjects' }}
            />
            <Stack.Screen 
              name="SubjectDetail" 
              component={SubjectDetailScreen} 
              options={{ title: 'Subject Details' }}
            />
            <Stack.Screen 
              name="ManageGuides" 
              component={ManageGuidesScreen} 
              options={{ title: 'Manage Guides' }}
            />
            <Stack.Screen 
              name="EnglishALiterature" 
              component={EnglishALiteratureScreen} 
              options={{ 
                title: 'English A: Literature',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen 
              name="EnglishALiteraturePerformance" 
              component={EnglishALiteraturePerformanceScreen} 
              options={{ 
                title: 'English A: Literature and Performance',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen 
              name="EnglishALanguageLiterature" 
              component={EnglishALanguageLiteratureScreen} 
              options={{ 
                title: 'English A: Language and Literature',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen 
              name="LanguageAcquisition" 
              component={LanguageAcquisitionScreen} 
              options={{ 
                title: 'Language Acquisition',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen 
              name="LanguageB" 
              component={LanguageBScreen} 
              options={{ 
                title: 'Language B',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen 
              name="LanguageAbInitio" 
              component={LanguageAbInitioScreen} 
              options={{ 
                title: 'Language Ab Initio',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen 
              name="ClassicalLanguages" 
              component={ClassicalLanguagesScreen} 
              options={{ 
                title: 'Classical Languages',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen 
              name="IndividualsAndSocieties" 
              component={IndividualsAndSocietiesScreen} 
              options={{ 
                title: 'Individuals and Societies',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen 
              name="Philosophy" 
              component={PhilosophyScreen} 
              options={{ 
                title: 'Philosophy',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen 
              name="History" 
              component={HistoryScreen} 
              options={{ 
                title: 'History',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen 
              name="GlobalPolitics" 
              component={GlobalPoliticsScreen} 
              options={{ 
                title: 'Global Politics',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen 
              name="Geography" 
              component={GeographyScreen} 
              options={{ 
                title: 'Geography',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen 
              name="EnvironmentalSystems" 
              component={EnvironmentalSystemsScreen} 
              options={{ 
                title: 'Environmental Systems',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen 
              name="Economics" 
              component={EconomicsScreen} 
              options={{ 
                title: 'Economics',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen 
              name="MathAA" 
              component={MathAAScreen} 
              options={{ 
                title: 'Mathematics: Analysis and Approaches',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen 
              name="MathAI" 
              component={MathAIScreen} 
              options={{ 
                title: 'Mathematics: Applications and Interpretation',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen
              name="ExtendedEssay"
              component={ExtendedEssayScreen}
              options={{
                title: 'Extended Essay',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen
              name="GradePrediction"
              component={GradePredictionScreen}
              options={{
                title: 'Grade Prediction',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen
              name="DigitalSociety"
              component={DigitalSocietyScreen}
              options={{
                title: 'Digital Society',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen
              name="Sciences"
              component={SciencesScreen}
              options={{
                title: 'Sciences',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen
              name="Biology"
              component={BiologyScreen}
              options={{
                title: 'Biology',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen
              name="Chemistry"
              component={ChemistryScreen}
              options={{
                title: 'Chemistry',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen
              name="ComputerScience"
              component={ComputerScienceScreen}
              options={{
                title: 'Computer Science',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen
              name="Physics"
              component={PhysicsScreen}
              options={{
                title: 'Physics',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen
              name="SportsExerciseHealthScience"
              component={SportsExerciseHealthScienceScreen}
              options={{
                title: 'Sports, Exercise and Health Science',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen
              name="TheArts"
              component={TheArtsScreen}
              options={{
                title: 'The Arts',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
            <Stack.Screen
              name="Dance"
              component={DanceScreen}
              options={{
                title: 'Dance',
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
} 