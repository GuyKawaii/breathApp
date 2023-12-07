// storageUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveState = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error saving state:', e);
  }
};

export const loadState = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error loading state:', e);
    return null;
  }
};
