import { StyleSheet } from 'react-native';
import { spacing } from '../theme';  // Fixed path
import { globalStyles } from '../globalStyles';  // Fixed path

export const createThemeToggleButtonStyles = () => {
  return StyleSheet.create({
    button: {
      ...globalStyles.button,
      padding: spacing.medium,
      borderRadius: 24,
      backgroundColor: 'transparent',
    }
  });
};

// Add this named export if your component is using it
export const themeToggleButtonStyles = createThemeToggleButtonStyles();