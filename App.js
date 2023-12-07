import React from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import { AudioProvider } from './AudioContext';
import { LoginProvider } from './LoginContext';

import LoginPage from './LoginPage';
import SetupPage from "./SetupPage";
import TimerPage from "./TimerPage";
import AudioPage from "./AudioPage";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <LoginProvider>
          <AudioProvider>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  // Set the icon name based on the route name
                  if (route.name === 'Session') {
                    iconName = focused ? 'ios-settings' : 'ios-settings-outline';
                  } else if (route.name === 'TimerPage') {
                    iconName = focused ? 'ios-timer' : 'ios-timer-outline';
                  } else if (route.name === 'Audio') {
                    iconName = focused ? 'ios-musical-notes' : 'ios-musical-notes-outline';
                  } else if (route.name === 'User') {
                    iconName = focused ? 'ios-person' : 'ios-person-outline';
                  }

                  // Return the icon component
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarInactiveTintColor: 'gray',
                tabBarActiveTintColor: 'black',
                headerTitle: "",
                headerStyle: {
                  backgroundColor: 'black',
                  height: 50,
                },
              })}
            >
              <Tab.Screen name="Session" component={SetupPage} />
              <Tab.Screen name="Audio" component={AudioPage} />
              <Tab.Screen name="User" component={LoginPage} />
              <Tab.Screen
                name="TimerPage"
                component={TimerPage}
                options={{
                  unmountOnBlur: true,     // reset the timer when navigating away
                  tabBarButton: () => null // Disable the button press but tab is still visible
                }}
              />
            </Tab.Navigator>
          </AudioProvider>
        </LoginProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

