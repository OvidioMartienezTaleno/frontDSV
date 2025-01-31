import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import axios from "axios";
import { Picker } from "@react-native-picker/picker"; // Importar Picker desde @react-native-picker/picker
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importar AsyncStorage

import ViewCliente from "./Pages/viewCliente";
import MensajeScreen from "./Pages/Mensaje"; // Asegúrate de actualizar la ruta
import OrganizadorScreen from "./Pages/Organizador"; // Asegúrate de actualizar la ruta

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [accountType, setAccountType] = useState("Cliente"); // Estado para el tipo de cuenta
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const saveProfile = async (profile) => {
    try {
      await AsyncStorage.setItem("perfil", JSON.stringify(profile));
      console.log("Perfil guardado en AsyncStorage");
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.get("http://192.168.1.127:8080/usuarios");
      const usuarios = response.data;
      const usuarioEncontrado = usuarios.find(
        (user) => user.correo === email && user.password === password
      );

      if (usuarioEncontrado) {
        alert("Inicio de sesión exitoso");
        await saveProfile({ nombre: usuarioEncontrado.nombre, correo: email });
        navigation.navigate("Cliente", { userEmail: email }); // Pasar userEmail al navegar a ViewCliente
      } else {
        alert("Correo o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al iniciar sesión");
    }
  };

  const handleCreateAccount = async () => {
    try {
      const response = await axios.get("http://192.168.1.127:8080/usuarios");
      const usuarios = response.data;
      const usuarioExistente = usuarios.find((user) => user.correo === email);

      if (usuarioExistente) {
        alert("Este correo ya está registrado.");
        return;
      }

      const nuevoUsuario = {
        nombre: nombreCompleto,
        correo: email,
        password: password,
        ubicacion: ubicacion,
        telefono: telefono,
        tipo: accountType,
      };

      const createResponse = await axios.post(
        "http://192.168.1.127:8080/usuarios",
        nuevoUsuario
      );

      if (createResponse.status === 201) {
        alert("Cuenta creada exitosamente");
        await saveProfile({ nombre: nombreCompleto, correo: email });
        setIsCreatingAccount(false);
        navigation.navigate("Cliente", { userEmail: email }); // Pasar userEmail al navegar a ViewCliente
      } else {
        alert("Error al crear la cuenta");
      }
    } catch (error) {
      console.error("Error al crear la cuenta:", error);
      alert("Error al crear la cuenta");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isCreatingAccount ? "Crear Cuenta" : "Inicio de Sesión"}
      </Text>

      {isCreatingAccount && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={nombreCompleto}
            onChangeText={setNombreCompleto}
          />
          <TextInput
            style={styles.input}
            placeholder="Ubicación"
            value={ubicacion}
            onChangeText={setUbicacion}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />
          <Picker
            selectedValue={accountType}
            style={styles.input}
            onValueChange={(itemValue) => setAccountType(itemValue)}
          >
            <Picker.Item label="Cliente" value="Cliente" />
            <Picker.Item label="Organizador" value="Organizador" />
            <Picker.Item label="Proveedor" value="Proveedor" />
          </Picker>
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={isCreatingAccount ? handleCreateAccount : handleLogin}
      >
        <Text style={styles.buttonText}>
          {isCreatingAccount ? "Crear Cuenta" : "Iniciar Sesión"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => setIsCreatingAccount(!isCreatingAccount)}
      >
        <Text style={styles.linkText}>
          {isCreatingAccount
            ? "¿Ya tienes cuenta? Iniciar Sesión"
            : "¿No tienes cuenta? Crear Cuenta"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Inicio" }}
        />
        <Stack.Screen
          name="Cliente"
          component={ViewCliente}
          options={{ title: "Vista Cliente" }}
        />
        <Stack.Screen
          name="Organizador"
          component={OrganizadorScreen}
          options={{ title: "Organizador" }}
        />
        <Stack.Screen
          name="Mensaje"
          component={MensajeScreen}
          options={{ title: "Mensajes" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    color: "#007bff",
    fontSize: 16,
  },
});
