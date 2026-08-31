import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    const cleanedPhone = phone.replace(/\D/g, "");

    if (cleanedPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError("");

    router.push({
      pathname: "/otp",
      params: {
        phone: cleanedPhone,
      },
    });
  };

  const handlePhoneChange = (text) => {
    const numbersOnly = text.replace(/\D/g, "");

    if (numbersOnly.length <= 10) {
      setPhone(numbersOnly);
      setError("");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        {/* Header */}

        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>W</Text>
          </View>

          <Text style={styles.title}>Welcome to Women Savari</Text>

          <Text style={styles.subtitle}>
            Enter your mobile number to continue
          </Text>
        </View>

        {/* Phone Input */}

        <View style={styles.form}>
          <Text style={styles.label}>Mobile Number</Text>

          <View style={[styles.phoneContainer, error && styles.inputError]}>
            <View style={styles.countryCode}>
              <Text style={styles.flag}>🇮🇳</Text>

              <Text style={styles.code}>+91</Text>
            </View>

            <View style={styles.divider} />

            <TextInput
              style={styles.phoneInput}
              value={phone}
              onChangeText={handlePhoneChange}
              placeholder="Enter mobile number"
              placeholderTextColor="#A0A0A0"
              keyboardType="phone-pad"
              maxLength={10}
              returnKeyType="done"
            />
          </View>

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <Text style={styles.helperText}>
              We'll send you a verification code
            </Text>
          )}
        </View>

        {/* Continue Button */}

        <TouchableOpacity
          style={[
            styles.continueButton,
            phone.length === 10 && styles.continueButtonActive,
          ]}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueText}>Continue</Text>

          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        {/* Terms */}

        <Text style={styles.terms}>
          By continuing, you agree to our{" "}
          <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
          <Text style={styles.termsLink}>Privacy Policy</Text>.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 30,
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#F7F7F7",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    fontSize: 32,
    color: "#333333",
    marginTop: -4,
  },

  header: {
    alignItems: "center",
    marginTop: 45,
  },

  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#7B1FA2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#242424",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#777777",
    marginTop: 10,
    textAlign: "center",
  },

  form: {
    marginTop: 50,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 10,
  },

  phoneContainer: {
    height: 58,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  inputError: {
    borderColor: "#D32F2F",
  },

  countryCode: {
    flexDirection: "row",
    alignItems: "center",
  },

  flag: {
    fontSize: 20,
    marginRight: 7,
  },

  code: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },

  divider: {
    width: 1,
    height: 28,
    backgroundColor: "#DDDDDD",
    marginHorizontal: 12,
  },

  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: "#222222",
  },

  helperText: {
    marginTop: 9,
    fontSize: 12,
    color: "#888888",
  },

  errorText: {
    marginTop: 9,
    fontSize: 12,
    color: "#D32F2F",
  },

  continueButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#D8D8D8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 45,
  },

  continueButtonActive: {
    backgroundColor: "#7B1FA2",
  },

  continueText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  arrow: {
    fontSize: 22,
    color: "#FFFFFF",
    marginLeft: 12,
  },

  terms: {
    fontSize: 11,
    lineHeight: 18,
    textAlign: "center",
    color: "#888888",
    marginTop: 25,
    paddingHorizontal: 15,
  },

  termsLink: {
    color: "#7B1FA2",
    fontWeight: "600",
  },
});
