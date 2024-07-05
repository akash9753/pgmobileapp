import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import axios from 'axios';
import { useGlobalState } from '../context/GlobalState';

const { width } = Dimensions.get('window');

const AdminHome = () => {
  const [mealData, setMealData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useGlobalState();
  const scrollViewRef = useRef();

  const getCurrentDateFormatted = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const todayFormatted = getCurrentDateFormatted();

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('-');
    const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(month);
    return new Date(year, monthIndex, day);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://pghus.pghustul.xyz/meal/prefrenceTotalCount', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          const sortedData = response.data.data.sort((a, b) => parseDate(a.date) - parseDate(b.date));
          setMealData(sortedData);
        }
      } catch (error) {
        console.error('Error fetching meal data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (!loading && mealData.length > 0) {
      const index = mealData.findIndex(meal => meal.date === todayFormatted);
      if (index !== -1) {
        scrollViewRef.current.scrollTo({ y: index * 200, animated: true });
      }
    }
  }, [loading, mealData, todayFormatted]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} ref={scrollViewRef}>
      {mealData.map((meal, index) => (
        <View key={index} style={[styles.card, meal.date === todayFormatted && styles.currentDateCard]}>
          <Text style={styles.date}>{meal.date}, {meal.dayName}</Text>
          <View style={styles.mealSection}>
            <MealType type="Breakfast" count={meal.breakfast.length} date={meal.date} />
            <MealType type="Lunch" count={meal.lunch.length} date={meal.date} />
            <MealType type="Dinner" count={meal.dinner.length} date={meal.date} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const MealType = ({ type, count, date }) => {
  return (
    <View style={styles.mealType}>
      <Text style={styles.mealTitle}>{type}</Text>
      <Text style={styles.countText}>{count}</Text>
      <TouchableOpacity style={styles.updateButton}>
        <Text style={styles.updateButtonText}>Update Menu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: width - 32,
    alignSelf: 'center',
  },
  currentDateCard: {
    borderColor: 'green',
    borderWidth: 2,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  mealSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealType: {
    alignItems: 'center',
    flex: 1,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  countText: {
    fontSize: 24,
    marginVertical: 8,
  },
  updateButton: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#007BFF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default AdminHome;
