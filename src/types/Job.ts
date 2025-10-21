export interface Job {
  id: string;
  title: string;
  company: string;
  logo?: string;
  salary: number; // Calculated display value
  minSalary: number | null;
  maxSalary: number | null;
  salaryText: string; // Formatted display text
  description: string;
  location: string;
  
  // Additional API fields
  mainCategory?: string;
  applicationLink?: string;
  pubDate?: number;
  expiryDate?: number;
  companyName?: string;
  companyLogo?: string;
  jobType?: string;
  workModel?: string;
  seniorityLevel?: string;
  locations?: string[];
  tags?: string[];
}