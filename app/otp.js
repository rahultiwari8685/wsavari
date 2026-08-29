import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OTPScreen() {
  const { phone } = useLocalSearchParams();

  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(30);
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleOTPChange = (text) => {
    const numbersOnly = text.replace(/\D/g, "");

    if (numbersOnly.length <= 6) {
      setOtp(numbersOnly);
      setError("");
    }
  };

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    /*
      TEMPORARY DEVELOPMENT LOGIC

      Later this will call:
      POST /auth/verify-otp

      For now, any 6-digit OTP is accepted.
    */

    setError("");

    router.replace("/profile");
  };

  const handleResend = () => {
    if (seconds > 0) {
      return;
    }

    setSeconds(30);
    setOtp("");
    setError("");

    /*
      Later:
      POST /auth/send-otp
    */
  };

  const handleChangeNumber = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        {/* Back */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        {/* Header */}

        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🔐</Text>
          </View>

          <Text style={styles.title}>Verify Your Number</Text>

          <Text style={styles.subtitle}>Enter the 6-digit code sent to</Text>

          <View style={styles.phoneRow}>
            <Text style={styles.phone}>+91 {phone}</Text>

            <TouchableOpacity onPress={handleChangeNumber}>
              <Text style={styles.change}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* OTP Input */}

        <View style={styles.otpSection}>
          <TextInput
            ref={inputRef}
            value={otp}
            onChangeText={handleOTPChange}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.hiddenInput}
            autoFocus
          />

          <TouchableOpacity
            style={styles.otpBoxes}
            onPress={() => inputRef.current?.focus()}
            activeOpacity={1}
          >
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const digit = otp[index];

              return (
                <View
                  key={index}
                  style={[
                    styles.otpBox,
                    error && styles.otpBoxError,
                    index === otp.length && styles.otpBoxActive,
                  ]}
                >
                  <Text style={styles.otpDigit}>{digit || ""}</Text>
                </View>
              );
            })}
          </TouchableOpacity>

          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : (
            <Text style={styles.info}>Enter the code to continue</Text>
          )}
        </View>

        {/* Resend */}

        <View style={styles.resendContainer}>
          {seconds > 0 ? (
            <Text style={styles.resendDisabled}>
              Resend OTP in{" "}
              <Text style={styles.timer}>
                00:{seconds < 10 ? `0${seconds}` : seconds}
              </Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resend}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Verify */}

        <TouchableOpacity
          style={[
            styles.verifyButton,
            otp.length === 6 && styles.verifyButtonActive,
          ]}
          onPress={handleVerify}
          activeOpacity={0.85}
        >
          <Text style={styles.verifyText}>Verify</Text>

          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 20,
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
    marginTop: 40,
  },

  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },

  icon: {
    fontSize: 32,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#252525",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: "#777777",
  },

  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  phone: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333333",
  },

  change: {
    marginLeft: 10,
    fontSize: 14,
    color: "#7B1FA2",
    fontWeight: "700",
  },

  otpSection: {
    marginTop: 55,
    alignItems: "center",
  },

  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },

  otpBoxes: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  otpBox: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  otpBoxActive: {
    borderColor: "#7B1FA2",
    borderWidth: 2,
  },

  otpBoxError: {
    borderColor: "#D32F2F",
  },

  otpDigit: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222222",
  },

  info: {
    marginTop: 12,
    fontSize: 12,
    color: "#888888",
  },

  error: {
    marginTop: 12,
    fontSize: 12,
    color: "#D32F2F",
  },

  resendContainer: {
    alignItems: "center",
    marginTop: 30,
  },

  resendDisabled: {
    fontSize: 14,
    color: "#888888",
  },

  timer: {
    color: "#7B1FA2",
    fontWeight: "700",
  },

  resend: {
    fontSize: 15,
    color: "#7B1FA2",
    fontWeight: "700",
  },

  verifyButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#D8D8D8",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 45,
  },

  verifyButtonActive: {
    backgroundColor: "#7B1FA2",
  },

  verifyText: {
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
