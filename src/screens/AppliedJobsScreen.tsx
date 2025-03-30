import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl } from "react-native";
import { useJobContext } from "../contexts/JobContext";
import JobItem from "../components/JobItem";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { colors, spacing, fontSizes, borderRadius } from "../styles/theme";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/Navigation';
import { Job } from "../types/Job";
import AsyncStorage from '@react-native-async-storage/async-storage';

type AppliedJobsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AppliedJobs'
>;

const AppliedJobsScreen = () => {
    const { 
        jobs, 
        isLoading, 
        fetchJobs,
    } = useJobContext();
    const { theme, toggleTheme } = useTheme();
    const navigation = useNavigation<AppliedJobsScreenNavigationProp>();
    const isFocused = useIsFocused();
    const styles = createStyles(theme === 'dark');
    const [appliedJobsWithDetails, setAppliedJobsWithDetails] = useState<Job[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

    useEffect(() => {
        const loadAppliedJobIds = async () => {
            try {
                const savedAppliedJobs = await AsyncStorage.getItem('appliedJobs');
                if (savedAppliedJobs) {
                    const parsedAppliedJobs = JSON.parse(savedAppliedJobs);
                    setAppliedJobIds(parsedAppliedJobs);
                }
            } catch (error) {
                console.error("Failed to load applied jobs:", error);
            }
        };

        loadAppliedJobIds();
    }, [isFocused]);

    useEffect(() => {
        const loadAppliedJobsDetails = () => {
            const appliedJobsDetails = jobs.filter(job => 
                appliedJobIds.includes(job.id)
            );
            setAppliedJobsWithDetails(appliedJobsDetails);
        };

        loadAppliedJobsDetails();
    }, [appliedJobIds, jobs]);

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
        navigation.navigate("JobStack", { screen: "Jobs" });
    };

    if (isLoading && !isRefreshing && jobs.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors[theme].primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Applied Jobs</Text>
                <ThemeToggleButton onPress={toggleTheme} />
            </View>

            {appliedJobsWithDetails.length === 0 ? (
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
                    data={appliedJobsWithDetails}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.medium,
        borderBottomWidth: 1,
        borderBottomColor: colors[isDark ? 'dark' : 'light'].border,
    },
    headerTitle: {
        fontSize: fontSizes.xlarge,
        fontWeight: 'bold',
        color: colors[isDark ? 'dark' : 'light'].text,
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