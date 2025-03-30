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
}