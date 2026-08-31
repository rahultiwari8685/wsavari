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

import { router } from "expo-router";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  const [error, setError] = useState("");

  const handlePhoneChange = (text) => {
    const numbersOnly = text.replace(/\D/g, "");

    if (numbersOnly.length <= 10) {
      setEmergencyPhone(numbersOnly);
      setError("");
    }
  };

  const handleContinue = () => {
    const cleanName = name.trim();
    const cleanEmergencyName = emergencyName.trim();

    if (!cleanName) {
      setError("Please enter your full name.");
      return;
    }

    if (!cleanEmergencyName) {
      setError("Please enter your emergency contact name.");
      return;
    }

    if (emergencyPhone.length !== 10) {
      setError("Please enter a valid 10-digit emergency contact number.");
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");

    /*
      TEMPORARY

      Later we will send this information to:

      POST /users/profile

      and save it in MongoDB.
    */

    router.replace("/location");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.header}>
          <Text style={styles.title}>Create Your Profile</Text>

          <Text style={styles.subtitle}>Tell us a little about yourself</Text>
        </View>

        {/* Profile Photo */}

        <TouchableOpacity style={styles.photoContainer} activeOpacity={0.8}>
          <View style={styles.photoCircle}>
            <Text style={styles.photoIcon}>👩</Text>
          </View>

          <View style={styles.cameraBadge}>
            <Text style={styles.cameraText}>+</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.photoLabel}>Add profile photo</Text>

        {/* Personal Information */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          {/* Name */}

          <Text style={styles.label}>Full Name *</Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError("");
            }}
            placeholder="Enter your full name"
            placeholderTextColor="#999999"
            autoCapitalize="words"
            returnKeyType="next"
          />

          {/* Email */}

          <Text style={styles.label}>Email Address</Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError("");
            }}
            placeholder="Enter email address (optional)"
            placeholderTextColor="#999999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />
        </View>

        {/* Emergency Contact */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>

          <Text style={styles.sectionDescription}>
            This person can be contacted during a safety emergency.
          </Text>

          {/* Emergency Name */}

          <Text style={styles.label}>Contact Name *</Text>

          <TextInput
            style={styles.input}
            value={emergencyName}
            onChangeText={(text) => {
              setEmergencyName(text);
              setError("");
            }}
            placeholder="e.g. Mother, Sister, Friend"
            placeholderTextColor="#999999"
            autoCapitalize="words"
            returnKeyType="next"
          />

          {/* Emergency Phone */}

          <Text style={styles.label}>Contact Mobile Number *</Text>

          <View style={styles.phoneContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.flag}>🇮🇳</Text>

              <Text style={styles.code}>+91</Text>
            </View>

            <View style={styles.divider} />

            <TextInput
              style={styles.phoneInput}
              value={emergencyPhone}
              onChangeText={handlePhoneChange}
              placeholder="10-digit mobile number"
              placeholderTextColor="#999999"
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        {/* Error */}

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Privacy */}

        <View style={styles.privacyBox}>
          <Text style={styles.privacyIcon}>🛡️</Text>

          <Text style={styles.privacyText}>
            Your information is protected and will only be used to provide your
            Women Savari services and safety features.
          </Text>
        </View>

        {/* Continue */}

        <TouchableOpacity
          style={styles.button}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Continue</Text>

          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 35,
    paddingBottom: 30,
  },

  header: {
    alignItems: "center",
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#252525",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#777777",
    textAlign: "center",
  },

  photoContainer: {
    alignSelf: "center",
    marginTop: 25,
    position: "relative",
  },

  photoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E1BEE7",
  },

  photoIcon: {
    fontSize: 43,
  },

  cameraBadge: {
    position: "absolute",
    right: -2,
    bottom: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#7B1FA2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  cameraText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginTop: -2,
  },

  photoLabel: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 12,
    color: "#7B1FA2",
    fontWeight: "600",
  },

  section: {
    marginTop: 30,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#292929",
    marginBottom: 5,
  },

  sectionDescription: {
    fontSize: 12,
    color: "#777777",
    lineHeight: 18,
    marginBottom: 15,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#444444",
    marginTop: 15,
    marginBottom: 8,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 13,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#222222",
    backgroundColor: "#FFFFFF",
  },

  phoneContainer: {
    height: 54,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  countryCode: {
    flexDirection: "row",
    alignItems: "center",
  },

  flag: {
    fontSize: 19,
    marginRight: 6,
  },

  code: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333333",
  },

  divider: {
    width: 1,
    height: 26,
    backgroundColor: "#DDDDDD",
    marginHorizontal: 12,
  },

  phoneInput: {
    flex: 1,
    fontSize: 15,
    color: "#222222",
  },

  errorContainer: {
    marginTop: 15,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FFF3F3",
  },

  errorText: {
    fontSize: 12,
    color: "#D32F2F",
    lineHeight: 18,
  },

  privacyBox: {
    flexDirection: "row",
    backgroundColor: "#F8F5F9",
    borderRadius: 12,
    padding: 13,
    marginTop: 25,
  },

  privacyIcon: {
    fontSize: 20,
    marginRight: 10,
  },

  privacyText: {
    flex: 1,
    fontSize: 11,
    color: "#777777",
    lineHeight: 17,
  },

  button: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7B1FA2",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 22,
    marginLeft: 12,
  },
});
