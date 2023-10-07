import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SetupPage from "./SetupPage";
import TimerPage from "./TimerPage";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="SetupPage" component={SetupPage} />
        <Tab.Screen options={{ unmountOnBlur: true }} name="TimerPage" component={TimerPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}