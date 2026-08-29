import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo Icon */}
      <View style={styles.logoCircle}>
        <Text style={styles.logoIcon}>W</Text>
      </View>

      {/* Brand */}
      <Text style={styles.logoText}>WOMEN SAVARI</Text>

      <Text style={styles.tagline}>Women First Mobility</Text>

      {/* Bottom Text */}
      <View style={styles.bottom}>
        <Text style={styles.safeText}>
          Safe Rides • Flexible Earnings • Women Empowered
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#7B1FA2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  logoIcon: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "900",
  },

  logoText: {
    fontSize: 30,
    fontWeight: "900",
    color: "#7B1FA2",
    letterSpacing: 1,
  },

  tagline: {
    marginTop: 8,
    fontSize: 15,
    color: "#666666",
    letterSpacing: 0.5,
  },

  bottom: {
    position: "absolute",
    bottom: 45,
    paddingHorizontal: 20,
  },

  safeText: {
    textAlign: "center",
    fontSize: 12,
    color: "#777777",
  },
});
