import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TextInput, Image }  from 'react-native';
import { TouchableOpacity, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-paper';
import RNFetchBlob from "rn-fetch-blob";
import { Alert } from 'react-native';
import moment from 'moment';
import axios from 'axios';

const Tickets= () => {  
  //Datas
  const [noTicketData, setNoTicketData] = useState([]);
  const [noTicket, setNoTicket] = useState(null);
  const [repsolData, setRepsolData] = useState([]);
  const [fechaData, setFechaData] = useState([]);
  const [motivoData, setMotivoData] = useState([]);
  const [atencionData, setAtencionData] = useState([]);
  const [estadoData, setEstadoData] = useState([]);
  const [causaData, setCausaData] = useState([]);
  const [accionesData, setAccionesData] = useState([]);
  
  //Valores
  const [atencion, setAtencion] = useState('');
  const [acciones, setAcciones] = useState('');
  const [fotoUri, setFotoUri] = useState('https://fakeimg.pl/300x300/e8e8e8/3a456f?text=Not+Found&font=lobster');
  const [repsol, setRepsol] = useState('');
  const [motivo, setMotivo] = useState('');
  const [estado, setEstado] = useState('');
  const [fecha, setFecha] = useState('');
  const [causa, setCausa] = useState('');
  // const {nombreUsuario, setNombreUsuario } = useUserContext();
  
  const estadosData = [ 
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'Liberado', value: 'Liberado' },
    { label: 'Cerrado', value: 'Cerrado' },
  ]
  //isFocus
  const [isFocus, setIsFocus] = useState(false);

  const handleState = (folio : any) => {
    var config = {
      method: 'get',
      url: `http://192.168.0.46:4000/maquinases/${folio}`,
    };

    axios(config).then(function (response) {
      const datos = response.data;
      
      setRepsolData(  datos.map((item : any) => item['Maquina']));
      setFechaData(   datos.map((item : any) => item['Fecha Inicio']));
      setMotivoData(  datos.map((item : any) => item['Descripcion de Incidencia']));
      setAtencionData(datos.map((item : any) => item['Atencion de Ticket']));
      setCausaData(   datos.map((item : any) => item['Causa Raiz']));
      setAccionesData(datos.map((item : any) => item['Acciones a Seguir']));
      
      if (datos.length > 0) {
        setRepsol(  datos[0]['Maquina']);
        setFecha(   datos[0]['Fecha Inicio']);
        setMotivo(  datos[0]['Descripcion de Incidencia']);
        setAtencion(datos[0]['Atencion de Ticket']);
        setCausa(   datos[0]['Causa Raiz']);
        setAcciones(datos[0]['Acciones a Seguir']);
      }

      fetch(`http://192.168.0.46:4000/idPicture/${folio}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'image/jpeg'
        }
      })
      .then(response => response.blob())
      .then((blob : any) => {
        // const filePath = RNFetchBlob.fs.dirs.DocumentDir + '/image.jpg';
        // RNFetchBlob.fs.writeFile(filePath, blob, 'base64');
        // const imageUri = 'file://' + filePath;
        // console.log('Image: ', imageUri);
        // setFotoUri(imageUri);
        // const base64Imagen = RNFetchBlob.base64.encode(blob);
        // const imageUri =  `data:image/jpeg;base64,${base64Imagen}`
        // console.log('Image: ', imageUri);
        // setFotoUri(imageUri);
        
      })
      .catch(error => console.error(error));

      // const imagenUrl = `http://192.168.0.46:4000/idPicture/${folio}`;
      // axios.get(imagenUrl, { responseType: 'arraybuffer' })
      // .then(responsePicture => {

      //   console.log('Response Pic: ', responsePicture );
        
      //   // const imagen = Buffer.from(response.data, 'base64').toString('binary');
      //   // console.log(imagen);
      //   // console.log('Imagen:  ', response);
      //   // const imagen = response.data;
      //   // console.log('Imagen:  ', imagen); //Problema data no encontrada
      //   // const blob = new Blob([imagen], { type: 'image/jpeg' });
      //   // console.log('Blob:  ', blob);
      //   // const url = URL.createObjectURL(blob);
      //   // setFotoUri(url);
      // })
      // .catch(error => {
      //   console.error('Error al obtener la imagen:', error);
      // });

    })
    .catch(function (error) {
      console.error('Error fetching data:', error);
    });
  };

  const fetchImage = ( folio : any ) => {

    // const response = axios.get(`http://192.168.0.46:4000/idPicture/${folio}`);

      // const response = await fetch(`http://192.168.0.46:4000/idPicture/${folio}`);
      // console.log('Response: ', response);
      // const imgPicture = response.data;
      // const base64Imagen = await convertirImagenABase64( imgPicture );
      // console.log( base64Imagen );
    
  };

  // const convertirImagenABase64 = async (imagen : any) => {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(imagen);
  //   const base64Imagen = await new Promise((resolve, reject) => {
  //       reader.onload = () => {
  //           resolve(reader.result);
  //       };
  //       reader.onerror = () => {
  //           reject(reader.error);
  //       };
  //   });
  //   return base64Imagen;
  // };

  useEffect(() => {
    var config = {  
      method: 'get',
      url: `http://192.168.0.46:4000/maqticket`,
        // url: `http://192.168.0.46:4000/maquinaseee/${nombreUsuario}`,
    };

    axios(config).then(function (response) {
      var count = Object.keys(response.data).length;
      let equipoArray: any = [];
      
      for (var i = 0; i < count; i++) {
          equipoArray.push({
          value: response.data[i]['Folio'],
          label: response.data[i]['Folio'],
          });
      }
      setNoTicketData(equipoArray);
        
    })
    .catch(function (error) {
      console.log(error);
    });
  }, []);
  
  const cargarAtencio = () => {
    var config = {  
      method: 'get',
      url: `http://192.168.0.46:4000/users`,
    };
    axios(config).then(function (response) {
      var count = Object.keys(response.data).length;
      let equipoArray: any = [];
      
      for (var i = 0; i < count; i++) {
        equipoArray.push({
          value: response.data[i].Usuario,
          label: response.data[i].Usuario,
        });
      }
      setAtencionData(equipoArray); 
      
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  useEffect(() => {
    var config = {  
      method: 'get',
      url: `http://192.168.0.46:4000/users`,
    };
    axios(config).then(function (response) {
      var count = Object.keys(response.data).length;
      let equipoArray: any = [];
      
      for (var i = 0; i < count; i++) {
        equipoArray.push({
          value: response.data[i].Usuario,
          label: response.data[i].Usuario,
        });
      }
      setAtencionData(equipoArray); 
      
    })
    .catch(function (error) {
      console.log(error);
    });
  }, []);

  // RNFetchBlob.config({
  //   fileCache: true
  // })
  // .fetch("GET", "http://www.example.com/image.png")
  // // the image is now dowloaded to device's storage
  // .then(resp => {
  //   // the image path you can use it directly with Image component
  //   imagePath = resp.path();
  //   return resp.readFile("base64");
  // })
  // .then(base64Data => {
  //   // here's base64 encoded image
  //   console.log(base64Data);
  //   // remove the file from storage
  //   return fs.unlink(imagePath);
  // });

  // useEffect(() => {
  //   fetch(`http://192.168.0.46:4000/maquinases/${folioPicture}`)
  //     .then(response => response.blob())
  //     .then(blob => {
  //       const uri = URL.createObjectURL(blob);
  //       setImageUri(uri);
  //       setLoading(false);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }, [imageId]);

  const cerrarTicket = async () => {
    if (estado === 'Liberado') {
      try {
        const fechaHora = moment().format('lll');
        const response = await axios.put(
          `http://192.168.0.46:4000/maquinase/${noTicket}`,
          {
            atendio: atencion,
            fechaCierre: fechaHora,
            estadofinal: 'Cerrado',
          }
        );
        Alert.alert('El Ticket fue Cerrado');
        console.log('Respuesta del servidor:', response.data);
      } catch (error) {
        console.error('Error al realizar la solicitud POST:', error);

      }
    }
    if (estado === 'Cerrado') {
      Alert.alert('Ticket cerrado');
    
    } else {
      Alert.alert('Aun no se puede cerrar este Ticket');
    }
  };

  return (
        
  <View style={styles.container}>
    <ScrollView>
      <Text style={styles.Textmain}>Mis Tickets</Text>

      <Text style={styles.text}>Numero de Ticket</Text>
      <Dropdown
        style={[styles.dropdown]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={noTicketData}
        search
        maxHeight={300}
        labelField='label'
        valueField='value'
        placeholder={!isFocus ? 'Seleccione Folio' : '...'}
        searchPlaceholder='Search...'
        value={noTicket}
        onChange={(item : any) => {
          handleState(item.value);
          setNoTicket(item.value);
        }}
      />

      <View style={styles.containerSeparate}>

        <View style={styles.containerDrop}>
          <Text style={styles.textCenter}>Equipo reportado</Text>
          <TextInput value={repsol} style={styles.boxsmall}></TextInput>
        </View>

        <View style={styles.containerDrop}>
          <Text style={styles.textCenter}>Fecha del Ticket</Text>
          <TextInput value={fecha} style={styles.boxsmall}></TextInput>
        </View>

      </View>

      <View style={styles.contMotivo}>
        <Text style={styles.textCenter}>Motivo</Text>
        <TextInput style={styles.boxlarge2}
          value={motivo}
          multiline
          numberOfLines={6}
          onChangeText={setMotivo}
        />
      </View>

      <View style={styles.containerSeparate2}>

        <View style={[styles.containerDrop]}>
          <Text style={styles.textCenter}>Agente que atiende</Text>
          <Dropdown
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={atencionData}
            search
            maxHeight={200}
            labelField='label'
            valueField='value'
            placeholder={'Agente que atiende...'}
            searchPlaceholder='Buscar...'
            value={atencion}
            onChange={(item : any) => {
              setAtencion(item.value);
              cargarAtencio();
            }}
          />
        </View>

        <View style={[styles.containerDrop]}>
          <Text style={styles.textCenter}>Estado del ticket</Text>      
          <Dropdown
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={estadosData}
            search
            maxHeight={200}
            labelField='label'
            valueField='value'
            placeholder={!isFocus ? 'Selecciona usuario que reporta' : '...'}
            searchPlaceholder='Buscar...'
            value={estado}
            onChange={(item : any) => {
              setEstado(item.value);
            }}
          />

        </View>

      </View>

      <Image style = { styles.imagenContainer }
        source = {{ uri: fotoUri}}>
      </Image>


      <Text style={styles.textCenter}>Causa Raiz</Text>
      <TextInput value={causa}
        onChangeText={setCausa}
        style={styles.boxlarge}
      />

      <Text style={styles.textCenter}>Acciones a Seguir</Text>
      <TextInput value={acciones}
        style={styles.boxlarge2}
        onChangeText={setAcciones}>
      </TextInput>

      <TouchableOpacity style={styles.button}
        onPress={cerrarTicket}>
        <Text style={styles.Txtboton}>Cerrar Ticket</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>

  );
}

export default Tickets;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    padding: 15,
    backgroundColor:'#e8e8e8',
  },
  Textmain: {
    fontSize: 30,
    marginBottom: 10,
    textAlign:'center',
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
    left:10,
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
  text: {
    marginLeft: 20,
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical:'2%'
  },
  textCenter: {
    fontSize:16,
    marginVertical:'2%',
    textAlign:'center',
  },
  boxlarge: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    backgroundColor: '#fff',
    textAlign: 'center',
    color: '#000000',
  },
  boxlarge2: {
    width: '100%',
    height: 80,
    borderWidth: 1, 
    borderColor: 'gray', 
    borderRadius: 20,
    backgroundColor: '#fff',
    textAlign: 'center',
    color: '#000000',
  },
  boxsmall: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'gray', 
    textAlign: 'center',
    backgroundColor: '#fff',
    color: '#000000',
  },
  contMotivo: {
    alignItems:'center',
  },
  containerSeparate: {
    width:'98%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical:'2%'
  },
  containerSeparate2: {
    width:'98%',
    flexDirection:'row',
    justifyContent: 'space-evenly',
  },
  containerDrop: {
    width:'48%',
    marginVertical:'2%',
  },
  button: {
    alignItems: 'center',
    marginVertical: '10%'
  },
  Txtboton: {
    backgroundColor: '#b01212',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: 4,
    color: 'white',
    padding: 15,
    width: '60%',
  },
  imagenContainer: {
    maxWidth:'100%',
    minWidth:300,
    height: 300,
  },
});

