import { StyleSheet } from 'react-native';
import { spacing } from './theme';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.medium
  },
  safeArea: {
    flex: 1
  },
  card: {
    borderRadius: 8,
    padding: spacing.medium,
    marginVertical: spacing.small,
    elevation: 2
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: spacing.small
  },
  button: {
    padding: spacing.small,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontWeight: 'bold'
  }
});