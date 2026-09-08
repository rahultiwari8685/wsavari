import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";

import { ENDPOINTS } from "../constants/api";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      Alert.alert(
        "Invalid Phone",
        "Please enter a valid 10 digit mobile number.",
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(ENDPOINTS.partnerSendOtp, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: cleanPhone,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        Alert.alert("Unable to send OTP", data.message || "Please try again.");
        return;
      }

      router.push({
        pathname: "/otp",
        params: {
          phone: cleanPhone,
        },
      });
    } catch (error) {
      console.error("Send partner OTP error:", error);

      Alert.alert(
        "Connection Error",
        "Unable to connect to server. Please check your internet connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.logo}>
        <Text style={styles.logoText}>W</Text>
      </View>

      <Text style={styles.brand}>WOMEN SAVARI</Text>

      <Text style={styles.title}>Partner Login</Text>

      <Text style={styles.subtitle}>Login to start accepting safe rides</Text>

      <Text style={styles.label}>Mobile Number</Text>

      <View style={styles.phoneBox}>
        <Text style={styles.countryCode}>+91</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter mobile number"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          maxLength={10}
          value={phone}
          onChangeText={(text) => setPhone(text.replace(/\D/g, ""))}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={sendOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send OTP</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footer}>
        By continuing, you agree to Women Savari partner terms.
      </Text>
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

  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#7B1FA2",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 12,
  },

  logoText: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "900",
  },

  brand: {
    textAlign: "center",
    color: "#7B1FA2",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 45,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#191919",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 30,
    color: "#777",
    fontSize: 15,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },

  phoneBox: {
    height: 58,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  countryCode: {
    fontSize: 17,
    fontWeight: "700",
    marginRight: 10,
    color: "#333",
  },

  input: {
    flex: 1,
    fontSize: 17,
    color: "#222",
  },

  button: {
    height: 58,
    borderRadius: 14,
    backgroundColor: "#7B1FA2",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },

  footer: {
    textAlign: "center",
    marginTop: 25,
    color: "#999",
    fontSize: 11,
    lineHeight: 17,
  },
});
