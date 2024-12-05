import { View, Text, TextInput, Image }  from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import React, { useState, useEffect } from 'react';
import { ScrollView, Linking } from 'react-native';
import { Button } from 'react-native-paper';
import { styles } from '../Routes/Estilos';
import { Alert } from 'react-native';
import userStore from '../store';
import moment, { relativeTimeRounding } from 'moment';
import axios from 'axios';
const Tickets = () => {
  //Datas
  const [fetchLibera, setFetchLiberaData ] = useState([]);
  const [hHomInterna, sethhomInternaData ] = useState([]);
  const [costManoHom, setCostManoHomData ] = useState([]);
  const [numModeloData, setNumModeloData ] = useState([]);
  const [eviMejoraData, setEviMejoraData ] = useState([]);
  const [totalReTra, setTotalReTraData ] = useState([]);
  const [noTicketData, setNoTicketData] = useState([]);
  const [atencionData, setAtencionData] = useState([]);
  const [accionesData, setAccionesData] = useState([]);
  const [refaccion, setRefaccionData ] = useState([]);
  const [costHoraH, setCostHoraHData ] = useState([]);
  const [eviDañoData, setEviDañoData ] = useState([]);
  const [estMaqui, setEstMaquiData ] = useState([]);
  const [attExter, setAttExterData ] = useState([]);
  const [repsolData, setRepsolData] = useState([]);
  const [motivoData, setMotivoData] = useState([]);
  const [estadoData, setEstadoData] = useState([]);
  const [fullName, setFullNameData] = useState('');
  const [noTicket, setNoTicket] = useState(null);
  const [fechaData, setFechaData] = useState([]);
  const [causaData, setCausaData] = useState([]);
  const [trasla, setTraslaData ] = useState([]);
  const [otData, setOtData ] = useState([]);
  let [usuario, setUsuario] = useState("");
  //Valores
  const [fotoUri, setFotoUri] = useState('https://fakeimg.pl/300x300/e8e8e8/3a456f?text=Not+Found&font=lobster');
  const [botonTexto, setBotonTexto] = useState('');
  const [numModelo, setNumModelo ] = useState(' ');
  const [eviMejora, setEviMejora ] = useState(' ');
  const [fetchLibe, setFetchLibe] = useState(' ');
  const [hHomInter, setHHomInter] = useState(' ');
  const [costManoH, setCostManoH] = useState(' ');
  const [isFocus, setIsFocus] = useState(false);
  const [costHora, setCostHora] = useState(' ');
  const [totalTra, setTotalTra] = useState(' ');
  const [atencion, setAtencion] = useState('');
  const [acciones, setAcciones] = useState('');
  const [eviDaño, setEviDaño ] = useState(' ');
  const [estmaq, setEstMaq] = useState(' ');
  const [refacc, setRefacc] = useState(' ');
  const [attExt, setAttExt] = useState(' ');
  const [repsol, setRepsol] = useState('');
  const [correo, setCorreo] = useState('');
  const [motivo, setMotivo] = useState('');
  const [foto, setFoto] = useState(null);
  const [fecha, setFecha] = useState('');
  const [causa, setCausa] = useState('');
  const [folio, setFolio] = useState('');
  const [tras, setTras] = useState(' ');
  const [ot, setOt ] = useState(' ');
  const estadosData = [
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'En progreso...', value: 'En progreso...' },
    { label: 'Cerrado', value: 'Cerrado' },
    { label: 'Liberado', value: 'Liberado' },
  ]
  let [emailAddress, setemailAddress ] = useState(' ');
  let [estado, setEstado] = useState('');
  let [phone, setphone] = useState('');
  let [level, setlevel] = useState('');
  let body = '', subject = '', mensaje = '', cuenta : any;
  let [estadoDB, setEstadoDB] = useState('');
  let fechaLiberacion, fechaCierre;
  //Habilitados Formulario
  const [habAcciones, setHabAcciones] = useState(false);
  const [habReporte, setHabReporte] = useState(false);
  const [formMantto, setFormMantto] = useState(false);
  const [userMantto, setuserMantto] = useState(true);
  const [habCerrar, setHabCerrar] = useState(false);
  const [habEstado, setHabEstado] = useState(false);
  const [habMotivo, setHabMotivo] = useState(false);
  const [habFecha, setHabFecha] = useState(false);
  const [habCausa, setHabCausa] = useState(false);
  const [nivel, setNivel] = useState(false);
  useEffect(() => {
    limpiarcampos();
    usuario = userStore.usuario;
    setUsuario(userStore.usuario);
    setFullNameData(userStore.fullName);
    validarUsuario();
    getFolios();
  }, []);
  const refrescar  = () => {
    limpiarcampos();
    usuario = userStore.usuario;
    setUsuario(userStore.usuario);
    setFullNameData(userStore.fullName);
    validarUsuario();
    getFolios();
  }
  const handleStateAtencionChange = (item : any) => {
    setAtencion(item)
    validarUsuario(item);
  }
  const validarUsuario = (atencion?: any) => {
    axios.get(`http://192.168.0.46:4000/verifica`).then(function (response) {
      cuenta = response.data.map((item : any) => ( {
        nombre: item['Usuario'],
        email: item['correo'],
        celular: item['celular'],
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
          level = nivelAcceso;
          if (nivelAcceso === 'Consu'){
            setHabReporte(false);
            setHabFecha(false);
            setHabMotivo(false);
            setHabCausa(false);
            setHabAcciones(false);
            setHabCerrar(true);
            // setFormMantto(false);
            setNivel(false);
            setBotonTexto('');
          } else if (nivelAcceso === 'User'){
            setHabReporte(false);
            setHabFecha(false);
            setHabAcciones(false);
            setHabCerrar(false);
            setHabMotivo(false);
            setHabCausa(false);
            setHabEstado(false);
            // setFormMantto(false);
            setNivel(false);
            setBotonTexto('Liberar Ticket')
          } else if (nivelAcceso === 'Admin' || nivelAcceso === 'Poweruser'){
            setHabReporte(false);
            setHabFecha(false);
            setHabMotivo(true);
            setHabCausa(true);
            setHabAcciones(true);
            setHabCerrar(false);
            setuserMantto(false);
            // setFormMantto(true);
            setNivel(true);
            setBotonTexto('Actualizar Ticket')
          }
          cuenta.forEach((item : any) => {
            if (item.nombre === atencion){
              setemailAddress(item.email);
              emailAddress = item.email;
              setphone(item.celular);
              phone = item.celular;
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
    axios.get(`http://192.168.0.46:4000/maquinasef/${folioDB}`).then(function (response) {
      const datos = response.data;
      setCostManoHomData(datos.map((item : any) => item['Costo mano de obra interna']));
      setMotivoData     (datos.map((item : any) => item['Descripcion de Incidencia']));
      setCostHoraHData  (datos.map((item : any) => item['Costo por hora hombre']));
      sethhomInternaData(datos.map((item : any) => item['Horas hombre interno']));
      setAttExterData   (datos.map((item : any) => item['Atencion Tec Externo']));
      setEviMejoraData  (datos.map((item : any) => item['Evidencia de mejoras']));
      setEviDañoData    (datos.map((item : any) => item['Evidencia de danios']));
      setAccionesData   (datos.map((item : any) => item['Acciones a Seguir']));
      setEstMaquiData   (datos.map((item : any) => item['Estado de Maquina']));
      setEstadoData     (datos.map((item : any) => item['Estado del Ticket']));
      setFetchLiberaData(datos.map((item : any) => item['Fecha liberacion']));
      setTotalReTraData (datos.map((item : any) => item['Total re trabajo']));
      setNumModeloData  (datos.map((item : any) => item['Numero de modelo']));
      setFechaData      (datos.map((item : any) => item['Fecha Inicio']));
      setRefaccionData  (datos.map((item : any) => item['Refacciones']));
      setCausaData      (datos.map((item : any) => item['Causa Raiz']));
      setTraslaData     (datos.map((item : any) => item['Traslado']));
      setRepsolData     (datos.map((item : any) => item['Maquina']));
      setOtData         (datos.map((item : any) => item['OT']));
      if (datos.length > 0) {
        setCostManoH(datos[0]['Costo mano de obra interna']);
        setMotivo   (datos[0]['Descripcion de Incidencia']);
        setCostHora (datos[0]['Costo por hora hombre']);
        setHHomInter(datos[0]['Horas hombre interno']);
        setAttExt   (datos[0]['Atencion Tec Externo']);
        setEviMejora(datos[0]['Evidencia de mejoras']);
        setEviDaño  (datos[0]['Evidencia de danios']);
        setAtencion (datos[0]['Atencion de Ticket']);
        setAcciones (datos[0]['Acciones a Seguir']);
        setEstado   (datos[0]['Estado del Ticket']);
        setEstadoDB (datos[0]['Estado del Ticket']);
        setEstMaq   (datos[0]['Estado de Maquina']);
        setFetchLibe(datos[0]['Fecha liberacion']);
        setTotalTra (datos[0]['Total re trabajo']);
        setNumModelo(datos[0]['Numero de modelo']);
        setFecha    (datos[0]['Fecha Inicio']);
        setRefacc   (datos[0]['Refacciones']);
        setCausa    (datos[0]['Causa Raiz']);
        setTras     (datos[0]['Traslado']);
        setRepsol   (datos[0]['Maquina']);
        setOt       (datos[0]['OT']);
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
        if (level === 'Admin' || level === 'Poweruser' ) {
          Array.push({
            value: response.data[i]['Folio'],
            label: response.data[i]['Folio'],
          });
        } else{
          if (usuario === response.data[i]['Usuario que Reporta']) {
            Array.push({
              value: response.data[i]['Folio'],
              label: response.data[i]['Folio'],
            });
          }
        }
      }
      setNoTicketData(Array);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  const openGmail = async () => {
    // emailAddress = 'reporteyfallas@gruca.mx';
    subject = `Folio: ${folio} ha sido modficiado`;
    body = `${fullName} ha modificado el reporte con numero folio: ${folio}`;
    if ( estado === 'Pendiente' && estadoDB == '') {
      mensaje = `Se ha creado un  nuevo ticket con el folio: ${folio}`;
    } else if ( estado === 'Pendiente' ) {
      mensaje = `${fullName} ha cambiado el status del ticket a ${estado} con numero de folio: ${folio}`;
    } else if ( estado === 'En progreso...' ) {
      mensaje = `${fullName} ha cambiado el status del ticket a ${estado} con numero de folio: ${folio}`;
    } else if ( estado === 'Cerrado' ) {
      mensaje = `${usuario} ha cambiado el status del ticket a ${estado} con numero de folio: ${folio}, pendiente de la liberacion de este ticket`;
    } else if ( estado === 'Liberado' ) {
      mensaje = `${usuario} ha cambiado el status del ticket a ${estado} con numero de folio: ${folio}`;
    } else {
      Alert.alert('Aviso', 'Se ha producido  un error al enviar el correo electronico');
    }
    const mailtoUrl = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    Linking.openURL(mailtoUrl);
  };
  const sendWhatsApp = () => {
    // const phone = 4491014022;
    // const link = `https://chat.whatsapp.com/IGRCKeJRa2P923ej54QFt3?text=${subject}${body}`;
    const link = `https://wa.me/${phone}?text=${mensaje}`;
    Linking.canOpenURL(link).then((supported) => {
      if (!supported) {
        Alert.alert('Por favor instale WhatsApp para enviar un mensaje directo');
      }
      return Linking.openURL(link);
    })
  };
  const cerrarTicket = async () => {
    if (!noTicket || !motivo || !atencion) {
      Alert.alert('Aviso', 'Favor de rellenar los campos faltantes, para continuar.');
      return;
    }
    //Validar campos
    // Definir las condiciones de cierre según el nivel de acceso
    const canCloseTicket = (level === 'User' && estadoDB === 'Pendiente' && estado === 'En progreso...') || (level === 'User' && estadoDB === 'Cerrado' && estado === 'Liberado') || (level === 'Poweruser' && estadoDB === 'Pendiente' && estado === 'En progreso...') || (level === 'Poweruser' && estadoDB === 'En progreso...' && estado === 'Cerrado') || (level === 'Poweruser' && estadoDB === 'Cerrado' && estado === 'Cerrado') || 
    (level === 'Admin');
    // Verificar si se puede cerrar el ticket
    if (!canCloseTicket) {
      Alert.alert('Aviso', 'No se pueden realizar más modificaciones');
      return;
    }
    if (estadoDB === "En progreso..." && estado === 'Cerrado') {
      fechaCierre = moment().format('lll');      
    }
    if (estadoDB === "Cerrado" && estado === 'Liberado') {
      fechaLiberacion = moment().format('lll');
    }
    // Enviar datos
    enviarDatos();
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
      const response = await axios.put(
        `http://192.168.0.46:4000/maquinasf/${noTicket}`, {
          atendio: atencion,
          fechaCierre: fechaCierre,
          estadofinal: `${estado}`,
          acciones: acciones,
          ot: ot,
          numModelo: numModelo,
          eviDanios: eviDaño,
          eviMejora: eviMejora,
          estMaquina: estmaq,
          fetLiberacion: fechaLiberacion,
          hhomInter: hHomInter,
          refacciones: refacc,
          attExt: attExt,
          traslado: tras,
          cosHora: costHora,
          costManoH: costManoH,
          totalTra: totalTra,
        }
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
    setFotoUri('https://fakeimg.pl/300x300/e8e8e8/3a456f?text=Not+Found&font=lobster');
    setNoTicket(null);
    setAtencion('');
    setAcciones('');
    setRepsol('');
    setMotivo('');
    setEstado('');
    setFoto(null);
    setFecha('');
    setCausa('');
    setFolio('');

    setOt('');
    setNumModelo('');
    setEviDaño('');
    setEviMejora('');
    setEstMaq('');
    setFetchLibe('');
    setHHomInter('');
    setRefacc('');
    setAttExt('');
    setTras('');
    setCostHora('');
    setCostManoH('');
    setTotalTra('');
  }
  return (
    <View style={styles.contForms}>
      <ScrollView>
      <Text style={styles.Textmain}>Mis Tickets</Text>
        <Button onPress={refrescar}
        icon='refresh'
        style={styles.btnMain} children={''}>
        </Button>
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
              disable={habEstado}
            />
          </View>
        </View>
          <Image style = { styles.imagenContainer }
            source = {{ uri: fotoUri }}>
          </Image>
        <Text style={styles.textCenter}>Causa Raiz</Text>
        <TextInput value={causa}
          onChangeText={setCausa}
          multiline
          editable={habCausa}
          style={styles.boxlarge}
        />
        <Text style={styles.textCenter}>Acciones a Seguir</Text>
        <TextInput value={acciones}
          style={styles.boxlarge2}
          editable={habAcciones}
          multiline
          onChangeText={setAcciones}>
        </TextInput>

          {nivel && (
            <Button onPress={() => setFormMantto(!formMantto)}
            style={styles.button}
            disabled={userMantto}>
            {formMantto ? "Ocultar Informacion" : "Mas Informacion" }
          </Button>
          )}

          {formMantto && (
          <View>
            <Text style={styles.textCenter}>OT</Text>
            <TextInput value={ot}
              style={styles.boxsmall}
              onChangeText={setOt}/>
            <Text style={styles.textCenter}>Numero de modelo</Text>
            <TextInput value={numModelo}
              style={styles.boxsmall}
              onChangeText={setNumModelo}/>
            <Text style={styles.textCenter}>Estado de maquina</Text>
            <TextInput value={estmaq}
              style={styles.boxsmall}
              onChangeText={setEstMaq}/>
            <Text style={styles.textCenter}>Fecha liberacion</Text>
            <TextInput value={fetchLibe}
              style={styles.boxsmall}
              onChangeText={setFetchLibe}
              editable={false}/>
            <Text style={styles.textCenter}>Evidencia de daños</Text>
            <TextInput value={eviDaño}
              style={styles.boxsmall}
              onChangeText={setEviDaño}/>
              <Text style={styles.textCenter}>Evidencia de mejora</Text>
            <TextInput value={eviMejora}
              style={styles.boxsmall}
              onChangeText={setEviMejora}/>
            <Text style={styles.textCenter}>Horas hombre interno</Text>
            <TextInput value={hHomInter}
              style={styles.boxsmall}
              onChangeText={setHHomInter}/>
            <Text style={styles.textCenter}>Refacciones</Text>
            <TextInput value={refacc}
              style={styles.boxsmall}
              onChangeText={setRefacc}/>
            <Text style={styles.textCenter}>Atencion tecnico externo</Text>
            <TextInput value={attExt}
              style={styles.boxsmall}
              onChangeText={setAttExt}/>
            <Text style={styles.textCenter}>Traslado</Text>
            <TextInput value={tras}
              style={styles.boxsmall}
              onChangeText={setTras}/>
            <Text style={styles.textCenter}>Costo por hora hombre</Text>
            <TextInput value={costHora}
              style={styles.boxsmall}
              onChangeText={setCostHora}/>
            <Text style={styles.textCenter}>Costo mano de obra interna</Text>
            <TextInput value={costManoH}
              style={styles.boxsmall}
              onChangeText={setCostManoH}/>
            <Text style={styles.textCenter}>Total re trabajo</Text>
            <TextInput value={totalTra}
              style={styles.boxsmall}
              onChangeText={setTotalTra}/>
          </View>
          )}
        <Button onPress={ cerrarTicket }
          mode='contained'
          disabled={habCerrar}
          style={styles.button}
          icon='file-document-edit'
          buttonColor='#374175'>
            {botonTexto}
        </Button>
      </ScrollView>
    </View>
    );
  }
export default Tickets;