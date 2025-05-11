import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet, Linking } from 'react-native';
import { Text, Card, Button, IconButton } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { guideService, SubjectGuide } from '../services/guideService';
import { RootStackParamList } from '../types/navigation';
import { theme } from '../theme/theme';

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
      <View style={theme.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!guide) {
    return (
      <View style={theme.errorContainer}>
        <Text>Guide not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={theme.container}>
      <Card style={theme.card}>
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
          <Text style={theme.description}>{guide.description}</Text>
          
          <Text style={theme.sectionTitle}>Topics</Text>
          <View style={styles.topicsContainer}>
            {guide.topics.map((topic, index) => (
              <Text key={index} style={theme.topic}>• {topic}</Text>
            ))}
          </View>

          <Text style={theme.sectionTitle}>Assessment</Text>
          <Text style={theme.content}>{guide.assessment}</Text>

          <Text style={theme.sectionTitle}>Content</Text>
          <Text style={theme.content}>{guide.content}</Text>

          {guide.pdfUrl && (
            <Button
              mode="contained"
              onPress={handleOpenPDF}
              style={theme.pdfButton}
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
  headerActions: {
    flexDirection: 'row',
  },
  topicsContainer: {
    marginBottom: 16,
  },
}); 