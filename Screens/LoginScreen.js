import { useEffect, useState } from 'react';
import { Alert, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthAPI } from '../api';
import { TokenStorage } from '../tokenStorage';
import styles from './styles_folder/LoginScreenStyles';

const ShieldIcon = () => (
    <View style={styles.shieldIcon}>
        <Text style={styles.shieldText}>🛡️</Text>
    </View>
);
const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Check if the user is already logged in and then navigate to GroupList
    const checkLoginStatus = async () => {
        const isAuth = await TokenStorage.isAuthenticated();
        if (isAuth) {
            navigation.navigate('GroupList');
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const result = await AuthAPI.login(username.trim(), password);
            
            if (result.success) {
                const stored = await TokenStorage.setToken(result.access_token);
                if (!stored) {
                    Alert.alert('Error', 'Failed to persist token');
                    return;
                }
                console.log("hello")
                navigation.navigate('GroupList');
            } else {
                Alert.alert('Login Failed', result.error);
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                 <ShieldIcon />
                 <Text style={styles.secureLabel}> VPN </Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.title}>         SECURE COMMUNICATION</Text>
                <Text style={styles.subtitle}>Access Your Account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#8A8A8A"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#8A8A8A"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry 
                />

                {/* <TouchableOpacity style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>LOGIN</Text>
                </TouchableOpacity> */}

                <TouchableOpacity 
                    style={[styles.loginButton, loading && { opacity: 0.7 }]} 
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.loginButtonText}>{loading ? 'LOGGING IN...' : 'LOGIN'}</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.footerText}>New User? <Text style={styles.linkText}>Register</Text></Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => navigation.navigate('Admin')}>
                        <Text style={styles.footerText}>🔒 Admin Login</Text>
                    </TouchableOpacity> 

                </View>
            </View>
        </SafeAreaView>
    );
};


export default LoginScreen;