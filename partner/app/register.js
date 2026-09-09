import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { ENDPOINTS } from "../constants/api";

export default function PartnerRegisterScreen() {
  const { phone } = useLocalSearchParams();

  const [name, setName] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [drivingLicense, setDrivingLicense] = useState("");

  const [loading, setLoading] = useState(false);

  const registerPartner = async () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter your name.");
      return;
    }

    if (!vehicleType.trim()) {
      Alert.alert("Required", "Please enter vehicle type.");
      return;
    }

    if (!vehicleNumber.trim()) {
      Alert.alert("Required", "Please enter vehicle number.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(ENDPOINTS.partnerRegister, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          name: name.trim(),
          vehicleType: vehicleType.trim(),
          vehicleNumber: vehicleNumber.trim(),
          drivingLicense: drivingLicense.trim(),
        }),
      });

      const data = await response.json();

      console.log("REGISTER STATUS:", response.status);
      console.log("REGISTER RESPONSE:", data);

      if (!data.success) {
        Alert.alert(
          "Registration Failed",
          data.message || "Unable to register partner.",
        );
        return;
      }

      Alert.alert(
        "Registration Successful",
        "Your partner account has been created.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ],
      );
    } catch (error) {
      console.error("Partner registration error:", error);

      Alert.alert("Connection Error", "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Create Partner Account</Text>

      <Text style={styles.subtitle}>Complete your partner registration</Text>

      <Text style={styles.label}>Mobile Number</Text>

      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={`+91 ${phone}`}
        editable={false}
      />

      <Text style={styles.label}>Name</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Vehicle Type</Text>

      <TextInput
        style={styles.input}
        placeholder="Example: Bike / Scooter / Auto"
        value={vehicleType}
        onChangeText={setVehicleType}
      />

      <Text style={styles.label}>Vehicle Number</Text>

      <TextInput
        style={styles.input}
        placeholder="Example: DL01AB1234"
        autoCapitalize="characters"
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
      />

      <Text style={styles.label}>Driving License</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter driving license number"
        autoCapitalize="characters"
        value={drivingLicense}
        onChangeText={setDrivingLicense}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={registerPartner}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register Partner</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#191919",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 25,
    color: "#777",
    fontSize: 15,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 7,
    marginTop: 10,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#222",
  },

  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#777",
  },

  button: {
    height: 58,
    borderRadius: 14,
    backgroundColor: "#7B1FA2",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },
});
