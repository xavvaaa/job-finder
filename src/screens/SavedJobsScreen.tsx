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
import ThemeToggleButton from "../components/ThemeToggleButton";
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

    useEffect(() => {
        navigation.setOptions({
            title: `Saved Jobs`,
        });
    }, [savedJobs.length]);

    const handleBrowseJobs = () => {
        navigation.navigate("JobStack", { screen: "Jobs" });
    };

    const handleUnsaveJob = (jobId: string) => {
        Alert.alert(
            "Remove Saved Job",
            "Are you sure you want to remove this job from your saved list?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Unsave",
                    onPress: async () => {
                        await removeSavedJob(jobId); 
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
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Saved Jobs</Text>
                <ThemeToggleButton onPress={toggleTheme} />
            </View>

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
                    data={savedJobs}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <JobItem
                            job={item}
                            onSave={() => handleUnsaveJob(item.id)}
                            isSaved={true}
                            hideButtons={false}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
};

const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors[isDark ? "dark" : "light"].background,
        },
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: spacing.medium,
            borderBottomWidth: 1,
            borderBottomColor: colors[isDark ? "dark" : "light"].border,
        },
        headerTitle: {
            fontSize: fontSizes.xlarge,
            fontWeight: "bold",
            color: colors[isDark ? "dark" : "light"].text,
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
