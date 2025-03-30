import { StyleSheet } from "react-native";
import { colors, spacing, fontSizes } from '../theme';
import { globalStyles } from '../globalStyles';

export const createAppliedJobsScreenStyles = (isDarkMode: boolean) => {
  const themeColors = isDarkMode ? colors.dark : colors.light;
  
  return StyleSheet.create({
    container: {
      ...globalStyles.container,
      backgroundColor: themeColors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.medium,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
    },
    backButton: {
      marginRight: spacing.medium,
    },
    title: {
      fontSize: fontSizes.large,
      fontWeight: 'bold',
      color: themeColors.text,
    },
    listContainer: {
      padding: spacing.medium,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xlarge,
    },
    emptyText: {
      fontSize: fontSizes.medium,
      color: themeColors.secondaryText,
      marginTop: spacing.medium,
      marginBottom: spacing.large,
      textAlign: 'center',
    },
    browseButton: {
      ...globalStyles.button,
      backgroundColor: themeColors.primary,
      paddingHorizontal: spacing.large,
      paddingVertical: spacing.medium,
    },
    browseButtonText: {
      ...globalStyles.buttonText,
      color: themeColors.text,
    },
  });
};