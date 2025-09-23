import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StatusBar, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles_folder/GroupListScreenStyles'; // Ensure path is correct

// Mock Data
const MOCK_GROUPS = [
    { id: '1', name: 'Alpha Squad', lastMessage: 'Bravo pakistan ko udaa do', timestamp: '10:42 AM', unreadCount: 2 },
    { id: '2', name: 'Command HQ', lastMessage: 'Hows the josh', timestamp: '9:15 AM', unreadCount: 0 },
    { id: '3', name: 'Veterans', lastMessage: 'Jai Hind!!!', timestamp: 'Yesterday', unreadCount: 5 },
    { id: '4', name: 'Family', lastMessage: 'Great, thank you!', timestamp: 'Yesterday', unreadCount: 0 },
    { id: '5', name: 'Bravo Team', lastMessage: 'Pakistan ki aesi ki taisi.', timestamp: '20/09/2025', unreadCount: 0 },
];

// Component for rendering each item in the list
const GroupItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.groupItemContainer} onPress={onPress}>
        <View style={styles.groupIcon}>
            <Text style={styles.groupIconText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.groupTextContainer}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        </View>
        <View style={styles.groupMetaContainer}>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
            {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
            )}
        </View>
    </TouchableOpacity>
);

const GroupListScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredGroups, setFilteredGroups] = useState(MOCK_GROUPS);

    const handleSearch = (text) => {
        setSearchQuery(text);
        if (text) {
            const filteredData = MOCK_GROUPS.filter(group => 
                group.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredGroups(filteredData);
        } else {
            setFilteredGroups(MOCK_GROUPS);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Secure Groups</Text>
                {/* Navigates to Login Screen - adjust as per your actual logout logic */}
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.logoutIcon}>🏠</Text>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search groups..."
                    placeholderTextColor="#8A8A8A"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            {/* Group List */}
            <FlatList
                data={filteredGroups}
                renderItem={({ item }) => (
                    <GroupItem 
                        item={item} 

                        onPress={() => navigation.navigate('Chat', { groupName: item.name })}
                    />
                )}
                keyExtractor={item => item.id}
                style={styles.listContainer}
            />
        </SafeAreaView>
    );
};

export default GroupListScreen;