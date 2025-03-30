import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  FlatList, 
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  onClear: () => void;
  recentSearches: string[];
  onRecentSearchSelect: (term: string) => void;
  isExpanded: boolean;
  onFocus: () => void;
  onBlur?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value, 
  onChangeText,
  onSearch,
  onClear,
  recentSearches,
  onRecentSearchSelect,
  isExpanded,
  onFocus,
  onBlur
}) => {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkColors : lightColors;
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleRecentSearchPress = (term: string) => {
    onRecentSearchSelect(term);
    Keyboard.dismiss();
    setIsFocused(false);  
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={[styles.searchContainer, { backgroundColor: colors.cardBackground }]}>
          <Ionicons 
            name="search" 
            size={20} 
            color={colors.secondaryText}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Search jobs, companies..."
            placeholderTextColor={colors.secondaryText}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={onSearch}
            returnKeyType="search"
            autoCorrect={false}
          />
          {value ? (
            <TouchableOpacity onPress={onClear} style={styles.clearButton}>
              <Ionicons 
                name="close-circle" 
                size={20} 
                color={colors.secondaryText} 
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {isExpanded && isFocused && !value && recentSearches.length > 0 && (
          <View 
            style={[styles.recentSearchesContainer, { 
              backgroundColor: colors.cardBackground,
              borderColor: colors.border
            }]}
            onStartShouldSetResponder={() => true} 
          >
            <Text style={[styles.recentTitle, { color: colors.secondaryText }]}>
              Recent Searches
            </Text>
            <FlatList
              data={recentSearches}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.recentItem}
                  onPress={() => handleRecentSearchPress(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name="time-outline" 
                    size={18} 
                    color={colors.secondaryText}
                    style={styles.recentIcon}
                  />
                  <Text style={[styles.recentText, { color: colors.text }]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              keyboardShouldPersistTaps="handled" 
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  clearButton: {
    marginLeft: 8,
  },
  recentSearchesContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    borderRadius: 10,
    padding: 12,
    maxHeight: 200,
    borderWidth: 1,
    zIndex: 1000,
    elevation: 4,
  },
  recentTitle: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  recentIcon: {
    marginRight: 10,
  },
  recentText: {
    fontSize: 16,
  },
});

const darkColors = {
  cardBackground: '#2a2a2a',
  text: '#ffffff',
  secondaryText: '#aaaaaa',
  border: '#444',
};

const lightColors = {
  cardBackground: '#ffffff',
  text: '#000000',
  secondaryText: '#666666',
  border: '#ddd',
};

export default SearchBar;