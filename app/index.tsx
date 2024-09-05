import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from "react-native";
import Login from "./Routes/Login";
import React from "react";
import Formulario from "./Routes/Formulario";

const Stack = createNativeStackNavigator();

export default function App() {
  return (

    <Stack.Navigator initialRouteName="Login">
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
