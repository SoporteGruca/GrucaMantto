import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import Login from "./Routes/Login";
import React from "react";
import Root from "./Routes/Roots";

const Stack = createNativeStackNavigator();

export default function Index () {
  return (

    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen options={{ headerShown: false}} name="index" component={Index} />
      <Stack.Screen
        options={{ headerShown: false}} 
        name="Login" 
        component={Login}
        />
    </Stack.Navigator>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  }
});
