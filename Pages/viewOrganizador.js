import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import ProveedorScreen from "./Proveedor";
import MensajeScreen from "./Mensaje";
import EventosScreen from "./Eventos";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [perfil, setPerfil] = useState(null);
  const [servicio, setServicio] = useState("");
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const perfilGuardado = await AsyncStorage.getItem("perfil");
        if (perfilGuardado !== null) {
          setPerfil(JSON.parse(perfilGuardado));
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      }
    };

    cargarPerfil();
  }, []);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.127:8080/organizador"
        );
        setUsuarios(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsuarios();
  }, []);

  useEffect(() => {
    if (perfil?.correo) {
      const usuarioFiltrado = usuarios.find(
        (usuario) => usuario.correo === perfil.correo
      );
      if (usuarioFiltrado) {
        setServicios(usuarioFiltrado.servicios || []);
      }
    }
  }, [usuarios, perfil]);

  const usuarioFiltrado = usuarios.find(
    (usuario) => usuario.correo === perfil?.correo
  );

  const handleAddService = async () => {
    if (servicio.trim() === "") {
      Alert.alert("Error", "Por favor, introduce un servicio válido.");
      return;
    }

    try {
      const response = await axios.post("http://192.168.1.127:8080/servicios", {
        correo: perfil.correo,
        servicio,
      });

      if (response.status === 201) {
        Alert.alert("Éxito", "Servicio agregado correctamente.");
        setServicios([...servicios, servicio]);
        setServicio("");
      } else {
        Alert.alert("Error", "No se pudo agregar el servicio.");
      }
    } catch (error) {
      console.error("Error al agregar el servicio:", error);
      Alert.alert("Error", "Ocurrió un error al agregar el servicio.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Perfil de Usuario (Organizador)</Text>
      {usuarioFiltrado ? (
        <View style={styles.userCard}>
          <Text>Nombre: {usuarioFiltrado.nombre}</Text>
          <Text>Teléfono: {usuarioFiltrado.telefono}</Text>
          <Text>Correo: {usuarioFiltrado.correo}</Text>
          <Text>Ubicación: {usuarioFiltrado.ubicacion}</Text>
          <Text>Servicios:</Text>
          {servicios.map((serv, index) => (
            <Text key={index}>- {serv}</Text>
          ))}
          <TextInput
            style={styles.input}
            placeholder="Nuevo Servicio"
            value={servicio}
            onChangeText={setServicio}
          />
          <Button title="Agregar Servicio" onPress={handleAddService} />
        </View>
      ) : (
        <Text>Cargando perfil...</Text>
      )}
    </ScrollView>
  );
}

export default function ViewOrganizador() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: "Página Principal",
          headerStyle: {
            backgroundColor: "#6200ea",
          },
          headerTintColor: "#fff",
          headerLeft: () => null,
          headerRight: () => (
            <>
              <Button
                title="Eve"
                onPress={() => navigation.navigate("Eventos")}
              />
              <Button
                title="Pro"
                onPress={() => navigation.navigate("Proveedores")}
              />
              <Button
                title="Men"
                onPress={() => navigation.navigate("Mensajes")}
              />
            </>
          ),
        })}
      />

      <Stack.Screen
        name="Proveedores"
        component={ProveedorScreen}
        options={({ navigation }) => ({
          title: "Proveedores",
          headerStyle: {
            backgroundColor: "#6200ea",
          },
          headerTintColor: "#fff",
          headerRight: () => (
            <>
              <Button
                title="Home"
                onPress={() => navigation.navigate("Home")}
              />
              <Button
                title="Eve"
                onPress={() => navigation.navigate("Eventos")}
              />
              <Button
                title="Men"
                onPress={() => navigation.navigate("Mensajes")}
              />
            </>
          ),
        })}
      />

      <Stack.Screen
        name="Eventos"
        component={EventosScreen}
        options={({ navigation }) => ({
          title: "Eventos",
          headerStyle: {
            backgroundColor: "#6200ea",
          },
          headerTintColor: "#fff",
          headerRight: () => (
            <>
              <Button
                title="Home"
                onPress={() => navigation.navigate("Home")}
              />
              <Button
                title="Pro"
                onPress={() => navigation.navigate("Proveedores")}
              />
              <Button
                title="Men"
                onPress={() => navigation.navigate("Mensajes")}
              />
            </>
          ),
        })}
      />
      <Stack.Screen
        name="Mensajes"
        component={MensajeScreen}
        options={({ navigation }) => ({
          title: "Mensajes",
          headerStyle: {
            backgroundColor: "#6200ea",
          },
          headerTintColor: "#fff",
          headerRight: () => (
            <>
              <Button
                title="Home"
                onPress={() => navigation.navigate("Home")}
              />
              <Button
                title="Eve"
                onPress={() => navigation.navigate("Eventos")}
              />
              <Button
                title="Pro"
                onPress={() => navigation.navigate("Proveedores")}
              />
            </>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  userCard: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
    width: "100%",
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});
