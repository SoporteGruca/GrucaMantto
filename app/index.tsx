import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserProvider } from "./Routes/userContext";
// import { useUserContext } from "./Routes/userContext";
import Login from "./Routes/Login";
import React from "react";
import Tickets from "./Routes/Tickets";
import { Provider } from 'react-redux';


const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <UserProvider>

      <Stack.Navigator initialRouteName="Login"
        screenOptions={{
          headerShown: false}}>
        <Stack.Screen
          options={{ headerShown: false}} 
          name="Login"
          component={Login}/>
      </Stack.Navigator>

    </UserProvider>
    
  );
}