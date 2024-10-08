import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { TextInput, Image, Alert, Linking, Platform } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Button } from 'react-native-paper';
import { autorun} from 'mobx';
import { Camera } from 'expo-camera';
// import { useContext } from 'react';
// import store from './Store';
// import { UserContext } from './store';
import moment from 'moment';
import axios from 'axios';

const Tab = createBottomTabNavigator();
// const { user } = useContext(UserContext);
// console.log(user.nombreUsuario);


const Reportes = () => {
  //Datos
  const [useReport, setuseReportData] = useState([{ }]);
  const [equipoData, setEquipoData] = useState([{ }]);
  const [marcaData, setMarcaData] = useState([{ }]);
  const [fallaData, setFallaData] = useState([{ }]);
  const [ubiData, setUbiData] = useState([{ }]);
  const [encData, setEncData] = useState([{ }]);
  const [numData, setnumData] = useState([{ }]);
  const [falla, setFalla] = useState('');
  const [isCameraReady, setIsCameraReady] = useState(false);
  //Camara
  const [hasCameraPermission, setHasCameraPermission] = useState({});
  const [image, setImage] = useState('https://fakeimg.pl/300x300/e8e8e8/3a456f?text=Not+Found&font=lobster');
  //Valores para Test
  const [descripcion, setDescripcion] = useState('Mantenimiento Correctivo');
  const [marca, setMarca] = useState('Balanceadora Hofmann (Leeson)');
  const [encargado, setEncargado] = useState('Alejandro Ramirez');
  const [usuarioReport, setUsuarioReport] = useState('Oscar');
  const [equipo, setEquipo] = useState('Balanceadora');
  const [depto, setDepto] = useState('Habilitado');
  const [fotoUri, setFotoUri] = useState(null);
  const [ubi, setUbi] = useState('Almacén');
  const [num, setNum] = useState('1234');
//Valores
  // const [usuarioReport, setUsuarioReport] = useState('');
  // const [descripcion, setDescripcion] = useState('');
  // const [encargado, setEncargado] = useState('');
  // const [fotoUri, setFotoUri] = useState(null);
  // const [equipo, setEquipo] = useState('');
  // const [marca, setMarca] = useState('');
  // const [depto, setDepto] = useState('');
  // const [num, setNum] = useState('');
  // const [ubi, setUbi] = useState('');
  //Otro test
  // const {nombreUsuario, setNombreUsuario } = useUserContext();
  //Funciones
  const [selectedValue, setSelectedValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [count, setCount] = useState({});
  const [folio, setFolio] = useState('');

  useEffect(() => {
    fetchCount();
    loadMaquina();
    camPermission();
    loadUbicacion();
    loadEncargado();
    loadIncidencia();
  }, []);
  
  const fetchCount = async () => {
    try {
      const response = await axios.get('http://192.168.0.46:4000/foliosm');
      const recordset = response.data;
      if (Array.isArray(recordset) && recordset.length > 0) {
        const countValue = recordset[0][''];
        if (typeof countValue === 'number' || typeof countValue === 'string') {
          setCount(countValue);
          const numeroPredeterminado = countValue;
          const folioPredeterminado = `RM-${numeroPredeterminado
            .toString()
            .padStart(4, '0')}`;
          setFolio(folioPredeterminado);
          
        } else {
          console.error('El valor del recuento no es válido:', countValue);
        }
      } else {
        console.error('La respuesta no contiene datos válidos:', recordset);
      }
    } catch (error) {
      console.error('Error al obtener el recuento:', error);
    }
  };
  const loadMaquina = (() => {
    var config = {
      method: 'get',
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
  })
  const loadEncargado = (() => {
    var config = {
      method: 'get',
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
  })
  const loadUbicacion = (() => {
    var config = {
      method: 'get',
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
  })
  // useEffect(() => {
  //   var config = {
  //     method: 'get',
  //     url: `http://192.168.0.46:4000/users`,
  //   };
  //   axios(config).then(function (response) {
  //     var count = Object.keys(response.data).length;      
  //     let equipoArray = [];            
  //       for (var i = 0; i < count; i++) {
  //         equipoArray.push({
  //           value: response.data[i].Usuario,
  //           label: response.data[i].Usuario,
  //         });
  //       }        
  //       setuseReportData(equipoArray);
  //     })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
  // }, []);
  const generarFolio = () => {
    const nuevoNumero = parseInt(folio.split('-')[1]) + 1;
    const nuevoFolio = `RM-${nuevoNumero.toString().padStart(4, '0')}`;
    setFolio(nuevoFolio);
  };
  const loadIncidencia = (() => {
    var config = {
      method: 'get',
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
  });
  const handleState = (clasmaq: any) => {
    var config = {
      method: 'get',
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
      method: 'get',
      url: `http://192.168.0.46:4000/maquinas/${equipo}/${equipoMarca}`,
    }
    //Secccion de ubucaicon charge.
    var configMaq = {
      method: 'get',
      url: `http://192.168.0.46:4000/maqUbica/${equipoMarca}`,
    }
    axios(configMaq).then(function (response) {
      const datos = response.data;
      console.log(datos);
      let ubiArray : any[] = [];
      let encArray : any[] = [];
      let numArray : any[] = [];
      let depArray : any[] = [];
      // console.log(response.data[0].UbicaMaq);
      for (var i = 0; i < datos.length; i++) {
        ubiArray.push({
          value: datos[i].UbicaMaq,
          label: datos[i].UbicaMaq,
        });
        encArray.push({
          value: datos[i].Encargado,
          label: datos[i].Encargado,
        })
        numArray.push({
          value: datos[i].NumSerMaq,
          label: datos[i].NumSerMaq,
        })
        depArray.push({
          value: datos[i].DeptoMaq,
          label: datos[i].DeptoMaq,
        })
      }
      setUbi(ubiArray[0].value);
      setNum(numArray[0].value);
      setDepto(depArray[0].value);
      setEncargado(encArray[0].value);
    }).catch(function (error) {
      console.log(error);
    });
  }
  const camPermission = (() =>{
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  });
  const deletePicture = async() =>{
    setFotoUri(null);
    setImage('https://fakeimg.pl/300x300/e8e8e8/3a456f?text=Not+Found&font=lobster');  
  }
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
      <Text style={{ color: '#fff', fontSize: 16 }}>
        Acceso a Camara Denegado
      </Text>
    );
  }
  const ambos = async () => {
    // if (usuarioReport === '') {
    if (usuarioReport === '' || equipo === '' || marca === '' || descripcion === '' || encargado === '' || num === '' || image === 'https://fakeimg.pl/300x300/e8e8e8/3a456f?text=Not+Found&font=lobster' ) {
      Alert.alert('Debe llenar todos los campos del formulario para generar el reportar');
    } else {
      try {
        await fetchCount();
        generarFolio();
        enviarDatos();
        setUsuarioReport('');
        setEquipo('');
        setMarca('');
        setDescripcion('');
        setFalla('');
        setEncargado('');
        setNum('');
        setDepto('');
        setUbi('');
        setFotoUri(null);
        setImage('https://fakeimg.pl/300x300/e8e8e8/3a456f?text=Not+Found&font=lobster');
        Alert.alert(`Aviso`, `Se ha registrado un reporte con el folio: ${folio}. El reporte ha sido enviado correctamente.`);
        await fetchCount();
        generarFolio();
        openGmail();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const enviarDatos = async () => {
    try {
      const fechaHora = moment().format('lll');
      const formData: any = new FormData();
      formData.append('image', {
        uri: image,
        type: 'image/jpg',
        name: 'imagen.jpg',
      });
      // const imageBase64 = await fetch(image)
      // .then(response => response.blob())
      // .then(blob => {
      //   const reader = new FileReader();
      //   reader.onload = () => {
      //     const base64Image = reader.result;
      //     formData.append('image', base64Image);
      //     // console.log('Base', base64Image); //Validar que la imagen esta siendo enviada de forma correcta
      //   };
      //   reader.readAsDataURL(blob);
      // });
      formData.append('fecha', fechaHora);
      formData.append('usuario', usuarioReport);
      formData.append('encargado', encargado);
      formData.append('departamento', depto);
      formData.append('id', num);
      formData.append('maquina', marca);
      formData.append('clase', equipo);
      formData.append('falla', falla);
      formData.append('ubicacion', ubi);
      formData.append('descripcion', descripcion);
      formData.append('estado', 'Pendiente');
      formData.append('personal', '');
      formData.append('descripcionfalla', descripcion);
      formData.append('acciones', '');
      formData.append('folio', folio);
      const response = await axios.post(
        'http://192.168.0.46:4000/maquinas', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    } catch (error) {
      console.error('Error al realizar la solicitud POST:', error);
      // console.error('Error al enviar la imagen:', error);
    }
  };

  const openGmail = async () => {
  
    // const emailAddress = 'reporteyfallas@gruca.mx';
    const emailAddressTest = 'soporte.sistemas@gruca.mx';
    // const subject = `Se ha registrado un Reporte con el folio: ${folio}`;
    const subjectTest = `Se ha registrado un reporte con el folio: ${folio}`;
    // const body = `Se ha enviado un Reporte de ${equipo} debido a que ${descripcion}`;
    const bodyTest = `Se ha enviado un reporte de ${equipo} debido a ${descripcion}`;
    // const mailtoUrl = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    const mailtoUrl = `mailto:${emailAddressTest}?subject=${subjectTest}&body=${bodyTest}`;

    Linking.openURL(mailtoUrl);

  };

  return (
    <View style={styles.container}>
      <ScrollView>

      <View style={styles.containerLineInside}>
        <Text style={styles.text}>Usuario que reporta</Text>
        <TextInput placeholder='Nombre del usuario...'
          style={styles.boxBig}
          onChangeText={(text : any) => {
            setUsuarioReport(text);
            handleState(text);
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
          labelField='label'
          valueField='value'
          placeholder={!isFocus ? 'Selecciona usuario que reporta' : '...'}
          searchPlaceholder='Buscar...'
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
          labelField='label'
          valueField='value'
          placeholder={!isFocus ? 'Seleccione maquina' : '...'}
          searchPlaceholder='Buscar...'
          value={equipo}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          renderLeftIcon={ () => (
            <AntDesign color='red' name='tool' size={25} />
          )}
          onChange={(item : any) => {
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
          labelField='label'
          valueField='value'
          placeholder={!isFocus ? 'Seleccione equipo' : '...'}
          searchPlaceholder='Buscar...'
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
          labelField='label'
          valueField='value'
          placeholder={!isFocus ? 'Seleccione la falla' : '...'}
          searchPlaceholder='Buscar...'
          value={falla}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item : any) => {
            setFalla(item.value);
            setIsFocus(false);
        }}/>
        <Text style={styles.text}> Ubicación </Text>
        {/* <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={ubiData}
          search
          maxHeight={200}
          labelField='label'
          valueField='value'
          placeholder={'Seleccione la ubicacion...'}
          searchPlaceholder='Buscar...'
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
          labelField='label'
          valueField='value'
          placeholder={'Seleccione la ubicacion...'}
          searchPlaceholder='Buscar...'
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
          labelField='label'
          valueField='value'
          placeholder={'Seleccione al operador...'}
          value={encargado}
          onChange={(item : any) => {
            setEncargado(item.value);
        }}/>
        <View style={styles.containerLine}>
          <View style={styles.containerLineInside}>
            <Text style={styles.text}> Numero de maquina</Text>
            <TextInput placeholder='Numero de maquina'
              style={styles.boxsmall}
              keyboardType='numeric'
              onChangeText={setNum}
              value={num}
            />
          </View>
          <View style={styles.containerLineInside}>
            <Text style={styles.text}> Departamento encargado </Text>
            <TextInput
              placeholder='Departamento Encargado'
              style={styles.boxsmall}
              onChangeText={setDepto}
              value={depto}
            ></TextInput>
          </View>
        </View>
        <View style={styles.containerLineInside}>
          <Text style={styles.Text}> Descripción de la falla </Text>
          <TextInput
            multiline
            numberOfLines={6} 
            placeholder='Descrpción de la falla '
            style={styles.boxBig}
            onChangeText={setDescripcion}
            value={descripcion}
          ></TextInput>
        </View>
        <View>
          {image && <Image source={{ uri : image }} />}
          <Image style = { styles.imagenContainer }
          source = {{ uri : image }}>
          </Image>
        </View>
        <View style={styles.containerButton}>
          <View style={styles.LineButtonBorrar}>
            <Button onPress={deletePicture}
              icon='delete'
              mode='contained'
              buttonColor='#b01212'>
              Borrar
            </Button>
          </View>
          <View style={styles.LineButtonTomarFoto}>
            <Button onPress={takePicture}
              icon='camera'
              mode='contained'
              buttonColor='#374175'>
              Tomar foto
            </Button>
          </View>
        </View>
        <View style={styles.container}>
          <Button onPress={ambos}
            icon='mail'
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
      backgroundColor:'#e8e8e8',
      height: '100%',
      width:'100%',
      padding: 15,
    },
    containerLine: {
      flexDirection:'row',
      justifyContent:'space-around',
      marginVertical: '2%',
    },
    containerLineInside: {
      alignItems:'center',
    },
    containerButton:{
      flexDirection:'row',
      justifyContent:'space-around',
      paddingTop:'5%'
    },
    LineButtonBorrar: {
      width: 150
    },
    LineButtonTomarFoto: {
      width: 150
    },
    text: {
      fontSize: 18,
      marginVertical:'2%',
    },
    dropdown: {
      backgroundColor: '#fff',
      borderColor: 'gray',
      borderRadius: 20,
      paddingLeft:'3%',
      borderWidth: .5,
      width: '98%',
      height: 40,
    },
    iconStyle: {
      backgroundColor:'#3a456f',
      position: 'relative',
      tintColor:'white',
      height: 20,
      width: 20,
      right: 15,
    },
    placeholderStyle: {
      fontSize: 16,
      left:10
    },
    selectedTextStyle: {
      fontSize: 16,
      left:10,
      fontWeight:'600',
      fontStyle:'italic'
    },
    inputSearchStyle: {
      height: 30,
      fontSize: 18,
      color:'#242f66'
    },
    boxsmall: {
      backgroundColor: '#fff',
      paddingHorizontal: 10,
      marginVertical: '2%',
      borderColor: 'gray', 
      textAlign:"center",
      borderRadius: 20,
      borderWidth: .5, 
      width: '100%',
      height: 40,
    },
    boxBig: {
      backgroundColor: '#fff',
      paddingHorizontal: 10,
      marginVertical: '2%',
      borderColor: 'gray',
      textAlign:"center",
      borderRadius: 20,
      borderWidth: .5, 
      width: '100%',
      minHeight: 40,
      maxHeight: 60,
    },
    containerFoto: {      
      width:'100%',
      height: 240,
    },
    Text: {
      marginLeft: 20,
      fontSize: 16,
      fontWeight: 'bold',
      marginVertical:'2%'
    },
    imagenContainer: {
      maxWidth:'100%',
      minWidth:300,
      height: 300,
      marginVertical:'2%',
      resizeMode:"contain",
      borderRadius: 10,
    },
});