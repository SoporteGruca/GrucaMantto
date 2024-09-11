import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { TextInput, TouchableOpacity, Image, Alert, } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Button, Icon } from 'react-native-paper';
import { useUserContext } from "./UserContext";
import { Camera } from "expo-camera/legacy";
import { Linking } from "react-native";
import moment from "moment";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";

import AntDesign from '@expo/vector-icons/AntDesign';
import RNPickerSelect from 'react-native-picker-select';

const Tab = createBottomTabNavigator();

const Reportes = () => {
  
  const placeholder = {
    label: 'Select an option...',
    value: null,
  };

  //Datos
  const [equipoData, setEquipoData] = useState([{ }]);
  const [marcaData, setMarcaData] = useState([{ }]);
  const [fallaData, setFallaData] = useState([{ }]);
  const [falla, setFalla] = useState("");

  //Camara
  const [hasCameraPermission, setHasCameraPermission] = useState({});
  // const [flash, stFlash] = useState(Camera.Constants.FlashMode.off);
  // const [type, SetType] = useState(Camera.Constants.Type.back);
  const [facing, setFacing] = useState<CameraType>('back');
  const [image, setImage] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  //Valores
  const [descripcion, setDescripcion] = useState("");
  const [encargado, setEncargado] = useState("");
  const [equipo, setEquipo] = useState("");
  const [marca, setMarca] = useState("");
  const [depto, setDepto] = useState("");
  const [num, setNum] = useState("");
  const [ubi, setUbi] = useState("");
  const [photo, setPhoto] = useState("");
  // const {nombreUsuario, setNombreUsuario } = useUserContext();
  
  //Funciones
  const [selectedValue, setSelectedValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [count, setCount] = useState({});
  const [folio, setFolio] = useState("");

  useEffect(() => {
    fetchCount();
  }, []);

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

  const generarFolio = () => {
    const nuevoNumero = parseInt(folio.split("-")[1]) + 1;
    const nuevoFolio = `RM-${nuevoNumero.toString().padStart(4, "0")}`;
    setFolio(nuevoFolio);        
  };


  useEffect(() => {
    var config = {
      method: "get",
      url: `http://192.168.0.46:4000/maquinas`,
  };

  axios(config)
  .then(function (response) {
    var count = Object.keys(response.data).length;
    let equipoArray = [];
    for (var i = 0; i < count; i++) {
      equipoArray.push({
        label: response.data[i].ClasMaq,
        value: response.data[i].ClasMaq,
      });    
    }
    setEquipoData(equipoArray);
  })
  .catch(function (error) {
    // console.log(error);
  });
  }, []);

  useEffect(() => {
    var config = {
      method: "get",
      url: `http://192.168.0.46:4000/maquinasi`,
    };

    axios(config).then(function (response) {
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
  }, []);

  const handleState = (clasmaq: any) => {
    var config = {
      method: "get",
      url: `http://192.168.0.46:4000/maquinas/${clasmaq}`,
    };

    axios(config).then(function (response) {
      // console.log(JSON.stringify(response.data));
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
    var config = {
      method: "get",
      url: `http://192.168.0.46:4000/maquinas/${equipo}/${equipoMarca}`,
    };
  }

  //Seccion de camara
  
  // if (!permission) {
  //   // Camera permissions are still loading.
  //   return <View />;
  // }

  // if (!permission.granted) {
    
  //   //En caso de que la camara no tenga permisos, esta los solicita.
  //   return (
  //     <View>
  //       <Text>We need your permission to show the camera</Text>
  //       <Text>Necesita permisos para mostrar la camara</Text>
  //       <Button onPress={requestPermission} mode="contained"> 
  //         Grant permissions
  //       </Button>
  //     </View>
  //   );
  // }

  const cameraRef = useRef(null);
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);


  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data : any = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };
  if (hasCameraPermission === false) {
    return (
      <Text style={{ color: "#fff", fontSize: 16 }}>
        Acceso a Camara Denegado
      </Text>
    );
  }

  if (hasCameraPermission === false) {
    return (
      <Text style={{ color: "#fff", fontSize: 16 }}>
        Acceso a Camara Denegado
      </Text>
    );
  }

  const ambos = async () => {

    // if (equipo === "" || marca === "" || descripcion === "" || encargado === "" || num === "") {
    if ( equipo === "" ) {
      Alert.alert("Debe llenar todos los campos de la maquina a reportar");
    } else {
      try {
        // await fetchCount();
        // setDescripcion("");
        generarFolio();
        // enviarDatos();
        // setEquipo("");
        // setNum("");
        // setFalla("");
        // setMarca("");
        // setEncargado("");
        // setDepto("");
        // setUbi("");
        // setImage(null);
        // await fetchCount();
        // generarFolio();
        // openGmail();
        Alert.alert("Reporte Enviado");
      } catch (error) {
        console.error("Error:", error);
      }
    }

  };

  const enviarDatos = async () => {


  //   try {
  //     const fechaHora = moment().format("lll");
  //     const formData: any = new FormData();
  //     formData.append("image", {
  //       uri: image,
  //       type: "image/png",
  //       name: "imagen.png",
  //     });

  //     formData.append("fecha", fechaHora.toString());
  //     // formData.append("usuario", nombreUsuario);
  //     formData.append("encargado", encargado);
  //     formData.append("departamento", depto);
  //     formData.append("id", num);
  //     formData.append("maquina", marca.toString());
  //     formData.append("clase", equipo.toString());
  //     formData.append("falla", falla);
  //     formData.append("ubicacion", ubi);
  //     formData.append("descripcion", descripcion.toString());
  //     formData.append("estado", "Pendiente");
  //     formData.append("personal", "");
  //     formData.append("descripcionfalla", "");
  //     formData.append("acciones", "");
  //     formData.append("folio", folio.toString());

  //     const response = await axios.post(
  //       "http://192.168.0.46:4000/maquinas",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     Alert.alert("Reporte Enviado");
  //     console.log("Respuesta del servidor:", response.data);
  //   } catch (error) {
  //     console.error("Error al realizar la solicitud POST:", error);
  //   }
  };

  const openGmail = async () => {
    const emailAddress = "reporteyfallas@gruca.mx";
    const subject = `Se ha registrado un Reporte con el folio: ${folio}`;
    // const body = `${nombreUsuario} ha enviado un Reporte de ${equipo} debido a que ${descripcion}`;

    // const mailtoUrl = `mailto:${emailAddress}?subject=${subject}&body=${body}`;

    // Linking.openURL(mailtoUrl);
  };


  return (
    <View style={styles.container}>
      <ScrollView style={styles.containerScroll}>

        <Text style={styles.text}>Maquina a reportar</Text>      
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={equipoData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Seleccione maquina" : "..."}
          searchPlaceholder="Buscar..."
          value={equipo}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          renderLeftIcon={ () => (
            <AntDesign color="black" name="tool" size={20} />
          )}
          onChange={(item) => {
            setEquipo(item.value);
            handleState(item.value);
            setIsFocus(false);
          }}
        />

        <Text style={styles.text}>Descripcion de la maquina</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={marcaData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Seleccione equipo" : "..."}
          searchPlaceholder="Buscar..."
          value={marca}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setMarca(item.value);
            handleState2(item.value);
            setIsFocus(false);
          }}
        />

        <View>    
          <Text style={styles.text}> Tipo Falla</Text>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={fallaData}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Seleccione la falla" : "..."}
            searchPlaceholder="Buscar..."
            value={falla}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setFalla(item.value);
              setIsFocus(false);
          }}/>
        </View>

        <View style={styles.containerLine}>
          <View style={styles.containerLineInside}>
            <Text style={styles.text}> Numero de maquina</Text>
            <TextInput placeholder="Numero de maquina"
              style={styles.boxsmall1}
              onChangeText={setNum}
              value={num}
            />
          </View>

          <View style={styles.containerLineInside}>
            <Text style={styles.text}> Operador </Text>
            <TextInput placeholder="Operador"
              style={styles.boxsmall1}
              onChangeText={setEncargado}
              value={encargado}
          />
          </View>

        </View>

        <View style={styles.containerLine}>
          <View style={styles.containerLineInside}>
            <Text style={styles.text}> Departamento encargado </Text>
            <TextInput
              placeholder="Departamento Encargado"
              style={styles.boxsmall1}
              onChangeText={setDepto}
              value={depto}
            ></TextInput>
          </View>

          <View style={styles.containerLineInside}>
            <Text style={styles.Text}> Ubicación </Text>
            <TextInput
              multiline 
              placeholder="Ubicación"
              style={styles.boxsmall}
              onChangeText={setUbi}
              value={ubi}
            ></TextInput>
          </View>

        </View>
          
        <View style={styles.containerLineInside}>
            <Text style={styles.Text}> Descripción </Text>
            <TextInput
              multiline // Esta prop permite el ingreso de múltiples líneas
              numberOfLines={4} // Establece la altura inicial del componente
              placeholder="Descrpción "
              style={styles.boxBig}
              onChangeText={setDescripcion}
              value={descripcion}
            ></TextInput>
        </View>

        <View style={styles.containerFoto}>
          {/* <CameraView style={styles.containerFoto} facing={facing}>
            <View>
              <TouchableOpacity>
              </TouchableOpacity>
            </View>
          </CameraView> */}

          {!image ? (
            <Camera
              style={styles.imagenContainer}
              // type={type}
              // flashMode={flash}
              ref={cameraRef}
            ></Camera>
          ) : (
            <Image style={styles.imagenCapturada} source={{ uri: image }} />
          )}

        </View>

        <View style={styles.containerButton}>

          <View style={styles.LineButtonBorrar}>
            <Button onPress={() => setImage(null)}
              icon="delete"
              style={styles.botonBorrar}
              mode='contained'
              buttonColor='#b01212'>
              Borrar
            </Button>
          </View>

          <View style={styles.LineButtonTomarFoto}>
            <Button onPress={takePicture}
              icon="camera"
              mode='contained'
              buttonColor='#374175'>
              Tomar foto
            </Button>
          </View>

        </View>

        <View style={styles.container}>
          <Button onPress={ambos}
            icon="mail"
            mode='contained'
            buttonColor='#374175'>
            Reportar
          </Button>
        </View>

      </ScrollView>
    </View>
  );

}

export default Reportes

const styles = StyleSheet.create({
    container: {
      height: '100%',
      width:'100%',
      padding: 10,
      backgroundColor:"#e8e8e8"
    },
    containerScroll: {
      width:"100%",
    },
    containerLine: {
      flexDirection:'row',
      paddingLeft:12,
      paddingRight:12,
    },
    containerLineInside: {
      alignItems:"center",
      alignContent:"center",
    },
    containerButton:{
      flexDirection:"row",
      alignItems:"center",
      width:"95%",
      height:100
    },
    LineButtonBorrar: {
      width:"50%",
      margin:5
    },
    LineButtonTomarFoto: {
      width:"50%",
      margin:5
    },
    dropdown: {
      height: 40,
      borderColor: "gray",
      borderWidth: 2,
      borderRadius: 4,
      paddingHorizontal: 10,
      marginLeft: 5,
      width: '95%',
      backgroundColor: "#fff",
      marginBottom: 10,
      marginTop: 10,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    placeholderStyle: {
      fontSize: 14,
    },
    selectedTextStyle: {
      fontSize: 14,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 14,
    },
    text: {
      fontSize: 16,
      marginLeft: 5,
      fontWeight: "bold",
    },
    boxsmall1: {
      width: 170,
      height: 40,
      borderWidth: 1, // Añade un borde de 1 píxel
      borderColor: "gray", // Color del borde
      paddingHorizontal: 10,
      marginTop: 5,
      marginLeft: 5,
      marginBottom: 10,
      backgroundColor: "#fff",
      color: "#000000",
    },
    containerSeparate: {
      flexDirection: "column",
    },
    boxsmall: {
      width: 170,
      borderWidth: 1, // Añade un borde de 1 píxel
      borderColor: "gray", // Color del borde
      paddingHorizontal: 10,
      marginTop: 5,
      marginLeft: 5,
      marginBottom: 20,
      backgroundColor: "#fff",
      minHeight: 40,
      maxHeight: 60,
    },
    boxBig: {
      width: "90%",
      borderWidth: 1, // Añade un borde de 1 píxel
      borderColor: "gray", // Color del borde
      paddingHorizontal: 10,
      marginTop: 5,
      marginLeft: 5,
      marginBottom: 20,
      backgroundColor: "#fff",
      minHeight: 40,
      maxHeight: 60,
    },
    containerFoto: {      
      width:"100%",
      height:200,
      flexDirection:"row",
    },
    botonBorrar: {
    },
    botonTomarfoto: {
    },
    Text: {
      marginLeft: 20,
      fontSize: 16,
      fontWeight: "bold",
    },
    botones: {
      backgroundColor: "gray",
      color: "white",
      borderRadius: 4,
      padding: 5,
      marginBottom: 15,
      marginRight: 10,
    },
  
    boton: {
      backgroundColor: "salmon",
      justifyContent: "center",
      textAlign: "center",
      color: "white",
      borderRadius: 4,
      padding: 15,
      width: 350,
      marginLeft: 13,
    },
    imagenContainer: {
      height: 256,
      backgroundColor: "gray",
      marginBottom: 20,
      width: 144,
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
    },
    imagenCapturada: {
      width: 144,
      height: 256,
      borderRadius: 8,
    }
});