import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StatusBar,
    KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles_folder/ChatScreenStyles';

// Mock Data for messages
const MOCK_MESSAGES = [
    { id: '1', text: 'Hi everyone, is the operational update confirmed?', sender: 'John Doe', timestamp: '10:00 AM', isCurrentUser: false },
    { id: '2', text: 'Yes, it is confirmed. We proceed as planned.', sender: 'You', timestamp: '10:01 AM', isCurrentUser: true },
    { id: '3', text: 'Great. What about the logistics for the field team?', sender: 'Jane Smith', timestamp: '10:05 AM', isCurrentUser: false },
    { id: '4', text: 'Logistics are being finalized by Bravo Team. Expect an update shortly.', sender: 'You', timestamp: '10:06 AM', isCurrentUser: true },
];

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
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const flatListRef = useRef();

    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg = {
                id: String(messages.length + 1),
                text: newMessage.trim(),
                sender: 'You',
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