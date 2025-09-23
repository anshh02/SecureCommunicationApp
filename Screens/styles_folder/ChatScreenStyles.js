import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2C2C2C', // Dark background
    },
    // Header Styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        backgroundColor: '#3D3D3D', 
        borderBottomWidth: 1,
        borderBottomColor: '#4A4A4A',
    },
    backButton: {
        paddingRight: 10,
    },
    backButtonText: {
        color: '#43D0AC', 
        fontSize: 28,
        fontWeight: 'bold',
    },
    groupTitle: {
        flex: 1, 
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    moreOptionsButton: {
        paddingLeft: 10,
    },
    moreOptionsText: {
        fontSize: 24, 
        color: '#FFFFFF',
    },
    
    messageListContent: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    messageBubble: {
        maxWidth: '80%',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
        marginBottom: 10,
        flexDirection: 'column', 
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#43D0AC', 
        borderBottomRightRadius: 2, 
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#3D3D3D', 
        borderBottomLeftRadius: 2, 
    },
    senderName: {
        color: '#B0B0B0', 
        marginBottom: 3,
        fontWeight: 'bold',
    },
    messageText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    timestamp: {
        color: '#D0D0D0', 
        fontSize: 10,
        marginTop: 5,
        alignSelf: 'flex-end', 
    },
    // Input Container Styles
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#4A4A4A',
        backgroundColor: '#3D3D3D', 
    },
    messageInput: {
        flex: 1, 
        backgroundColor: '#2C2C2C', 
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: Platform.OS === 'ios' ? 10 : 8, 
        marginRight: 10,
        color: '#FFFFFF',
        fontSize: 16,
        maxHeight: 100, 
        borderWidth: 1,
        borderColor: '#4A4A4A',
    },
    sendButton: {
        backgroundColor: '#43D0AC',
        borderRadius: 25,
        width: 60,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default styles;