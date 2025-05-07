import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, IconButton } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  SubjectList: undefined;
  SubjectDetail: { subjectId: string };
};

type SubjectDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SubjectDetail'>;
  route: RouteProp<RootStackParamList, 'SubjectDetail'>;
};

// Sample subject details - in a real app, this would come from an API or database
const subjectDetails = {
  '1': {
    name: 'Mathematics',
    group: 'Group 5',
    description: 'The IB Mathematics course focuses on developing mathematical knowledge, concepts, and principles.',
    topics: [
      'Algebra',
      'Functions and equations',
      'Circular functions and trigonometry',
      'Vectors',
      'Statistics and probability',
      'Calculus'
    ],
    assessment: 'Internal assessment (20%), External assessment (80%)'
  },
  // Add more subject details as needed
};

const SubjectDetailScreen: React.FC<SubjectDetailScreenProps> = ({ route }) => {
  const { subjectId } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const subject = subjectDetails[subjectId as keyof typeof subjectDetails];

  if (!subject) {
    return (
      <View style={styles.container}>
        <Title>Subject not found</Title>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title style={styles.title}>{subject.name}</Title>
            <IconButton
              icon={isFavorite ? 'star' : 'star-outline'}
              size={24}
              onPress={() => setIsFavorite(!isFavorite)}
            />
          </View>
          <Paragraph style={styles.group}>{subject.group}</Paragraph>
          <Paragraph style={styles.description}>{subject.description}</Paragraph>
          
          <Title style={styles.sectionTitle}>Topics</Title>
          {subject.topics.map((topic, index) => (
            <Paragraph key={index} style={styles.topic}>
              • {topic}
            </Paragraph>
          ))}

          <Title style={styles.sectionTitle}>Assessment</Title>
          <Paragraph>{subject.assessment}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={() => {/* Handle download guide */}}
            style={styles.button}
          >
            Download Guide
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  group: {
    color: '#666',
    marginBottom: 16,
  },
  description: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  topic: {
    marginLeft: 8,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#2196F3',
  },
});

export default SubjectDetailScreen; 