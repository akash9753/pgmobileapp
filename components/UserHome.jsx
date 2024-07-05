import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import axios from "axios";
import { useGlobalState } from "../context/GlobalState"; // Import useGlobalState to access the token

const { width, height } = Dimensions.get("window"); // Get the screen width and height

const UserHome = () => {
  const [mealData, setMealData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, userDetail } = useGlobalState(); // Retrieve the token and user from the global state
  const scrollViewRef = useRef();

  const getCurrentDateFormatted = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const todayFormatted = getCurrentDateFormatted();

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    const monthIndex = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ].indexOf(month);
    return new Date(year, monthIndex, day);
  };

  const updateMeal = async (mealdayId, value, name) => {
    const prefrence = name;
    try {
      const response = await axios.post(
        "https://pghus.pghustul.xyz/meal/prefrenceUpdate",
        {
          mealdayId,
          value,
          prefrence,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
    } catch (error) {
      console.error("Error updating meal preference:", error);
    }
  };

  const updatePrefrence = (id, value, name, date) => {
    console.log(id, value, name, date);
    const userId = userDetail._id;

    // Update mealData state immediately
    setMealData((prevPrefrence) => {
      return prevPrefrence.map((pref) => {
        if (pref._id === id) {
          if (name === "breakfast") {
            const updatedArray = value
              ? [...pref.breakfast, userId]
              : pref.breakfast.filter((uid) => uid !== userId);
            return { ...pref, breakfast: updatedArray };
          } else if (name === "lunch") {
            const updatedArray = value
              ? [...pref.lunch, userId]
              : pref.lunch.filter((uid) => uid !== userId);
            return { ...pref, lunch: updatedArray };
          } else if (name === "dinner") {
            const updatedArray = value
              ? [...pref.dinner, userId]
              : pref.dinner.filter((uid) => uid !== userId);
            return { ...pref, dinner: updatedArray };
          }
        }
        return pref;
      });
    });

    // Call the API after updating the state
    updateMeal(id, value, name);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://pghus.pghustul.xyz/meal/prefrenceTotalCount",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data.data);
        if (response.data.success) {
          const sortedData = response.data.data.sort(
            (a, b) => parseDate(a.date) - parseDate(b.date)
          );
          setMealData(sortedData);
        }
      } catch (error) {
        console.error("Error fetching meal data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (!loading && mealData.length > 0) {
      const index = mealData.findIndex((meal) => meal.date === todayFormatted);
      console.log(`Current Date: ${todayFormatted}, Matching Index: ${index}`);
      if (index !== -1) {
        // Center the current date card
        scrollViewRef.current.scrollTo({
          y: index * 200 - height / 2 + 100, // Adjust the offset to center the card
          animated: true,
        });
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
        <View
          key={index}
          style={[
            styles.card,
            meal.date === todayFormatted && styles.currentDateCard,
          ]}
        >
          <Text style={styles.date}>
            {meal.date}, {meal.dayName}
          </Text>
          <View style={styles.mealSection}>
            <MealType
              title="Breakfast"
              updateTime="Update before 5 AM"
              id={meal._id}
              date={meal.date}
              updatePrefrence={updatePrefrence}
              checked={meal.breakfast.includes(userDetail._id)}
            />
            <MealType
              title="Lunch"
              updateTime="Update before 10 AM"
              id={meal._id}
              date={meal.date}
              updatePrefrence={updatePrefrence}
              checked={meal.lunch.includes(userDetail._id)}
            />
            <MealType
              title="Dinner"
              updateTime="Update before 4 PM"
              id={meal._id}
              date={meal.date}
              updatePrefrence={updatePrefrence}
              checked={meal.dinner.includes(userDetail._id)}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const MealType = ({
  title,
  updateTime,
  id,
  date,
  updatePrefrence,
  checked,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handlePress = () => {
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    updatePrefrence(id, newChecked, title.toLowerCase(), date);
  };

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  return (
    <View style={styles.mealType}>
      <Text style={styles.mealTitle}>{title}</Text>
      <TouchableOpacity style={styles.checkboxContainer} onPress={handlePress}>
        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
          {isChecked && <View style={styles.checkboxInner} />}
        </View>
      </TouchableOpacity>
      <Text style={styles.updateTime}>{updateTime}</Text>
      <TouchableOpacity>
        <Text style={styles.checkMenu}>Check Menu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0", // off-white background color
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff", // pure white background color for cards
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: width - 32, // Full width with padding
    alignSelf: "center",
  },
  currentDateCard: {
    borderColor: "green",
    borderWidth: 2,
  },
  date: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  mealSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mealType: {
    alignItems: "center",
    flex: 1,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  checkboxContainer: {
    marginVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#fff", // Set checked color to green
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: "green",
  },
  updateTime: {
    color: "#000",
    marginVertical: 8,
    textAlign: "center", // Center the text
  },
  checkMenu: {
    color: "#1E90FF",
    textDecorationLine: "underline",
  },
});

export default UserHome;
