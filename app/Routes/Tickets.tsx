import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TextInput }  from "react-native";
import { TouchableOpacity, Button, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { Dropdown } from "react-native-element-dropdown";
import moment from "moment";
import { Alert } from "react-native";
import axios from "axios";

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
  const [repsol, setRepsol] = useState("");
  const [fecha, setFecha] = useState("");
  const [motivo, setMotivo] = useState("");
  // const {nombreUsuario, setNombreUsuario } = useUserContext();
  const [atencion, setAtencion] = useState("");
  const [estado, setEstado] = useState("");
  const [causa, setCausa] = useState("");
  const [acciones, setAcciones] = useState("");

  //isFocus
  const [isFocus, setIsFocus] = useState(false);

  const cerrarTicket = async () => {
    if (estado === "Liberado") {
      try {
        const fechaHora = moment().format("lll");
        const response = await axios.put(
          `http://192.168.0.46:4000/maquinase/${noTicket}`,
          {
            fechaCierre: fechaHora,
            estadofinal: "Cerrado",
          }
        );
        Alert.alert("El Ticket fue Cerrado");
        console.log("Respuesta del servidor:", response.data);
      } catch (error) {

        console.error("Error al realizar la solicitud POST:", error);

      }
    }
    if (estado === "Cerrado") {

      Alert.alert("Este Ticket ya fue cerrado");
      //mandar correo al area para notificar del cierre
      //subir el nuevo estado a la base de datos

    } else {
      Alert.alert("Aun no se puede cerrar este Ticket");
    }
  };

  useEffect(() => {
    // const userName = 'Samael'
    var config = {  
      method: "get",
      url: `http://192.168.0.46:4000/maqticket`,
        // url: `http://192.168.0.46:4000/maquinaseee/${nombreUsuario}`,
    };

    axios(config).then(function (response) {
      var count = Object.keys(response.data).length;
      let equipoArray: any = [];
      
      for (var i = 0; i < count; i++) {
          equipoArray.push({
          value: response.data[i]["Folio"],
          label: response.data[i]["Folio"],
          });
      }
      setNoTicketData(equipoArray);
        
    })
    .catch(function (error) {
      console.log(error);
    });
  }, []);

  const handleState = (folio : any) => {
    var config = {
      method: "get",
      url: `http://192.168.0.46:4000/maquinases/${folio}`,
    };
    
    axios(config).then(function (response) {
      const datos = response.data;
    
      setMotivoData(datos.map((item : any) => item["Descripcion de Incidencia"]));
      setAtencionData(datos.map((item : any) => item["Atencion de Ticket"]));
      setAccionesData(datos.map((item : any) => item["Acciones a Seguir"]));
      setEstadoData(datos.map((item : any) => item["Estado del Ticket"]));
      setFechaData(datos.map((item : any) => item["Fecha Inicio"]));
      setCausaData(datos.map((item : any) => item["Causa Raiz"]));
      setRepsolData(datos.map((item : any) => item["Maquina"]));

      if (datos.length > 0) {
        setRepsol(datos[0]["Maquina"]);
        setFecha(datos[0]["Fecha Inicio"]);
        setMotivo(datos[0]["Descripcion de Incidencia"]);
        setAtencion(datos[0]["Atencion de Ticket"]);
        setEstado(datos[0]["Estado del Ticket"]);
        setCausa(datos[0]["Causa Raiz"]);
        setAcciones(datos[0]["Acciones a Seguir"]);
      }

    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
  };

  return (
        
  <View style={styles.container}>
    <ScrollView>
      <Text style={styles.Textmain}>Mis Tickets</Text>

      <Text style={styles.text}>Numero de Ticket</Text>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={noTicketData}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? "Seleccione Folio" : "..."}
        searchPlaceholder="Search..."
        value={noTicket}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item : any) => {
          setNoTicket(item.value);
          handleState(item.value);
          setIsFocus(false);
        }}
      />

      <View style={styles.containerSeparate}>

        <View style={styles.containerInput}>
          <Text style={styles.textCenter}>Equipo reportado</Text>
          <TextInput value={repsol} style={styles.boxsmall1}></TextInput>
        </View>

        <View style={styles.containerInput}>
          <Text style={styles.textCenter}>Fecha del Ticket</Text>
          <TextInput value={fecha} style={styles.boxsmall1}></TextInput>
        </View>

      </View>

      <Text style={styles.textCenter}>Motivo</Text>
      <TextInput style={styles.boxlarge2}
        value={motivo}
        onChangeText={setMotivo}
      />

      <Text style={styles.textCenter}>Quien Atiende el Ticket</Text>
      <TextInput 
        value={atencion} 
        style={styles.boxlarge}
        onChangeText={setAtencion}
      />

      <Text style={styles.textCenter}>Estado</Text>
      <TextInput style={styles.boxlarge}
        value={estado}
        onChangeText={setEstado}
      />

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
    padding: 15,
    height: "100%",
    width: "100%"
  },
  Textmain: {
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 20,
    textAlign:"center",
  },
  dropdown: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginLeft: 0,
    width: "100%",
    backgroundColor: "#fff",
    marginBottom: 20,
    marginTop: 10,
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
    marginLeft: 0,
  },
  textCenter: {
    fontSize:16,
    textAlign:"center"
  },
  boxlarge: {
    width: 360,
    height: 40,
    borderWidth: 1, // Añade un borde de 1 píxel
    borderColor: "gray", // Color del borde
    borderRadius: 4,
    marginTop: 5,
    marginLeft: 0,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    color: "#000000",
  },
  boxlarge2: {
    width: 360,
    height: 80,
    borderWidth: 1, // Añade un borde de 1 píxel
    borderColor: "gray", // Color del borde
    borderRadius: 4,
    marginTop: 5,
    marginLeft: 0,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    color: "#000000",
  },
  boxsmall1: {
    width: "100%",
    height: 40,
    borderWidth: 1, // Añade un borde de 1 píxel
    borderColor: "gray", // Color del borde
    paddingHorizontal: 10,
    marginTop: 5,
    marginLeft: 0,
    marginBottom: 20,
    borderRadius: 4,
    backgroundColor: "#fff",
    color: "#000000",
  },
  containerInput: {
    width: "45%",
  },
  containerSeparate: {
    width:"100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    alignItems: 'center',
  },
  Txtboton: {
    backgroundColor: "#b01212",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 4,
    color: "white",
    padding: 15,
    width: "60%",
  },
});

