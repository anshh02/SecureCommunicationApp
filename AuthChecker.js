import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { AuthAPI } from './api';
import { TokenStorage } from './tokenStorage';

const AuthChecker = ({ children, navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuth = await TokenStorage.isAuthenticated();
      
      if (isAuth) {
        // Verify token is still valid by calling the API
        const userResult = await AuthAPI.getCurrentUser();
        
        if (userResult.success) {
          setIsAuthenticated(true);
          // Optionally navigate to main app screen
          if (navigation) {
            navigation.navigate('GroupList');
          }
        } else {
          // Token is invalid, clear it
          await TokenStorage.deleteToken();
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  return children;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 16,
    fontSize: 16,
  },
});

export default AuthChecker;