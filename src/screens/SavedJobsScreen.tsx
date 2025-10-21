import React, { useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useJobContext } from "../contexts/JobContext";
import JobItem from "../components/JobItem";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors, spacing, fontSizes, borderRadius } from "../styles/theme";
import ScreenHeader from "../components/ScreenHeader";
import FilterModal from "../components/FilterModal";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigation";

type SavedJobsScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "SavedJobs"
>;

const SavedJobsScreen = () => {
    const { savedJobs, removeSavedJob, saveJob, jobs, isLoading } = useJobContext();
    const { theme, toggleTheme } = useTheme();
    const navigation = useNavigation<SavedJobsScreenNavigationProp>();
    const styles = createStyles(theme === "dark");
    const [showFilters, setShowFilters] = React.useState(false);
    const [filters, setFilters] = React.useState<any>({});

    // Filter saved jobs based on filter criteria
    const filteredJobs = React.useMemo(() => {
        let filtered = [...savedJobs];

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
    }, [savedJobs, filters]);

    useEffect(() => {
        navigation.setOptions({
            title: `Saved Jobs`,
        });
    }, [savedJobs.length]);

    const handleBrowseJobs = () => {
        (navigation as any).navigate("JobStack", { screen: "Jobs" });
    };

    const handleUnsaveJob = (job: any) => {
        Alert.alert(
            "Remove Saved Job",
            `Remove "${job.title}" from your saved jobs?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => {
                        removeSavedJob(job); 
                    },
                },
            ]
        );
    };

    if (isLoading && jobs.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors[theme].primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScreenHeader
                title="Saved Jobs"
                badge={savedJobs.length}
                showThemeToggle={true}
                showFilter={true}
                onFilterPress={() => setShowFilters(true)}
            />

            {savedJobs.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons
                        name="bookmark-outline"
                        size={64}
                        color={colors[theme].secondaryText}
                    />
                    <Text style={styles.emptyText}>No saved jobs yet</Text>
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
                            onSave={() => handleUnsaveJob(item)}
                            isSaved={true}
                            hideButtons={false}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
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

const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors[isDark ? "dark" : "light"].background,
        },
        listContainer: {
            padding: spacing.medium,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: spacing.large,
        },
        emptyText: {
            fontSize: fontSizes.medium,
            marginTop: spacing.medium,
            marginBottom: spacing.large,
            color: colors[isDark ? "dark" : "light"].secondaryText,
            textAlign: "center",
        },
        loadingContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        browseButton: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors[isDark ? "dark" : "light"].primary,
            paddingHorizontal: spacing.large,
            paddingVertical: spacing.medium,
            borderRadius: borderRadius.medium,
        },
        browseButtonIcon: {
            marginRight: spacing.small,
        },
        browseButtonText: {
            color: "white",
            fontWeight: "bold",
            fontSize: fontSizes.medium,
        },
    });

export default SavedJobsScreen;
