import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// --- UPDATED IMPORT PATH ---
import styles from './AdminScreenStyles.js';


const dashboardData = {
    totalUsers: '991',
    activeGroups: '73',
    pendingApprovals: '12'
};

const AdminDashboardScreen = ({ navigation }) => {
    // Mock logout function
    const handleLogout = () => {
        
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Admin Dashboard</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.welcomeMessage}>Welcome, Admin!</Text>
                <Text style={styles.welcomeSubMessage}>Here's your platform summary.</Text>

                {/* Summary Cards */}
                <View style={styles.cardContainer}>
                    <View style={[styles.summaryCard, { borderColor: '#43D0AC'}]}>
                        <Text style={styles.cardValue}>{dashboardData.pendingApprovals}</Text>
                        <Text style={styles.cardLabel}>Pending</Text>
                    </View>
                    <View style={[styles.summaryCard, { borderColor: '#64B5F6'}]}>
                        <Text style={styles.cardValue}>{dashboardData.totalUsers}</Text>
                        <Text style={styles.cardLabel}>Users</Text>
                    </View>
                    <View style={[styles.summaryCard, { borderColor: '#FFB74D'}]}>
                        <Text style={styles.cardValue}>{dashboardData.activeGroups}</Text>
                        <Text style={styles.cardLabel}>Groups</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <TouchableOpacity style={styles.actionButton}>
                    <Text>👥</Text>
                    <Text style={styles.actionButtonText}>Manage Users</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Text>📂</Text>
                    <Text style={styles.actionButtonText}>Manage Groups</Text>
                </TouchableOpacity>
                 <TouchableOpacity style={styles.actionButton}>
                    <Text>📊</Text>
                    <Text style={styles.actionButtonText}>View Logs & Analytics</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AdminDashboardScreen;