import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E', // Slightly different background for depth
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#2C2C2C',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    logoutButton: {
        padding: 5,
    },
    logoutText: {
        color: '#E57373', // A soft red for logout
        fontSize: 16,
    },
    scrollView: {
        padding: 20,
    },
    welcomeMessage: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 5,
    },
    welcomeSubMessage: {
        color: '#B0B0B0',
        fontSize: 16,
        marginBottom: 30,
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    summaryCard: {
        backgroundColor: '#2C2C2C',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        width: '31%',
        borderLeftWidth: 4,
    },
    cardValue: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
    },
    cardLabel: {
        color: '#B0B0B0',
        fontSize: 14,
        marginTop: 5,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    actionButton: {
        backgroundColor: '#2C2C2C',
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginLeft: 15,
    }
});

export default styles;