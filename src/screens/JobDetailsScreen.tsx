import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useJobContext } from '../contexts/JobContext';
import { colors, spacing, fontSizes, borderRadius } from '../styles/theme';
import { Job } from '../types/Job';
import { JobStackParamList } from '../navigation/JobStackNavigator';

type JobDetailsRouteProp = RouteProp<JobStackParamList, 'JobDetails'>;
type JobDetailsNavigationProp = NativeStackNavigationProp<JobStackParamList, 'JobDetails'>;

// Utility function to strip HTML tags
const stripHtml = (html: string): string => {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
};

const JobDetailsScreen = () => {
  const navigation = useNavigation<JobDetailsNavigationProp>();
  const route = useRoute<JobDetailsRouteProp>();
  const { theme } = useTheme();
  const { allJobs, savedJobs, saveJob, unsaveJob, appliedJobs } = useJobContext();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false);
  
  const { jobId } = route.params;
  const job = allJobs.find((j: Job) => j.id === jobId);
  
  // Check if saved using stable identifiers
  const isSaved = savedJobs.some((savedJob: Job) => {
    if (!job) return false;
    // First try applicationLink (most stable)
    if (job.applicationLink && savedJob.applicationLink) {
      return savedJob.applicationLink === job.applicationLink;
    }
    // Fallback to title + company
    return savedJob.title === job.title && savedJob.company === job.company;
  });
  
  // Check if applied using stable identifiers (applicationLink or title+company)
  const isApplied = appliedJobs.some((appliedJob: Job) => {
    if (!job) return false;
    // First try applicationLink (most stable)
    if (job.applicationLink && appliedJob.applicationLink) {
      return appliedJob.applicationLink === job.applicationLink;
    }
    // Fallback to title + company
    return appliedJob.title === job.title && appliedJob.company === job.company;
  });
  
  const styles = createStyles(theme === 'dark');
  
  // Truncate description for preview
  const getDescriptionPreview = (description: string) => {
    const stripped = stripHtml(description);
    if (stripped.length <= 300) return stripped;
    return stripped.substring(0, 300) + '...';
  };

  if (!job) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors[theme].text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Details</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors[theme].secondaryText} />
          <Text style={styles.errorText}>Job not found</Text>
        </View>
      </View>
    );
  }

  const handleSave = () => {
    if (!job) return;
    if (isSaved) {
      Alert.alert(
        'Remove from Saved',
        `Remove "${job.title}" from your saved jobs?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Remove', 
            style: 'destructive',
            onPress: () => unsaveJob(job)
          }
        ]
      );
    } else {
      saveJob(job);
    }
  };

  const handleApply = () => {
    // If there's an application link, open it in browser
    if (job.applicationLink) {
      Linking.openURL(job.applicationLink);
    } else {
      // Otherwise, navigate to application form
      navigation.navigate('Application', {
        jobId: job.id,
        onApply: () => {},
        onClose: () => navigation.goBack(),
      });
    }
  };

  const openCompanyWebsite = () => {
    // Search the company name
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(job.companyName || job.company)}`;
    Linking.openURL(searchUrl);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors[theme].text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Ionicons 
            name={isSaved ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={isSaved ? colors[theme].primary : colors[theme].text} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Company Logo & Title Section */}
        <View style={styles.topSection}>
          <View style={styles.logoContainer}>
            {(job.companyLogo || job.logo) ? (
              <Image source={{ uri: job.companyLogo || job.logo }} style={styles.logo} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>
                  {(job.companyName || job.company).charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          
          <Text style={styles.jobTitle}>{job.title}</Text>
          
          <TouchableOpacity onPress={openCompanyWebsite} style={styles.companyButton}>
            <Text style={styles.companyName}>{job.companyName || job.company}</Text>
            <Ionicons name="open-outline" size={16} color={colors[theme].primary} />
          </TouchableOpacity>

          {job.mainCategory && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{job.mainCategory}</Text>
            </View>
          )}
        </View>

        {/* Quick Info Cards */}
        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            <Ionicons name="location-outline" size={24} color={colors[theme].primary} />
            <Text style={styles.infoCardLabel}>Location</Text>
            <Text style={styles.infoCardValue}>
              {job.locations?.join(', ') || job.location || 'Not specified'}
            </Text>
          </View>
          
          <View style={styles.infoCard}>
            <Ionicons name="cash-outline" size={24} color={colors[theme].primary} />
            <Text style={styles.infoCardLabel}>Salary</Text>
            <Text style={styles.infoCardValue}>{job.salaryText}</Text>
          </View>
        </View>

        {/* Additional Info Cards Row 2 */}
        <View style={styles.infoCardsWrap}>
          {job.jobType && (
            <View style={styles.infoCardSmall}>
              <Ionicons name="briefcase-outline" size={24} color={colors[theme].primary} />
              <Text style={styles.infoCardLabel}>Job Type</Text>
              <Text style={styles.infoCardValue}>{job.jobType}</Text>
            </View>
          )}
          
          {job.workModel && (
            <View style={styles.infoCardSmall}>
              <Ionicons name="laptop-outline" size={24} color={colors[theme].primary} />
              <Text style={styles.infoCardLabel}>Work Model</Text>
              <Text style={styles.infoCardValue}>{job.workModel}</Text>
            </View>
          )}

          {job.seniorityLevel && (
            <View style={styles.infoCardSmall}>
              <Ionicons name="trending-up-outline" size={24} color={colors[theme].primary} />
              <Text style={styles.infoCardLabel}>Level</Text>
              <Text style={styles.infoCardValue}>{job.seniorityLevel}</Text>
            </View>
          )}
        </View>

        {/* Skills/Tags */}
        {job.tags && job.tags.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="pricetags-outline" size={20} color={colors[theme].primary} />
              <Text style={styles.sectionTitle}>Required Skills</Text>
            </View>
            <View style={styles.tagsContainer}>
              {job.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Detailed Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={20} color={colors[theme].primary} />
            <Text style={styles.sectionTitle}>Job Description</Text>
          </View>
          {job.description ? (
            <>
              <Text style={styles.description}>
                {isDescriptionExpanded 
                  ? stripHtml(job.description) 
                  : getDescriptionPreview(job.description)
                }
              </Text>
              {stripHtml(job.description).length > 300 && (
                <TouchableOpacity 
                  onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  style={styles.readMoreButton}
                >
                  <Text style={styles.readMoreText}>
                    {isDescriptionExpanded ? 'Read Less' : 'Read More'}
                  </Text>
                  <Ionicons 
                    name={isDescriptionExpanded ? 'chevron-up' : 'chevron-down'} 
                    size={16} 
                    color={colors[theme].primary} 
                  />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.description}>No description available</Text>
          )}
        </View>

        {/* Additional Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={20} color={colors[theme].primary} />
            <Text style={styles.sectionTitle}>Additional Information</Text>
          </View>
          
          {job.pubDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Posted:</Text>
              <Text style={styles.detailValue}>
                {new Date(job.pubDate * 1000).toLocaleDateString()}
              </Text>
            </View>
          )}

          {job.expiryDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Expires:</Text>
              <Text style={styles.detailValue}>
                {new Date(job.expiryDate * 1000).toLocaleDateString()}
              </Text>
            </View>
          )}
          
          {job.minSalary && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Minimum Salary:</Text>
              <Text style={styles.detailValue}>${job.minSalary.toLocaleString()}</Text>
            </View>
          )}
          
          {job.maxSalary && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Maximum Salary:</Text>
              <Text style={styles.detailValue}>${job.maxSalary.toLocaleString()}</Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Job ID:</Text>
            <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="middle">
              {job.id}
            </Text>
          </View>
        </View>

        {/* Status Badge */}
        {isApplied && (
          <View style={styles.appliedBadge}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.appliedText}>You've already applied to this job</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.saveActionButton]} 
          onPress={handleSave}
        >
          <Ionicons 
            name={isSaved ? "bookmark" : "bookmark-outline"} 
            size={20} 
            color={colors[theme].text} 
          />
          <Text style={styles.actionButtonText}>{isSaved ? 'Saved' : 'Save'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.applyActionButton, isApplied && styles.disabledButton]} 
          onPress={handleApply}
          disabled={isApplied}
        >
          <Ionicons 
            name={isApplied ? "checkmark-circle" : "paper-plane"} 
            size={20} 
            color="#fff" 
          />
          <Text style={styles.applyButtonText}>
            {isApplied ? 'Applied' : 'Apply Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors[isDark ? 'dark' : 'light'].background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.medium,
    paddingTop: spacing.large + 20,
    backgroundColor: colors[isDark ? 'dark' : 'light'].cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors[isDark ? 'dark' : 'light'].border,
  },
  backButton: {
    padding: spacing.xsmall,
  },
  headerTitle: {
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    color: colors[isDark ? 'dark' : 'light'].text,
    flex: 1,
    textAlign: 'center',
  },
  saveButton: {
    padding: spacing.xsmall,
  },
  scrollView: {
    flex: 1,
  },
  topSection: {
    alignItems: 'center',
    padding: spacing.large,
    paddingBottom: spacing.xlarge,
    backgroundColor: colors[isDark ? 'dark' : 'light'].cardBackground,
    borderBottomLeftRadius: borderRadius.xlarge,
    borderBottomRightRadius: borderRadius.xlarge,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoContainer: {
    marginBottom: spacing.medium,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors[isDark ? 'dark' : 'light'].primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  jobTitle: {
    fontSize: fontSizes.xlarge,
    fontWeight: 'bold',
    color: colors[isDark ? 'dark' : 'light'].text,
    textAlign: 'center',
    marginBottom: spacing.small,
  },
  companyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xsmall,
  },
  companyName: {
    fontSize: fontSizes.medium,
    color: colors[isDark ? 'dark' : 'light'].primary,
    fontWeight: '600',
  },
  infoCards: {
    flexDirection: 'row',
    padding: spacing.medium,
    paddingTop: spacing.large,
    gap: spacing.medium,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors[isDark ? 'dark' : 'light'].cardBackground,
    padding: spacing.medium,
    paddingVertical: spacing.large,
    borderRadius: borderRadius.large,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0.2 : 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors[isDark ? 'dark' : 'light'].border,
  },
  infoCardLabel: {
    fontSize: fontSizes.small,
    color: colors[isDark ? 'dark' : 'light'].secondaryText,
    marginTop: spacing.xsmall,
    marginBottom: spacing.xsmall,
  },
  infoCardValue: {
    fontSize: fontSizes.medium,
    fontWeight: '600',
    color: colors[isDark ? 'dark' : 'light'].text,
    textAlign: 'center',
  },
  section: {
    padding: spacing.large,
    backgroundColor: colors[isDark ? 'dark' : 'light'].cardBackground,
    marginHorizontal: spacing.medium,
    marginBottom: spacing.medium,
    borderRadius: borderRadius.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0.2 : 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.small,
    marginBottom: spacing.medium,
  },
  sectionTitle: {
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    color: colors[isDark ? 'dark' : 'light'].text,
  },
  description: {
    fontSize: fontSizes.medium,
    color: colors[isDark ? 'dark' : 'light'].text,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: colors[isDark ? 'dark' : 'light'].border,
    gap: spacing.small,
  },
  detailLabel: {
    fontSize: fontSizes.medium,
    color: colors[isDark ? 'dark' : 'light'].secondaryText,
    fontWeight: '500',
    flexShrink: 0,
  },
  detailValue: {
    fontSize: fontSizes.medium,
    color: colors[isDark ? 'dark' : 'light'].text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  appliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.small,
    backgroundColor: isDark ? '#10b98120' : '#d1fae5',
    padding: spacing.medium,
    marginHorizontal: spacing.medium,
    borderRadius: borderRadius.medium,
    marginTop: spacing.medium,
  },
  appliedText: {
    fontSize: fontSizes.medium,
    color: '#10b981',
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: colors[isDark ? 'dark' : 'light'].primary + '20',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.xsmall,
    borderRadius: borderRadius.large,
    marginTop: spacing.small,
  },
  categoryText: {
    color: colors[isDark ? 'dark' : 'light'].primary,
    fontSize: fontSizes.small,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.small,
  },
  tag: {
    backgroundColor: isDark ? '#1e40af20' : '#dbeafe',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    borderRadius: borderRadius.large,
    borderWidth: 1,
    borderColor: isDark ? '#1e40af40' : '#93c5fd',
  },
  tagText: {
    color: isDark ? '#93c5fd' : '#1e40af',
    fontSize: fontSizes.small,
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    padding: spacing.medium,
    gap: spacing.medium,
    backgroundColor: colors[isDark ? 'dark' : 'light'].cardBackground,
    borderTopWidth: 1,
    borderTopColor: colors[isDark ? 'dark' : 'light'].border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xsmall,
    padding: spacing.medium,
    borderRadius: borderRadius.medium,
  },
  saveActionButton: {
    backgroundColor: colors[isDark ? 'dark' : 'light'].background,
    borderWidth: 1,
    borderColor: colors[isDark ? 'dark' : 'light'].border,
  },
  applyActionButton: {
    backgroundColor: colors[isDark ? 'dark' : 'light'].primary,
    flex: 2,
  },
  disabledButton: {
    backgroundColor: colors[isDark ? 'dark' : 'light'].secondaryText,
    opacity: 0.6,
  },
  actionButtonText: {
    fontSize: fontSizes.medium,
    fontWeight: '600',
    color: colors[isDark ? 'dark' : 'light'].text,
  },
  applyButtonText: {
    fontSize: fontSizes.medium,
    fontWeight: '600',
    color: '#fff',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.medium,
  },
  errorText: {
    fontSize: fontSizes.large,
    color: colors[isDark ? 'dark' : 'light'].secondaryText,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xsmall,
    marginTop: spacing.medium,
    paddingVertical: spacing.small,
  },
  readMoreText: {
    color: colors[isDark ? 'dark' : 'light'].primary,
    fontSize: fontSizes.medium,
    fontWeight: '600',
  },
  infoCardsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.medium,
    paddingTop: 0,
    gap: spacing.medium,
  },
  infoCardSmall: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: colors[isDark ? 'dark' : 'light'].cardBackground,
    padding: spacing.medium,
    paddingVertical: spacing.large,
    borderRadius: borderRadius.large,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDark ? 0.2 : 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors[isDark ? 'dark' : 'light'].border,
  },
});

export default JobDetailsScreen;
