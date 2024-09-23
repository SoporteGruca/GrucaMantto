import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useUserContext } from './UserContext'
import moment from 'moment'
import { Linking} from 'react-native';

const Solicitud = () => {
    // const { nombreUsuario, setNombreUsuario } = useUserContext();
    const [descripcion, setDescripcion] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [solicitar, setSolicitar] = useState('');
    const [nomina, setNominaValue] = useState('');
    const [depto, setDeptoValue] = useState('');
    const [nominas, setNomina] = useState('');
    const [count, setCount] = useState({});
    const [folio, setFolio] = useState("");
    const [deptos, setDepto] = useState('');

    const nombreUsuario = "Oscar Alonso";
    const encargado = "Staff Sistemas";

    useEffect(() => {
        fetchCount();
        }, []);

    const fetchCount = async () => {
    try {
        const response = await axios.get('http://192.168.0.46:4000/foliosm');
        const recordset = response.data;
        if (Array.isArray(recordset) && recordset.length > 0) {
        const countValue = recordset[0][""];
        
        if (typeof countValue === 'number' || typeof countValue === 'string') {
            setCount(countValue);
            const numeroPredeterminado = countValue;
            const folioPredeterminado = `RE-${numeroPredeterminado.toString().padStart(4, '0')}`;
            setFolio(folioPredeterminado);
            
        } else {
            console.error('El valor del recuento no es válido:', countValue);
        }
        } else {
            console.error('La respuesta no contiene datos válidos:', recordset);
        }
    }   catch (error) {
        console.error('Error al obtener el recuento:', error);
        }
    };

    const generarFolio = () => {
        const nuevoNumero = parseInt(folio.split('-')[1]) + 1;
        const nuevoFolio = `RE-${nuevoNumero.toString().padStart(4, '0')}`;        
        setFolio(nuevoFolio);
        
    };

    useEffect (() =>{
    var config = {
        method: 'get',
        // url: `http://192.168.0.46:4000/equipos/${nombreUsuario}`,
        url: `http://192.168.0.46:4000/equipos/${nombreUsuario}`,
    };
    axios(config).then(function (response) {
        const datos = response.data;
        setDeptoValue(datos.map((item : any) => item.Depto));
        setNominaValue(datos.map((item : any) => item.NumNomina));
        if (datos.length > 0) {
            setDepto(datos[0].Depto);
            setNomina(datos[0].NumNomina);
        }
    })
    .catch(function (error) {
    console.error('Error fetching data:', error);
    });
    }, []);

    const enviarDatos = async () => {
        try {
            const fechaHora = moment().format('lll');
            const response = await axios.post('http://192.168.0.46:4000/tickets', {
            tipo: 'Solicitud',
            fecha: fechaHora,
            // usuario: "Oscar",
            // encargado: "Staff sisemas",
            usuario: nombreUsuario,
            encargado: nombreUsuario,
            nomina: nominas.toString(),
            departamento: deptos.toString(),
            reporte: solicitar.toString(),
            ubicacion: ubicacion.toString(),
            descripcion: descripcion.toString(),
            estado: 'Pendiente',
            personal: '',
            descripcionfalla: '',
            diagnostico: '',
            acciones: '',
            ticket: folio.toString(),
            });
            
            Alert.alert('Solicitud Enviada');
            console.log('Respuesta del servidor:', response.data);
        } catch (error) {
            Alert.alert('Problemas al enviar Solicitud');
            console.error('Error al realizar la solicitud POST:', error);
        }   
    }
    const openGmail = () => {
        // const emailAddress = 'reporteyfallas@gruca.mx';
        const emailAddressTest = 'soporte.sistemas@gruca.mx';
        const subject = `Reporte con el folio: ${folio}`;
        // const body = `${nombreUsuario} ha enviado un Reporte de ${solicitar} debido a que ${descripcion}`
        const bodyTest = `Se ha enviado un Reporte de ${solicitar} debido a que ${descripcion}`
        // const mailtoUrl = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
        const mailtoUrlTest = `mailto:${emailAddressTest}?subject=${subject}&body=${bodyTest}`;
        Linking.openURL(mailtoUrlTest);
    };

    const eventos = async () =>{
        if (solicitar === '' || descripcion === '' || ubicacion === '') {
            Alert.alert('Alerta','Debe llenar todos los campos');
        } else {  
            await fetchCount();
            generarFolio();
            enviarDatos();
            setSolicitar('')
            setDescripcion('')
            setUbicacion('')
            await fetchCount();
            generarFolio();
            Alert.alert("Alert", "Reporte Enviado")
            openGmail()
        }
    }
    return (
    <View style={styles.contai}>
        <View style={styles.container}>
            <View>
                <Text style={styles.Text}>Titulo del reporte</Text>
                <TextInput
                    value={solicitar}
                    onChangeText={setSolicitar}
                    placeholder="Equipo o Servicio a reportar " style={styles.boxlarge}></TextInput>
                <Text style={styles.Text}>Descripcion de la falla o necesidad </Text>
                <TextInput multiline  // Esta prop permite el ingreso de múltiples líneas
                    numberOfLines={4}
                    value={descripcion}
                    onChangeText={setDescripcion}
                    placeholder="Describe tu reporte o solicitud" style={styles.boxsmall}></TextInput>
                <Text style={styles.Text}> Ubicación</Text>
                <TextInput multiline  // Esta prop permite el ingreso de múltiples líneas
                    numberOfLines={4}
                    value={ubicacion}
                    onChangeText={setUbicacion}
                    placeholder="Lugar en donde se requiere el apoyo" style={styles.boxsmall}></TextInput>
            </View>
            <View style={styles.containerSeparate}>
                <TouchableOpacity onPress={eventos}>
                <Text style={styles.boton} >Abrir Ticket</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View> 
    )
};

const styles = StyleSheet.create({
contai:{
    width: '100%',    
    alignItems:'center',
},
container:{
    width: '100%',
    marginTop: 10,   
},
boxlarge:{
    width: 360,
    height: 40,
    borderWidth: 1, // Añade un borde de 1 píxel
    borderColor: 'gray', // Color del borde
    borderRadius: 4,
    marginTop:5,
    marginLeft: 20,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: '#fff'

},

containerSeparate:{
    flexDirection: 'row',
    justifyContent: "space-between",
    marginRight: 23,
    marginTop: 250
},

Text:{
    marginLeft:20,
    fontSize: 16,
    fontWeight: 'bold'
},

boton:{
    backgroundColor: 'salmon', 
    justifyContent: 'center',
    textAlign: 'center',
    color:'white', 
    borderRadius:4, 
    padding:15,
    width: 350,
    marginLeft:23
},
boxsmall:{
    width: 360,
    borderWidth: 1, // Añade un borde de 1 píxel
    borderColor: 'gray', // Color del borde
    paddingHorizontal: 10,
    marginTop:5,
    marginLeft: 20,
    paddingTop: 0,
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: '#fff',
    minHeight: 100,
    maxHeight: 100
},


})

export default Solicitud 
