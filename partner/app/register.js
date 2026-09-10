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

import AsyncStorage from "@react-native-async-storage/async-storage";

import { ENDPOINTS } from "../constants/api";

export default function PartnerRegisterScreen() {
  // IMPORTANT:
  // OTP भी receive करना है
  const { phone, otp } = useLocalSearchParams();

  const [name, setName] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [drivingLicense, setDrivingLicense] = useState("");

  const [loading, setLoading] = useState(false);

  const registerPartner = async () => {
    // ==========================================
    // VALIDATION
    // ==========================================

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

    if (!phone) {
      Alert.alert("Error", "Phone number is missing. Please verify OTP again.");
      return;
    }

    if (!otp) {
      Alert.alert(
        "Error",
        "OTP is missing. Please go back and verify OTP again.",
      );
      return;
    }

    try {
      setLoading(true);

      const cleanPhone = String(phone).replace(/\D/g, "");
      const cleanOtp = String(otp).trim();

      console.log("REGISTER URL:", ENDPOINTS.partnerRegister);

      console.log("REGISTER REQUEST:", {
        phone: cleanPhone,
        otp: cleanOtp,
        name: name.trim(),
        vehicleType: vehicleType.trim(),
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        drivingLicense: drivingLicense.trim().toUpperCase(),
      });

      const response = await fetch(ENDPOINTS.partnerRegister, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          phone: cleanPhone,

          // IMPORTANT
          otp: cleanOtp,

          name: name.trim(),

          vehicleType: vehicleType.trim(),

          vehicleNumber: vehicleNumber.trim().toUpperCase(),

          drivingLicense: drivingLicense.trim().toUpperCase(),
        }),
      });

      console.log("REGISTER STATUS:", response.status);

      // पहले text पढ़ेंगे ताकि HTML response आने पर
      // JSON Parse Error न हो
      const responseText = await response.text();

      console.log("REGISTER RAW RESPONSE:", responseText);

      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("REGISTER JSON PARSE ERROR:", parseError);

        Alert.alert("Server Error", "Server returned an invalid response.");

        return;
      }

      console.log("REGISTER RESPONSE:", data);

      // ==========================================
      // BACKEND ERROR
      // ==========================================

      if (!data.success) {
        Alert.alert(
          "Registration Failed",
          data.message || "Unable to register partner.",
        );

        return;
      }

      // ==========================================
      // TOKEN CHECK
      // ==========================================

      if (!data.token) {
        Alert.alert(
          "Registration Error",
          "Registration successful but login token was not received.",
        );

        return;
      }

      // ==========================================
      // SAVE TOKEN
      // ==========================================

      await AsyncStorage.setItem("partnerToken", data.token);

      // ==========================================
      // SAVE PARTNER DATA
      // ==========================================

      if (data.partner) {
        await AsyncStorage.setItem("partnerData", JSON.stringify(data.partner));
      }

      // ==========================================
      // SUCCESS
      // ==========================================

      Alert.alert(
        "Registration Successful",
        "Your partner account has been created and is waiting for approval.",
        [
          {
            text: "Continue",
            onPress: () => {
              router.replace("/partner");
            },
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

      {/* ================= PHONE ================= */}

      <Text style={styles.label}>Mobile Number</Text>

      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={`+91 ${phone || ""}`}
        editable={false}
      />

      {/* ================= NAME ================= */}

      <Text style={styles.label}>Name</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      {/* ================= VEHICLE TYPE ================= */}

      <Text style={styles.label}>Vehicle Type</Text>

      <TextInput
        style={styles.input}
        placeholder="Example: Bike / Scooter / Auto"
        placeholderTextColor="#999"
        value={vehicleType}
        onChangeText={setVehicleType}
      />

      {/* ================= VEHICLE NUMBER ================= */}

      <Text style={styles.label}>Vehicle Number</Text>

      <TextInput
        style={styles.input}
        placeholder="Example: DL01AB1234"
        placeholderTextColor="#999"
        autoCapitalize="characters"
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
      />

      {/* ================= DRIVING LICENSE ================= */}

      <Text style={styles.label}>Driving License</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter driving license number"
        placeholderTextColor="#999"
        autoCapitalize="characters"
        value={drivingLicense}
        onChangeText={setDrivingLicense}
      />

      {/* ================= REGISTER ================= */}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
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

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },
});
