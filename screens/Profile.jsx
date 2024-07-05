import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useGlobalState } from '../context/GlobalState';

const Profile = () => {
  const { logout, userDetail } = useGlobalState();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TextInput
        style={styles.input}
        value={userDetail.firstName}
        editable={false}
        placeholder="First Name"
      />
      <TextInput
        style={styles.input}
        value={userDetail.lastName}
        editable={false}
        placeholder="Last Name"
      />
      <TextInput
        style={styles.input}
        value={userDetail.email}
        editable={false}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        value={userDetail.mobile}
        editable={false}
        placeholder="Mobile"
      />
      <Button title="Logout" onPress={logout} />
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
    backgroundColor: '#e9ecef',
  },
});

export default Profile;
