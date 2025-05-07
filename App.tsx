import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

// Import screens (we'll create these next)
import HomeScreen from './src/screens/HomeScreen';
import SubjectListScreen from './src/screens/SubjectListScreen';
import SubjectDetailScreen from './src/screens/SubjectDetailScreen';
import ManageGuidesScreen from './src/screens/ManageGuidesScreen';

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
        <NavigationContainer theme={DarkTheme}>
          <Stack.Navigator
            initialRouteName="Home"
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
                backgroundColor: theme.colors.background,
              },
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ 
                title: 'IB Guidemate',
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
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
} 