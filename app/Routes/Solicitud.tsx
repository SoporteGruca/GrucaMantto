import { View, Text, StyleSheet, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Button } from 'react-native-paper';
import { Linking} from 'react-native';
import userStore from '../store';
import moment from 'moment'
import axios from 'axios'

const Solicitud = () => {
    const [descripcion, setDescripcion] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [solicitar, setSolicitar] = useState('');
    const [nomina, setNominaValue] = useState('');
    const [depto, setDeptoValue] = useState('');
    const [nominas, setNomina] = useState('');
    const [count, setCount] = useState({});
    const [folio, setFolio] = useState('');
    const [deptos, setDepto] = useState('');
    const [usuario, setUsuario] = useState('');

    useEffect(() => {
        setUsuario(userStore.usuario);
        fetchCount();
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

    const enviarDatos = async () => {
        try {
            const fechaHora = moment().format('lll');
            const response = await axios.post('http://192.168.0.46:4000/tickets', {
            tipo: 'Solicitud',
            fecha: fechaHora,
            usuario: usuario,
            encargado: usuario,
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
            // console.log('Respuesta del servidor:', response.data);
        } catch (error) {
            Alert.alert('Problemas al enviar Solicitud');
            console.error('Error al realizar la solicitud POST:', error);
        }
    }
    const openGmail = () => {
        const emailAddress = 'reporteyfallas@gruca.mx';
        const subject = `Reporte con el folio: ${folio}`;
        const body = `${usuario} ha enviado un Reporte de ${solicitar} debido a que ${descripcion}`
        const mailtoUrl = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
        Linking.openURL(mailtoUrl);
        //CorreoTest
        // const emailAddressTest = 'soporte.sistemas@gruca.mx';
        // const subject = `Reporte con el folio: ${folio}`;
        // const bodyTest = `Se ha enviado un Reporte de ${solicitar} debido a que ${descripcion}`
        // const mailtoUrlTest = `mailto:${emailAddressTest}?subject=${subject}&body=${bodyTest}`;
        // Linking.openURL(mailtoUrlTest);
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
            Alert.alert('Alert', 'Reporte Enviado')
            openGmail()
        }
    }
    return (
    <View style={styles.container}>
        
        <Text style={styles.Text}>Titulo del reporte</Text>
        <TextInput style={styles.boxSmall}
            value={solicitar}
            onChangeText={setSolicitar}
            placeholder='Solicitud a reportar '>
        </TextInput>

        <Text style={styles.Text}>Descripcion de la falla o necesidad </Text>
        <TextInput style={styles.boxBig}
            multiline
            numberOfLines={4}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder='Describe tu reporte o solicitud'>
        </TextInput>

        <Text style={styles.Text}> Ubicación</Text>
        <TextInput style={styles.boxBig}
            multiline
            numberOfLines={4}
            value={ubicacion}
            onChangeText={setUbicacion}
            placeholder='Lugar en donde se requiere el apoyo'>
        </TextInput>
        
        <View style={styles.containerMidEvent}>
            <Button onPress={ eventos }
                icon='file'
                mode='contained'
                buttonColor='#b01212'>
                Abrir ticket
            </Button>
        </View>

    </View> 
    )
};

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#e8e8e8',
        alignItems:'center',
        height: '100%',
        width: '100%',
        padding: 15,
    },
    boxlarge:{
        width: '100%',
        height: 40,
        borderWidth: .5,
        borderRadius: 20,
        backgroundColor: '#fff'
    },
    containerMidEvent:{
        width: 150,
        alignSelf:'center',
        marginVertical: '10 %'
    },
    Text:{
        fontSize: 18,
        marginVertical:'2%',
        
    },
    buttonEvent:{
        color:'white',
        backgroundColor: '#b01212',
        borderRadius:4, 
        padding:15,
        width: 350,
        marginLeft:23
    },
    boxSmall:{
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        marginVertical: '2%',
        borderColor: 'gray', 
        borderRadius: 20,
        borderWidth: .5, 
        width: '100%',
        height: 40,
    },
    boxBig:{
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        marginVertical: '2%',
        borderColor: 'gray',
        borderRadius: 20,
        borderWidth: .5, 
        width: '100%',
        minHeight: 40,
        maxHeight: 60,
    },
})

export default Solicitud 