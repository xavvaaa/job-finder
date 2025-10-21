import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from "react";
import { Job } from "../types/Job";
import { v4 as uuidv4 } from 'uuid';
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, APP_CONFIG, ERROR_MESSAGES } from '../constants';
import { fetchJobsFromAPI } from '../utils/api';

interface ApplicationData {
  name: string;
  email: string;
  contactNumber: string;
  reason: string;
}

interface Filters {
  minSalary?: number;
  location?: string;
  jobType?: string;
  workModel?: string;
  seniorityLevel?: string;
  category?: string;
}

interface JobContextType {
  jobs: Job[];
  allJobs: Job[];
  savedJobs: Job[];
  appliedJobs: Job[]; // Changed from string[] to Job[]
  fetchJobs: () => Promise<void>;
  searchJobs: (term: string) => void;
  saveJob: (job: Job) => void;
  removeSavedJob: (job: Job) => void;
  unsaveJob: (job: Job) => void;
  isLoading: boolean;
  error: string | null;
  applyForJob: (jobId: string, applicationData: ApplicationData) => Promise<void>;
  searchHistory: string[];
  addToSearchHistory: (term: string) => void;
  clearSearchHistory: () => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  markJobAsApplied: (jobId: string) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

// Helper functions outside the component
function formatSalaryText(min: number | null, max: number | null): string {
  if (min !== null && max !== null) {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  }
  if (min !== null) return `From $${min.toLocaleString()}`;
  if (max !== null) return `Up to $${max.toLocaleString()}`;
  return 'Salary not disclosed';
}

function calculateDisplaySalary(min: number | null, max: number | null): number {
  if (min !== null && max !== null) return Math.round((min + max) / 2);
  if (min !== null) return min;
  if (max !== null) return max;
  return 0;
}

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]); // Changed from string[] to Job[]
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Load persisted data from storage on initial render
  useEffect(() => {
    const loadPersistedData = async () => {
      try {
        const [appliedJobsData, savedJobsData, searchHistoryData, cachedJobsData] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.APPLIED_JOBS),
          AsyncStorage.getItem(STORAGE_KEYS.SAVED_JOBS),
          AsyncStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY),
          AsyncStorage.getItem(STORAGE_KEYS.CACHED_JOBS)
        ]);
        
        if (appliedJobsData) {
          const parsed = JSON.parse(appliedJobsData);
          setAppliedJobs(parsed);
        }
        if (savedJobsData) setSavedJobs(JSON.parse(savedJobsData));
        if (searchHistoryData) setSearchHistory(JSON.parse(searchHistoryData));
        
        // Load cached jobs if available
        if (cachedJobsData) {
          const cachedJobs = JSON.parse(cachedJobsData);
          setAllJobs(cachedJobs);
          setJobs(cachedJobs);
        }
      } catch (error) {
        console.error('Failed to load persisted data', error);
      } finally {
        setIsInitialized(true);
      }
    };
    loadPersistedData();
  }, []);

  // Save applied jobs to storage when they change (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    const saveAppliedJobs = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.APPLIED_JOBS, JSON.stringify(appliedJobs));
      } catch (error) {
        console.error('Failed to save applied jobs', error);
      }
    };
    saveAppliedJobs();
  }, [appliedJobs, isInitialized]);

  // Save saved jobs to storage when they change (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    const saveSavedJobs = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(savedJobs));
      } catch (error) {
        console.error('Failed to save saved jobs', error);
      }
    };
    saveSavedJobs();
  }, [savedJobs, isInitialized]);

  // Save search history to storage when it changes (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    const saveSearchHistory = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(searchHistory));
      } catch (error) {
        console.error('Failed to save search history', error);
      }
    };
    saveSearchHistory();
  }, [searchHistory, isInitialized]);

  const normalizeString = (str: string) => {
    return str.toLowerCase().trim().replace(/\s+/g, ' ');
  };

  const filterJobs = useCallback((jobs: Job[], searchTerm: string): Job[] => {
    let filtered = [...jobs];
    
    if (searchTerm.trim()) {
      const term = normalizeString(searchTerm);
      filtered = filtered.filter(job => {
        const title = normalizeString(job.title);
        const company = normalizeString(job.company);
        const description = job.description ? normalizeString(job.description) : '';
        const location = job.location ? normalizeString(job.location) : '';
        
        return (
          title.includes(term) ||
          company.includes(term) ||
          description.includes(term) ||
          location.includes(term)
        );
      });
    }

    if (filters.minSalary) {
      filtered = filtered.filter(job => 
        job.salary >= filters.minSalary! ||
        (job.minSalary !== null && job.minSalary >= filters.minSalary!)
      );
    }
    
    if (filters.location) {
      const normalizedLocation = normalizeString(filters.location);
      filtered = filtered.filter(job => {
        const jobLocation = job.location ? normalizeString(job.location) : '';
        return jobLocation.includes(normalizedLocation);
      });
    }

    if (filters.jobType) {
      filtered = filtered.filter(job => 
        job.jobType && normalizeString(job.jobType) === normalizeString(filters.jobType!)
      );
    }

    if (filters.workModel) {
      filtered = filtered.filter(job => 
        job.workModel && normalizeString(job.workModel) === normalizeString(filters.workModel!)
      );
    }

    if (filters.seniorityLevel) {
      filtered = filtered.filter(job => 
        job.seniorityLevel && normalizeString(job.seniorityLevel) === normalizeString(filters.seniorityLevel!)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(job => 
        job.mainCategory && normalizeString(job.mainCategory) === normalizeString(filters.category!)
      );
    }

    return filtered;
  }, [filters]);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const jobsArray = await fetchJobsFromAPI();
      
      const transformedJobs = jobsArray.map((job: any) => {
        const minSalary = job.minSalary ?? job.midslary ?? null;
        const maxSalary = job.maxSalary ?? null;

        return {
          id: job.id || uuidv4(),
          title: job.title || 'No title',
          company: job.companyName || job.company || 'No company',
          logo: job.companyLogo || job.logo,
          salary: calculateDisplaySalary(minSalary, maxSalary),
          minSalary: minSalary !== null ? Number(minSalary) : null,
          maxSalary: maxSalary !== null ? Number(maxSalary) : null,
          salaryText: formatSalaryText(minSalary, maxSalary),
          description: job.description || '',
          location: job.locations?.[0] || '',
          
          // Additional API fields
          mainCategory: job.mainCategory,
          applicationLink: job.applicationLink,
          pubDate: job.pubDate,
          expiryDate: job.expiryDate,
          companyName: job.companyName,
          companyLogo: job.companyLogo,
          jobType: job.jobType,
          workModel: job.workModel,
          seniorityLevel: job.seniorityLevel,
          locations: job.locations,
          tags: job.tags,
        };
      });

      setAllJobs(transformedJobs);
      setJobs(filterJobs(transformedJobs, ''));
      
      // Cache jobs for offline access
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.CACHED_JOBS, JSON.stringify(transformedJobs));
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_FETCH_TIME, Date.now().toString());
      } catch (cacheError) {
        console.error('Failed to cache jobs', cacheError);
      }
      
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.API_ERROR;
      setError(errorMessage);
      
      // Try to load cached jobs on error
      try {
        const cachedJobsData = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_JOBS);
        if (cachedJobsData) {
          const cachedJobs = JSON.parse(cachedJobsData);
          setAllJobs(cachedJobs);
          setJobs(filterJobs(cachedJobs, ''));
          setError(`${errorMessage} Showing cached data.`);
        }
      } catch (cacheError) {
        console.error('Failed to load cached jobs', cacheError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [filterJobs]);

  const addToSearchHistory = useCallback((term: string) => {
    if (term.trim()) {
      setSearchHistory(prev => 
        [term, ...prev.filter(t => t !== term)].slice(0, APP_CONFIG.MAX_SEARCH_HISTORY)
      );
    }
  }, []);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  const searchJobs = useCallback((term: string) => {
    const normalizedTerm = normalizeString(term);
    if (normalizedTerm) {
      addToSearchHistory(normalizedTerm);
    }
    setJobs(filterJobs(allJobs, normalizedTerm));
  }, [allJobs, filterJobs, addToSearchHistory]);

  const saveJob = useCallback((job: Job) => {
    setSavedJobs(prev => 
      prev.some(saved => saved.id === job.id) ? prev : [...prev, job]
    );
  }, []);

  const removeSavedJob = useCallback((jobToRemove: Job) => {
    setSavedJobs(prev => prev.filter(savedJob => {
      // Match by applicationLink (most stable)
      if (jobToRemove.applicationLink && savedJob.applicationLink) {
        return savedJob.applicationLink !== jobToRemove.applicationLink;
      }
      // Fallback to title + company
      return !(savedJob.title === jobToRemove.title && savedJob.company === jobToRemove.company);
    }));
  }, []);

  const markJobAsApplied = useCallback((jobId: string) => {
    const jobToApply = allJobs.find(job => job.id === jobId);
    if (jobToApply) {
      setAppliedJobs(prev => 
        prev.some(job => job.id === jobId) ? prev : [...prev, jobToApply]
      );
    }
  }, [allJobs]);

  const applyForJob = useCallback(async (jobId: string, applicationData: ApplicationData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Find the job by ID
      const jobToApply = allJobs.find((job) => job.id === jobId);
      if (!jobToApply) {
        Alert.alert('Error', 'Job not found.');
        return;
      }
  
      // Mark job as applied
      markJobAsApplied(jobId);
  
      // Save to savedJobs if not already saved
      setSavedJobs((prev) =>
        prev.some((job) => job.id === jobId) ? prev : [...prev, jobToApply]
      );
  
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application');
      return Promise.reject(error);
    }
  }, [markJobAsApplied, allJobs]);
  

  return (
    <JobContext.Provider value={{ 
      jobs,
      allJobs,
      savedJobs,
      appliedJobs,
      fetchJobs,
      searchJobs,
      saveJob, 
      removeSavedJob,
      unsaveJob: removeSavedJob,
      isLoading,
      error,
      applyForJob,
      searchHistory,
      addToSearchHistory,
      clearSearchHistory,
      filters,
      setFilters,
      markJobAsApplied
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (!context) throw new Error("useJobContext must be used within a JobProvider");
  return context;
};