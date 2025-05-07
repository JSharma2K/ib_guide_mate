import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Text, Card, Searchbar, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { guideService, SubjectGuide } from '../services/guideService';
import { RootStackParamList } from '../types/navigation';

type GuideListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GuideList'>;

export const GuideListScreen = () => {
  const [guides, setGuides] = useState<SubjectGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<GuideListScreenNavigationProp>();

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    try {
      setLoading(true);
      const allGuides = await guideService.getAllGuides();
      setGuides(allGuides);
    } catch (error) {
      console.error('Error loading guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      loadGuides();
    } else {
      const searchResults = await guideService.searchGuides(query);
      setGuides(searchResults);
    }
  };

  const renderGuideItem = ({ item }: { item: SubjectGuide }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('GuideDetail', { guideId: item.id })}
    >
      <Card.Title
        title={item.subjectName}
        subtitle={`Group: ${item.group}`}
      />
      <Card.Content>
        <Text numberOfLines={2}>{item.description}</Text>
        <Text style={styles.lastUpdated}>
          Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
        </Text>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search guides..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={guides}
        renderItem={renderGuideItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddGuide')}
      />
    </View>
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
  searchBar: {
    margin: 16,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  lastUpdated: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 