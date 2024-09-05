import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import * as React from 'react';

const Tab = createBottomTabNavigator();


export default function Tickets() {  
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Mis tickets</Text>
        </View>
  );
}
