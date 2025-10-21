import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import JobFinderScreen from "../screens/JobFinderScreen";
import JobDetailsScreen from "../screens/JobDetailsScreen";
import ApplicationForm, { ApplicationFormProps } from "../components/ApplicationForm";

export type JobStackParamList = {
  Jobs: undefined;
  JobDetails: {
    jobId: string;
  };
  Application: {
    jobId: string;
    onApply: (applicationData: {
      name: string;
      email: string;
      contactNumber: string;
      reason: string;
    }) => void;
    onClose: () => void;
    fromSavedJobs?: boolean;
  };
};

const Stack = createNativeStackNavigator<JobStackParamList>();

const JobStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Jobs" component={JobFinderScreen} />
      <Stack.Screen 
        name="JobDetails" 
        component={JobDetailsScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="Application"
        component={ApplicationForm as React.ComponentType<any>}
        options={{
          presentation: "modal",
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default JobStackNavigator;