import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import JobStackNavigator from "./JobStackNavigator";
import SavedJobsScreen from "../screens/SavedJobsScreen";
import AppliedJobsScreen from "../screens/AppliedJobsScreen";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useJobContext } from "../contexts/JobContext";

export type AppTabParamList = {
  JobStack: undefined;
  SavedJobs: undefined;
  AppliedJobs: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

const AppNavigator = () => {
  const { theme } = useTheme();
  const { savedJobs, appliedJobs } = useJobContext(); // ✅ Get savedJobs too!

  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={{ 
          headerShown: false,
          tabBarActiveTintColor: theme === 'dark' ? '#3b82f6' : '#2563eb',
          tabBarInactiveTintColor: theme === 'dark' ? '#94a3b8' : '#64748b',
          tabBarStyle: {
            backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        <Tab.Screen 
          name="JobStack" 
          component={JobStackNavigator}
          options={{ 
            title: "Jobs",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="briefcase-outline" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen 
          name="SavedJobs" 
          component={SavedJobsScreen}
          options={{ 
            title: "Saved",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bookmark-outline" size={size} color={color} />
            ),
            tabBarBadge: savedJobs.length > 0 ? savedJobs.length : undefined, // ✅ FIXED!
          }}
        />
        <Tab.Screen 
          name="AppliedJobs" 
          component={AppliedJobsScreen}
          options={{ 
            title: "Applied",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document-text-outline" size={size} color={color} />
            ),
            tabBarBadge: appliedJobs.length > 0 ? appliedJobs.length : undefined,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
