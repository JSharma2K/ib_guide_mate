import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { List, Searchbar, Divider } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  SubjectList: undefined;
  SubjectDetail: { subjectId: string };
};

type SubjectListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SubjectList'>;
};

// Sample subject data - in a real app, this would come from an API or database
const subjects = [
  { id: '1', name: 'Mathematics', group: 'Group 5' },
  { id: '2', name: 'Physics', group: 'Group 4' },
  { id: '3', name: 'Chemistry', group: 'Group 4' },
  { id: '4', name: 'Biology', group: 'Group 4' },
  { id: '5', name: 'English', group: 'Group 1' },
  { id: '6', name: 'History', group: 'Group 3' },
  { id: '7', name: 'Economics', group: 'Group 3' },
  { id: '8', name: 'Visual Arts', group: 'Group 6' },
];

const SubjectListScreen: React.FC<SubjectListScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSubjects, setFilteredSubjects] = useState(subjects);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = subjects.filter(subject =>
      subject.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSubjects(filtered);
  };

  const renderItem = ({ item }: { item: typeof subjects[0] }) => (
    <List.Item
      title={item.name}
      description={item.group}
      onPress={() => navigation.navigate('SubjectDetail', { subjectId: item.id })}
      right={props => <List.Icon {...props} icon="chevron-right" />}
    />
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search subjects"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        data={filteredSubjects}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Divider />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    margin: 16,
  },
});

export default SubjectListScreen; 