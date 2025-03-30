import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Jobs: undefined;
  JobFinder: undefined; // Add this
  Application: { 
    jobTitle: string;
    jobId?: string;
    company?: string; 
  };
  AppliedJobs: undefined; // Add this
  SavedJobs: undefined; // Add this
};

export type ApplicationScreenRouteProp = RouteProp<RootStackParamList, 'Application'>;
export type ApplicationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Application'>;

export type ApplicationFormProps = {
  route: ApplicationScreenRouteProp;
  navigation: ApplicationScreenNavigationProp;
};

export type TabParamList = {
  JobFinder: undefined;
  SavedJobs: undefined;
  AppliedJobs: undefined; // Add this if it's a tab
};

// Add these new types for the jobs screens
export type JobFinderNavigationProp = NativeStackNavigationProp<RootStackParamList, 'JobFinder'>;
export type AppliedJobsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AppliedJobs'>;
export type SavedJobsNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SavedJobs'>;