import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGlobalState } from '../context/GlobalState';
import AdminHome from '../components/AdminHome';
import UserHome from '../components/UserHome';

const Home = () => {
  const { userDetail } = useGlobalState();
  console.log('====================================');
  console.log(userDetail);
  console.log('====================================');
  return (
    <View style={styles.container}>
      {userDetail ? (
        userDetail.role === 4 ? (
          <AdminHome />
        ) : (
          <UserHome />
        )
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default Home;
