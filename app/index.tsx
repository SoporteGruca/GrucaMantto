import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Provider } from 'mobx-react';
import Login from "./Routes/Login";
import userStore from "./store";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <Provider store={userStore}>
        <Stack.Navigator initialRouteName="Login"
          screenOptions={{
          headerShown: false}}>
          <Stack.Screen
            options={{ headerShown: false}} 
            name="Login"
            component={Login}/>
        </Stack.Navigator>
    </Provider>
  );
}
