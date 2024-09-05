import { View, Text, Image, TouchableOpacity } from "react-native";
import { useUserContext } from "./UserContext";
import { Alert, TextInput } from "react-native";
import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import axios from "axios";

const Login = ({}) => {
  // const [Usuario, setUsuario] = useState("");
  // const [contrasena, setContrasena] = useState("");
  const [Usuario, setUsuario] = useState("Samael");
  const [contrasena, setContrasena] = useState("12345678");

  // const [loading, setLoading] = useState(false); // Nuevo estado para el ActivityIndicator
  // const { setNombreUsuario } = useUserContext(); 
  const entrar = async () => {

    try {
      const response = await axios.post("http://192.168.0.46:4000/login", {
        Usuario,
        contrasena,
      });

      const data = response.data;

      if (data.success) {
        const nombreUsuario = data.user.NomUsuario;
        // setNombreUsuario(nombreUsuario); // Actualiza el nombre de usuario en el contexto
        setUsuario("");
        setContrasena("");
        router.push('/Routes/Formulario');
      } else {
        Alert.alert("Credenciales inválidas");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      // setLoading(false); // Ocultar el ActivityIndicator
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
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 25, color: "white" }}>Iniciar Sesion</Text>
          </View>

          <View style={styles.textinput2}>
            <TextInput
              style={styles.textInput}
              placeholder="Usuario"
              value={Usuario}
              onChangeText={setUsuario}
            ></TextInput>
          </View>
          <View>
            <TextInput
              style={styles.textInput}
              placeholder="Contraseña"
              secureTextEntry={true}
              value={contrasena}
              onChangeText={setContrasena}
            ></TextInput>
          </View>

          <View>
            <TouchableOpacity
            onPress={entrar}>
              <Text style={styles.boton}> Ingresar </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </View>
    
  );
};

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
export default Login;