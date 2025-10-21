// components/FilterModal.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from "../contexts/ThemeContext";
import { useJobContext } from "../contexts/JobContext";
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius } from "../styles/theme";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    minSalary?: number;
    location?: string;
    jobType?: string;
    workModel?: string;
    seniorityLevel?: string;
    category?: string;
  };
  setFilters: (filters: { minSalary?: number; location?: string; jobType?: string; workModel?: string; seniorityLevel?: string; category?: string }) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ 
  visible, 
  onClose, 
  filters, 
  setFilters 
}) => {
  const { theme } = useTheme();
  const { jobs } = useJobContext();
  const [localFilters, setLocalFilters] = useState(filters);
  const [showLocationList, setShowLocationList] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  
  const styles = createStyles(theme === 'dark');

  // Extract unique values from job data
  const locations = useMemo(() => {
    const locationSet = new Set<string>();
    jobs.forEach(job => {
      if (job.location && job.location.trim()) {
        locationSet.add(job.location.trim());
      }
    });
    return Array.from(locationSet).sort();
  }, [jobs]);

  const jobTypes = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach(job => {
      if (job.jobType && job.jobType.trim()) set.add(job.jobType.trim());
    });
    return Array.from(set).sort();
  }, [jobs]);

  const workModels = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach(job => {
      if (job.workModel && job.workModel.trim()) set.add(job.workModel.trim());
    });
    return Array.from(set).sort();
  }, [jobs]);

  const seniorityLevels = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach(job => {
      if (job.seniorityLevel && job.seniorityLevel.trim()) set.add(job.seniorityLevel.trim());
    });
    return Array.from(set).sort();
  }, [jobs]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach(job => {
      if (job.mainCategory && job.mainCategory.trim()) set.add(job.mainCategory.trim());
    });
    return Array.from(set).sort();
  }, [jobs]);

  const applyFilters = () => {
    setFilters(localFilters);
    onClose();
  };

  const resetFilters = () => {
    setLocalFilters({});
    setFilters({});
    setLocationSearch('');
    onClose();
  };

  const selectLocation = (location: string) => {
    setLocalFilters(prev => ({
      ...prev,
      location
    }));
    setShowLocationList(false);
    setLocationSearch('');
  };

  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <View style={styles.modalContent}>
            <View style={styles.headerContainer}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color={colors[theme].text} />
              </TouchableOpacity>
            </View>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
          
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Minimum Salary ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 50000"
              placeholderTextColor={colors[theme].placeholder}
              keyboardType="numeric"
              value={localFilters.minSalary?.toString() || ''}
              onChangeText={(text) => 
                setLocalFilters(prev => ({
                  ...prev,
                  minSalary: text ? parseInt(text) : undefined
                }))
              }
            />
          </View>
          
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Location</Text>
            <TouchableOpacity
              style={styles.locationSelector}
              onPress={() => setShowLocationList(!showLocationList)}
            >
              <Text style={[styles.locationText, !localFilters.location && { color: colors[theme].placeholder }]}>
                {localFilters.location || 'Select a location'}
              </Text>
              <Ionicons 
                name={showLocationList ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={colors[theme].text} 
              />
            </TouchableOpacity>
            
            {showLocationList && (
              <View style={styles.locationList}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search locations..."
                  placeholderTextColor={colors[theme].placeholder}
                  value={locationSearch}
                  onChangeText={setLocationSearch}
                />
                <FlatList
                  data={filteredLocations}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.locationItem,
                        localFilters.location === item && styles.selectedLocationItem
                      ]}
                      onPress={() => selectLocation(item)}
                    >
                      <Text style={styles.locationItemText}>{item}</Text>
                      {localFilters.location === item && (
                        <Ionicons 
                          name="checkmark" 
                          size={18} 
                          color={colors[theme].primary} 
                        />
                      )}
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyStateText}>
                        {locationSearch ? 'No matching locations found' : 'No locations available'}
                      </Text>
                    </View>
                  }
                />
              </View>
            )}
          </View>

          {/* Job Type Filter */}
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Job Type</Text>
            <View style={styles.chipContainer}>
              {jobTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.chip,
                    localFilters.jobType === type && styles.selectedChip
                  ]}
                  onPress={() => setLocalFilters(prev => ({
                    ...prev,
                    jobType: prev.jobType === type ? undefined : type
                  }))}
                >
                  <Text style={[
                    styles.chipText,
                    localFilters.jobType === type && styles.selectedChipText
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Work Model Filter */}
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Work Model</Text>
            <View style={styles.chipContainer}>
              {workModels.map((model) => (
                <TouchableOpacity
                  key={model}
                  style={[
                    styles.chip,
                    localFilters.workModel === model && styles.selectedChip
                  ]}
                  onPress={() => setLocalFilters(prev => ({
                    ...prev,
                    workModel: prev.workModel === model ? undefined : model
                  }))}
                >
                  <Text style={[
                    styles.chipText,
                    localFilters.workModel === model && styles.selectedChipText
                  ]}>
                    {model}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Seniority Level Filter */}
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Seniority Level</Text>
            <View style={styles.chipContainer}>
              {seniorityLevels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.chip,
                    localFilters.seniorityLevel === level && styles.selectedChip
                  ]}
                  onPress={() => setLocalFilters(prev => ({
                    ...prev,
                    seniorityLevel: prev.seniorityLevel === level ? undefined : level
                  }))}
                >
                  <Text style={[
                    styles.chipText,
                    localFilters.seniorityLevel === level && styles.selectedChipText
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category Filter */}
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Category</Text>
            <View style={styles.chipContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.chip,
                    localFilters.category === cat && styles.selectedChip
                  ]}
                  onPress={() => setLocalFilters(prev => ({
                    ...prev,
                    category: prev.category === cat ? undefined : cat
                  }))}
                >
                  <Text style={[
                    styles.chipText,
                    localFilters.category === cat && styles.selectedChipText
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          </ScrollView>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.resetButton]}
              onPress={resetFilters}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.applyButton]}
              onPress={applyFilters}
            >
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
          </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: spacing.large,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: colors[isDark ? 'dark' : 'light'].cardBackground,
    borderRadius: borderRadius.large,
    padding: spacing.large,
    maxHeight: '85%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.large,
  },
  modalTitle: {
    fontSize: fontSizes.xlarge,
    fontWeight: 'bold',
    color: colors[isDark ? 'dark' : 'light'].text,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: spacing.xsmall,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  scrollContent: {
    paddingTop: spacing.small,
    paddingBottom: spacing.xlarge,
  },
  filterItem: {
    marginBottom: spacing.medium,
  },
  filterLabel: {
    fontSize: fontSizes.small,
    color: colors[isDark ? 'dark' : 'light'].secondaryText,
    marginBottom: spacing.small,
  },
  input: {
    borderWidth: 1,
    borderColor: colors[isDark ? 'dark' : 'light'].border,
    borderRadius: borderRadius.medium,
    padding: spacing.small,
    color: colors[isDark ? 'dark' : 'light'].text,
    backgroundColor: colors[isDark ? 'dark' : 'light'].background,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors[isDark ? 'dark' : 'light'].border,
    borderRadius: borderRadius.medium,
    padding: spacing.small,
    backgroundColor: colors[isDark ? 'dark' : 'light'].background,
  },
  locationText: {
    color: colors[isDark ? 'dark' : 'light'].text,
    fontSize: fontSizes.medium,
  },
  locationList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: colors[isDark ? 'dark' : 'light'].border,
    borderRadius: borderRadius.medium,
    marginTop: spacing.small,
  },
  searchInput: {
    borderBottomWidth: 1,
    borderBottomColor: colors[isDark ? 'dark' : 'light'].border,
    padding: spacing.small,
    color: colors[isDark ? 'dark' : 'light'].text,
    backgroundColor: colors[isDark ? 'dark' : 'light'].background,
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: colors[isDark ? 'dark' : 'light'].border,
  },
  selectedLocationItem: {
    backgroundColor: isDark ? '#1e3a8a20' : '#bfdbfe',
  },
  locationItemText: {
    color: colors[isDark ? 'dark' : 'light'].text,
    fontSize: fontSizes.medium,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.large,
    paddingTop: spacing.medium,
  },
  button: {
    flex: 1,
    padding: spacing.small,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    marginHorizontal: spacing.xsmall,
  },
  resetButton: {
    backgroundColor: colors[isDark ? 'dark' : 'light'].background,
    borderWidth: 1,
    borderColor: colors[isDark ? 'dark' : 'light'].border,
  },
  cancelButton: {
    backgroundColor: colors[isDark ? 'dark' : 'light'].background,
    borderWidth: 1,
    borderColor: colors[isDark ? 'dark' : 'light'].border,
  },
  applyButton: {
    backgroundColor: colors[isDark ? 'dark' : 'light'].primary,
  },
  buttonText: {
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    color: colors[isDark ? 'dark' : 'light'].text,
  },
  emptyState: {
    padding: spacing.large,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: colors[isDark ? 'dark' : 'light'].secondaryText,
    fontSize: fontSizes.small,
    textAlign: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.small,
  },
  chip: {
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    borderRadius: borderRadius.large,
    borderWidth: 1,
    borderColor: colors[isDark ? 'dark' : 'light'].border,
    backgroundColor: colors[isDark ? 'dark' : 'light'].background,
  },
  selectedChip: {
    backgroundColor: colors[isDark ? 'dark' : 'light'].primary,
    borderColor: colors[isDark ? 'dark' : 'light'].primary,
  },
  chipText: {
    color: colors[isDark ? 'dark' : 'light'].text,
    fontSize: fontSizes.small,
    fontWeight: '500',
  },
  selectedChipText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default FilterModal;