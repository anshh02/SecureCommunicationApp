import React, { useState, useRef, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    FlatList, 
    StatusBar,  
    KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles_folder/ChatScreenStyles';

// Mock Data for different groups
const GROUP_MESSAGES = {
    'Alpha Squad': [
        { id: '1', text: 'Alpha Team, Mission is to check Uri base camp', sender: 'Commander', timestamp: '04:00 AM', isCurrentUser: false },
        { id: '2', text: 'Roger that, sir. All team members ready.', sender: 'You', timestamp: '08:01 AM', isCurrentUser: true },
        { id: '3', text: 'Equipment check complete', sender: 'Alpha-2', timestamp: '08:05 AM', isCurrentUser: false },
        { id: '4', text: 'Good work team, Bravo Team Pakistan ko udaa do', sender: 'You', timestamp: '08:06 AM', isCurrentUser: true },
    ],
    'Command HQ': [
        { id: '1', text: 'All units report status immediately.', sender: 'HQ Control', timestamp: '09:00 AM', isCurrentUser: false },
        { id: '2', text: 'Alpha Squad standing by, all clear.', sender: 'You', timestamp: '09:01 AM', isCurrentUser: true },
        { id: '3', text: 'Bravo Team operational, no issues.', sender: 'Bravo Lead', timestamp: '09:02 AM', isCurrentUser: false },
        { id: '4', text: 'Charlie Unit ready for deployment.', sender: 'Charlie-1', timestamp: '09:03 AM', isCurrentUser: false },
    ],
    'Veterans': [
        { id: '1', text: 'Remember our training days? Good times!', sender: 'Old Timer', timestamp: 'Yesterday', isCurrentUser: false },
        { id: '2', text: 'Those were the days! We\'ve come a long way.', sender: 'You', timestamp: 'Yesterday', isCurrentUser: true },
        { id: '3', text: 'Jai Hind! Hindustan Zindabad Tha, Zindabad Hai, Zindabad Rahega 🇮🇳', sender: 'Veteran Joe', timestamp: 'Yesterday', isCurrentUser: false },
        { id: '4', text: 'Yeh Indian Army hain, hum dushmani mein bhi ek sharafat rakhte hain!!', sender: 'You', timestamp: 'Yesterday', isCurrentUser: true },
    ],
    'Family': [
        { id: '1', text: 'Hope everyone is staying safe out there.', sender: 'Mom', timestamp: 'Yesterday', isCurrentUser: false },
        { id: '2', text: 'All good here, Mom. Don\'t worry about us.', sender: 'You', timestamp: 'Yesterday', isCurrentUser: true },
        { id: '3', text: 'Dinner this Sunday? Everyone\'s invited!', sender: 'Sister', timestamp: 'Yesterday', isCurrentUser: false },
        { id: '4', text: 'Count me in! I\'ll be there.', sender: 'You', timestamp: 'Yesterday', isCurrentUser: true },
    ],
    'Bravo Team': [
        { id: '1', text: 'Operation Jaish-e-mohammed is on go.', sender: 'Bravo Lead', timestamp: '20/09/2025', isCurrentUser: false },
        { id: '2', text: 'Message received. Team is ready for action.', sender: 'You', timestamp: '20/09/2025', isCurrentUser: true },
        { id: '3', text: 'PKMKB', sender: 'Bravo-2', timestamp: '20/09/2025', isCurrentUser: false },
        { id: '4', text: 'Unko Kashmir Chahiye aur Humko unko sar!!!', sender: 'You', timestamp: '20/09/2025', isCurrentUser: true },
    ]
};

// Component for rendering a single message
const MessageBubble = ({ message }) => (
    <View style={[
        styles.messageBubble,
        message.isCurrentUser ? styles.myMessage : styles.otherMessage
    ]}>
        {!message.isCurrentUser && <Text style={styles.senderName}>{message.sender}</Text>}
        <Text style={styles.messageText}>{message.text}</Text>
        <Text style={styles.timestamp}>{message.timestamp}</Text>
    </View>
);

const ChatScreen = ({ navigation, route }) => {
    // Get group name from navigation parameters
    const { groupName } = route.params || { groupName: 'Secure Group' };
    
    // Get group-specific messages or default to empty array
    const initialMessages = GROUP_MESSAGES[groupName] || [];
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const flatListRef = useRef(); // Ref for auto-scrolling

    // Scroll to the bottom when messages change
    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg = {
                id: String(messages.length + 1), // Simple ID generation for mock data
                text: newMessage.trim(),
                sender: 'You', // Simulate current user
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                isCurrentUser: true,
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>{'<'}</Text>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.groupTitle}>{groupName}</Text>
                    <Text style={styles.onlineStatus}>online</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionText}>📞</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.moreOptionsButton}>
                        <Text style={styles.moreOptionsText}>⋮</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Message List */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item }) => <MessageBubble message={item} />}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messageListContent}
                // Only scroll to end if there's content; avoid error on empty list
                onContentSizeChange={() => messages.length > 0 && flatListRef.current.scrollToEnd({ animated: true })} 
            />

            {/* Message Input Area */}
            <KeyboardAvoidingView 
                behavior="padding"
                keyboardVerticalOffset={0}
                style={styles.inputContainer}
            >
                <TextInput
                    style={styles.messageInput}
                    placeholder="Type a secure message..."
                    placeholderTextColor="#8A8A8A"
                    value={newMessage}
                    onChangeText={setNewMessage}
                    multiline
                />
                <TouchableOpacity 
                    style={styles.sendButton} 
                    onPress={handleSendMessage}
                    disabled={!newMessage.trim()} 
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatScreen;