import { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles_folder/ChatScreenStyles';

import { addMessage, getGroupMessages, markGroupRead, subscribe as subscribeStore } from '../messageStore';

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
    
    const [messages, setMessages] = useState(() => getGroupMessages(groupName));
    const [newMessage, setNewMessage] = useState('');
    const flatListRef = useRef(); // Ref for auto-scrolling

    // Scroll to the bottom when messages change
    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    useEffect(() => {
        // Mark read and subscribe to updates for this group
        markGroupRead(groupName);
        const unsub = subscribeStore(() => {
            setMessages(getGroupMessages(groupName));
        });
        return () => unsub();
    }, [groupName]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        addMessage(groupName, { text: newMessage.trim(), sender: 'You', isCurrentUser: true });
        setNewMessage('');
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
                                ListEmptyComponent={() => (
                                    <View style={{ padding: 24, alignItems: 'center' }}>
                                        <Text style={{ color: '#888' }}>No messages yet. Start the conversation.</Text>
                                    </View>
                                )}
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