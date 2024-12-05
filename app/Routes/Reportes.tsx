import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FontAwesome, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TextInput, Image, Alert, Linking } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";
import { styles } from "../Routes/Estilos";
import { Camera } from "expo-camera";
import userStore from "../store";
import moment from "moment";
import axios from "axios";



const Tab = createBottomTabNavigator();
const Reportes = () => {
  //Datos
  const [usuarioReport, setUsuarioReport] = useState("");
  const [atencionData, setAtencionData] = useState([]);
  const [equipoData, setEquipoData] = useState([{}]);
  const [marcaData, setMarcaData] = useState([{}]);
  const [fallaData, setFallaData] = useState([{}]);
  const [ubiData, setUbiData] = useState([{}]);
  const [encData, setEncData] = useState([{}]);
  const [idData, setIdData] = useState([{}]);
  const [falla, setFalla] = useState("");
  let emailAddress = "", subject = "", body = "";
  //Camara
  const [image, setImage] = useState("https://fakeimg.pl/300x300/e8e8e8/3a456f?text=Not+Found&font=lobster");
  const [hasCameraPermission, setHasCameraPermission] = useState({});
  const [descripcion, setDescripcion] = useState("");
  const [encargado, setEncargado] = useState("");
  const [fullName, setFullName] = useState("");
  const [fotoUri, setFotoUri] = useState(null);
  const [equipo, setEquipo] = useState("");
  const [marca, setMarca] = useState("");
  const [depto, setDepto] = useState("");
  const [cel, setCel] = useState("");
  const [num, setNum] = useState("");
  const [ubi, setUbi] = useState("");
  const [id, setId] = useState("");
  //Funciones
  const [isFocus, setIsFocus] = useState(false);
  const [count, setCount] = useState({});
  const [folio, setFolio] = useState("");

  useEffect(() => {
    setUsuarioReport(userStore.usuario);
    getUserData();
    fetchCount();
    loadMaquina();
    camPermission();
    loadUbicacion();
    loadEncargado();
    loadIncidencia();
  }, []);
  const getUserData = async () => {
    //Get tje full name of  the user
    axios
      .get(`http://192.168.0.46:4000/verifica`)
      .then(function (response) {
        var count = Object.keys(response.data).length;
        let userArray: any = [];
        for (var i = 0; i < count; i++) {
          userArray.push({
            value: response.data[i].Usuario,
            label: response.data[i].Usuario,
          });
          if (userStore.usuario == response.data[i].Usuario) {
            setFullName(response.data[i].NomUsuario);
            userStore.setFullName(response.data[i].NomUsuario);
          }
        }
        setAtencionData(userArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const fetchCount = async () => {
    try {
      const response = await axios.get("http://192.168.0.46:4000/foliosm");
      const recordset = response.data;
      if (Array.isArray(recordset) && recordset.length > 0) {
        const countValue = recordset[0][""];
        if (typeof countValue === "number" || typeof countValue === "string") {
          setCount(countValue);
          const numeroPredeterminado = countValue;
          const folioPredeterminado = `RM-${numeroPredeterminado
            .toString()
            .padStart(4, "0")}`;
          setFolio(folioPredeterminado);
        } else {
          console.error("El valor del recuento no es válido:", countValue);
        }
      } else {
        console.error("La respuesta no contiene datos válidos:", recordset);
      }
    } catch (error) {
      console.error("Error al obtener el recuento:", error);
    }
  };
  const loadMaquina = () => {
    axios
      .get(`http://192.168.0.46:4000/maquinas`)
      .then(function (response) {
        var count = Object.keys(response.data).length;
        let equipoArray = [];
        let nomArray = [];
        let idArray = [];
        for (var i = 0; i < count; i++) {
          idArray.push({
            label: response.data[i].IdMaquina,
            value: response.data[i].IdMaquina,
          });
          equipoArray.push({
            label: response.data[i].ClasMaq,
            value: response.data[i].ClasMaq,
          });
          nomArray.push({
            label: response.data[i].NombreMaq,
            value: response.data[i].NombreMaq,
          });
        }
        setEquipoData(equipoArray);
        setIdData(idArray);
        setMarcaData(nomArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const loadEncargado = () => {
    axios
      .get(`http://192.168.0.46:4000/encargado`)
      .then(function (response) {
        var count = Object.keys(response.data).length;
        let equipoArray = [];
        for (var i = 0; i < count; i++) {
          equipoArray.push({
            value: response.data[i].Encargado,
            label: response.data[i].Encargado,
          });
        }
        setEncData(equipoArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const loadUbicacion = () => {
    axios
      .get(`http://192.168.0.46:4000/ubicacion`)
      .then(function (response) {
        var count = Object.keys(response.data).length;
        let equipoArray: any = [];
        for (var i = 0; i < count; i++) {
          equipoArray.push({
            value: response.data[i].UbicaMaq,
            label: response.data[i].UbicaMaq,
          });
        }
        setUbiData(equipoArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const generarFolio = () => {
    const nuevoNumero = parseInt(folio.split("-")[1]) + 1;
    const nuevoFolio = `RM-${nuevoNumero.toString().padStart(4, "0")}`;
    setFolio(nuevoFolio);
  };
  const loadIncidencia = () => {
    axios
      .get(`http://192.168.0.46:4000/maquinasi`)
      .then(function (response) {
        var count = Object.keys(response.data).length;
        let equipoArray = [];
        for (var i = 0; i < count; i++) {
          equipoArray.push({
            value: response.data[i].DescIncidencia,
            label: response.data[i].DescIncidencia,
          });
        }
        setFallaData(equipoArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleState = (clasmaq: any) => {
    axios
      .get(`http://192.168.0.46:4000/maquinas/${clasmaq}`)
      .then(function (response) {
        var count = Object.keys(response.data).length;
        let marcaArray = [];
        for (var i = 0; i < count; i++) {
          marcaArray.push({
            value: response.data[i].NombreMaq,
            label: response.data[i].NombreMaq,
          });
        }
        setMarcaData(marcaArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleState2 = (equipoMarca: any) => {
    axios
      .get(`http://192.168.0.46:4000/maqUbica/${equipoMarca}`)
      .then(function (response) {
        const datos = response.data;
        console.log(datos);
        let idArray, ubiArray, encArray, numArray, depArray = [];
        for (var i = 0; i < datos.length; i++) {
          idArray.push({
            value: datos[i].IdMaquina,
            label: datos[i].IdMaquina,
          });
          ubiArray.push({
            value: datos[i].UbicaMaq,
            label: datos[i].UbicaMaq,
          });
          encArray.push({
            value: datos[i].Encargado,
            label: datos[i].Encargado,
          });
          numArray.push({
            value: datos[i].NumSerMaq,
            label: datos[i].NumSerMaq,
          });
          depArray.push({
            value: datos[i].DeptoMaq,
            label: datos[i].DeptoMaq,
          });
        }
        setId(idArray[0].value);
        setUbi(ubiArray[0].value);
        setNum(numArray[0].value);
        setDepto(depArray[0].value);
        setEncargado(encArray[0].value);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleState3 = (idMaquina: any) => {
    axios
      .get(`http://192.168.0.46:4000/maqID/${idMaquina}`)
      .then(function (response) {
        const datos = response.data;
        let nomArray, maqArray, ubiArray, encArray, numArray, depArray = [];
        for (var i = 0; i < datos.length; i++) {
          maqArray.push({
            value: datos[i].ClasMaq,
            label: datos[i].ClasMaq,
          });
          nomArray.push({
            value: datos[i].NombreMaq,
            label: datos[i].NombreMaq,
          });
          ubiArray.push({
            value: datos[i].UbicaMaq,
            label: datos[i].UbicaMaq,
          });
          encArray.push({
            value: datos[i].Encargado,
            label: datos[i].Encargado,
          });
          numArray.push({
            value: datos[i].NumSerMaq,
            label: datos[i].NumSerMaq,
          });
          depArray.push({
            value: datos[i].DeptoMaq,
            label: datos[i].DeptoMaq,
          });
        }
        setEquipo(maqArray[0].value);
        setMarca(nomArray[0].value);
        setUbi(ubiArray[0].value);
        setNum(numArray[0].value);
        setDepto(depArray[0].value);
        setEncargado(encArray[0].value);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const camPermission = () => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  };
  const deletePicture = async () => {
    setFotoUri(null);
    setImage("https://fakeimg.pl/300x300/e8e8e8/3a456f?text=Not+Found&font=lobster");
  };
  const takePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  if (hasCameraPermission === false) {
    return (
      <Text style={{ color: "#fff", fontSize: 16 }}>
        Acceso a Camara Denegado
      </Text>
    );
  }
  const limpiarCampos = () => {
    setUsuarioReport("");
    setEquipo("");
    setMarca("");
    setDescripcion("");
    setFalla("");
    setEncargado("");
    setNum("");
    setDepto("");
    setUbi("");
    setFotoUri(null);
    setImage(
      "https://fakeimg.pl/300x300/e8e8e8/3a456f?text=Not+Found&font=lobster"
    );
  };
  const reportar = async () => {
    if ( !equipo || !marca || !falla || !ubi || !encargado || !num || !depto || !descripcion || image === "https://fakeimg.pl/300x300/e8e8e8/3a456f?text=Not+Found&font=lobster"
    ) {
      Alert.alert(
        "Debe llenar todos los campos del formulario para generar el reportar"
      );
    } else {
      try {
        await fetchCount();
        generarFolio();
        enviarDatos();
        limpiarCampos();
        await fetchCount();
        generarFolio();
        openGmail();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        sendWhatsApp();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        Alert.alert(
          `Aviso`,
          `Se ha registrado un reporte con el folio: ${folio}. El reporte ha sido enviado correctamente.`
        );
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  const enviarDatos = async () => {
    try {
      const fechaHora = moment().format("lll");
      const formData: any = new FormData();
      formData.append("image", {
        uri: image,
        type: "image/jpg",
        name: "imagen.jpg",
      });
      formData.append("fecha", fechaHora);
      formData.append("usuario", usuarioReport);
      formData.append("encargado", encargado);
      formData.append("departamento", depto);
      formData.append("id", num);
      formData.append("maquina", marca);
      formData.append("clase", equipo);
      formData.append("falla", falla);
      formData.append("ubicacion", ubi);
      formData.append("descripcion", descripcion);
      formData.append("estado", "Pendiente");
      formData.append("personal", "");
      formData.append("descripcionfalla", descripcion);
      formData.append("acciones", "");
      formData.append("folio", folio);
      const response = await axios.post(
        "http://192.168.0.46:4000/maquinas",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error("Error al realizar la solicitud POST:", error);
    }
  };

  const openGmail = async () => {
    emailAddress = "reporteyfallas@gruca.mx";
    subject = `Se ha registrado un reporte con el folio: ${folio}`;
    body = `${fullName} ha enviado un reporte de ${equipo}, con numero de folio: ${folio} debido a, ${descripcion}`;
    const mailtoUrl = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    Linking.openURL(mailtoUrl);
  };
  const sendWhatsApp = () => {
    const phone = 4491014022;
    const link = `https://wa.me/${phone}?text=${body}`;
    Linking.canOpenURL(link).then((supported) => {
      if (!supported) {
        Alert.alert(
          "Por favor instale WhatsApp para enviar un mensaje directo"
        );
      }
      return Linking.openURL(link);
    });
  };
  return (
    <View style={styles.contForms}>
      <ScrollView>
        <View style={styles.containerLineInside}>
          <Text style={styles.textTitle}>¡Bienvenido!</Text>
          <Text style={styles.textSubTitle}>{fullName}</Text>
        </View>
        <Text style={styles.text}>ID maquina</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={idData}
          search
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Seleccione equipo" : "..."}
          searchPlaceholder="Buscar..."
          value={id}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item: any) => {
            setId(item.value);
            handleState3(item.value);
          }}
        />
        <Text style={styles.text}>Maquina a reportar</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={equipoData}
          search
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Seleccione maquina" : "..."}
          searchPlaceholder="Buscar..."
          value={equipo}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          renderLeftIcon={() => (
            <MaterialCommunityIcons name="tools" size={24} color="red" />
          )}
          onChange={(item: any) => {
            setEquipo(item.value);
            handleState(item.value);
            setIsFocus(false);
          }}
        />
        <Text style={styles.text}>Numero y Modelo</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={marcaData}
          search
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Seleccione equipo" : "..."}
          searchPlaceholder="Buscar..."
          value={marca}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          renderLeftIcon={() => (
            <FontAwesome name="gears" size={24} color="black" />
          )}
          onChange={(item: any) => {
            setMarca(item.value);
            handleState2(item.value);
            setIsFocus(false);
          }}
        />
        <Text style={styles.text}>Ubicación o Area</Text>
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={ubiData}
          search
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder={"Seleccione la ubicacion..."}
          searchPlaceholder="Buscar..."
          value={ubi}
          renderLeftIcon={() => (
            <MaterialIcons name="location-pin" size={24} color="black" />
          )}
          onChange={(item: any) => {
            setUbi(item.value);
          }}
        />
        <Text style={styles.text}>Operador</Text>
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={encData}
          search
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder={"Seleccione al operador..."}
          value={encargado}
          renderLeftIcon={() => (
            <FontAwesome6 name="user-gear" size={24} color="black" />
          )}
          onChange={(item: any) => {
            setEncargado(item.value);
          }}
        />
        <Text style={styles.text}>Tipo Falla</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={fallaData}
          search
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Seleccione la falla" : "..."}
          searchPlaceholder="Buscar..."
          value={falla}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          renderLeftIcon={() => (
            <MaterialIcons name="sms-failed" size={24} color="black" />
          )}
          onChange={(item: any) => {
            setFalla(item.value);
            setIsFocus(false);
          }}
        />
        <View style={styles.containerLine}>
          <View style={styles.containerLineInside}>
            <Text style={styles.text}> Numero de maquina</Text>
            <TextInput
              placeholder="Numero de maquina"
              style={styles.boxsmall}
              keyboardType="numeric"
              onChangeText={setNum}
              value={num}
            />
          </View>
          <View style={styles.containerLineInside}>
            <Text style={styles.text}> Departamento encargado </Text>
            <TextInput
              placeholder="Departamento Encargado"
              style={styles.boxsmall}
              onChangeText={setDepto}
              value={depto}
            ></TextInput>
          </View>
        </View>
        <View style={styles.containerLineInside}>
          <Text style={styles.text}> Descripción de la falla </Text>
          <TextInput
            multiline
            numberOfLines={6}
            placeholder="Descrpción de la falla "
            style={styles.boxBig}
            onChangeText={setDescripcion}
            value={descripcion}
          ></TextInput>
        </View>
        <View>
          {image && <Image source={{ uri: image }} />}
          <Image style={styles.imagenContainer} source={{ uri: image }}></Image>
        </View>
        <View style={styles.containerButton}>
          <View style={styles.LineButtonBorrar}>
            <Button
              onPress={deletePicture}
              icon="delete"
              mode="contained"
              buttonColor="#b01212"
            >
              Borrar
            </Button>
          </View>
          <View style={styles.LineButtonTomarFoto}>
            <Button
              onPress={takePicture}
              icon="camera"
              mode="contained"
              buttonColor="#374175"
            >
              Tomar foto
            </Button>
          </View>
        </View>
        <View style={styles.contForms}>
          <Button
            onPress={reportar}
            icon="mail"
            mode="contained"
            buttonColor="#374175"
          >
            Reportar
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};
export default Reportes;
