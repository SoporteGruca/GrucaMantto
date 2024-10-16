import { View, Text, Image, Alert, TextInput } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import axios from "axios";

import { observer } from 'mobx-react';
import userStore from '../store';

const Login = ({}) => {
  const navigation = useNavigation();
  const [Usuario, setUsuario] = useState('');
  const [loading, setLoading] = useState(false); // Nuevo estado para el ActivityIndicator
  const [contrasena, setContrasena] = useState('');
  //Valores modo test
  // const [contrasena, setContrasena] = useState("1234");
  // const [Usuario, setUsuario] = useState("Oscar");
  const entrar = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://192.168.0.46:4000/login', {
        Usuario,
        contrasena,
      });
      const data = response.data;
      if (data.success) {
        userStore.setUsuario(Usuario);
        router.push("/Routes/Forms");
        setContrasena("");
        setUsuario("");
      } else {
        Alert.alert("Aviso","Credenciales inválidas");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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
          <TextInput style={styles.textInput}
            placeholder="Usuario"
            value={Usuario}
            onChangeText={setUsuario}
            >
          </TextInput>
          <TextInput style={styles.textInput}
            placeholder="Contraseña"
            secureTextEntry={true}
            value={contrasena}
            onChangeText={setContrasena}
          />
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
    height: 50,
    borderRadius: 20,
    marginVertical:20,
    backgroundColor: 'white',
    textAlign:'center',
    borderBlockColor: 'orange',
    
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
  }
});
export default observer(Login);