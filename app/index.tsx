import React, { useState } from "react";
import { ActivityIndicator, Alert, TextInput } from "react-native";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import  Conexion  from "../components/Conexion"
import axios from "axios";
import Login from "./Routes/Login";
import SignUp from "./Routes/SignUp";
import Dashboard from "./Routes/Dashboard";

const Tab = createBottomTabNavigator();

function MyTabs() {
  return(
    <Tab.Navigator>
      <Tab.Screen name="Login" component={Login} />
      <Tab.Screen name="SingUp" component={SignUp} />
      <Tab.Screen name="Dashboard" component={Dashboard} />
    </Tab.Navigator>
  )
}


export default function Index() {
  return (
    
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <Image style={styles.logo} source={require("../assets/images/logo.png")} />
        <View style={styles.textoLogo}>
          <Text style={styles.titulo}>Mantenimiento</Text>
          <Text style={styles.titulo}>Maquinas</Text>
        </View>
      </View>
      <View style={styles.containerImagen}>
        <Image style={styles.image} source={require("../assets/images/login.png")} />
        <View style={styles.textInputContainer}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 25, color: "white" }}>Iniciar Sesion</Text>
          </View>

          <View style={styles.textinput2}>
            <TextInput
              style={styles.textInput}
              placeholder="Usuario"
            ></TextInput>
          </View>
          <View>
            <TextInput
              style={styles.textInput}
              placeholder="Contraseña"
              secureTextEntry={true}
            ></TextInput>
          </View>

          <View>
            <TouchableOpacity >
              <Text style={styles.boton}> Ingresar </Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "flex-end",
  },
  containerImagen: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: 30,
  },
  image: {
    resizeMode: "stretch",
    width: "100%",
  },
  containerLogo: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
  },
  textoLogo: {
    marginTop: 10,
    alignItems: "center",
  },
  titulo: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "",
  },
  textInputContainer: {
    position: "absolute",
    top: 100, // Ajusta la posición vertical del TextInput
    left: 80, // Ajusta la posición horizontal del TextInput
    zIndex: 1,
  },
  textInput: {
    width: 250,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "white",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textinput2: {
    marginBottom: 40,
    marginTop: 30,
  },
  boton: {
    color: "white",
    borderRadius: 5,
    backgroundColor: "#FF8080",
    overflow: "hidden",
    padding: 10,
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 60,
  },
  loadingContainer: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    justifyContent: "center",
    alignItems: "center",
  },
});
