import React, { useContext, useState } from 'react';
import { View, Button, TextInput, Text, StyleSheet } from 'react-native';
import LoginContext from './LoginContext';

const LoginPage = () => {
  const { user, token, login, signup, logout } = useContext(LoginContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user && token) {
    return (
      <View style={styles.container}>
        <Text>Welcome, {user.email}</Text>
        <Button
          title="Log Out"
          onPress={logout}
        />
      </View>
    );
  }

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
