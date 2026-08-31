import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

export default function SearchingScreen() {
  const { destination, rideType, total } = useLocalSearchParams();

  const handleCancel = () => {
    router.replace("/home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSpace} />

      <View style={styles.loaderContainer}>
        <View style={styles.loaderCircle}>
          <ActivityIndicator size="large" color="#7B1FA2" />
        </View>
      </View>

      <Text style={styles.title}>Finding your rider</Text>

      <Text style={styles.subtitle}>
        We're looking for a nearby
        {rideType ? ` ${rideType}` : " rider"} for you.
      </Text>

      <View style={styles.tripCard}>
        <View style={styles.tripRow}>
          <View style={styles.dot} />

          <View style={styles.tripText}>
            <Text style={styles.label}>DESTINATION</Text>

            <Text style={styles.value} numberOfLines={2}>
              {destination || "Your destination"}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.tripRow}>
          <Text style={styles.paymentIcon}>₹</Text>

          <View style={styles.tripText}>
            <Text style={styles.label}>ESTIMATED FARE</Text>

            <Text style={styles.value}>₹{total || "0"}</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>🛡️</Text>

        <Text style={styles.infoText}>
          Your trip will only start after a rider accepts your request.
        </Text>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelText}>Cancel Ride Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 25,
  },

  topSpace: {
    height: 100,
  },

  loaderContainer: {
    alignItems: "center",
  },

  loaderCircle: {
    width: 125,
    height: 125,
    borderRadius: 63,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    marginTop: 35,
    fontSize: 27,
    fontWeight: "800",
    color: "#252525",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: "#777777",
    textAlign: "center",
    paddingHorizontal: 20,
  },

  tripCard: {
    marginTop: 35,
    borderRadius: 16,
    backgroundColor: "#F8F5F9",
    padding: 18,
  },

  tripRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  dot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#7B1FA2",
  },

  paymentIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#7B1FA2",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "800",
  },

  tripText: {
    flex: 1,
    marginLeft: 12,
  },

  label: {
    fontSize: 9,
    fontWeight: "700",
    color: "#999999",
  },

  value: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: "700",
    color: "#333333",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 15,
  },

  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 13,
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
  },

  infoIcon: {
    fontSize: 20,
    marginRight: 10,
  },

  infoText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: "#777777",
  },

  bottom: {
    marginTop: "auto",
    paddingBottom: 30,
  },

  cancelButton: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555555",
  },
});
