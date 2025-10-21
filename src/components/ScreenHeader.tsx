import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggleButton from './ThemeToggleButton';
import { colors, spacing, fontSizes } from '../styles/theme';

interface ScreenHeaderProps {
  title: string;
  showThemeToggle?: boolean;
  showFilter?: boolean;
  onFilterPress?: () => void;
  badge?: number;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showThemeToggle = true,
  showFilter = false,
  onFilterPress,
  badge,
  leftComponent,
  rightComponent,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const styles = createStyles(isDark);

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <Text style={styles.headerTitle}>{title}</Text>
        {badge !== undefined && badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.rightSection}>
        {rightComponent}
        
        {showFilter && onFilterPress && (
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onFilterPress}
          >
            <Ionicons
              name="filter"
              size={24}
              color={colors[theme].text}
            />
          </TouchableOpacity>
        )}
        
        {showThemeToggle && <ThemeToggleButton onPress={toggleTheme} />}
      </View>
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors[isDark ? 'dark' : 'light'].border,
    backgroundColor: colors[isDark ? 'dark' : 'light'].background,
    zIndex: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.small,
  },
  headerTitle: {
    fontSize: fontSizes.xlarge,
    fontWeight: 'bold',
    color: colors[isDark ? 'dark' : 'light'].text,
  },
  badge: {
    backgroundColor: colors[isDark ? 'dark' : 'light'].primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xsmall,
  },
  badgeText: {
    color: '#fff',
    fontSize: fontSizes.small,
    fontWeight: 'bold',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.small,
  },
  iconButton: {
    padding: spacing.xsmall,
  },
});

export default ScreenHeader;
