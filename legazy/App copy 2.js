import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Alert, Text, Button, TextInput } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Countdown } from "react-native-countdown-component";
// ... other firebase imports

function SetupPage({ navigation }) {
  const [duration, setDuration] = useState("30"); // default duration

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Setup your breath holding</Text>

      <Text>Hold duration (seconds):</Text>
      <TextInput
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />

      {/* Pass the duration as a parameter to Page2 when navigating */}
      <Button title="Start" onPress={() => navigation.navigate('TimerPage', { duration: parseInt(duration) })} />
    </View>
  );
}

function TimerPage({ route }) {
  const { duration } = route.params; // Get the passed parameter

  const [remaining, setRemaining] = useState(duration);
  const intervalRef = useRef();

  useEffect(() => {
    if (remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => prev - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current); // Clean up on unmount
  }, [remaining]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{remaining} seconds left</Text>
      {remaining === 0 && <Text>Done!</Text>}
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="SetupPage" component={SetupPage} />
        <Tab.Screen name="TimerPage" component={TimerPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
