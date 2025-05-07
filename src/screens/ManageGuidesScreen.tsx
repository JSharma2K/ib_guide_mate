import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Card, TextInput, Title, Paragraph, IconButton } from 'react-native-paper';
import { guideService, SubjectGuide } from '../services/guideService';

const ManageGuidesScreen = () => {
  const [guides, setGuides] = useState<SubjectGuide[]>([]);
  const [newGuide, setNewGuide] = useState<Omit<SubjectGuide, 'id' | 'lastUpdated'>>({
    subjectName: '',
    group: '',
    description: '',
    topics: [],
    assessment: '',
    content: ''
  });

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    const loadedGuides = await guideService.getAllGuides();
    setGuides(loadedGuides);
  };

  const handleAddGuide = async () => {
    if (newGuide.subjectName && newGuide.content) {
      await guideService.addGuide(newGuide);
      setNewGuide({
        subjectName: '',
        group: '',
        description: '',
        topics: [],
        assessment: '',
        content: ''
      });
      loadGuides();
    }
  };

  const handleDeleteGuide = async (id: string) => {
    await guideService.deleteGuide(id);
    loadGuides();
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Add New Guide</Title>
          <TextInput
            label="Subject Name"
            value={newGuide.subjectName}
            onChangeText={(text) => setNewGuide({ ...newGuide, subjectName: text })}
            style={styles.input}
          />
          <TextInput
            label="Group"
            value={newGuide.group}
            onChangeText={(text) => setNewGuide({ ...newGuide, group: text })}
            style={styles.input}
          />
          <TextInput
            label="Description"
            value={newGuide.description}
            onChangeText={(text) => setNewGuide({ ...newGuide, description: text })}
            style={styles.input}
            multiline
          />
          <TextInput
            label="Topics (comma-separated)"
            value={newGuide.topics.join(', ')}
            onChangeText={(text) => setNewGuide({ ...newGuide, topics: text.split(',').map(t => t.trim()) })}
            style={styles.input}
          />
          <TextInput
            label="Assessment"
            value={newGuide.assessment}
            onChangeText={(text) => setNewGuide({ ...newGuide, assessment: text })}
            style={styles.input}
          />
          <TextInput
            label="Content"
            value={newGuide.content}
            onChangeText={(text) => setNewGuide({ ...newGuide, content: text })}
            style={styles.input}
            multiline
            numberOfLines={4}
          />
          <Button mode="contained" onPress={handleAddGuide} style={styles.button}>
            Add Guide
          </Button>
        </Card.Content>
      </Card>

      {guides.map((guide) => (
        <Card key={guide.id} style={styles.card}>
          <Card.Content>
            <View style={styles.guideHeader}>
              <Title>{guide.subjectName}</Title>
              <IconButton
                icon="delete"
                size={24}
                onPress={() => handleDeleteGuide(guide.id)}
              />
            </View>
            <Paragraph>Group: {guide.group}</Paragraph>
            <Paragraph>Description: {guide.description}</Paragraph>
            <Paragraph>Topics: {guide.topics.join(', ')}</Paragraph>
            <Paragraph>Assessment: {guide.assessment}</Paragraph>
            <Paragraph>Last Updated: {new Date(guide.lastUpdated).toLocaleDateString()}</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#2196F3',
  },
  guideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default ManageGuidesScreen; 