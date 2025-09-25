import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getGroupsArray, seedGroups, subscribe as subscribeStore } from '../messageStore';
import { ensureWsConnected, wsManager } from '../wsManager';
import styles from './styles_folder/GroupListScreenStyles'; // Ensure path is correct

// Initial mock group seeds (will be managed by messageStore after seeding)
const INITIAL_GROUPS = [
    {
        id: '1', name: 'Alpha Squad', unreadCount: 0,
        messages: [
            { text: 'Alpha Team, Mission is to check Uri base camp', sender: 'Commander', timestamp: '04:00 AM' },
            { text: 'Roger that, sir. All team members ready.', sender: 'You', timestamp: '08:01 AM', isCurrentUser: true },
            { text: 'Equipment check complete', sender: 'Alpha-2', timestamp: '08:05 AM' },
            { text: 'Good work team, Bravo Team Pakistan ko udaa do', sender: 'You', timestamp: '08:06 AM', isCurrentUser: true }
        ]
    },
    {
        id: '2', name: 'Command HQ', unreadCount: 0,
        messages: [
            { text: 'All units report status immediately.', sender: 'HQ Control', timestamp: '09:00 AM' },
            { text: 'Alpha Squad standing by, all clear.', sender: 'You', timestamp: '09:01 AM', isCurrentUser: true },
            { text: 'Bravo Team operational, no issues.', sender: 'Bravo Lead', timestamp: '09:02 AM' },
            { text: 'Charlie Unit ready for deployment.', sender: 'Charlie-1', timestamp: '09:03 AM' }
        ]
    },
    {
        id: '3', name: 'Veterans', unreadCount: 0,
        messages: [
            { text: 'Remember our training days? Good times!', sender: 'Old Timer', timestamp: 'Yesterday' },
            { text: "Those were the days! We've come a long way.", sender: 'You', timestamp: 'Yesterday', isCurrentUser: true },
            { text: 'Jai Hind! Hindustan Zindabad Tha, Zindabad Hai, Zindabad Rahega 🇮🇳', sender: 'Veteran Joe', timestamp: 'Yesterday' },
            { text: 'Yeh Indian Army hain, hum dushmani mein bhi ek sharafat rakhte hain!!', sender: 'You', timestamp: 'Yesterday', isCurrentUser: true }
        ]
    },
    {
        id: '4', name: 'Family', unreadCount: 0,
        messages: [
            { text: 'Hope everyone is staying safe out there.', sender: 'Mom', timestamp: 'Yesterday' },
            { text: "All good here, Mom. Don't worry about us.", sender: 'You', timestamp: 'Yesterday', isCurrentUser: true },
            { text: "Dinner this Sunday? Everyone's invited!", sender: 'Sister', timestamp: 'Yesterday' },
            { text: "Count me in! I'll be there.", sender: 'You', timestamp: 'Yesterday', isCurrentUser: true }
        ]
    },
    {
        id: '5', name: 'Bravo Team', unreadCount: 0,
        messages: [
            { text: 'Operation Jaish-e-mohammed is on go.', sender: 'Bravo Lead', timestamp: '20/09/2025' },
            { text: 'Message received. Team is ready for action.', sender: 'You', timestamp: '20/09/2025', isCurrentUser: true },
            { text: 'PKMKB', sender: 'Bravo-2', timestamp: '20/09/2025' },
            { text: 'Unko Kashmir Chahiye aur Humko unko sar!!!', sender: 'You', timestamp: '20/09/2025', isCurrentUser: true }
        ]
    }
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
        const [groups, setGroups] = useState(() => {
            seedGroups(INITIAL_GROUPS);
            return getGroupsArray();
        });
        const [filteredGroups, setFilteredGroups] = useState(groups);
    const [wsStatus, setWsStatus] = useState(wsManager.status);
    const [connecting, setConnecting] = useState(false);

    useEffect(() => {
        // Subscribe to status changes
        const unsub = wsManager.onStatus(setWsStatus);
        // Kick off a connection attempt when screen loads
        reconnectIfNeeded();
        return unsub;
    }, []);

    const reconnectIfNeeded = async () => {
        if (wsManager.status === 'OPEN' || wsManager.status === 'CONNECTING') return;
        setConnecting(true);
        try {
            await ensureWsConnected(4000);
        } catch (e) {
            console.log('WS reconnect attempt failed:', e.message);
        } finally {
            setConnecting(false);
        }
    };

        useEffect(() => {
            // Subscribe to message store updates
            const unsubStore = subscribeStore(() => {
                const arr = getGroupsArray();
                setGroups(arr);
                // Apply current search filter if any
                if (searchQuery) {
                    setFilteredGroups(arr.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase())));
                } else {
                    setFilteredGroups(arr);
                }
            });
            return () => { unsubStore(); };
        }, [searchQuery]);

        const handleSearch = (text) => {
            setSearchQuery(text);
            if (text) {
                setFilteredGroups(groups.filter(g => g.name.toLowerCase().includes(text.toLowerCase())));
            } else {
                setFilteredGroups(groups);
            }
        };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.menuIcon}>☰</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Secure Groups</Text>
                <View style={styles.headerSpacer} />
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

            {/* Connection status / reconnect UI */}
            <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
                {wsStatus !== 'OPEN' && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#ffb347' }}>WS: {wsStatus}</Text>
                        <TouchableOpacity
                            onPress={reconnectIfNeeded}
                            disabled={connecting || wsStatus === 'CONNECTING'}
                            style={{ backgroundColor: '#444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 }}
                        >
                            {connecting || wsStatus === 'CONNECTING' ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={{ color: '#fff' }}>Reconnect</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
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
                            ListEmptyComponent={() => (
                                <View style={{ padding: 32, alignItems: 'center' }}>
                                    <Text style={{ color: '#999' }}>No groups found.</Text>
                                </View>
                            )}
                        />
        </SafeAreaView>
    );
};

export default GroupListScreen;