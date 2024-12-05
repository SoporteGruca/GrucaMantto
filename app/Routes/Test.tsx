// import SignatureCapture from 'react-native-signature-capture';
import { View, Button, Text } from 'react-native';
import React, { useRef, useState } from 'react';
import { styles } from '../Routes/Estilos';

export default function Test() {
    const [signature, setSignature] = useState('');


    const handleSave = (data) => {
        setSignature(data);
        // console.log("Firma guardada:", data); // Puedes manejar la firma guardada como desees
    };

    const handleClear = () => {
        setSignature('');
    };


    return (
        <View style={styles.contForms}>
            <Text style={styles.textMain}>Zona de pruebas</Text>
            
            <Button title="Borrar" onPress={handleClear} />
            {signature ? <Text style={styles.signatureText}>Firma guardada</Text> : null}
        </View>
    )
};
