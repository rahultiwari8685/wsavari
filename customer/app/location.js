import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as Location from "expo-location";
import { router } from "expo-router";

export default function LocationScreen() {
  const [loading, setLoading] = useState(false);

  const handleAllowLocation = async () => {
    try {
      setLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLoading(false);

        Alert.alert(
          "Location Permission Needed",
          "Location helps Women Savari find your pickup point and provide ride tracking.",
          [
            {
              text: "Continue Manually",
              onPress: () => router.replace("/home"),
            },
            {
              text: "Try Again",
              onPress: () => {},
            },
          ],
        );

        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      console.log(
        "Customer location:",
        location.coords.latitude,
        location.coords.longitude,
      );

      setLoading(false);

      router.replace("/home");
    } catch (error) {
      console.log("Location error:", error);

      setLoading(false);

      Alert.alert(
        "Unable to Get Location",
        "Please try again or continue manually.",
        [
          {
            text: "Continue",
            onPress: () => router.replace("/home"),
          },
          {
            text: "Try Again",
            style: "cancel",
          },
        ],
      );
    }
  };

  const handleManualLocation = () => {
    router.replace("/home");
  };

  return (
    <View style={styles.container}>
      {/* Illustration */}

      <View style={styles.illustration}>
        <View style={styles.circle}>
          <Text style={styles.pin}>📍</Text>
        </View>

        <View style={styles.smallDotOne} />
        <View style={styles.smallDotTwo} />
      </View>

      {/* Content */}

      <View style={styles.content}>
        <Text style={styles.title}>Enable Location</Text>

        <Text style={styles.description}>
          Location helps us find your pickup point, show nearby riders and
          provide live trip tracking.
        </Text>

        {/* Benefits */}

        <View style={styles.benefits}>
          <Benefit icon="📍" text="Find your pickup location" />

          <Benefit icon="🚗" text="Show nearby available riders" />

          <Benefit icon="🛡️" text="Improve trip safety" />
        </View>
      </View>

      {/* Buttons */}

      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.allowButton}
          onPress={handleAllowLocation}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.allowText}>Allow Location</Text>

              <Text style={styles.arrow}>→</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.manualButton}
          onPress={handleManualLocation}
          disabled={loading}
        >
          <Text style={styles.manualText}>Enter Location Manually</Text>
        </TouchableOpacity>

        <Text style={styles.privacy}>
          You can change location permissions anytime from your phone settings.
        </Text>
      </View>
    </View>
  );
}

function Benefit({ icon, text }) {
  return (
    <View style={styles.benefit}>
      <View style={styles.benefitIcon}>
        <Text style={styles.benefitEmoji}>{icon}</Text>
      </View>

      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 25,
  },

  illustration: {
    height: 260,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  circle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  pin: {
    fontSize: 80,
  },

  smallDotOne: {
    position: "absolute",
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: "#7B1FA2",
    top: 40,
    right: 55,
  },

  smallDotTwo: {
    position: "absolute",
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#CE93D8",
    bottom: 35,
    left: 55,
  },

  content: {
    flex: 1,
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#252525",
    textAlign: "center",
  },

  description: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 23,
    color: "#777777",
    textAlign: "center",
    paddingHorizontal: 10,
  },

  benefits: {
    width: "100%",
    marginTop: 28,
  },

  benefit: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  benefitIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F8F1FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  benefitEmoji: {
    fontSize: 20,
  },

  benefitText: {
    fontSize: 14,
    color: "#444444",
    fontWeight: "500",
  },

  bottom: {
    width: "100%",
  },

  allowButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7B1FA2",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  allowText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 22,
    marginLeft: 12,
  },

  manualButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  manualText: {
    color: "#7B1FA2",
    fontSize: 14,
    fontWeight: "700",
  },

  privacy: {
    fontSize: 10,
    lineHeight: 15,
    color: "#999999",
    textAlign: "center",
    marginTop: 5,
  },
});
