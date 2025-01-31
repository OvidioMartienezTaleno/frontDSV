import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

function Organizador() {
  const [organizadores, setOrganizadores] = useState([]);
  const [selectedOrganizador, setSelectedOrganizador] = useState(null);
  const navigation = useNavigation(); // Usar la navegación

  useEffect(() => {
    const fetchOrganizadores = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.127:8080/organizador"
        );
        setOrganizadores(response.data);
      } catch (error) {
        console.error("Error al obtener organizadores:", error);
      }
    };

    fetchOrganizadores();
  }, []);

  const handleSelectOrganizador = (organizador) => {
    setSelectedOrganizador(organizador);
  };

  const handleSendMessage = () => {
    if (selectedOrganizador) {
      navigation.navigate("Mensaje", { chatId: selectedOrganizador.correo });
    }
  };

  const handleContract = () => {
    // Aquí puedes agregar la lógica para contratar al organizador
    alert("Contratar a " + selectedOrganizador.nombre);
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={true} // Muestra la barra de desplazamiento
    >
      {selectedOrganizador ? (
        <View style={styles.profileContainer}>
          <Text style={styles.profileTitle}>Perfil del Organizador</Text>
          <Text>Nombre: {selectedOrganizador.nombre}</Text>
          <Text>Teléfono: {selectedOrganizador.telefono}</Text>
          <Text>Correo: {selectedOrganizador.correo}</Text>
          <Text>Ubicación: {selectedOrganizador.ubicacion}</Text>
          <Text>Servicios:</Text>
          {selectedOrganizador.servicios.map((servicio, index) => (
            <Text key={index} style={styles.servicioItem}>
              - {servicio}
            </Text>
          ))}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedOrganizador(null)}
          >
            <Text style={styles.backButtonText}>Volver a la lista</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={handleSendMessage}
          >
            <Text style={styles.buttonText}>Mensaje</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contractButton}
            onPress={handleContract}
          >
            <Text style={styles.buttonText}>Contratar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.title}>Lista de Organizadores</Text>
          {organizadores.map((organizador, index) => (
            <TouchableOpacity
              key={index}
              style={styles.userCard}
              onPress={() => handleSelectOrganizador(organizador)}
            >
              <Text>Nombre: {organizador.nombre}</Text>
              <Text>Teléfono: {organizador.telefono}</Text>
              <Text>Correo: {organizador.correo}</Text>
              <Text>Ubicación: {organizador.ubicacion}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );
}

export default function OrganizadorScreen() {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={true} // Muestra la barra de desplazamiento
    >
      <View style={styles.container}>
        <Organizador />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  userCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  servicioItem: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
  },
  messageButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#28a745",
    borderRadius: 8,
    alignItems: "center",
  },
  contractButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ffc107",
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
