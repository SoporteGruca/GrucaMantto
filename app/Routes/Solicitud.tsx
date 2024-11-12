import { View, Text, StyleSheet, TextInput, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react'
import { Button } from 'react-native-paper';
import { Linking, Image} from 'react-native';
import userStore from '../store';
import moment from 'moment'
import axios from 'axios'
const Solicitud = () => {
    const [image, setImage] = useState('https://fakeimg.pl/300x300/e8e8e8/3a456f?text=Not+Found&font=lobster');
    const [hasCameraPermission, setHasCameraPermission] = useState({});
    const [descripcion, setDescripcion] = useState('');
    const [fullName, setFullName] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [solicitar, setSolicitar] = useState('');
    const [fotoUri, setFotoUri] = useState(null);
    const [usuario, setUsuario] = useState('');
    const [nominas, setNomina] = useState('');
    const [deptos, setDepto] = useState('');
    const [count, setCount] = useState({});
    const [folio, setFolio] = useState('');
    useEffect(() => {
        setUsuario(userStore.usuario);
        getUserData();
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
    } catch (error) {
        console.error('Error al obtener el recuento:', error);
        }
    };
    const getUserData  = async () => {
        axios.get(`http://192.168.0.46:4000/verifica`).then(function (response) {
            var count = Object.keys(response.data).length;
            let userArray: any = [];
            for (var i = 0; i < count; i++) {
                userArray.push({
                    value: response.data[i].Usuario,
                    label: response.data[i].Usuario,
                });
                if ( userStore.usuario === response.data[i].Usuario ) {
                    setFullName( response.data[i].NomUsuario );
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    const generarFolio = () => {
        const nuevoNumero = parseInt(folio.split('-')[1]) + 1;
        const nuevoFolio = `RE-${nuevoNumero.toString().padStart(4, '0')}`;        
        setFolio(nuevoFolio);
    };
    const enviarDatos = async () => {
        getUserData();
        try {
            const fechaHora = moment().format('lll');
            const formData: any = new FormData();
            formData.append('image', {
                uri: image,
                type: 'image/jpg',
                name: 'imagen.jpg',
            });
            formData.append('ticket', folio.toString());
            formData.append('tipo', 'Solicitud');
            formData.append('fecha', fechaHora);
            formData.append('usuario', fullName);
            formData.append('encargado', fullName);
            formData.append('nomina', nominas.toString());
            formData.append('departamento', deptos.toString());
            formData.append('reporte', solicitar.toString());
            formData.append('ubicacion', ubicacion.toString());
            formData.append('descripcion', descripcion.toString());
            formData.append('estado', 'Pendiente');
            formData.append('personal', '');
            formData.append('descripcionfalla', '');
            formData.append('diagnostico', '');
            formData.append('acciones', '');
            // console.log(formData);
            const response = await axios.post('http://192.168.0.46:4000/ticketsSoli', formData, {
                headers: {
                'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error) {
            console.error('Error al realizar la solicitud POST:', error);
        }
    }
    const openGmail = () => {
        const emailAddress = 'reporteyfallas@gruca.mx';
        const subject = `Reporte con el folio: ${folio}`;
        const body = `${usuario} ha enviado un Reporte de ${solicitar} debido a que ${descripcion}`
        const mailtoUrl = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
        Linking.openURL(mailtoUrl);
    };
    const deletePicture = async() =>{
        setFotoUri(null);
        setImage('https://fakeimg.pl/300x300/e8e8e8/3a456f?text=Not+Found&font=lobster');  
    }
    const takePicture = async () => {
        const result = await ImagePicker.           launchCameraAsync({
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
    const abrirTickets = async () =>{
        if (solicitar === '' || descripcion === '' || ubicacion === '') {
            Alert.alert('Alerta','Debe llenar todos los campos');
        } else {  
            await fetchCount();
            generarFolio();
            enviarDatos();
            setSolicitar('')
            setDescripcion('')
            setUbicacion('')
            setFotoUri(null);
            setImage('https://fakeimg.pl/300x300/e8e8e8/3a456f?text=Not+Found&font=lobster');  
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
        <View style={styles.containerMidEvent}>
            <Button onPress={ abrirTickets }
                icon='file'
                mode='contained'
                buttonColor='#374175'>
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
    paddingTop:'10%',
    height: '100%',
    width: '100%',
    padding: 15,
},
boxlarge:{
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    height: 40,
},
containerMidEvent:{
    marginVertical: '10 %',
    alignSelf:'center',
    width: 150,
},
Text:{
    marginVertical:'2%',
    fontSize: 18,
    
},
buttonEvent:{
    backgroundColor: '#b01212',
    borderRadius:4,
    marginLeft:23,
    color:'white',
    padding:15,
    width: 350,
},
boxSmall:{
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginVertical: '2%',
    borderColor: 'gray', 
    borderRadius: 20,
    width: '100%',
    height: 40,
},
boxBig:{
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginVertical: '2%',
    borderColor: 'gray',
    borderRadius: 20,
    width: '100%',
    minHeight: 40,
    maxHeight: 60,
},
imagenContainer: {
    resizeMode:"contain",
    marginVertical:'2%',
    borderRadius: 10,
    maxWidth:'100%',
    minWidth:300,
    height: 300,
},
containerButton:{
    justifyContent:'space-around',
    flexDirection:'row',
    paddingTop:'5%',
    width:"100%",
},
LineButtonBorrar: {
    width: 150,
},
LineButtonTomarFoto: {
    width: 150,
},
})
export default Solicitud 