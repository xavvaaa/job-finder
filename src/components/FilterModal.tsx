// components/FilterModal.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, StyleSheet } from 'react-native';
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius } from "../styles/theme";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    minSalary?: number;
    location?: string;
  };
  setFilters: (filters: { minSalary?: number; location?: string }) => void;
}

const locations = [
  "Asia",
  "Canada", 
  "Europe",
  "France",
  "Israel", 
  "North Macedonia",
  "Philippines",
  "South America", 
  "United Kingdom", 
  "United States",
];

const FilterModal: React.FC<FilterModalProps> = ({ 
  visible, 
  onClose, 
  filters, 
  setFilters 
}) => {
  const { theme } = useTheme();
  const [localFilters, setLocalFilters] = useState(filters);
  const [showLocationList, setShowLocationList] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  
  const styles = createStyles(theme === 'dark');

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
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filters</Text>
          
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
                />
              </View>
            )}
          </View>
          
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
  modalContent: {
    backgroundColor: colors[isDark ? 'dark' : 'light'].cardBackground,
    borderRadius: borderRadius.large,
    padding: spacing.large,
  },
  modalTitle: {
    fontSize: fontSizes.xlarge,
    fontWeight: 'bold',
    color: colors[isDark ? 'dark' : 'light'].text,
    marginBottom: spacing.large,
    textAlign: 'center',
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
    marginTop: spacing.medium,
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
});

export default FilterModal;