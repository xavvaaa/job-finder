import { StyleSheet } from 'react-native';
import { colors, spacing, fontSizes } from '../theme';
import { globalStyles } from '../globalStyles';

export const createFilterModalStyles = (isDark: boolean) => {
  const themeColors = isDark ? colors.dark : colors.light;
  
  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
      width: '90%',
      padding: spacing.large,
      borderRadius: 8,
      backgroundColor: themeColors.cardBackground,
      elevation: 4,
    },
    modalTitle: {
      fontSize: fontSizes.xlarge,
      fontWeight: 'bold',
      marginBottom: spacing.large,
      textAlign: 'center',
      color: themeColors.text
    },
    filterItem: {
      marginBottom: spacing.medium
    },
    filterLabel: {
      fontSize: fontSizes.medium,
      marginBottom: spacing.small,
      color: themeColors.secondaryText
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.large
    },
    input: {
      ...globalStyles.input,
      backgroundColor: themeColors.inputBackground,
      borderColor: themeColors.border,
      color: themeColors.text
    },
    resetButton: {
      ...globalStyles.button,
      backgroundColor: colors.light.danger
    },
    cancelButton: {
      ...globalStyles.button,
      backgroundColor: themeColors.border
    },
    applyButton: {
      ...globalStyles.button,
      backgroundColor: themeColors.success
    },
    buttonText: {
      ...globalStyles.buttonText,
      color: themeColors.text
    }
  });
};