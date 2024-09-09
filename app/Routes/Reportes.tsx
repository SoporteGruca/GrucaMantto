import { TextInput, TouchableOpacity, Image, Alert, } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useUserContext } from "./UserContext";
import { Camera } from "expo-camera";
import { Linking } from "react-native";
import moment from "moment";
import { Dropdown } from "react-native-element-dropdown";
import axios from "axios";

import AntDesign from '@expo/vector-icons/AntDesign';
import RNPickerSelect from 'react-native-picker-select';

const Tab = createBottomTabNavigator();

//Prueba de datos local
// const options = [
//     { label: 'Item 1', value: '1' },
//     { label: 'Item 2', value: '2' },
//     { label: 'Item 3', value: '3' },
//     { label: 'Item 4', value: '4' },
//     { label: 'Item 5', value: '5' },
//     { label: 'Item 6', value: '6' },
//     { label: 'Item 7', value: '7' },
//     { label: 'Item 8', value: '8' },
//   ];


const Reportes = () => {
  
  // const placeholder = {
  //   label: 'Select an option...',
  //   value: null,
  // };

  //Datas
  const [equipoData, setEquipoData] = useState([{ }]);
  const [marcaData, setMarcaData] = useState([{ }]);
  const [fallaData, setFallaData] = useState([{ }]);
  const [falla, setFalla] = useState("");
  
  //Valores a solicitar
  const [marca, setMarca] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [num, setNum] = useState("");
  const [depto, setDepto] = useState("");
  const [ubi, setUbi] = useState("");
  const [encargado, setEncargado] = useState("");
  const [equipo, setEquipo] = useState("");
  
  //Funciones
  const [selectedValue, setSelectedValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [count, setCount] = useState({});
  const [folio, setFolio] = useState("");

  // useEffect(() => {
  //   fetchCount();
  // }, []);

const fetchCount = async () => {
    try {
      const response = await axios.get("http://192.168.0.46:4000/foliosm");
      const recordset = response.data;

      if (Array.isArray(recordset) && recordset.length > 0) {
        const countValue = recordset[0][""];

        if (typeof countValue === "number" || typeof countValue === "string") {
          setCount(countValue);
          const numeroPredeterminado = countValue;
          const folioPredeterminado = `RM-${numeroPredeterminado
            .toString()
            .padStart(4, "0")}`;
          setFolio(folioPredeterminado);
        } else {
          console.error("El valor del recuento no es válido:", countValue);
        }
      } else {
        console.error("La respuesta no contiene datos válidos:", recordset);
      }
    } catch (error) {
      console.error("Error al obtener el recuento:", error);
    }
};


useEffect(() => {
  var config = {
    method: "get",
    url: `http://192.168.0.46:4000/maquinas`,
};
axios(config)
.then(function (response) {
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
  // console.log(error);
});
}, []);

// useEffect(() => {
//   var config = {
//     method: "get",
//     url: `http://192.168.0.46:4000/maquinasi`,
//   };

//   axios(config)
//     .then(function (response) {
//       var count = Object.keys(response.data).length;
//       let equipoArray = [];
//       for (var i = 0; i < count; i++) {
//         equipoArray.push({
//           value: response.data[i].DescIncidencia,
//           label: response.data[i].DescIncidencia,
//         });
//       }
//       setFallaData(equipoArray);
//     })
//     .catch(function (error) {
//     });
// }, []);


const handleState = (clasmaq: any) => {
  var config = {
    method: "get",
    url: `http://192.168.0.46:4000/maquinas/${clasmaq}`,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
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
    method: "get",
    url: `http://192.168.0.46:4000/maquinas/${equipo}/${equipoMarca}`,
  };
}


return (
  <View style={styles.container}>
    <ScrollView>

      <Text style={styles.text}>Maquina a reportar</Text>
      
      {/* <RNPickerSelect
          placeholder={styles.placeholderStyle}
          items={equipoData}
          onValueChange={(value) => setSelectedValue(value)}
          value={equipoData}
      /> */}

      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={equipoData}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Seleccione Equipo" : "..."}
        searchPlaceholder="Buscar..."
        value={equipo}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        renderLeftIcon={ () => (
          <AntDesign style={styles.icon} color="black" name="customerservice" size={20} />
        )}
        onChange={(item) => {
          setEquipo(item.value);
          handleState(item.value);
          setIsFocus(false);
        }}
      />

      <Text style={styles.text}>Descripcion de la Maquina</Text>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={marcaData}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Seleccione Equipo" : "..."}
        searchPlaceholder="Buscar..."
        value={marca}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setMarca(item.value);
          handleState2(item.value);
          setIsFocus(false);
        }}
      />
      
      <View style={styles.containerSeparate}>
        <View>
          <Text style={styles.text}> Numero de Maquina</Text>
          <TextInput
            placeholder="Numero de Maquina"
            style={styles.boxsmall1}
            value={num}
        />
        </View>
      <View>    
        <Text style={styles.text}> Tipo Falla</Text>

        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={fallaData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Seleccione Equipo" : "..."}
          searchPlaceholder="Buscar..."
          value={falla}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setEquipo(item.value);
            setIsFocus(false);
        }}/>
      </View>
      </View>

      <View style={styles.containerSeparate}>
        <View>
          <Text style={styles.text}> Operador </Text>
          <TextInput
            placeholder="Oprador"
            style={styles.boxsmall1}
            onChangeText={setEncargado}
            value={encargado}
          ></TextInput>
        </View>

      <View>
          <Text style={styles.text}> Depto Encargado </Text>
          <TextInput
            placeholder="Depto"
            style={styles.boxsmall1}
            value={depto}
          ></TextInput>
        </View>
      </View>

      <View style={styles.containerSeparate}>
        <View>
          <Text style={styles.Text}> Descripción </Text>
          <TextInput
            multiline // Esta prop permite el ingreso de múltiples líneas
            numberOfLines={4} // Establece la altura inicial del componente
            placeholder="Descrpción "
            style={styles.boxsmall}
            value={descripcion}
            onChangeText={setDescripcion}
          ></TextInput>
        </View>
        <View>
          <Text style={styles.Text}> Ubicación </Text>
          <TextInput
            multiline // Esta prop permite el ingreso de múltiples líneas
            numberOfLines={4} // Establece la altura inicial del componente
            placeholder="Ubicación"
            style={styles.boxsmall}
            value={ubi}
          ></TextInput>
        </View>
      </View>
      
      
    </ScrollView>
  </View>
);

}

export default Reportes


const styles = StyleSheet.create({
    container: {
      height: '100%',
      width:'100%',
      padding: 10,
    },
    dropdown: {
      height: 40,
      borderColor: "gray",
      borderWidth: 2,
      borderRadius: 4,
      paddingHorizontal: 10,
      marginLeft: 5,
      width: 360,
      backgroundColor: "#fff",
      marginBottom: 10,
      marginTop: 10,
    },
    iconStyle: {
      width: 20,
      height: 20,
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
      marginLeft: 5,
      fontWeight: "bold",
    },
    boxsmall1: {
      width: 170,
      height: 40,
      borderWidth: 1, // Añade un borde de 1 píxel
      borderColor: "gray", // Color del borde
      paddingHorizontal: 10,
      marginTop: 5,
      marginLeft: 5,
      marginBottom: 10,
      borderRadius: 4,
      backgroundColor: "#fff",
      color: "#000000",
    },
    containerSeparate: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginRight: 10,
    },
  
    boxsmall: {
      width: 170,
      borderWidth: 1, // Añade un borde de 1 píxel
      borderColor: "gray", // Color del borde
      paddingHorizontal: 10,
      marginTop: 5,
      marginLeft: 5,
      paddingTop: 0,
      marginBottom: 20,
      borderRadius: 4,
      backgroundColor: "#fff",
      minHeight: 40,
      maxHeight: 60,
    },
    containerFoto: {
      alignItems: "center",
    },
    Text: {
      marginLeft: 20,
      fontSize: 16,
      fontWeight: "bold",
    },
    botones: {
      backgroundColor: "gray",
      color: "white",
      borderRadius: 4,
      padding: 5,
      marginBottom: 15,
      marginRight: 10,
    },
  
    boton: {
      backgroundColor: "salmon",
      justifyContent: "center",
      textAlign: "center",
      color: "white",
      borderRadius: 4,
      padding: 15,
      width: 350,
      marginLeft: 13,
    },
    imagenContainer: {
      height: 256,
      backgroundColor: "gray",
      marginBottom: 20,
      width: 144,
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
    },
    imagenCapturada: {
      width: 144,
      height: 256,
      borderRadius: 8,
    }
});