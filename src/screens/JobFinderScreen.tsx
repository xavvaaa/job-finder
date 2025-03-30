import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { useJobContext } from "../contexts/JobContext";
import JobItem from "../components/JobItem";
import SearchBar from "../components/SearchBar";
import { useTheme } from "../contexts/ThemeContext";
import FilterModal from "../components/FilterModal";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { createJobFinderScreenStyles } from "../styles/components/JobFinderScreenStyles";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/theme";

const JobFinderScreen = () => {
  const {
    jobs: originalJobs,
    fetchJobs,
    savedJobs,
    saveJob,
    isLoading,
    error,
    searchJobs,
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
    filters,
    setFilters,
  } = useJobContext();

  const [displayedJobs, setDisplayedJobs] = useState(originalJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const styles = createJobFinderScreenStyles(theme === "dark");

  useEffect(() => {
    setDisplayedJobs(originalJobs);
  }, [originalJobs]);

  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim() || originalJobs.length === 0) return [];
    const term = searchTerm.toLowerCase();
    const suggestions = new Set<string>();

    originalJobs.forEach((job) => {
      if (job.title.toLowerCase().includes(term)) suggestions.add(job.title);
      if (job.company.toLowerCase().includes(term)) suggestions.add(job.company);
      if (job.location?.toLowerCase().includes(term)) suggestions.add(job.location);
    });

    return Array.from(suggestions).slice(0, 5);
  }, [searchTerm, originalJobs]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        searchJobs(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, searchJobs]);

  const handleSearchSubmit = useCallback(() => {
    if (searchTerm.trim()) {
      addToSearchHistory(searchTerm);
      setIsSearchFocused(false);
    }
  }, [searchTerm, addToSearchHistory]);

  const handleRecentSearchSelect = useCallback(
    (term: string) => {
      setSearchTerm(term);
      searchJobs(term);
      setIsSearchFocused(false);
    },
    [searchJobs]
  );

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    searchJobs("");
  }, [searchJobs]);

  const shuffleJobs = useCallback(() => {
    setDisplayedJobs(prevJobs => {
      const shuffled = [...prevJobs];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      shuffleJobs();
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setRefreshing(false);
    }
  }, [shuffleJobs]);

  useEffect(() => {
    fetchJobs().catch((err) => console.error("Initial data load failed:", err));
  }, [fetchJobs]);

  if (isLoading && !refreshing && originalJobs.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isSearchFocused && (
        <TouchableWithoutFeedback onPress={() => setIsSearchFocused(false)}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>
      )}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Finder</Text>
        <View style={styles.headerActions}>
          <ThemeToggleButton onPress={toggleTheme} />
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
            <Ionicons
              name="filter"
              size={24}
              color={theme === "dark" ? colors.dark.text : colors.light.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchTerm}
          onChangeText={setSearchTerm}
          onClear={handleClearSearch}
          onSearch={handleSearchSubmit}
          recentSearches={searchHistory}
          onRecentSearchSelect={handleRecentSearchSelect}
          isExpanded={isSearchFocused}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />

        {searchTerm && isSearchFocused && (
          <View style={styles.suggestionsContainer}>
            {searchSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => {
                  setSearchTerm(suggestion);
                  searchJobs(suggestion);
                  setIsSearchFocused(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <FlatList
        data={displayedJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobItem 
            job={item} 
            onSave={() => saveJob(item)} 
            isSaved={savedJobs.some((saved) => saved.id === item.id)} 
          />
        )}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={theme === "dark" ? ["#fff"] : ["#000"]}
            tintColor={theme === "dark" ? "#fff" : "#000"}
          />
        }
        ListEmptyComponent={<Text style={styles.noJobsText}>{refreshing ? "Refreshing..." : "No jobs found"}</Text>}
      />

      <FilterModal visible={showFilters} onClose={() => setShowFilters(false)} filters={filters} setFilters={setFilters} />
    </View>
  );
};

export default JobFinderScreen;