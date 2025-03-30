import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes } from '../theme';
import { globalStyles } from '../globalStyles';

export const createJobItemStyles = (isDark: boolean) => {
  const themeColors = isDark ? colors.dark : colors.light;
  
  return StyleSheet.create({
    card: {
      ...globalStyles.card,
      backgroundColor: themeColors.cardBackground,
      padding: spacing.medium,
      marginVertical: spacing.small,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.small,
    },
    logoContainer: {
      marginRight: spacing.medium,
    },
    logoImage: {
      width: 50,
      height: 50,
      borderRadius: 8,
    },
    logoFallback: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: themeColors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoText: {
      color: themeColors.text,
      fontSize: fontSizes.xlarge,
      fontWeight: 'bold',
    },
    companyInfo: {
      flex: 1,
    },
    title: {
      fontSize: fontSizes.large,
      fontWeight: 'bold',
      color: themeColors.text,
      marginBottom: 4,
    },
    companyName: {
      fontSize: fontSizes.medium,
      color: themeColors.secondaryText,
    },
    details: {
      marginTop: spacing.small,
    },
    salary: {
      fontSize: fontSizes.medium,
      fontWeight: 'bold',
      color: themeColors.primary,
      marginBottom: spacing.small,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    location: {
      fontSize: fontSizes.small,
      color: themeColors.secondaryText,
      marginLeft: spacing.small,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.medium,
    },
    button: {
      ...globalStyles.button,
      paddingVertical: spacing.small,
      minWidth: '48%',
    },
    saveButton: {
      backgroundColor: themeColors.primary,
    },
    applyButton: {
      backgroundColor: themeColors.primary,
    },
    buttonText: {
      ...globalStyles.buttonText,
      color: themeColors.text,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    appliedButton: {
      backgroundColor: '#10b981', // Different color for applied state
    },
    appliedBadge: {
      backgroundColor: isDark ? '#10b981' : '#059669',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginTop: 4,
    },
    appliedBadgeText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
    },
  });
};