import * as React from 'react';
import { Text, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import Reportes from './Reportes';
import Tickets from './Tickets';

const Tab = createBottomTabNavigator();

function HomeScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Reporte de Equipos</Text>
      </View>
    );
  }
  
  function SettingsScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Mis tickets</Text>
      </View>
    );
  }

export default function Formulario() {  
    return (
        <Tab.Navigator screenOptions={{ headerShown: false,
          tabBarActiveBackgroundColor: "#242f66",
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "#242f66"
         }}>
            <Tab.Screen 
              name="Reportes" 
              component={Reportes}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="document-text-outline" color={color} size={size} />
                ),
              }}
            />

            <Tab.Screen 
              name="Tickets"
              component={Tickets} 
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="server-outline" color={color} size={size} />
                ),
              }}
            />
        </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "flex-end",
  }
});
