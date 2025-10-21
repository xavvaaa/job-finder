// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://empllo.com/api/v1',
  TIMEOUT: 10000, // 10 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

// AsyncStorage Keys
export const STORAGE_KEYS = {
  APPLIED_JOBS: 'appliedJobs',
  SAVED_JOBS: 'savedJobs',
  SEARCH_HISTORY: 'searchHistory',
  CACHED_JOBS: 'cachedJobs',
  LAST_FETCH_TIME: 'lastFetchTime',
};

// App Configuration
export const APP_CONFIG = {
  SEARCH_DEBOUNCE_MS: 300,
  MAX_SEARCH_HISTORY: 5,
  CACHE_EXPIRY_MS: 5 * 60 * 1000, // 5 minutes
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  API_ERROR: 'Failed to load jobs. Please try again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  INVALID_RESPONSE: 'Received invalid data from server.',
  APPLICATION_ERROR: 'Failed to submit application. Please try again.',
  STORAGE_ERROR: 'Failed to save data locally.',
};
