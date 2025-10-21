import { API_CONFIG, ERROR_MESSAGES } from '../constants';

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = API_CONFIG.TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(ERROR_MESSAGES.TIMEOUT_ERROR);
    }
    throw error;
  }
}

/**
 * Retry logic with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = API_CONFIG.MAX_RETRIES,
  delay = API_CONFIG.RETRY_DELAY
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Don't retry on certain errors
      if (lastError.message.includes('Invalid') || lastError.message.includes('404')) {
        throw lastError;
      }

      if (attempt < maxRetries - 1) {
        // Exponential backoff: delay * 2^attempt
        const backoffDelay = delay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }

  throw lastError!;
}

/**
 * Fetch jobs from API with retry logic
 */
export async function fetchJobsFromAPI(): Promise<any[]> {
  return retryWithBackoff(async () => {
    try {
      const response = await fetchWithTimeout(API_CONFIG.BASE_URL, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error(ERROR_MESSAGES.API_ERROR);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle different response formats
      let jobsArray = [];
      if (Array.isArray(data)) {
        jobsArray = data;
      } else if (data?.data) {
        jobsArray = data.data;
      } else if (data?.jobs) {
        jobsArray = data.jobs;
      } else {
        throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
      }

      return jobsArray;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }
      throw error;
    }
  });
}

/**
 * Check if device is online
 */
export function isOnline(): boolean {
  // In React Native, we would use NetInfo
  // For now, return true as a placeholder
  return true;
}
