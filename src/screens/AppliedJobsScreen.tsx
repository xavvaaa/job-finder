import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl } from "react-native";
import { useJobContext } from "../contexts/JobContext";
import JobItem from "../components/JobItem";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { colors, spacing, fontSizes, borderRadius } from "../styles/theme";
import ScreenHeader from "../components/ScreenHeader";
import FilterModal from "../components/FilterModal";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Navigation';
import { Job } from "../types/Job";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

type AppliedJobsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AppliedJobs'
>;

const AppliedJobsScreen = () => {
    const { 
        allJobs,
        isLoading, 
        fetchJobs,
        appliedJobs,
    } = useJobContext();
    const { theme, toggleTheme } = useTheme();
    const navigation = useNavigation<AppliedJobsScreenNavigationProp>();
    const isFocused = useIsFocused();
    const styles = createStyles(theme === 'dark');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<any>({});

    // Filter applied jobs based on filter criteria
    const filteredJobs = React.useMemo(() => {
        let filtered = [...appliedJobs];

        if (filters.minSalary) {
            filtered = filtered.filter(job => 
                job.salary >= filters.minSalary || 
                (job.minSalary !== null && job.minSalary >= filters.minSalary)
            );
        }

        if (filters.location) {
            filtered = filtered.filter(job =>
                job.location?.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        if (filters.jobType) {
            filtered = filtered.filter(job => job.jobType === filters.jobType);
        }

        if (filters.workModel) {
            filtered = filtered.filter(job => job.workModel === filters.workModel);
        }

        if (filters.seniorityLevel) {
            filtered = filtered.filter(job => job.seniorityLevel === filters.seniorityLevel);
        }

        if (filters.category) {
            filtered = filtered.filter(job => job.mainCategory === filters.category);
        }

        return filtered;
    }, [appliedJobs, filters]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await fetchJobs();
        } catch (error) {
            console.error("Refresh failed:", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleBrowseJobs = () => {
        (navigation as any).navigate("JobStack", { screen: "Jobs" });
    };

    if (isLoading && !isRefreshing && allJobs.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors[theme].primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScreenHeader
                title="Applied Jobs"
                badge={appliedJobs.length}
                showThemeToggle={true}
                showFilter={true}
                onFilterPress={() => setShowFilters(true)}
            />

            {appliedJobs.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons
                        name="document-text-outline"
                        size={64}
                        color={colors[theme].secondaryText}
                    />
                    <Text style={styles.emptyText}>No applications submitted yet</Text>
                    <TouchableOpacity 
                        style={styles.browseButton}
                        onPress={handleBrowseJobs}
                    >
                        <Ionicons 
                            name="search" 
                            size={20} 
                            color="white" 
                            style={styles.browseButtonIcon}
                        />
                        <Text style={styles.browseButtonText}>Browse Jobs</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredJobs}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <JobItem
                            job={item}
                            onSave={() => {}}
                            isSaved={true}
                            hideButtons={true}
                            fromSavedJobs={true}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            colors={[colors[theme].primary]}
                            tintColor={colors[theme].primary}
                        />
                    }
                />
            )}

            <FilterModal
                visible={showFilters}
                onClose={() => setShowFilters(false)}
                filters={filters}
                setFilters={setFilters}
            />
        </View>
    );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors[isDark ? 'dark' : 'light'].background,
    },
    listContainer: {
        padding: spacing.medium,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.large,
    },
    emptyText: {
        fontSize: fontSizes.medium,
        marginTop: spacing.medium,
        marginBottom: spacing.large,
        color: colors[isDark ? 'dark' : 'light'].secondaryText,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    browseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors[isDark ? 'dark' : 'light'].primary,
        paddingHorizontal: spacing.large,
        paddingVertical: spacing.medium,
        borderRadius: borderRadius.medium,
    },
    browseButtonIcon: {
        marginRight: spacing.small,
    },
    browseButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: fontSizes.medium,
    },
});

export default AppliedJobsScreen;