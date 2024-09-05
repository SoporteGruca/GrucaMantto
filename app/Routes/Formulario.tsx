import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import Reportes from './Reportes';
import Tickets from './Tickets';


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

  const Tab = createBottomTabNavigator();

export default function Formulario() {  
    return (
        <Tab.Navigator>
            <Tab.Screen name="Reportes" component={Reportes} />
            <Tab.Screen name="Tickets" component={Tickets} />
        </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "flex-end",
  }
});
