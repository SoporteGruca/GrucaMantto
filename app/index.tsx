import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { UserProvider } from "./Routes/userContext";
import Login from "./Routes/Login";
import React from "react";
import { Provider } from 'mobx-react';
import userStore from "./store";


const Stack = createNativeStackNavigator();

export default function App() {
  
  return (
    <Provider store={userStore}>
      {/* <UserProvider> */}

        <Stack.Navigator initialRouteName="Login"
          screenOptions={{
            headerShown: false}}>
          <Stack.Screen
            options={{ headerShown: false}} 
            name="Login"
            component={Login}/>
        </Stack.Navigator>

      {/* </UserProvider> */}
    </Provider>
  );
}