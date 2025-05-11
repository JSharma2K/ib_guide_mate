import { MD3DarkTheme } from 'react-native-paper';
import { ColorValue } from 'react-native';

export const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FFD700',
    background: '#181A20',
    surface: '#22242C',
    text: '#B6B6B6',
    secondary: '#22304A',
  },
  fonts: {
    regular: {
      fontFamily: 'Inter_400Regular',
    },
    medium: {
      fontFamily: 'Inter_400Regular',
    },
    light: {
      fontFamily: 'Inter_300Light',
    },
    thin: {
      fontFamily: 'Inter_300Light',
    },
    bold: {
      fontFamily: 'Inter_700Bold',
    },
  },
};

export const gradientColors = {
  primary: ["#22304A", "#181A20"] as [ColorValue, ColorValue],
  secondary: ["#232B4D", "#1A237E", "#121933"] as [ColorValue, ColorValue, ColorValue],
};

export const styles = {
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#22242C',
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#B6B6B6',
    fontFamily: 'Inter_400Regular',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#FFD700',
  },
  subsectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFD700',
    marginTop: 16,
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    color: '#B6B6B6',
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
  },
  searchBar: {
    backgroundColor: '#22242C',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  levelTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#FFD700',
    marginTop: 12,
    marginBottom: 4,
  },
  criterionTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#FFD700',
    marginTop: 12,
    marginBottom: 4,
  },
  criterionDescription: {
    fontSize: 14,
    color: '#B6B6B6',
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
    marginBottom: 8,
  },
  sectionContent: {
    padding: 16,
    backgroundColor: 'rgba(34, 48, 74, 0.7)',
    borderRadius: 8,
  },
  criterionContainer: {
    marginBottom: 16,
  },
  highlightedText: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    color: '#FFD700',
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  topic: {
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 4,
  },
  pdfButton: {
    marginTop: 16,
  },
}; 