import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from "react";
import { Job } from "../types/Job";
import { v4 as uuidv4 } from 'uuid';
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ApplicationData {
  name: string;
  email: string;
  contactNumber: string;
  reason: string;
}

interface Filters {
  minSalary?: number;
  location?: string;
  jobType?: string[];
}

interface JobContextType {
  jobs: Job[];
  savedJobs: Job[];
  appliedJobs: string[];
  fetchJobs: () => Promise<void>;
  searchJobs: (term: string) => void;
  saveJob: (job: Job) => void;
  removeSavedJob: (id: string) => void;
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
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({});

  // Load applied jobs from storage on initial render
  useEffect(() => {
    const loadAppliedJobs = async () => {
      try {
        const saved = await AsyncStorage.getItem('appliedJobs');
        if (saved) setAppliedJobs(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load applied jobs', error);
      }
    };
    loadAppliedJobs();
  }, []);

  // Save applied jobs to storage when they change
  useEffect(() => {
    const saveAppliedJobs = async () => {
      try {
        await AsyncStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
      } catch (error) {
        console.error('Failed to save applied jobs', error);
      }
    };
    saveAppliedJobs();
  }, [appliedJobs]);

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

    return filtered;
  }, [filters]);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://empllo.com/api/v1', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      console.log('API Response:', data);

      let jobsArray = [];
      if (Array.isArray(data)) {
        jobsArray = data;
      } else if (data?.data) {
        jobsArray = data.data;
      } else if (data?.jobs) {
        jobsArray = data.jobs;
      } else {
        throw new Error('Invalid API response format');
      }

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
          location: job.locations?.[0] || ''
        };
      });

      setAllJobs(transformedJobs);
      setJobs(filterJobs(transformedJobs, ''));
      
    } catch (error) {
      console.error('API Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch jobs');
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [filterJobs]);

  const addToSearchHistory = useCallback((term: string) => {
    if (term.trim()) {
      setSearchHistory(prev => 
        [term, ...prev.filter(t => t !== term)].slice(0, 5)
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

  const removeSavedJob = useCallback((id: string) => {
    setSavedJobs(prev => prev.filter(job => job.id !== id));
  }, []);

  const markJobAsApplied = useCallback((jobId: string) => {
    setAppliedJobs(prev => 
      prev.includes(jobId) ? prev : [...prev, jobId]
    );
  }, []);

  const applyForJob = useCallback(async (jobId: string, applicationData: ApplicationData) => {
    try {
      console.log('Applying for job:', jobId, applicationData);
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
      savedJobs,
      appliedJobs,
      fetchJobs,
      searchJobs,
      saveJob, 
      removeSavedJob,
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