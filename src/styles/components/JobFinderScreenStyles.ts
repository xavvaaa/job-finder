import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes } from '../theme';
import { globalStyles } from '../globalStyles';

export const createJobFinderScreenStyles = (isDark: boolean) => {
  const themeColors = isDark ? colors.dark : colors.light;

  return StyleSheet.create({
    container: {
      ...globalStyles.container,
      backgroundColor: themeColors.background
    },
    filterButtonText: {
      ...globalStyles.buttonText,
      color: themeColors.text
    },
    searchContainer: {
      position: 'relative' as const,
      zIndex: 10,
      marginBottom: spacing.small
    },
    suggestionsContainer: {
      position: 'absolute' as const,
      top: '100%',
      left: spacing.medium,
      right: spacing.medium,
      borderRadius: 8,
      elevation: 3,
      maxHeight: 200
    },
    suggestionItem: {
      padding: spacing.medium,
      borderBottomWidth: 1,
      backgroundColor: themeColors.cardBackground
    },
    suggestionText: {
      fontSize: fontSizes.medium,
      color: themeColors.text
    },
    historyContainer: {
      marginTop: spacing.small,
      padding: spacing.medium,
      borderRadius: 8,
      backgroundColor: themeColors.cardBackground
    },
    historyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.small
    },
    historyTitle: {
      fontSize: fontSizes.small,
      fontWeight: 'bold',
      color: themeColors.secondaryText
    },
    clearHistory: {
      fontSize: fontSizes.small,
      color: themeColors.primary 
    },
    historyItem: {
      paddingVertical: spacing.small
    },
    historyText: {
      fontSize: fontSizes.medium,
      color: themeColors.text
    },
    noJobsText: {
      textAlign: 'center',
      marginTop: spacing.large,
      fontSize: fontSizes.medium,
      color: themeColors.secondaryText
    },
    errorText: {
      textAlign: 'center',
      margin: spacing.large,
      color: themeColors.error 
    },
    retryButton: {
      ...globalStyles.button,
      backgroundColor: themeColors.primary 
    },
    retryButtonText: {
      ...globalStyles.buttonText,
      color: colors.light.text
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
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.medium,
    },
    filterButton: {
      padding: spacing.small,
    },
    listContainer: {
      flexGrow: 1,
      padding: spacing.medium,
      paddingTop: spacing.small,
      backgroundColor: themeColors.background
    }
  });
};