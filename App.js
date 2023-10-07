import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from 'react-native-gesture-handler';


import SetupPage from "./SetupPage";
import TimerPage from "./TimerPage";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="SetupPage" component={SetupPage} />
          <Tab.Screen options={{ unmountOnBlur: true }} name="TimerPage" component={TimerPage} />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}