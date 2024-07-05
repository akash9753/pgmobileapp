import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useGlobalState } from '../context/GlobalState';

const Footer = () => {
  const { setScreen, isAuth } = useGlobalState();

  if (!isAuth) return null;

  return (
    <View style={styles.footer}>
      <Button title="Home" onPress={() => setScreen('Home')} />
      <Button title="Profile" onPress={() => setScreen('Profile')} />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#eee',
  },
});

export default Footer;
