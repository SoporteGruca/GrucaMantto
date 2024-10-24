
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from 'mobx-react';
import Formulario from "./Routes/Formulario";
import Login from "./Routes/Login";
import userStore from "./store";
import React from "react";

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
        <Stack.Screen
          options={{ headerShown: false}} 
          name="Formulario"
          component={Formulario}/>
      </Stack.Navigator>
  </Provider>
    
  );
}
