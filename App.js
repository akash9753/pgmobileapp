import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GlobalStateProvider, useGlobalState } from './context/GlobalState';
import Home from './screens/Home';
import Login from './screens/Login';
import Profile from './screens/Profile';
import Register from './screens/Register';
import Footer from './components/Footer';

const MainApp = () => {
  const { currentScreen } = useGlobalState();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <Home />;
      case 'Login':
        return <Login />;
      case 'Profile':
        return <Profile />;
      case 'Register':
        return <Register />;
      default:
        return <Login />;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
      <Footer />
      <StatusBar style="auto" />
    </View>
  );
};

export default function App() {
  return (
    <GlobalStateProvider>
      <MainApp />
    </GlobalStateProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
