import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export interface ApplicationFormProps {
  onApply: (data: {
    name: string;
    email: string;
    contactNumber: string;
    reason: string;
  }) => Promise<void>;
  onClose: () => void;
  fromSavedJobs?: boolean;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  onApply,
  onClose,
  fromSavedJobs = false
}) => {
  const { theme } = useTheme();
  const colors = theme === 'dark' ? darkColors : lightColors;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    reason: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    contactNumber: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateName = (name: string) => {
    if (!name.trim()) return 'Name is required';
    if (name.length < 3) return 'Name must be at least 3 characters';
    return '';
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email';
    return '';
  };

  const validateContactNumber = (number: string) => {
    if (!number.trim()) return 'Contact number is required';
    const numberRegex = /^\d{10}$/;
    if (!numberRegex.test(number)) return 'Must be 10 digits';
    return '';
  };

  const validateReason = (reason: string) => {
    if (!reason.trim()) return 'Reason is required';
    if (reason.length < 20) return 'Please provide more details (min 20 chars)';
    return '';
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      contactNumber: validateContactNumber(formData.contactNumber),
      reason: validateReason(formData.reason)
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onApply(formData);
      setFormData({
        name: '',
        email: '',
        contactNumber: '',
        reason: ''
      });
      if (fromSavedJobs) {
        onClose();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingContainer}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContainer, { backgroundColor: colors.cardBackground }]}
          keyboardShouldPersistTaps="handled"
        >
            <View style={styles.headerContainer}>
              <Text style={[styles.title, { color: colors.text }]}>Job Application</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
            <Text style={[styles.example, { color: colors.secondaryText }]}>e.g., John Doe</Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: errors.name ? colors.error : colors.border,
                  backgroundColor: colors.inputBackground
                }
              ]}
              placeholder="Enter your full name"
              placeholderTextColor={colors.placeholderText}
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
            />
            {errors.name ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.name}</Text> : null}
          </View>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
            <Text style={[styles.example, { color: colors.secondaryText }]}>e.g., john@example.com</Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: errors.email ? colors.error : colors.border,
                  backgroundColor: colors.inputBackground
                }
              ]}
              placeholder="Enter your email"
              placeholderTextColor={colors.placeholderText}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
            />
            {errors.email ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.email}</Text> : null}
          </View>

          {/* Contact Number Field */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Contact Number</Text>
            <Text style={[styles.example, { color: colors.secondaryText }]}>e.g., 9123456789</Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: errors.contactNumber ? colors.error : colors.border,
                  backgroundColor: colors.inputBackground
                }
              ]}
              placeholder="Enter 10-digit number"
              placeholderTextColor={colors.placeholderText}
              keyboardType="phone-pad"
              maxLength={10}
              value={formData.contactNumber}
              onChangeText={(text) => handleChange('contactNumber', text.replace(/[^0-9]/g, ''))}
            />
            {errors.contactNumber ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.contactNumber}</Text> : null}
          </View>

          {/* Fixed Text Area */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Why should we hire you?</Text>
            <Text style={[styles.example, { color: colors.secondaryText }]}>Minimum 20 characters</Text>

            <View style={{ height: 120 }}>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    color: colors.text,
                    borderColor: errors.reason ? colors.error : colors.border,
                    backgroundColor: colors.inputBackground, // Ensure consistency
                  },
                ]}
                placeholder="Explain your qualifications..."
                placeholderTextColor={colors.placeholderText}
                multiline
                textAlignVertical="top"
                scrollEnabled={true}
                value={formData.reason}
                onChangeText={(text) => handleChange('reason', text)}
              />

            </View>

            {errors.reason ? <Text style={[styles.errorText, { color: colors.error }]}>{errors.reason}</Text> : null}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor: isSubmitting ? colors.disabled : colors.primary,
                }
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.cancelButton,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.inputBackground
                }
              ]}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginVertical: 40,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 4,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  example: {
    fontSize: 13,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
  },
  textAreaContainer: {
    height: 140,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  textArea: {
    fontSize: 16,
    height: 120,
    textAlignVertical: 'top',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
  },


  buttonContainer: {
    marginTop: 16,
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
  cancelButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    fontSize: 13,
    marginTop: 6,
  },
});

const darkColors = {
  background: '#121212',
  cardBackground: '#2a2a2a',
  inputBackground: '#333333',
  text: '#ffffff',
  secondaryText: '#aaaaaa',
  placeholderText: '#888888',
  border: '#444',
  primary: '#3b82f6',
  error: '#ff4444',
  disabled: '#555555',
};

const lightColors = {
  background: '#f5f5f5',
  cardBackground: '#ffffff',
  inputBackground: '#f8f8f8',
  text: '#000000',
  secondaryText: '#666666',
  placeholderText: '#999999',
  border: '#ddd',
  primary: '#3b82f6',
  error: '#ff4444',
  disabled: '#cccccc',
};

export default ApplicationForm;