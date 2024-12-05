import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import Solicitud from './Solicitud';
import Reportes from './Reportes';
import Tickets from './Tickets';
import Test from './Test';
import { styles } from '../Routes/Estilos';

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
          <Ionicons name="bug-sharp" color={ color } size={ size } />
        ),
        tabBarLabel: 'Reportes',
        tabBarLabelStyle: {
          fontSize: 14,
        }
      }}
    />
    
    {/* <Tab.Screen
      name="Solicitud"
      component={Solicitud} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="document-outline" color={ color } size={ size } />
        ),
        tabBarLabel: 'Solicitud',
        tabBarLabelStyle: {
          fontSize: 14,
        }
      }}
    /> */}

    <Tab.Screen
      name="Mis tickets"
      component={Tickets} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="library" color={ color } size={ size } />
        ),
        tabBarLabel: 'Mis tickets',
        tabBarLabelStyle: {
          fontSize: 14,
        }
      }}
    />

    {/* <Tab.Screen
      name="Pruebas"
      component={Test} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="terminal" color={ color } size={ size } />
        ),
        tabBarLabel: 'Pruebas',
        tabBarLabelStyle: {
          fontSize: 14,
        }
      }}
    /> */}
    
    </Tab.Navigator>
  );
}