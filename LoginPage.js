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
  const chartColumns = 7;

  useEffect(() => {
    if (user && user.email) {
      loadSessionBreathHoldMetrics(user.email, chartColumns)
        .then(data => setChartData(data))
        .catch(error => console.error("Error fetching chart data:", error));
    }
  }, [user]);

  const reloadChartData = () => {
    if (user && user.email) {
      loadSessionBreathHoldMetrics(user.email, chartColumns)
        .then(data => setChartData(data))
        .catch(error => console.error("Error reloading chart data:", error));
    }
  };

  if (!user) {
    // show login page
    return (
      <View style={styles.loginContainer}>
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
        <View style={styles.Button}>
          <Button
            title="Login"
            onPress={() => login(email, password)}
          />
        </View>
        <View style={styles.Button}>
          <Button
            title="Sign Up"
            onPress={() => signup(email, password)}
          />
        </View>
      </View>
    );
  }

  // Loading indicator until data is fetched
  if (!chartData) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.detailsContainer}>
      <View style={styles.header}>
        <Text>Welcome, {user.email}</Text>
        <Button title="Log Out" onPress={logout} />
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.title}>Your Breath Hold Progress</Text>
        <BreathBarChart chartData={chartData} />
        <Button title="Reload Data" onPress={reloadChartData} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  detailsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  header: {
    alignItems: 'space-between',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    backgroundColor: 'white', // Light background for header
  },
  chartSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'white', // Light background for title
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    margin: 10,
    width: '80%',
  },
  Button: {
    margin: 10,
  },
});

export default LoginPage;
