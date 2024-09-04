import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import Login from "./Login";
import Index from "../index";
import React from "react";

const Stack = createNativeStackNavigator();

export default function Root () {
  return (

    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen options={{ headerShown: false}} name="index" component={Index} />
      <Stack.Screen options={{ headerShown: false}} name="Login" component={Login} />
    </Stack.Navigator>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  }
});
