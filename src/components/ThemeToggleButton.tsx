import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { themeToggleButtonStyles } from '../styles/components/ThemeToggleButtonStyles';

const ThemeToggleButton = ({ onPress }: { onPress: () => void }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={themeToggleButtonStyles.button}
    >
      <Ionicons 
        name={theme === 'dark' ? 'sunny' : 'moon'} 
        size={24} 
        color={theme === 'dark' ? '#fff' : '#000'} 
      />
    </TouchableOpacity>
  );
};

export default ThemeToggleButton;