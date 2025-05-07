import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet, Linking } from 'react-native';
import { Text, Card, Button, IconButton } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { guideService, SubjectGuide } from '../services/guideService';
import { RootStackParamList } from '../types/navigation';

type GuideDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GuideDetail'>;
type GuideDetailScreenRouteProp = RouteProp<RootStackParamList, 'GuideDetail'>;

export const GuideDetailScreen = () => {
  const [guide, setGuide] = useState<SubjectGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<GuideDetailScreenNavigationProp>();
  const route = useRoute<GuideDetailScreenRouteProp>();

  useEffect(() => {
    loadGuide();
  }, [route.params.guideId]);

  const loadGuide = async () => {
    try {
      setLoading(true);
      const guideData = await guideService.getGuideById(route.params.guideId);
      setGuide(guideData);
    } catch (error) {
      console.error('Error loading guide:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (guide) {
      try {
        await guideService.deleteGuide(guide.id);
        navigation.goBack();
      } catch (error) {
        console.error('Error deleting guide:', error);
      }
    }
  };

  const handleEdit = () => {
    if (guide) {
      navigation.navigate('AddGuide', { guideId: guide.id });
    }
  };

  const handleOpenPDF = async () => {
    if (guide?.pdfUrl) {
      try {
        await Linking.openURL(guide.pdfUrl);
      } catch (error) {
        console.error('Error opening PDF:', error);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!guide) {
    return (
      <View style={styles.errorContainer}>
        <Text>Guide not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={guide.subjectName}
          subtitle={`Group: ${guide.group}`}
          right={(props) => (
            <View style={styles.headerActions}>
              <IconButton
                {...props}
                icon="pencil"
                onPress={handleEdit}
              />
              <IconButton
                {...props}
                icon="delete"
                onPress={handleDelete}
              />
            </View>
          )}
        />
        <Card.Content>
          <Text style={styles.description}>{guide.description}</Text>
          
          <Text style={styles.sectionTitle}>Topics</Text>
          <View style={styles.topicsContainer}>
            {guide.topics.map((topic, index) => (
              <Text key={index} style={styles.topic}>• {topic}</Text>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Assessment</Text>
          <Text style={styles.content}>{guide.assessment}</Text>

          <Text style={styles.sectionTitle}>Content</Text>
          <Text style={styles.content}>{guide.content}</Text>

          {guide.pdfUrl && (
            <Button
              mode="contained"
              onPress={handleOpenPDF}
              style={styles.pdfButton}
            >
              Open PDF Guide
            </Button>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  card: {
    margin: 16,
  },
  headerActions: {
    flexDirection: 'row',
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  topicsContainer: {
    marginBottom: 16,
  },
  topic: {
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 4,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  pdfButton: {
    marginTop: 16,
  },
}); 