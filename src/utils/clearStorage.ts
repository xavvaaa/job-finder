import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

/**
 * Clear all app data from AsyncStorage
 * Use this to reset the app to a fresh state
 */
export async function clearAllStorage() {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.APPLIED_JOBS,
      STORAGE_KEYS.SAVED_JOBS,
      STORAGE_KEYS.SEARCH_HISTORY,
      STORAGE_KEYS.CACHED_JOBS,
    ]);
    console.log('✅ Storage cleared successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to clear storage:', error);
    return false;
  }
}

/**
 * Clear only applied jobs from storage
 */
export async function clearAppliedJobs() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.APPLIED_JOBS);
    console.log('✅ Applied jobs cleared');
    return true;
  } catch (error) {
    console.error('❌ Failed to clear applied jobs:', error);
    return false;
  }
}

/**
 * View all stored data (for debugging)
 */
export async function viewStoredData() {
  try {
    const [appliedJobs, savedJobs, searchHistory, cachedJobs] = await AsyncStorage.multiGet([
      STORAGE_KEYS.APPLIED_JOBS,
      STORAGE_KEYS.SAVED_JOBS,
      STORAGE_KEYS.SEARCH_HISTORY,
      STORAGE_KEYS.CACHED_JOBS,
    ]);
    
    console.log('📦 Stored Data:');
    console.log('Applied Jobs:', appliedJobs[1]);
    console.log('Saved Jobs:', savedJobs[1]);
    console.log('Search History:', searchHistory[1]);
    console.log('Cached Jobs:', cachedJobs[1] ? `${JSON.parse(cachedJobs[1]).length} jobs` : 'none');
  } catch (error) {
    console.error('❌ Failed to view stored data:', error);
  }
}
