import React from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';

import SetupPage from "./SetupPage";
import TimerPage from "./TimerPage";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'SetupPage') {
                iconName = focused ? 'ios-settings' : 'ios-settings-outline';
              } else if (route.name === 'TimerPage') {
                iconName = focused ? 'ios-timer' : 'ios-timer-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarInactiveTintColor: 'gray',
            tabBarActiveTintColor: 'tomato',
          })}
        >
          <Tab.Screen name="SetupPage" component={SetupPage} />
          <Tab.Screen
            name="TimerPage"
            component={TimerPage}
            options={{
              unmountOnBlur: true,
              tabBarButton: () => null   // Disable the button press but tab is still visible
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
