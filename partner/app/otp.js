import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ENDPOINTS } from "../constants/api";

export default function OtpScreen() {
  const { phone } = useLocalSearchParams();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter the 6 digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(ENDPOINTS.partnerVerifyOtp, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          otp,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        Alert.alert("Verification Failed", data.message || "Invalid OTP.");
        return;
      }

      if (!data.token) {
        Alert.alert("Login Error", "Server did not return a login token.");
        return;
      }

      await AsyncStorage.setItem("partnerToken", data.token);

      if (data.partner) {
        await AsyncStorage.setItem("partnerData", JSON.stringify(data.partner));
      }

      router.replace("/partner");
    } catch (error) {
      console.error("Partner OTP verification error:", error);

      Alert.alert("Connection Error", "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setResending(true);

      const response = await fetch(ENDPOINTS.partnerSendOtp, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        Alert.alert("Error", data.message || "Unable to resend OTP.");
        return;
      }

      Alert.alert("OTP Sent", "A new OTP has been sent.");
    } catch (error) {
      Alert.alert("Error", "Unable to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      <View style={styles.logo}>
        <Text style={styles.logoText}>W</Text>
      </View>

      <Text style={styles.title}>Verify OTP</Text>

      <Text style={styles.subtitle}>Enter the 6 digit OTP sent to</Text>

      <Text style={styles.phone}>+91 {phone}</Text>

      <TextInput
        style={styles.input}
        placeholder="000000"
        placeholderTextColor="#aaa"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={(value) => setOtp(value.replace(/\D/g, ""))}
        autoFocus
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.disabled]}
        onPress={verifyOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify & Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={resendOtp}
        disabled={resending}
        style={styles.resend}
      >
        <Text style={styles.resendText}>
          {resending ? "Sending..." : "Didn't receive OTP? Resend"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    justifyContent: "center",
  },

  back: {
    position: "absolute",
    top: 55,
    left: 22,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    fontSize: 32,
    color: "#333",
    marginTop: -4,
  },

  logo: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#7B1FA2",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 30,
  },

  logoText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "900",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#191919",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    marginTop: 10,
    color: "#777",
    fontSize: 15,
  },

  phone: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
    marginTop: 5,
    marginBottom: 28,
  },

  input: {
    height: 62,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    textAlign: "center",
    fontSize: 27,
    fontWeight: "700",
    letterSpacing: 10,
    color: "#222",
    marginBottom: 20,
  },

  button: {
    height: 58,
    backgroundColor: "#7B1FA2",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  disabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },

  resend: {
    marginTop: 22,
    alignItems: "center",
  },

  resendText: {
    color: "#7B1FA2",
    fontWeight: "700",
  },
});
