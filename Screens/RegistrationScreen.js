import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, ScrollView, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './styles_folder/RegistrationScreenStyles';

const ShieldIcon = () => (
    <View style={styles.shieldIcon}>
        <Text style={styles.shieldText}>🛡️</Text>
    </View>
);

const EyeIcon = ({ onPress, isVisible }) => (
    <TouchableOpacity onPress={onPress} style={styles.eyeIcon}>
        <Text style={styles.eyeText}>{isVisible ? '👁️' : '👁️‍🗨️'}</Text>
    </TouchableOpacity>
); // eyeIcon

const RegistrationScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                 <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>{'<'}</Text>
                 </TouchableOpacity>
                 <View style={styles.secureIconContainer}>
                    <ShieldIcon />
                    <Text style={styles.secureLabel}> VPN </Text>
                 </View>
            </View>
            <KeyboardAvoidingView 
                behavior="padding" 
                style={[styles.keyboardAvoidingView, {paddingVertical: 24}]}
                keyboardVerticalOffset={0}
            >
                <ScrollView 
                    contentContainerStyle={[styles.scrollViewContent, {paddingBottom: 32}]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >

                <Text style={styles.title}>Create Your Secure Account</Text>
                <Text style={styles.subtitle}>Enter your details below</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#8A8A8A"
                    value={fullName}
                    onChangeText={setFullName}
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Email Address ID"
                    placeholderTextColor="#8A8A8A"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#8A8A8A"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!isPasswordVisible}
                    />
                    <EyeIcon onPress={() => setIsPasswordVisible(!isPasswordVisible)} isVisible={isPasswordVisible}/>
                </View>

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#8A8A8A"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!isConfirmPasswordVisible}
                    />
                    <EyeIcon onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} isVisible={isConfirmPasswordVisible}/>
                </View>

                <TouchableOpacity style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>REGISTER</Text>
                </TouchableOpacity>

                 <Text style={styles.encryptionNote}>Your info is end-to-end encrypted.</Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


export default RegistrationScreen;