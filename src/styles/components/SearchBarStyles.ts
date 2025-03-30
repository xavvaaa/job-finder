import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes } from '../theme';
import { globalStyles } from '../globalStyles';

export const createSearchBarStyles = (isDark: boolean) => {
  const themeColors = isDark ? colors.dark : colors.light;
  
  return StyleSheet.create({
    container: {
      ...globalStyles.card,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.medium,
      margin: spacing.medium,
      height: 40,
    },
    searchIcon: {
      marginRight: spacing.small
    },
    input: {
      ...globalStyles.input,
      flex: 1,
      height: '100%',
      borderWidth: 0,
      backgroundColor: 'transparent',
      color: themeColors.text,
      paddingVertical: 0
    },
    clearButton: {
      padding: spacing.small
    },
    recentSearchesContainer: {
      backgroundColor: themeColors.cardBackground,
      borderRadius: 8,
      marginTop: spacing.small,
      maxHeight: 200,
      elevation: 3,
    },
    recentSearchItem: {
      padding: spacing.medium,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
    },
  });
};