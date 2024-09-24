import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TextInput, Image }  from 'react-native';
import { TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-paper';
import moment from 'moment';
import { Alert } from 'react-native';
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

  let [image, setImage] = useState('https://fakeimg.pl/300x300/e8e8e8/3a456f?text=Not+Found&font=lobster');
  
  //Valores
  const [atencion, setAtencion] = useState('');
  const [acciones, setAcciones] = useState('');
  const [fotoUri, setFotoUri] = useState(null);
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

      console.log(datos);
      let imagenArray: any = []
      
      setRepsolData(datos.map((item : any) => item['Maquina']));
      setFechaData(datos.map((item : any) => item['Fecha Inicio']));
      setMotivoData(datos.map((item : any) => item['Descripcion de Incidencia']));
      setAtencionData(datos.map((item : any) => item['Atencion de Ticket']));
      setCausaData(datos.map((item : any) => item['Causa Raiz']));
      setAccionesData(datos.map((item : any) => item['Acciones a Seguir']));
      setImage(datos.map((item : any) => item['Image']));
      
      // console.log(imagenArray);
      
      if (datos.length > 0) {
        setRepsol(datos[0]['Maquina']);
        setFecha(datos[0]['Fecha Inicio']);
        setMotivo(datos[0]['Descripcion de Incidencia']);
        setAtencion(datos[0]['Atencion de Ticket']);
        setCausa(datos[0]['Causa Raiz']);
        setAcciones(datos[0]['Acciones a Seguir']);
        let pictureSaved = imagenArray.push( response.data[0]['Image'])
        
        // setImage(pictureSaved.uri);
        // console.log(setImage);
        
      }


    })
    .catch(function (error) {
      console.error('Error fetching data:', error);
    });
  };

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
          <TextInput value={fecha} style={styles.boxsmall1}></TextInput>
        </View>

      </View>

      <View style={styles.contMotivo}>
        <Text style={styles.textCenter}>Motivo</Text>
        <TextInput style={styles.boxlarge2}
          value={motivo}
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
            placeholder={!isFocus ? 'Agente que atiende la falla' : '...'}
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

      <Button> 
            {image && <Image source={{ uri: image }} />}
      </Button>
      <Image style = { styles.imagenContainer }
        source = {{ uri: image}}
      >
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
  },
  Textmain: {
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 10,
    textAlign:'center',
  },
  dropdown: {
    height: 30,
    borderColor: 'gray',
    borderWidth: .5,
    width: '98%',
    backgroundColor: '#fff',
    paddingLeft:'3%'
  },
  iconStyle: {
    width: 20,
    height: 20,
    tintColor:'white',
    backgroundColor:'#3a456f'
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
    textAlign:'center',
    marginVertical:'2%'
  },
  textCenter: {
    fontSize:16,
    marginVertical:'2%',
    textAlign:'center',
  },
  boxlarge: {
    width: 360,
    height: 40,
    borderWidth: 1, // Añade un borde de 1 píxel
    borderColor: 'gray', // Color del borde
    borderRadius: 4,
    marginTop: 5,
    marginLeft: 0,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    color: '#000000',
  },
  boxlarge2: {
    width: 360,
    height: 80,
    borderWidth: 1, // Añade un borde de 1 píxel
    borderColor: 'gray', // Color del borde
    borderRadius: 4,
    marginLeft: 0,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    color: '#000000',
  },
  boxsmall: {
    width: '100%',
    height: 40,
    borderWidth: 1, // Añade un borde de 1 píxel
    borderColor: 'gray', // Color del borde
    backgroundColor: '#fff',
    color: '#000000',
  },
  boxsmall1: {
    width:'100%',
    height: 40,
    borderWidth: 1, // Añade un borde de 1 píxel
    borderColor: 'gray', // Color del borde
    paddingHorizontal: 10,
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
    paddingVertical:10,
  },
  containerSeparate2: {
    width:'98%',
    flexDirection:'row',
    justifyContent: 'space-evenly',
  },
  containerDrop: {
    width:'48%'
  },
  button: {
    alignItems: 'center',
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

