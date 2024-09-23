import { CameraType, useCameraPermissions } from 'expo-camera';
import { TextInput, TouchableOpacity, Image, Alert, } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Button, Icon } from 'react-native-paper';
// import { Camera } from "expo-camera/legacy";
import { Camera } from 'expo-camera';
import { CameraView } from 'expo-camera';
import moment from "moment";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Linking} from 'react-native';

const Tab = createBottomTabNavigator();

const Reportes = () => {
  //Datos
  const [useReport, setuseReportData] = useState([{ }]);
  const [equipoData, setEquipoData] = useState([{ }]);
  const [marcaData, setMarcaData] = useState([{ }]);
  const [fallaData, setFallaData] = useState([{ }]);
  const [ubiData, setUbiData] = useState([{ }]);
  const [encData, setEncData] = useState([{ }]);
  const [falla, setFalla] = useState("");
  const [isCameraReady, setIsCameraReady] = useState(false);

  //Camara
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  // const [flash, stFlash] = useState(Camera.Constants.FlashMode.off);
  // const [type, SetType] = useState(Camera.Constants.Type.back);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  //Valores
  const [usuarioReport, setUsuarioReport] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [encargado, setEncargado] = useState("");
  const [equipo, setEquipo] = useState("");
  const [marca, setMarca] = useState("");
  const [depto, setDepto] = useState("");
  const [num, setNum] = useState("");
  const [ubi, setUbi] = useState("");
  const [photo, setPhoto] = useState("");
  const [fotoUri, setFotoUri] = useState(null);
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
          setFolio(folioPredeterminado);
          console.log(setFolio);
          
          
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

  useEffect(() => {
    var config = {
      method: "get",
      url: `http://192.168.0.46:4000/ubicacion`,
    };

    axios(config).then(function (response) {
      var count = Object.keys(response.data).length;      
      let equipoArray : any = [];      
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
  }, []);

  useEffect(() => {
    var config = {
      method: "get",
      url: `http://192.168.0.46:4000/users`,
    };

    axios(config).then(function (response) {
      var count = Object.keys(response.data).length;      
      let equipoArray = [];            
        for (var i = 0; i < count; i++) {
          equipoArray.push({
            value: response.data[i].Usuario,
            label: response.data[i].Usuario,
          });
        }        
        setuseReportData(equipoArray);
      })
    .catch(function (error) {
      console.log(error);
    });
  }, []);

  useEffect(() => {
    var config = {
      method: "get",
      url: `http://192.168.0.46:4000/encargado`,
    };

    axios(config).then(function (response) {      
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
  }, []);

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

  axios(config).then(function (response) {
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
    console.log(error);
  });
  }, []);

  // const loadState = ( maquina : any) => {
  //   var config = {  
  //     method: "get",
  //     // url: `http://192.168.0.46:4000/users`,
  //     url: `http://192.168.0.46:4000/maquinasess/${maquina}`,
  //   };

  //   axios(config).then(function (response) {
  //   const datos = response.data;

  //   console.log(datos);
  //   setUbiData(datos.map((item : any) => item["UbicaMaq"]));
  //   setEncData(datos.map((item : any) => item["Encargado"]));

  //   if(datos.length > 0) {
  //     console.log(datos);
      
  //     setEncargado(datos[0]["Encargado"]); 
  //     setUbi(datos[0]["UbicaMaq"]); 
  //   }
    
  //   })
  //   .catch(function (error) {
  //     console.error("Error fetching data:", error);
  //   });

  // }

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

  const cameraRef = useRef();
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const takePicture = async () => {

    setFotoUri(null);
    const camera = cameraRef.current;
    if (!camera) return;

    try {
      // const data : any = await camera.takePictureAsync({ base64: true, });
      const data : any = await camera.takePictureAsync({ base64: true, });
      setFotoUri(data.uri);
      console.log(data);
    } catch (error) {
      console.log('Error:', error);
    }

    alert("La foto no fue guardada, se sigue trajando en la reparacion.")
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

    if (usuarioReport === "" || equipo === "" || marca === "" || descripcion === "" || encargado === "" || num === "") {
    // if ( equipo === "" ) {
      Alert.alert("Debe llenar todos los campos de la maquina a reportar");
    } else {
      try {
        await fetchCount();
        generarFolio();
        enviarDatos();
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
        await fetchCount();
        generarFolio();
        // openGmail();
        Alert.alert("Reporte Enviado");
      } catch (error) {
        console.error("Error:", error);
      }
    }

  };

  const enviarDatos = async () => {

    try {
      const fechaHora = moment().format("lll");
      const formData: any = new FormData();
      
      // formData.append("image", {
      //   uri: image,
      //   type: "image/png",
      //   name: "imagen.png",
      // });<sw

      formData.append("fecha", fechaHora.toString());
      formData.append("usuario", usuarioReport.toString());
      formData.append("encargado", encargado.toString());
      formData.append("departamento", depto.toString());
      formData.append("id", num);
      formData.append("maquina", marca.toString());
      formData.append("clase", equipo.toString());
      formData.append("falla", falla);
      formData.append("ubicacion", ubi.toString());
      formData.append("descripcion", descripcion.toString());
      formData.append("estado", "Pendiente");
      formData.append("personal", "");
      formData.append("descripcionfalla", descripcion.toString());
      formData.append("acciones", "");
      formData.append("folio", folio.toString());

      console.log(formData);
      
      
      // const response = await axios.post(
      //   "http://192.168.0.46:4000/maquinas",
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );

      Alert.alert("Reporte Enviado");
    } catch (error) {
      console.error("Error al realizar la solicitud POST:", error);
    }
  };

  const openGmail = async () => {
    const emailAddress = "reporteyfallas@gruca.mx";
    const subject = `Se ha registrado un Reporte con el folio: ${folio}`;
    const body = `Se ha enviado un Reporte de ${equipo} debido a que ${descripcion}`;

    const mailtoUrl = `mailto:${emailAddress}?subject=${subject}&body=${body}`;

    Linking.openURL(mailtoUrl);
  };

  const onChangeHandler = (event : any) => {
    setEquipo(event.target.value);
 };

  return (
    <View style={styles.container}>
      <ScrollView>

      <View style={styles.containerLineInside}>
        <Text style={styles.text}>Usuario que reporta</Text>
        <TextInput placeholder="Nombre del usuario..."
          style={styles.boxBig}
          onChange={(item : any) => {
            setUsuarioReport(item.value);
            handleState(item.value);
          }}
          value={usuarioReport}
          />
      </View>

      {/* <Text style={styles.text}>Usuario que reporta</Text>
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={useReport}
          search
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Selecciona usuario que reporta" : "..."}
          searchPlaceholder="Buscar..."
          value={usuarioReport}
          onChange={(item : any) => {
            setUsuarioReport(item.value);
            handleState(item.value);
          }}
        /> */}

        <Text style={styles.text}>Maquina a reportar</Text>      
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
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
          renderLeftIcon={ () => (
            <AntDesign color="red" name="tool" size={25} />
          )}
          onChange={(item : any) => {
            // loadState(item.value);
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
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Seleccione equipo" : "..."}
          searchPlaceholder="Buscar..."
          value={marca}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item : any) => {
            setMarca(item.value);
            handleState2(item.value);
            // loadState(item.value)
            setIsFocus(false);
          }}
        />

        <Text style={styles.text}> Tipo Falla</Text>
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
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
          onChange={(item : any) => {
            setFalla(item.value);
            setIsFocus(false);
        }}/>

        {/* <Text style={styles.text}> Ubicación </Text>
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
          onChange={(item : any) => {
            
        }}/> */}

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
          onChange={(item : any) => {
            setUbi(item.value);
        }}/>

        <Text style={styles.text}> Operador </Text>
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
          onChange={(item : any) => {
            setEncargado(item.value);
        }}/>
            

        <View style={styles.containerLine}>

          <View style={styles.containerLineInside}>
            <Text style={styles.text}> Numero de maquina</Text>
            <TextInput placeholder="Numero de maquina"
              style={styles.boxsmall1}
              keyboardType="numeric"
              onChangeText={setNum}
              value={num}
            />
          </View>
          <View style={styles.containerLineInside}>
            <Text style={styles.text}> Departamento encargado </Text>
            <TextInput
              placeholder="Departamento Encargado"
              style={styles.boxsmall1}
              onChangeText={setDepto}
              value={depto}
            ></TextInput>
          </View>

        </View>

        <View style={styles.containerLineInside}>
          <Text style={styles.Text}> Descripción de la falla </Text>
          <TextInput
            multiline // Esta prop permite el ingreso de múltiples líneas
            numberOfLines={6} // Establece la altura inicial del componente
            placeholder="Descrpción de la falla "
            style={styles.boxBig}
            onChangeText={setDescripcion}
            value={descripcion}
          ></TextInput>
        </View>


        <View style={styles.containerGeFoto}>
          <CameraView style={styles.containerFoto}
            facing={facing}
            >
            <View>
              <TouchableOpacity>
              </TouchableOpacity>
            </View>
          </CameraView>

          {/* {!fotoUri ? (
            <Camera
              style={styles.containerFoto}
              autoFocus={true}
              // type={type}
              // flashMode={flash}
              ref={cameraRef}
            ></Camera>
          ) : (
            <Image style={styles.imagenCapturada} source={{ uri: fotoUri }} />
          )} */}

        </View>

        <View style={styles.containerButton}>

          <View style={styles.LineButtonBorrar}>
            <Button onPress={() => setFotoUri(null)}
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
      padding: 15,
      backgroundColor:"#e8e8e8"
      // backgroundColor:"red"
    },
    containerLine: {
      flexDirection:'row',
      justifyContent:"space-around"
    },
    containerLineInside: {
      alignItems:"center",
    },
    containerButton:{
      flexDirection:"row",
      justifyContent:"space-around",
      paddingTop:"5%"
    },
    LineButtonBorrar: {
      width: 150
    },
    LineButtonTomarFoto: {
      width: 150
    },
    text: {
      fontSize: 18,
      marginVertical:"1%"
    },
    dropdown: {
      height: 30,
      borderColor: "gray",
      borderWidth: .5,
      width: '98%',
      backgroundColor: "#fff",
      paddingLeft:"3%",
    },
    iconStyle: {
      width: 20,
      height: 20,
      tintColor:"white",
      backgroundColor:"#3a456f"
    },
    placeholderStyle: {
      fontSize: 16,
      left:10
    },
    selectedTextStyle: {
      fontSize: 16,
      left:10,
      fontWeight:"600",
      fontStyle:"italic"
    },
    inputSearchStyle: {
      height: 30,
      fontSize: 18,
      color:"#242f66"
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
      marginBottom: 20,
      backgroundColor: "#fff",
      minHeight: 40,
      maxHeight: 60,
    },
    containerGeFoto: {      
      width:"100%",
      alignItems:"center",
    },
    containerFoto: {      
      width:"70%",
      height: 240,
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