import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadAnonymousUserData = async () => {
  try {
    const data = await AsyncStorage.getItem('anonymousUser');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(
      'Error loading anonymous user data from AsyncStorage:',
      error,
    );
    return null;
  }
};
