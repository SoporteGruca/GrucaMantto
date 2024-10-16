import { View, Text, StyleSheet, TextInput, Image }  from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import React, { useState, useEffect } from 'react';
import { ScrollView, Linking } from 'react-native';
import { Button } from 'react-native-paper';
import { Alert } from 'react-native';
import userStore from '../store';
import moment from 'moment';
import axios from 'axios';

const Tickets = () => {  
  //Datas
  const [noTicketData, setNoTicketData] = useState([]);
  const [atencionData, setAtencionData] = useState([]);
  const [accionesData, setAccionesData] = useState([]);
  const [repsolData, setRepsolData] = useState([]);
  const [motivoData, setMotivoData] = useState([]);
  const [estadoData, setEstadoData] = useState([]);
  const [fullName, setFullNameData] = useState('');
  const [noTicket, setNoTicket] = useState(null);
  const [fechaData, setFechaData] = useState([]);
  const [causaData, setCausaData] = useState([]);
  const [correo, setCorreoData] = useState([]);
  const [usuario, setUsuario] = useState("");
  let correoArray: any = [];

  //Valores
  const [fotoUri, setFotoUri] = useState('https://fakeimg.pl/300x300/e8e8e8/3a456f?text=Not+Found&font=lobster');
  const [atencion, setAtencion] = useState('');
  const [acciones, setAcciones] = useState('');
  const [repsol, setRepsol] = useState('');
  const [motivo, setMotivo] = useState('');
  const [estado, setEstado] = useState('');
  const [foto, setFoto] = useState(null);
  const [fecha, setFecha] = useState('');
  const [causa, setCausa] = useState('');
  const [folio, setFolio] = useState('');
  let [level, setlevel] = useState('');
  let emailAddress = '';
  
  const estadosData = [ 
    { label: 'En progreso...', value: 'En progreso...' },
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'Liberado', value: 'Liberado' },
    { label: 'Cerrado', value: 'Cerrado' },]
  //isFocus
  const [isFocus, setIsFocus] = useState(false);
  //habilitados Formulario
  const [habReporte, setHabReporte] = useState(false);
  const [habFecha, setHabFecha] = useState(false);
  const [habMotivo, setHabMotivo] = useState(false);
  const [habCausa, setHabCausa] = useState(false);
  const [habAcciones, setHabAcciones] = useState(false);
  const [habCerrar, setHabCerrar] = useState(false);

  useEffect(() => {
    setUsuario(userStore.usuario);
    validarUsuario();
    getUsuarios();
    getFolios();
  }, []);
  const validarUsuario  = () => {
    var config = {
      method: 'get',
      url: `http://192.168.0.46:4000/verifica`,
    };
    axios(config).then(function (response) {
      var count = Object.keys(response.data).length;
      for (var i = 0; i < count; i++) {
        let user = response.data[i]['Usuario'];
        let nivelAcceso = response.data[i]['nivelAcceso'];
        if ( usuario == user) {
          if (nivelAcceso == 'Consu'){
            setHabReporte (false);
            setHabFecha   (false);
            setHabMotivo  (false);
            setHabCausa   (false);
            setHabAcciones(false);
            setHabCerrar  (true);
            Alert.alert('Aviso',`Acceso concedido: ${nivelAcceso} `)
          }else if (nivelAcceso == 'Operador'){
            setHabReporte (false);
            setHabFecha   (false);
            setHabMotivo  (true);
            setHabCausa   (true);
            setHabAcciones(false);
            setHabCerrar  (false);
            Alert.alert('Aviso',`Acceso concedido: ${nivelAcceso} `)
          }else if (nivelAcceso == 'Admin'){
            setHabReporte (true);
            setHabFecha   (true);
            setHabMotivo  (true);
            setHabCausa   (true);
            setHabAcciones(true);
            setHabCerrar  (false);
            Alert.alert('Aviso',`Acceso concedido: ${nivelAcceso} `)
          }
          setlevel(nivelAcceso);
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  const handleState = (folioDB : string) => {
    var config = {
      method: 'get',
      url: `http://192.168.0.46:4000/maquinases/${folioDB}`,
    };
    setFolio(folioDB);
    loadImage(folioDB);
    axios(config).then(function (response) {
      const datos = response.data;
      setRepsolData  (datos.map((item : any) => item['Maquina']));
      setFechaData   (datos.map((item : any) => item['Fecha Inicio']));
      setMotivoData  (datos.map((item : any) => item['Descripcion de Incidencia']));
      setCausaData   (datos.map((item : any) => item['Causa Raiz']));
      setAccionesData(datos.map((item : any) => item['Acciones a Seguir']));
      setEstadoData  (datos.map((item : any) => item['Estado del Ticket']));
      if (datos.length > 0) {
        setRepsol   (datos[0]['Maquina']);
        setFecha    (datos[0]['Fecha Inicio']);
        setMotivo   (datos[0]['Descripcion de Incidencia']);
        setAtencion (datos[0]['Atencion de Ticket']);
        setCausa    (datos[0]['Causa Raiz']);
        setAcciones (datos[0]['Acciones a Seguir']);
        setEstado   (datos[0]['Estado del Ticket']);
      }      
      })
    .catch(function (error) {
      console.error('Error fetching data:', error);
    });
  };
  const loadImage =  async ( folio : string ) => {
    fetch(`http://192.168.0.46:4000/idPicture/${folio}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'image/jpeg'
      }
    })
    .then(response => response.text())
    .then((base64Imagen) => {
      const imageUri = `data:image/jpeg;base64,${base64Imagen}`;
      setFotoUri(imageUri);
    })
      .catch(function(error) {
        console.error('Error fetching data:', error);
      });
  }
  const getFolios  = async () => {
    var config = {
      method: 'get',
      url: `http://192.168.0.46:4000/maqticket`,
        // url: `http://192.168.0.46:4000/maquinaseee/${usuario}`,
    };
    axios(config).then(function (response) {
      var count = Object.keys(response.data).length;
      let Array: any = [];
      for (var i = 0; i < count; i++) {
        if (response.data[i]['Estado del Ticket'] == 'Pendiente' || response.data[i]['Estado del Ticket'] == 'En progreso...') {
          // console.log(response.data[i]['Estado del Ticket']);
          Array.push({
            value: response.data[i]['Folio'],
            label: response.data[i]['Folio'],
          });
        }
      }
      setNoTicketData(Array);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
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
        correoArray.push({
          value: response.data[i].Usuario,
          label: response.data[i].Usuario,
        });
      }
      console.log(correo);
      setAtencionData(equipoArray); 
      setCorreoData(correoArray)      
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  const getUsuarios  = async () => {
    var config = {  
      method: 'get',
      url: `http://192.168.0.46:4000/users`,
    };
    axios(config).then(function (response) {
      var count = Object.keys(response.data).length;
      let userArray: any = [];
      for (var i = 0; i < count; i++) {
        userArray.push({
          value: response.data[i].Usuario,
          label: response.data[i].Usuario,
        });
      }
      setAtencionData(userArray); 
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  const cerrarTicket = async () => {
    if (motivo != '' && causa != '' ) {
      if (estado === 'Cerrado' && level === "Operador" ) {
        Alert.alert('Aviso', 'Usted no cuentan con permisos suficientes para realizar este cambio, el estado de Cerrado solo es para personal de IT / Administrador');
      } else if ( level === "Cosnu" ){
        Alert.alert('Aviso', 'Los permisos en tu cuenta no permite realizar esta operacion, favor de consultar con personal de sistemas. \n ¿Quieres mandar correo con tu peticion? ');
      } else{
        if (atencion == 'Oscar') {
          emailAddress =  'soporte.sistemas@gruca.mx';
        }
        else if (atencion == 'Juanpa') {
          emailAddress =  'sistemas@gruca.mx';
        }
        else if (atencion == 'Mario') {
          emailAddress =  'mario.roman@gruca.mx';
        } else {
          emailAddress =  'soporte.sistemas@gruca.mx';
        }
        try {
          const fechaHora = moment().format('lll');
          const response = await axios.put(
            `http://192.168.0.46:4000/maquinase/${noTicket}`, {
              atendio: atencion,
              fechaCierre: fechaHora,
              estadofinal: `${estado}`}
          );
          if ( atencion == 'Oscar')
          getFolios();
          Alert.alert('Aviso', `El Ticket esta ${estado}`);
        } catch (error) {
          console.error('Error', 'Error al realizar la solicitud POST:', error);
        }
      }
    } else {
      Alert.alert('Aviso', 'Aun no se puede cerrar este Ticket');
    }

    const openGmail = async () => {
      // const emailAddress = 'reporteyfallas@gruca.mx';
      const subject = `Se ha registrado un reporte con el folio: ${folio}`;
      const body = `${fullName} ha enviado un reporte de ${repsol} debido a ${motivo}`;
      const mailtoUrl = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
      // const emailAddressTest = 'soporte.sistemas@gruca.mx';
      // const subjectTest = `Se ha registrado un reporte con el folio: ${folio}`;
      // const bodyTest = `${usuarioReport} ha enviado un reporte de ${equipo} debido a ${descripcion}`;
      // const mailtoUrl = `mailto:${emailAddressTest}?subject=${subjectTest}&body=${bodyTest}`;
      Linking.openURL(mailtoUrl);
    };
    
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
              validarUsuario();
            }}
          />
          <View style={styles.containerSeparate}>
            <View style={styles.containerDrop}>
              <Text style={styles.textCenter}>Equipo reportado</Text>
              <TextInput value={repsol}
                style={styles.boxsmall}
                editable={habReporte}
                />
            </View>
            <View style={styles.containerDrop}>
              <Text style={styles.textCenter}>Fecha del Ticket</Text>
              <TextInput 
                value={fecha} 
                style={styles.boxsmall}
                editable={habFecha}
                />
            </View>
          </View>
          <View style={styles.contMotivo}>
            <Text style={styles.textCenter}>Motivo</Text>
            <TextInput style={styles.boxlarge2}
              value={motivo}
              multiline
              numberOfLines={6}
              editable={habMotivo}
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
                placeholder={'Estado del ticket...'}
                searchPlaceholder='Buscar...'
                value={estado}
                onChange={(item : any) => {
                  setEstado(item.value);
                }}
              />
            </View>
          </View>
            <Image style = { styles.imagenContainer }
              source = {{ uri: fotoUri }}>
            </Image>
          <Text style={styles.textCenter}>Causa Raiz</Text>
          <TextInput value={causa}
            onChangeText={setCausa}
            editable={habCausa}
            style={styles.boxlarge}
          />
          <Text style={styles.textCenter}>Acciones a Seguir</Text>
          <TextInput value={acciones}
            style={styles.boxlarge2}
            editable={habAcciones}
            onChangeText={setAcciones}>
          </TextInput>
          {/* <TouchableOpacity style={styles.button}
            onPress={cerrarTicket}
            >
            <Text style={styles.Txtboton}>Cerrar Ticket</Text>
          </TouchableOpacity> */}
            <Button onPress={ cerrarTicket }
            style={styles.button}
            disabled={habCerrar}
            icon='file-document-edit'
            mode='contained'
            buttonColor='#374175'>
              Actualizar ticket
          </Button>
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
    width:'100%',
    flexDirection: 'column',
    marginVertical:'2%'
  },
  containerSeparate2: {
    width:'100%',
    justifyContent: 'space-evenly',
  },
  containerDrop: {
    width:'100%',
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
    marginVertical: '4%',
  },
});

