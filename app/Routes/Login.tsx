import { View, Text, Image, TouchableOpacity } from "react-native";
import { Button, TextInput } from 'react-native-paper';
import {ActivityIndicator} from 'react-native';
import { StyleSheet } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { router, SplashScreen } from "expo-router";
import axios from "axios";

import AwesomeAlert from 'react-native-awesome-alerts';

import { useUserContext } from "./UserContext";

const Login = ({}) => {
  const [contrasena, setContrasena] = useState("1234");
  const [Usuario, setUsuario] = useState("Oscar");
  // const [contrasena, setContrasena] = useState("");
  // const [Usuario, setUsuario] = useState("");
  // const {setNombreUsuario} = useUserContext(); 
  const [loading, setLoading] = useState(false); // Nuevo estado para el ActivityIndicator
  
  
  const entrar = async () => {
    
    setLoading(true);
    try {
      const response = await axios.post('http://192.168.0.46:4000/login', {
        Usuario,
        contrasena,
      });
      const data = response.data;
      if (data.success) {
        const nombreUsuario = data.user.NomUsuario;
        // setNombreUsuario(nombreUsuario);
        setUsuario("");
        setContrasena("");
        router.push("/Routes/Forms")
      } else {

        // Alert.alert("Aviso","Credenciales inválidas");

      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Ocultar el ActivityIndicator
    }

  };

  return (
    <View style={styles.container}>

      <View style={styles.containerLogo}>

        <Image style={styles.logo} source={require("../../assets/images/logo.png")} />

        <View style={styles.textoLogo}>
          <Text style={styles.titulo}>Mantenimiento</Text>
          <Text style={styles.titulo}>Maquinas</Text>
        </View>

      </View>
      
      <View style={styles.containerImagen}>
        <Image style={styles.image} source={require("../../assets/images/login.png")} />
        <View style={styles.textInputContainer}>

          <Text style={styles.textos}>Iniciar Sesion</Text>

          <View style={styles.textinput2}>
            <TextInput
              label="Usuario"
              style={styles.textInput}
              placeholder="Usuario"
              value={Usuario}
              onChangeText={setUsuario}
            />
          </View>

          <View>
            <TextInput
              label="Contraseña"
              style={styles.textInput}
              placeholder="Contraseña"
              secureTextEntry={true}
              value={contrasena}
              onChangeText={setContrasena}
            />
          </View>


          <View>

            <Button onPress={entrar}
              icon="login"
              style={styles.txtBoton}
              mode='contained'
              buttonColor='#b83233'>
              Ingresar
            </Button>

          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
            </View>
          )}

        </View>
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width:"100%",
    justifyContent: "flex-end",
  },
  container2: {
    height: "100%",
    width:"100%",
  },
  containerLogo: {
    alignItems: "center",
  },
  containerImagen: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    paddingTop: 30,
  },
  image: {
    resizeMode: "stretch",
    width: "100%",
  },
  logo: {
    width: 150,
    height: 150,
  },
  textoLogo: {
    alignItems: "center",
  },
  titulo: {
    fontSize: 35,
    marginTop: "5%",
    textShadowColor: "blue",
    textShadowRadius: 1,
  },
  textos: {
    textShadowRadius: 5,
    textShadowColor:"#6e758b",
    textAlign:"center",
    fontSize: 30,
    color:"white",
  },
  textInputContainer: {
    position: "absolute",
    top: "25%", // Ajusta la posición vertical del TextInput
    left:0,
    zIndex: 1,
    width:"100%",
    alignItems:"center"
  },
  textInput: {
    width: 250,
    height: 40,
    borderRadius: 5,
  },
  textinput2: {
    marginBottom: 40,
    marginTop: 30,
  },
  txtBoton: {
    color: "white",
    borderRadius: 5,
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
    padding:20,
  },
});
export default Login;