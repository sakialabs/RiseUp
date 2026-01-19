import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../lib/auth';

const CAUSES = [
  'Racial Justice',
  'Climate Justice',
  'Workers Rights',
  'Housing Justice',
  'Education Access',
  'Healthcare for All',
  'LGBTQ+ Rights',
  'Immigrant Rights',
  'Food Security',
  'Disability Rights',
];

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [profileType, setProfileType] = useState<'individual' | 'organization'>('individual');
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const toggleCause = (cause: string) => {
    if (selectedCauses.includes(cause)) {
      setSelectedCauses(selectedCauses.filter((c) => c !== cause));
    } else {
      setSelectedCauses([...selectedCauses, cause]);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !name) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (selectedCauses.length === 0) {
      setError('Please select at least one cause');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await register(email, password, name, profileType, selectedCauses);
      router.replace('/feed');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Join the Cause ✊</Text>
          <Text style={styles.subtitle}>Find your people. Take action. Build power together.</Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name or organization"
                placeholderTextColor="#999"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor="#999"
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="At least 8 characters"
                placeholderTextColor="#999"
                secureTextEntry
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Profile Type</Text>
              <View style={styles.profileTypeButtons}>
                <Pressable
                  style={[
                    styles.profileTypeButton,
                    profileType === 'individual' && styles.profileTypeButtonActive,
                  ]}
                  onPress={() => setProfileType('individual')}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.profileTypeButtonText,
                      profileType === 'individual' && styles.profileTypeButtonTextActive,
                    ]}
                  >
                    Individual
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.profileTypeButton,
                    profileType === 'organization' && styles.profileTypeButtonActive,
                  ]}
                  onPress={() => setProfileType('organization')}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.profileTypeButtonText,
                      profileType === 'organization' && styles.profileTypeButtonTextActive,
                    ]}
                  >
                    Organization
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Causes (select at least one)</Text>
              <View style={styles.causesGrid}>
                {CAUSES.map((cause) => (
                  <Pressable
                    key={cause}
                    style={[
                      styles.causeButton,
                      selectedCauses.includes(cause) && styles.causeButtonActive,
                    ]}
                    onPress={() => toggleCause(cause)}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.causeButtonText,
                        selectedCauses.includes(cause) && styles.causeButtonTextActive,
                      ]}
                    >
                      {cause}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FAF9F6" />
              ) : (
                <Text style={styles.buttonText}>Show Up</Text>
              )}
            </Pressable>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/auth/login" asChild>
                <Pressable>
                  <Text style={styles.link}>Log In</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#1C1C1C',
    opacity: 0.7,
    marginBottom: 30,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1C',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#1C1C1C',
  },
  profileTypeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  profileTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1C1C1C',
    alignItems: 'center',
  },
  profileTypeButtonActive: {
    backgroundColor: '#1C1C1C',
  },
  profileTypeButtonText: {
    color: '#1C1C1C',
    fontSize: 14,
    fontWeight: '600',
  },
  profileTypeButtonTextActive: {
    color: '#FAF9F6',
  },
  causesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  causeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2F5D3A',
  },
  causeButtonActive: {
    backgroundColor: '#2F5D3A',
  },
  causeButtonText: {
    color: '#2F5D3A',
    fontSize: 13,
    fontWeight: '500',
  },
  causeButtonTextActive: {
    color: '#FAF9F6',
  },
  button: {
    backgroundColor: '#B11226',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FAF9F6',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#1C1C1C',
    fontSize: 14,
  },
  link: {
    color: '#B11226',
    fontSize: 14,
    fontWeight: '600',
  },
});
