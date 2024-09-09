import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import Login from "./Routes/Login";
import React from "react";

const Stack = createNativeStackNavigator();

export default function App() {

  return (

    <Stack.Navigator initialRouteName="Login"
      screenOptions={{
        headerShown: false
    }}>
        
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
