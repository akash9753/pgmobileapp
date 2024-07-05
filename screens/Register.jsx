import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useGlobalState } from '../context/GlobalState';

const Register = () => {
  const { startLoading, stopLoading, setScreen, isLoading } = useGlobalState();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateMobile = (mobile) => {
    const regex = /^\d{10}$/;
    return regex.test(mobile);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!validateEmail(form.email)) newErrors.email = 'Invalid email format';
    if (!validateMobile(form.mobile)) newErrors.mobile = 'Mobile number must be 10 digits';
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name, value) => {
    setForm((prevForm) => {
      const updatedForm = { ...prevForm, [name]: value };
      const fieldErrors = {};

      if (name === 'email' && !validateEmail(value)) {
        fieldErrors.email = 'Invalid email format';
      } else if (name === 'mobile' && !validateMobile(value)) {
        fieldErrors.mobile = 'Mobile number must be 10 digits';
      } else if (name === 'password' && value.length < 6) {
        fieldErrors.password = 'Password must be at least 6 characters';
      } else if (name === 'confirmPassword' && value !== updatedForm.password) {
        fieldErrors.confirmPassword = 'Passwords do not match';
      } else {
        fieldErrors[name] = !value.trim() ? `${name.charAt(0).toUpperCase() + name.slice(1)} is required` : '';
      }

      setErrors((prevErrors) => ({ ...prevErrors, ...fieldErrors }));
      return updatedForm;
    });
  };

  const handleRegister = async () => {
    if (!validateFields()) return;

    startLoading();

    try {
      const response = await axios.post('https://pghus.pghustul.xyz/auth/register', form);

      if (response.data.status) {
        alert('Registration successful! Please log in.');
        setScreen('Login');
      } else {
        alert('Registration failed. Please check your details.');
      }
    } catch (error) {
      alert('Registration failed. Please check your details.');
    } finally {
      stopLoading();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={form.firstName}
        onChangeText={(text) => handleChange('firstName', text)}
      />
      {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={form.lastName}
        onChangeText={(text) => handleChange('lastName', text)}
      />
      {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Mobile"
        value={form.mobile}
        onChangeText={(text) => handleChange('mobile', text)}
        keyboardType="phone-pad"
      />
      {errors.mobile ? <Text style={styles.errorText}>{errors.mobile}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={form.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
      />
      {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChangeText={(text) => handleChange('confirmPassword', text)}
        secureTextEntry
      />
      {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
      </TouchableOpacity>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => setScreen('Login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    color: '#1E90FF',
    fontSize: 14,
  },
});

export default Register;
