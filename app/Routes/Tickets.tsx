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
  let [usuario, setUsuario] = useState("");
  //Valores
  const [fotoUri, setFotoUri] = useState('https://fakeimg.pl/300x300/e8e8e8/3a456f?text=Not+Found&font=lobster');
  const [atencion, setAtencion] = useState('');
  const [acciones, setAcciones] = useState('');
  const [estadoDB, setEstadoDB] = useState('');
  const [repsol, setRepsol] = useState('');
  const [motivo, setMotivo] = useState('');
  const [estado, setEstado] = useState('');
  const [foto, setFoto] = useState(null);
  const [fecha, setFecha] = useState('');
  const [causa, setCausa] = useState('');
  const [folio, setFolio] = useState('');
  const [level, setlevel] = useState('');
  const [correo, setCorreo] = useState('');
  let body = '', subject = '', emailAddress = '', cuenta : any;
  const estadosData = [ 
    { label: 'En progreso...', value: 'En progreso...' },
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'Liberado', value: 'Liberado' },
    { label: 'Cerrado', value: 'Cerrado' },]
  const [isFocus, setIsFocus] = useState(false);
  //habilitados Formulario
  const [habReporte, setHabReporte] = useState(false);
  const [habFecha, setHabFecha] = useState(false);
  const [habMotivo, setHabMotivo] = useState(false);
  const [habCausa, setHabCausa] = useState(false);
  const [habAcciones, setHabAcciones] = useState(false);
  const [habCerrar, setHabCerrar] = useState(false);

  useEffect(() => {
    usuario = userStore.usuario;
    setUsuario(userStore.usuario);
    // setUsuario(userStore.usuario);
    setFullNameData(userStore.fullName);
    validarUsuario();
    getFolios();
  }, []);
  const handleStateAtencionChange = (item : any) => {
    setAtencion(item)
    validarUsuario(item);
  }
  const validarUsuario = (atencion?: any) => {
    axios.get(`http://192.168.0.46:4000/verifica`).then(function (response) {
      cuenta = response.data.map((item : any) => ( {
        nombre: item['Usuario'],
        email: item['correo'],
      }));
      var count = Object.keys(response.data).length;
      let userArray: any = [];
      for (var i = 0; i < count; i++) {
        if (response.data[i].correo) {
          userArray.push({
            value: response.data[i].Usuario,
            label: response.data[i].Usuario,
          });
        }
        let user = response.data[i]['Usuario'];
        let nivelAcceso = response.data[i]['nivelAcceso'];
        if ( usuario === user) {
          setlevel(nivelAcceso);
          if (nivelAcceso == 'Consu'){
            setHabReporte (false);
            setHabFecha   (false);
            setHabMotivo  (false);
            setHabCausa   (false);
            setHabAcciones(false);
            setHabCerrar  (true);
          }else if (nivelAcceso == 'User'){
            setHabReporte (false);
            setHabFecha   (false);
            setHabMotivo  (true);
            setHabCausa   (true);
            setHabAcciones(false);
            setHabCerrar  (false);
          }else if (nivelAcceso == 'Admin' || nivelAcceso == 'Poweruser'){
            setHabReporte (false);
            setHabFecha   (false);
            setHabMotivo  (true);
            setHabCausa   (true);
            setHabAcciones(true);
            setHabCerrar  (false);
          }
          cuenta.forEach((item : any) => {
            if (item.nombre === atencion) {
              emailAddress = item.email;
            } 
          });
        }
      }
      setAtencionData(userArray); 
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  const handleState = (folioDB : string) => {
    setFolio(folioDB);
    loadImage(folioDB);
    axios.get(`http://192.168.0.46:4000/maquinases/${folioDB}`).then(function (response) {
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
        setEstadoDB   (datos[0]['Estado del Ticket']);
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
    axios.get(`http://192.168.0.46:4000/maqticket`).then(function (response) {
      var count = Object.keys(response.data).length;
      let Array: any = [];
      for (var i = 0; i < count; i++) {
          Array.push({
            value: response.data[i]['Folio'],
            label: response.data[i]['Folio'],
          });
      }
      setNoTicketData(Array);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  const openGmail = async () => {
    subject = `Se te ha asignado el siguiente reporte con el folio: ${folio}`;
    body = `${fullName} ha enviado un reporte de ${repsol} debido a ${motivo}, el ticket se encuentra con el siguiete estado: ${estado}`;
    const mailtoUrl = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    Linking.openURL(mailtoUrl);
  };
  const sendWhatsApp = () => {
    const phone = 4494832860;
    const link = `https://wa.me/${phone}?text=${subject} ${body}`
    Linking.canOpenURL(link).then((supported) => {
      if (!supported) {
        Alert.alert('Por favor instale WhatsApp para enviar un mensaje directo');
      }
      return Linking.openURL(link);
    })
  };
  const cerrarTicket = async () => {
    if (noTicket!= '' && motivo != '' && atencion != '' && causa != '' ) {
      if (level === 'User' && estadoDB === 'Cerrado' && estado === 'liberado' || level === 'Poweruser' && estadoDB === 'Liberado' && estado === 'Cerrar') {
        enviarDatos();
      } else if (level === 'User' && estadoDB !== 'Cerrado' && estado === 'Cerrado' || level === 'Poweruser' && estadoDB !== 'Liberado' && estado === 'Liberado' ) {
        Alert.alert('Aviso', 'No se puede completar la operacion solicitada, es necesario que revises los permisos de tu cuenta')
      } else if ( level === 'Admin' && estadoDB === 'Cerrado') {
        enviarDatos();
      } else if ( estadoDB === 'Cerrado') {
        Alert.alert('Aviso', 'El ticket ya no puede ser modificado una vez cerrado');
      } else {
        enviarDatos();
      }
    } else {
      Alert.alert('Aviso', 'Favor de rellenar los campos faltantes, para continuar.');
    }
  };

  const enviarDatos = async function name() {
    
    if (atencion === 'Oscar') {
      emailAddress = 'soporte.sistemas@gruca.mx'
    } else if (atencion === 'Juanpa') {
      emailAddress = 'sistemas@gruca.mx' 
    } else if (atencion === 'Mario') {
      emailAddress = 'mario.roman@gruca.mx' 
    }
    try {
      const fechaHora = moment().format('lll');
      const response = await axios.put(
        `http://192.168.0.46:4000/maquinase/${noTicket}`, {
          atendio: atencion,
          fechaCierre: fechaHora,
          estadofinal: `${estado}`}
      );
      openGmail();
      await new Promise(resolve => setTimeout(resolve, 3000));
      sendWhatsApp();
      getFolios();
      limpiarcampos();
      Alert.alert('Aviso', `El Ticket esta ${estado}`);
    } catch (error) {
      console.error('Error', 'Error al realizar la solicitud POST:', error);
    }

  }
  const limpiarcampos = () =>  {
    setNoTicket(null);
    setFotoUri('https://fakeimg.pl/300x300/e8e8e8/3a456f?text=Not+Found&font=lobster');
    setAtencion('');
    setAcciones('');
    setRepsol('');
    setMotivo('');
    setEstado('');
    setFoto(null);
    setFecha('');
    setCausa('');
    setFolio('');
  }

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
          <TextInput style={styles.boxsmall} 
            placeholder='Equipo reportado'
            value={repsol}
            editable={habReporte}
            />
        </View>
        <View style={styles.containerDrop}>
          <Text style={styles.textCenter}>Fecha del Ticket</Text>
          <TextInput style={styles.boxsmall}
            placeholder='Fecha del Ticket'
            value={fecha} 
            editable={habFecha}
            />
        </View>
      </View>
      <View style={styles.contMotivo}>
        <Text style={styles.textCenter}>Motivo</Text>
        <TextInput style={styles.boxlarge2}
          placeholder='Motivo'
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
              handleStateAtencionChange(item.value);
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
    backgroundColor:'#e8e8e8',
    paddingTop:'10%',
    height: '100%',
    width: '100%',
    padding: 15,
  },
  Textmain: {
    textAlign:'center',
    marginBottom: 10,
    fontSize: 30,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderRadius: 20,
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
    textAlign:"center",
    fontSize: 16,
  },
  selectedTextStyle: {
    textAlign:"center",
    fontStyle:'italic',
    fontWeight:'600',
    fontSize: 16,
  },
  inputSearchStyle: {
    color:'#242f66',
    fontSize: 18,
    height: 30,
  },
  text: {
    marginVertical:'2%',
    fontWeight: 'bold',
    textAlign:'center',
    fontSize: 16,
  },
  textCenter: {
    marginVertical:'2%',
    textAlign:'center',
    fontSize:16,
  },
  boxlarge: {
    backgroundColor: '#fff',
    borderColor: 'gray',
    textAlign: 'center',
    borderRadius: 20,
    color: '#000000',
    width: '100%',
    height: 40,
  },
  boxlarge2: {
    backgroundColor: '#fff',
    borderColor: 'gray', 
    textAlign: 'center',
    color: '#000000',
    borderRadius: 20,
    width: '100%',
    height: 80,
  },
  boxsmall: {
    backgroundColor: '#fff',
    borderColor: 'gray', 
    textAlign: 'center',
    color: '#000000',
    borderRadius: 20,
    width: '100%',
    height: 40,
  },
  contMotivo: {
    alignItems:'center',
  },
  containerSeparate: {
    flexDirection: 'column',
    marginVertical:'2%',
    width:'100%',
  },
  containerSeparate2: {
    justifyContent: 'space-evenly',
    width:'100%',
  },
  containerDrop: {
    marginVertical:'2%',
    width:'100%',
  },
  button: {
    marginVertical: '10%',
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
    marginVertical: '4%',
    maxWidth:'100%',
    minWidth:300,
    height: 300,
  },
});