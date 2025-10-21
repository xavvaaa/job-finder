// components/JobItem.tsx
import React, { useState, memo, useMemo } from "react";
import { View, Text, TouchableOpacity, Image, Modal, Alert, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "../contexts/ThemeContext";
import { Job } from "../types/Job";
import ApplicationForm, { ApplicationFormProps } from "./ApplicationForm";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useJobContext } from "../contexts/JobContext";
import { colors, spacing, fontSizes, borderRadius } from "../styles/theme";
import { JobStackParamList } from "../navigation/JobStackNavigator";

interface JobItemProps {
  job: Job;
  onSave: () => void;
  isSaved: boolean;
  fromSavedJobs?: boolean;
  hideButtons?: boolean;
}

const JobItem: React.FC<JobItemProps> = memo(({ 
  job, 
  onSave, 
  isSaved,
  fromSavedJobs = false,
  hideButtons = false
}) => {
  const { theme } = useTheme();
  const { appliedJobs, applyForJob } = useJobContext();
  const styles = createStyles(theme === 'dark');
  const [logoError, setLogoError] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<JobStackParamList>>();

  // Check if applied using stable identifiers (applicationLink or title+company)
  const isApplied = appliedJobs.some(appliedJob => {
    // First try applicationLink (most stable)
    if (job.applicationLink && appliedJob.applicationLink) {
      return appliedJob.applicationLink === job.applicationLink;
    }
    // Fallback to title + company
    return appliedJob.title === job.title && appliedJob.company === job.company;
  });
  
  const formattedSalary = job.salaryText || 'Salary not specified';

  const handleCardPress = () => {
    navigation.navigate('JobDetails', { jobId: job.id });
  };

  const handleApplySubmit: ApplicationFormProps['onApply'] = async (applicationData) => {
    try {
      await applyForJob(job.id, applicationData);
      setShowApplicationForm(false);
      
      Alert.alert(
        'Application Submitted',
        'Thank you for your application!',
        [
          {
            text: 'OK',
            onPress: () => {
              if (fromSavedJobs) {
                navigation.goBack();
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Application Error',
        'Failed to submit application. Please try again.'
      );
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handleCardPress} activeOpacity={0.7}>
        {/* Header Section */}
        <View style={styles.header}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          {job.logo && !logoError ? (
            <Image 
              source={{ uri: job.logo }}
              style={styles.logoImage}
              onError={() => setLogoError(true)}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.logoFallback}>
              <Text style={styles.logoText}>
                {job.company.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        
        {/* Company Info */}
        <View style={styles.companyInfo}>
          <Text style={styles.title} numberOfLines={2}>{job.title}</Text>
          <Text style={styles.companyName} numberOfLines={1}>
            {job.company}
          </Text>
        </View>
      </View>

      {/* Job Details */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons 
            name="cash-outline" 
            size={16}
            color={colors[theme].secondary} 
            style={styles.detailIcon}
          />
          <Text style={styles.salary}>{formattedSalary}</Text>
        </View>
        
        {job.location && (
          <View style={styles.detailRow}>
            <Ionicons 
              name="location-outline" 
              size={16}
              color={colors[theme].secondary} 
              style={styles.detailIcon}
            />
            <Text style={styles.location}>{job.location}</Text>
          </View>
        )}
      </View>
      </TouchableOpacity>

      {/* Action Buttons */}
      {!hideButtons && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[
              styles.button, 
              isSaved ? styles.savedButton : styles.saveButton
            ]}
            onPress={onSave}
          >
            <Ionicons 
              name={isSaved ? "bookmark" : "bookmark-outline"} 
              size={18} 
              color={isSaved ? colors[theme].text : colors[theme].text} 
            />
            <Text style={styles.buttonText}>{isSaved ? "Saved" : "Save"}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.button, 
              isApplied ? styles.appliedButton : styles.applyButton
            ]}
            onPress={() => !isApplied && setShowApplicationForm(true)}
            disabled={isApplied}
          >
            <Ionicons 
              name={isApplied ? "checkmark-circle" : "document-text-outline"} 
              size={18} 
              color={isApplied ? colors[theme].text : colors[theme].text} 
            />
            <Text style={styles.buttonText}>
              {isApplied ? "Applied" : "Apply"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Application Form Modal */}
      <Modal
        visible={showApplicationForm}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowApplicationForm(false)}
      >
        <View style={styles.modalOverlay}>
          <ApplicationForm 
            onApply={handleApplySubmit}
            onClose={() => setShowApplicationForm(false)}
            fromSavedJobs={fromSavedJobs}
          />
        </View>
      </Modal>
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.job.id === nextProps.job.id &&
    prevProps.isSaved === nextProps.isSaved &&
    prevProps.hideButtons === nextProps.hideButtons
  );
});

const createStyles = (isDark: boolean) => StyleSheet.create({
  card: {
    backgroundColor: colors[isDark ? 'dark' : 'light'].cardBackground,
    borderRadius: borderRadius.large,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    shadowColor: isDark ? '#000' : '#888',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.small,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.medium,
    backgroundColor: colors[isDark ? 'dark' : 'light'].background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.medium,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    color: colors[isDark ? 'dark' : 'light'].text,
  },
  companyInfo: {
    flex: 1,
  },
  title: {
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    color: colors[isDark ? 'dark' : 'light'].text,
    marginBottom: spacing.xsmall,
  },
  companyName: {
    fontSize: fontSizes.small,
    color: colors[isDark ? 'dark' : 'light'].secondaryText,
  },
  details: {
    marginBottom: spacing.small,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xsmall,
  },
  detailIcon: {
    marginRight: spacing.xsmall,
  },
  salary: {
    fontSize: fontSizes.small,
    color: colors[isDark ? 'dark' : 'light'].text,
  },
  location: {
    fontSize: fontSizes.small,
    color: colors[isDark ? 'dark' : 'light'].text,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.small,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.small,
    borderRadius: borderRadius.medium,
    marginHorizontal: spacing.xsmall,
  },
  saveButton: {
    backgroundColor: colors[isDark ? 'dark' : 'light'].background,
    borderWidth: 1,
    borderColor: colors[isDark ? 'dark' : 'light'].border,
  },
  savedButton: {
    backgroundColor: colors[isDark ? 'dark' : 'light'].primary,
  },
  applyButton: {
    backgroundColor: colors[isDark ? 'dark' : 'light'].background,
    borderWidth: 1,
    borderColor: colors[isDark ? 'dark' : 'light'].border,
  },
  appliedButton: {
    backgroundColor: colors[isDark ? 'dark' : 'light'].secondary,
  },
  buttonText: {
    marginLeft: spacing.xsmall,
    color: colors[isDark ? 'dark' : 'light'].text,
    fontWeight: 'bold',
    fontSize: fontSizes.small,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing.large,
  },
});

export default JobItem;