import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './styles_folder/LoginScreenStyles';

const ShieldIcon = () => (
    <View style={styles.shieldIcon}>
        <Text style={styles.shieldText}>🛡️</Text>
    </View>
);
const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                    placeholder="Mobile / Email"
                    placeholderTextColor="#8A8A8A"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
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
                    style={styles.loginButton} 
                    onPress={() => navigation.navigate('GroupList')} 
                >
                    <Text style={styles.loginButtonText}>LOGIN</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={styles.footerText}>New User? <Text style={styles.linkText}>Register</Text></Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                         <Text style={styles.footerText}>🔒 Admin Login</Text>
                    </TouchableOpacity> 
                    
                </View>
            </View>
        </SafeAreaView>
    );
};


export default LoginScreen;