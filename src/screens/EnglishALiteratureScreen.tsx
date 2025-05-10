import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, List, Divider, Searchbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const EnglishALiteratureScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={["#232B4D", "#1A237E", "#121933"]}
        style={styles.gradient}
      >
        <Searchbar
          placeholder="Search content..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>English A: Literature</Text>
            <Text style={styles.subtitle}>Group 1: Studies in Language and Literature</Text>
            
            <List.Section>
              <List.Accordion
                title="Course Overview"
                expanded={expandedSection === 'overview'}
                onPress={() => toggleSection('overview')}
                titleStyle={styles.sectionTitle}
              >
                <View style={styles.sectionContent}>
                  <Text style={styles.content}>
                    English A: Literature is a course that focuses on the study of literary texts. 
                    It is designed for students who are interested in developing their understanding 
                    of literature and literary criticism.
                  </Text>
                </View>
              </List.Accordion>

              <List.Accordion
                title="Subject Essentials"
                expanded={expandedSection === 'essentials'}
                onPress={() => toggleSection('essentials')}
                titleStyle={styles.sectionTitle}
              >
                <View style={styles.sectionContent}>
                  <Text style={styles.subsectionTitle}>Course Overview</Text>
                  <Text style={styles.content}>
                    • Standard Level (SL): 4 works{'\n'}
                    • Higher Level (HL): 6 works{'\n\n'}
                    Areas of Exploration:{'\n'}
                    • Readers-Writers-Texts{'\n'}
                    • Time and Space{'\n'}
                    • Intertextuality
                  </Text>

                  <Text style={styles.subsectionTitle}>Assessment Outline</Text>
                  
                  <Text style={styles.levelTitle}>Standard Level (SL)</Text>
                  <Text style={styles.content}>
                    • Paper 1 (1h 15m): 35%{'\n'}
                    • Paper 2 (1h 45m): 35%{'\n'}
                    • Individual Oral (15 min): 30%
                  </Text>

                  <Text style={styles.levelTitle}>Higher Level (HL)</Text>
                  <Text style={styles.content}>
                    • Paper 1 (2h 15m): 35%{'\n'}
                    • Paper 2 (1h 45m): 25%{'\n'}
                    • Individual Oral: 20%{'\n'}
                    • HL Essay: 20%
                  </Text>

                  <Text style={styles.subsectionTitle}>Rubrics</Text>
                  <Text style={styles.content}>
                    • Paper 1 & 2: Criteria A-D (5-10 marks each){'\n'}
                    • Individual Oral: Criteria A-D (10 marks each){'\n'}
                    • HL Essay: Criteria A-D (5 marks each)
                  </Text>
                </View>
              </List.Accordion>

              <List.Accordion
                title="Prescribed Literature"
                expanded={expandedSection === 'literature'}
                onPress={() => toggleSection('literature')}
                titleStyle={styles.sectionTitle}
              >
                <View style={styles.sectionContent}>
                  <Text style={styles.subsectionTitle}>Works in Translation</Text>
                  <Text style={styles.content}>
                    • Study of works originally written in languages other than English{'\n'}
                    • Focus on cultural and historical context{'\n'}
                    • Development of intercultural understanding
                  </Text>
                  
                  <Text style={styles.subsectionTitle}>Works in English</Text>
                  <Text style={styles.content}>
                    • Study of works written in English{'\n'}
                    • Focus on literary techniques and devices{'\n'}
                    • Development of critical analysis skills
                  </Text>
                </View>
              </List.Accordion>
            </List.Section>
          </Card.Content>
        </Card>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
    fontFamily: 'Montserrat_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#E0D8C3',
    marginBottom: 24,
    fontFamily: 'Montserrat_400Regular',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFD700',
    fontFamily: 'Montserrat_700Bold',
  },
  subsectionTitle: {
    fontSize: 16,
    color: '#FFD700',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Montserrat_700Bold',
  },
  sectionContent: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 8,
  },
  content: {
    fontSize: 16,
    color: '#E0D8C3',
    lineHeight: 24,
    fontFamily: 'Montserrat_400Regular',
  },
  levelTitle: {
    fontSize: 16,
    color: '#FFD700',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Montserrat_700Bold',
    fontStyle: 'italic',
  },
});

export default EnglishALiteratureScreen; 