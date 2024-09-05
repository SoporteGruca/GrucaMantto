import { TextInput, TouchableOpacity, Image, Alert, } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState, useRef } from "react";
import { Dropdown } from 'react-native-element-dropdown';
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useUserContext } from "./UserContext";
import { Camera } from "expo-camera";
import { Linking } from "react-native";
import moment from "moment";
import axios from "axios";

import AntDesign from '@expo/vector-icons/AntDesign';
import RNPickerSelect from 'react-native-picker-select';



const Tab = createBottomTabNavigator();

//Prueba de datos local
const options = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];


const Reportes = () => { 

    //Prueba
    const [selectedValue, setSelectedValue] = useState(null);

    const placeholder = {
        label: 'Select an option...',
        value: null,
      };


    //Datas
    // const [equipoData, setEquipoData] = useState([]);
    // const [marcaData, setMarcaData] = useState([]);
    // const [fallaData, setFallaData] = useState([]);
    // const [numData, setNumData] = useState([]);
    // const [deptoValue, setDeptoValue] = useState([]);
    // const [ubiValue, setUbiValue] = useState([]);
    // const [falla, setFalla] = useState("");

    //Camara
    // const [hasCameraPermission, setHasCameraPermission] = useState(false);
    // const [image, setImage] = useState(null);
    // const [type, SetType] = useState(Camera.Constants.Type.back);
    // const [flash, stFlash] = useState(Camera.Constants.FlashMode.off);

    //Valores a solicitar
    const [descripcion, setDescripcion] = useState("");
    const [num, setNum] = useState("");
    const [depto, setDepto] = useState("");
    const [ubi, setUbi] = useState("");
    const [encargado, setEncargado] = useState("");
    // const [equipo, setEquipo] = useState("");
    // const [marca, setMarca] = useState(null);
    // const { nombreUsuario } = useUserContext();
    // const { setNombreUsuario } = useUserContext();

    //Funciones
    // const [isFocus, setIsFocus] = useState(false);
    // const [count, setCount] = useState(0);
    // const [folio, setFolio] = useState("");


//     useEffect(() => {
//         fetchCount();
//       }, []);

//     const fetchCount = async () => {
//         try {
//           const response = await axios.get("http://192.168.0.46:4000/foliosm");
//           const recordset = response.data;
    
//           if (Array.isArray(recordset) && recordset.length > 0) {
//             const countValue = recordset[0][""];
    
//             if (typeof countValue === "number" || typeof countValue === "string") {
//               setCount(countValue);
//               const numeroPredeterminado = countValue;
//               const folioPredeterminado = `RM-${numeroPredeterminado
//                 .toString()
//                 .padStart(4, "0")}`;
//               setFolio(folioPredeterminado);
//             } else {
//               console.error("El valor del recuento no es válido:", countValue);
//             }
//           } else {
//             console.error("La respuesta no contiene datos válidos:", recordset);
//           }
//         } catch (error) {
//           console.error("Error al obtener el recuento:", error);
//         }
//     };

//     const generarFolio = () => {
//         const nuevoNumero = parseInt(folio.split("-")[1]) + 1;
//         const nuevoFolio = `RM-${nuevoNumero.toString().padStart(4, "0")}`;
//         setFolio(nuevoFolio);
//     };

//     useEffect(() => {
//         var config = {
//           method: "get",
//           url: `http://192.168.0.46:4000/maquinas`,
//     };

//     axios(config)
//       .then(function (response) {
//         var count = Object.keys(response.data).length;
//         let equipoArray = [];
//         for (var i = 0; i < count; i++) {
//           equipoArray.push({
//             value: response.data[i].ClasMaq,
//             label: response.data[i].ClasMaq,
//           });
//         }
//         setEquipoData(equipoArray);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   }, []);

//   useEffect(() => {
//     var config = {
//       method: "get",
//       url: `http://192.168.0.46:4000/maquinasi`,
//     };

//     axios(config)
//       .then(function (response) {
//         var count = Object.keys(response.data).length;
//         let equipoArray = [];
//         for (var i = 0; i < count; i++) {
//           equipoArray.push({
//             value: response.data[i].DescIncidencia,
//             label: response.data[i].DescIncidencia,
//           });
//         }
//         setFallaData(equipoArray);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   }, []);

//   const handleState = (clasmaq) => {
//     var config = {
//       method: "get",
//       url: `http://192.168.0.46:4000/maquinas/${clasmaq}`,
//     };

//     axios(config)
//       .then(function (response) {
//         console.log(JSON.stringify(response.data));
//         var count = Object.keys(response.data).length;
//         let marcaArray = [];
//         for (var i = 0; i < count; i++) {
//           marcaArray.push({
//             value: response.data[i].NombreMaq,
//             label: response.data[i].NombreMaq,
//           });
//         }
//         setMarcaData(marcaArray);
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   };

//   const handleState2 = (equipoMarca) => {
//     var config = {
//       method: "get",
//       url: `http://192.168.0.46:4000/maquinas/${equipo}/${equipoMarca}`,
//     };

//     axios(config)
//       .then(function (response) {
//         const datos = response.data;

//         setNumData(datos.map((item) => item.NumMaq));
//         setDeptoValue(datos.map((item) => item.DeptoMaq));
//         setUbiValue(datos.map((item) => item.UbicaMaq));

//         if (datos.length > 0) {
//           setNum(datos[0].NumMaq);
//           setDepto(datos[0].DeptoMaq);
//           setUbi(datos[0].UbicaMaq);
//         }
//       })
//       .catch(function (error) {
//         console.error("Error fetching data:", error);
//       });
//   };

//   const cameraRef = useRef(null);

//   useEffect(() => {
//     (async () => {
//       const cameraStatus = await Camera.requestCameraPermissionsAsync();
//       setHasCameraPermission(cameraStatus.status === "granted");
//     })();
//   }, []);

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       try {
//         const data = await cameraRef.current.takePictureAsync();
//         // console.log(data);
//         setImage(data.uri);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//   };

//   if (hasCameraPermission === false) {
//     return (
//       <Text style={{ color: "#fff", fontSize: 16 }}>
//         Acceso a Camara Denegado
//       </Text>
//     );
//   }

//   const ambos = async () => {
//     if (equipo === "" || marca === "" || descripcion === "") {
//       Alert.alert("Debe llenar todos los campos");
//     } else {
//       try {
//         await fetchCount();
//         generarFolio();
//         enviarDatos();
//         setEquipo("");
//         setDescripcion("");
//         setNum("");
//         setFalla("");
//         setMarca("");
//         setEncargado("");
//         setDepto("");
//         setUbi("");
//         setImage(null);

//         await fetchCount();
//         generarFolio();

//         openGmail();
//         Alert.alert("Reporte Enviado");
//       } catch (error) {
//         console.error("Error:", error);
//       }
//     }
//   };

//   const enviarDatos = async () => {
//     try {
        
//       const fechaHora = moment().format("lll");
//       const formData = new FormData();
//     //   formData.append("image", {
//     //     uri: image,
//     //     type: "image/png",
//     //     name: "imagen.png",
//     //   });

//       formData.append("fecha", fechaHora.toString());
//       formData.append("usuario", nombreUsuario);
//       formData.append("encargado", encargado);
//       formData.append("departamento", depto);
//       formData.append("id", num);
//       formData.append("maquina", marca.toString());
//       formData.append("clase", equipo.toString());
//       formData.append("falla", falla);
//       formData.append("ubicacion", ubi);
//       formData.append("descripcion", descripcion.toString());
//       formData.append("estado", "Pendiente");
//       formData.append("personal", "");
//       formData.append("descripcionfalla", "");
//       formData.append("acciones", "");
//       formData.append("folio", folio.toString());

//       const response = await axios.post(
//         "http://192.168.0.46:4000/maquinas",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       Alert.alert("Reporte Enviado");
//       console.log("Respuesta del servidor:", response.data);
//     } catch (error) {
//       console.error("Error al realizar la solicitud POST:", error);
//     }
//   };
    
//     const openGmail = async () => {
//     // const emailAddress = "reporteyfallas@gruca.mx";
//     const emailAddress = "@gruca.mx";
//     console.log("reporte de Fallas enviado");
//     const subject = `Se ha registrado un Reporte con el folio: ${folio}`;
//     const body = `${nombreUsuario} ha enviado un Reporte de ${equipo} debido a que ${descripcion}`;
//     const mailtoUrl = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
//     Linking.openURL(mailtoUrl);
//   };


return (
    <View style={styles.container}>
      <ScrollView>

        <Text style={styles.text}>¿Qué Maquina desea Reportar?</Text>
        <RNPickerSelect
            placeholder={placeholder}
            items={options}
            onValueChange={(value) => setSelectedValue(value)}
            value={selectedValue}
        />

        {/* <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={data}
          search
          maxHeight={300}
          labelField="labelT"
          valueField="vFijo"
          placeholder={!isFocus ? "Seleccione Equipo" : "..."}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setValue(item.value);
          }}
          renderLeftIcon={() => (
            <AntDesign color="black" name="Safety" size={20} />
          )}
          renderItem={renderItem}
        /> */}

        <Text style={styles.text}>Descripcion de la Maquina</Text>

        {/* <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={marcaData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Seleccione Maquina" : "..."}
          searchPlaceholder="Search..."
          value={marca}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setMarca(item.value);
            handleState2(item.value);
            setIsFocus(false);
          }}
        /> */}

        <View style={styles.containerSeparate}>
          <View>
            <Text style={styles.text}> Numero de Maquina</Text>
            <TextInput
              placeholder="Numero de Maquina"
              style={styles.boxsmall1}
              value={num}
            ></TextInput>
          </View>

          <View>
            <Text style={styles.text}> Tipo Falla</Text>

            {/* <Dropdown
              style={[styles.boxsmall1, isFocus && { borderColor: "blue" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={fallaData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Seleccione Falla" : "..."}
              searchPlaceholder="Search..."
              value={falla}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setFalla(item.value);
              }}
            /> */}

          </View>
        </View>
        <View style={styles.containerSeparate}>
          <View>
            <Text style={styles.text}> Operador </Text>
            <TextInput
              placeholder="Oprador"
              style={styles.boxsmall1}
              onChangeText={setEncargado}
              value={encargado}
            ></TextInput>
          </View>

        <View>
            <Text style={styles.text}> Depto Encargado </Text>
            <TextInput
              placeholder="Depto"
              style={styles.boxsmall1}
              value={depto}
            ></TextInput>
          </View>
        </View>

        <View style={styles.containerSeparate}>
          <View>
            <Text style={styles.Text}> Descripción </Text>
            <TextInput
              multiline // Esta prop permite el ingreso de múltiples líneas
              numberOfLines={4} // Establece la altura inicial del componente
              placeholder="Descrpción "
              style={styles.boxsmall}
              value={descripcion}
              onChangeText={setDescripcion}
            ></TextInput>
          </View>
          <View>
            <Text style={styles.Text}> Ubicación </Text>
            <TextInput
              multiline // Esta prop permite el ingreso de múltiples líneas
              numberOfLines={4} // Establece la altura inicial del componente
              placeholder="Ubicación"
              style={styles.boxsmall}
              value={ubi}
            ></TextInput>
          </View>
        </View>
        <View style={styles.containerFoto}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Foto</Text>

          {/* <View>
            {!image ? (
              <Camera
                style={styles.imagenContainer}
                type={type}
                flashMode={flash}
                ref={cameraRef}
              ></Camera>
            ) : (
              <Image style={styles.imagenCapturada} source={{ uri: image }} />
            )}
          </View> */}
          
          <View style={styles.containerSeparate}>
            {/* <TouchableOpacity onPress={() => setImage(null)}>
              <Text style={styles.botones}>Volver a Tomar Foto</Text>
            </TouchableOpacity> */}

            {/* <TouchableOpacity onPress={takePicture}>
              <Text style={styles.botones}>Tomar Foto</Text>
            </TouchableOpacity> */}

          </View>
        </View>
        <View>
          
          {/* <TouchableOpacity onPress={ambos}>
            <Text style={styles.boton}>Abrir Ticket</Text>
          </TouchableOpacity> */}

        </View>
      </ScrollView>
    </View>
  );

};

// export function setCodigoDataSetter(setterFunction: any) {
//     setCodigoData = setterFunction;
// }
  
// export function setModeloDataSetter(setterFunction: any) {
//     setModeloData = setterFunction;
// }
  
// export function setEquipoDataSetter(setterFunction: any) {
//     equipo = setterFunction;
// }
  
// export function setMarcaDataSetter(setterFunction: any) {
//     marca = setterFunction;
// }

  
export default Reportes;

const styles = StyleSheet.create({
    container: {
      height: '94%',
    //   margingBottom: 0,
      padding: 0,
    },
    dropdown: {
      height: 40,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 10,
      marginLeft: 5,
      width: 360,
      backgroundColor: "#fff",
      marginBottom: 20,
      marginTop: 10,
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
      borderRadius: 4,
      backgroundColor: "#fff",
      color: "#000000",
    },
    containerSeparate: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginRight: 10,
    },
  
    boxsmall: {
      width: 170,
      borderWidth: 1, // Añade un borde de 1 píxel
      borderColor: "gray", // Color del borde
      paddingHorizontal: 10,
      marginTop: 5,
      marginLeft: 5,
      paddingTop: 0,
      marginBottom: 20,
      borderRadius: 4,
      backgroundColor: "#fff",
      minHeight: 40,
      maxHeight: 60,
    },
    containerFoto: {
      alignItems: "center",
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
    //   margingTop: 5,
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
    },
  });