import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(async () => {
      const token = await AsyncStorage.getItem("partnerToken");

      if (token) {
        router.replace("/partner");
      } else {
        router.replace("/login");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoIcon}>W</Text>
      </View>

      <Text style={styles.logoText}>WOMEN SAVARI</Text>

      <Text style={styles.tagline}>Partner • Safe Rides • Better Earnings</Text>

      <View style={styles.bottom}>
        <Text style={styles.safeText}>Women First Mobility</Text>
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
    fontSize: 14,
    color: "#666666",
  },

  bottom: {
    position: "absolute",
    bottom: 45,
  },

  safeText: {
    textAlign: "center",
    fontSize: 12,
    color: "#777777",
  },
});
