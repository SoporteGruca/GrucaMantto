import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import Reportes from './Reportes';
import Tickets from './Tickets';
import Solicitud from './Solicitud';

const Tab = createBottomTabNavigator();

export default function Formulario() {  
  return (
    <Tab.Navigator screenOptions={{ headerShown: false,
      tabBarActiveBackgroundColor: "#242f66",
      tabBarInactiveTintColor: "#242f66",
      tabBarActiveTintColor: "white",
    }}>
    <Tab.Screen 
      name="Reportes" 
      component={Reportes}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="bug" color={ color } size={ size } />
        ),
        tabBarLabel: 'Reportes',
        tabBarLabelStyle: {
          fontSize: 16,
        }
      }}
    />
    <Tab.Screen
      name="Solicitud"
      component={Solicitud} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="document-outline" color={ color } size={ size } />
        ),
        tabBarLabel: 'Solicitud',
        tabBarLabelStyle: {
          fontSize: 16,
        }
      }}
    />
    <Tab.Screen 
      name="Mis tickets"
      component={Tickets} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="server-outline" color={ color } size={ size } />
        ),
        tabBarLabel: 'Mis tickets',
        tabBarLabelStyle: {
          fontSize: 16,
        }
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
