import React, { useContext, useState, useEffect } from 'react';
import { View, Button, TextInput, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LoginContext from './LoginContext';
import { Dimensions } from "react-native";
import { loadSessionBreathHoldMetrics } from './FirebaseFuntions';
import BreathBarChart from './BreathBarChart'; // Import the new component

const LoginPage = () => {
  const { user, login, signup, logout } = useContext(LoginContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [chartData, setChartData] = useState(null);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    if (user && user.email) {
      loadSessionBreathHoldMetrics(user.email, 10) // Assuming you want to fetch 10 records
        .then(data => setChartData(data))
        .catch(error => console.error("Error fetching chart data:", error));
    }
  }, [user]);

  const reloadChartData = () => {
    if (user && user.email) {
      loadSessionBreathHoldMetrics(user.email, 10) // Assuming you want to fetch 10 records
        .then(data => setChartData(data))
        .catch(error => console.error("Error reloading chart data:", error));
    }
  };

  if (!user) {
    // show login page
    return (
      <View style={styles.container}>
        <Text>Login</Text>
        <TextInput
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          style={styles.input}
        />
        <TextInput
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry
          style={styles.input}
        />
        <Button
          title="Login"
          onPress={() => login(email, password)}
        />
        <Text>Sign up</Text>
        <Button
          title="Sign Up"
          onPress={() => signup(email, password)}
        />
      </View>
    );
  }

  // Loading indicator until data is fetched
  if (!chartData) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text>Welcome, {user.email}</Text>
      <Button title="Log Out" onPress={logout} />
      <BreathBarChart chartData={chartData} />
      <Button title="Reload Data" onPress={reloadChartData} style={styles.reloadButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    margin: 10,
    width: '80%',
  },
  // Add any additional styles if needed
});

export default LoginPage;
