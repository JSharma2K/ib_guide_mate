import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { guideService, SubjectGuide } from '../services/guideService';
import { RootStackParamList } from '../types/navigation';

type AddGuideScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddGuide'>;
type AddGuideScreenRouteProp = RouteProp<RootStackParamList, 'AddGuide'>;

type GuideFormData = Omit<SubjectGuide, 'id' | 'lastUpdated'>;

export const AddGuideScreen = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<GuideFormData>({
    subjectName: '',
    group: '',
    description: '',
    topics: [],
    assessment: '',
    content: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof GuideFormData, string>>>({});
  const navigation = useNavigation<AddGuideScreenNavigationProp>();
  const route = useRoute<AddGuideScreenRouteProp>();

  useEffect(() => {
    if (route.params?.guideId) {
      loadGuide();
    }
  }, [route.params?.guideId]);

  const loadGuide = async () => {
    try {
      setLoading(true);
      const guide = await guideService.getGuideById(route.params.guideId!);
      if (guide) {
        const { id, lastUpdated, ...guideData } = guide;
        setFormData(guideData);
      }
    } catch (error) {
      console.error('Error loading guide:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof GuideFormData, string>> = {};
    if (!formData.subjectName) newErrors.subjectName = 'Subject name is required';
    if (!formData.group) newErrors.group = 'Group is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.topics?.length) newErrors.topics = 'At least one topic is required';
    if (!formData.assessment) newErrors.assessment = 'Assessment information is required';
    if (!formData.content) newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      if (route.params?.guideId) {
        await guideService.updateGuide(route.params.guideId, formData);
      } else {
        await guideService.addGuide(formData);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving guide:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Subject Name"
        value={formData.subjectName}
        onChangeText={(text) => setFormData({ ...formData, subjectName: text })}
        error={!!errors.subjectName}
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.subjectName}>
        {errors.subjectName}
      </HelperText>

      <TextInput
        label="Group"
        value={formData.group}
        onChangeText={(text) => setFormData({ ...formData, group: text })}
        error={!!errors.group}
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.group}>
        {errors.group}
      </HelperText>

      <TextInput
        label="Description"
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        error={!!errors.description}
        multiline
        numberOfLines={3}
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.description}>
        {errors.description}
      </HelperText>

      <TextInput
        label="Topics (one per line)"
        value={formData.topics?.join('\n')}
        onChangeText={(text) => setFormData({ ...formData, topics: text.split('\n').filter(t => t.trim()) })}
        error={!!errors.topics}
        multiline
        numberOfLines={4}
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.topics}>
        {errors.topics}
      </HelperText>

      <TextInput
        label="Assessment"
        value={formData.assessment}
        onChangeText={(text) => setFormData({ ...formData, assessment: text })}
        error={!!errors.assessment}
        multiline
        numberOfLines={4}
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.assessment}>
        {errors.assessment}
      </HelperText>

      <TextInput
        label="Content"
        value={formData.content}
        onChangeText={(text) => setFormData({ ...formData, content: text })}
        error={!!errors.content}
        multiline
        numberOfLines={8}
        style={styles.input}
      />
      <HelperText type="error" visible={!!errors.content}>
        {errors.content}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        {route.params?.guideId ? 'Update Guide' : 'Add Guide'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  submitButton: {
    marginTop: 16,
    marginBottom: 32,
  },
}); 