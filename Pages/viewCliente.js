import React, { useState, useEffect } from "react";
import { Button, View, Text, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import OrganizadorScreen from "./Organizador";
import ProveedorScreen from "./Proveedor";
import MensajeScreen from "./Mensaje";
import { createStackNavigator } from "@react-navigation/stack"; // No es necesario NavigationContainer aquí

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [perfil, setPerfil] = useState(null);

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
        const response = await axios.get("http://192.168.1.127:8080/usuarios");
        setUsuarios(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsuarios();
  }, []);

  const usuarioFiltrado = usuarios.find(
    (usuario) => usuario.correo === perfil?.correo
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>
      {usuarioFiltrado ? (
        <View style={styles.userCard}>
          <Text>Nombre: {usuarioFiltrado.nombre}</Text>
          <Text>Teléfono: {usuarioFiltrado.telefono}</Text>
          <Text>Correo: {usuarioFiltrado.correo}</Text>
          <Text>Ubicación: {usuarioFiltrado.ubicacion}</Text>
        </View>
      ) : (
        <Text>Cargando perfil...</Text>
      )}
    </ScrollView>
  );
}

export default function ViewCliente() {
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
          headerLeft: () => null, // Elimina la flecha de regreso
          headerRight: () => (
            <>
              <Button
                title="Org"
                onPress={() => navigation.navigate("Organizadores")}
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
        name="Organizadores"
        component={OrganizadorScreen}
        options={({ navigation }) => ({
          title: "Organizadores",
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
                title="Org"
                onPress={() => navigation.navigate("Organizadores")}
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
                title="Org"
                onPress={() => navigation.navigate("Organizadores")}
              />
              <Button
                title="Men"
                onPress={() => navigation.navigate("Mensajes")}
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
});
