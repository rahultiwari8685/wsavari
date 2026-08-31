import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

export default function ConfirmRideScreen() {
  const { destination, rideType, fare, eta, distance } = useLocalSearchParams();

  const rideFare = Number(fare) || 0;

  const platformFee = 10;

  const total = rideFare + platformFee;

  const handleConfirm = () => {
    router.push({
      pathname: "/booking/searching",
      params: {
        destination,
        rideType,
        total,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Confirm Your Ride</Text>

        <View style={styles.spacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Trip */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your trip</Text>

          <View style={styles.locationRow}>
            <View style={styles.routeColumn}>
              <View style={styles.pickupDot} />

              <View style={styles.routeLine} />

              <View style={styles.destinationDot} />
            </View>

            <View style={styles.locationContent}>
              <View>
                <Text style={styles.locationLabel}>PICKUP</Text>

                <Text style={styles.locationValue}>Current Location</Text>
              </View>

              <View style={styles.destinationBlock}>
                <Text style={styles.locationLabel}>DESTINATION</Text>

                <Text style={styles.locationValue} numberOfLines={2}>
                  {destination || "Selected Destination"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Ride */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Selected ride</Text>

          <View style={styles.rideRow}>
            <View style={styles.rideIcon}>
              <Text style={styles.rideEmoji}>
                {rideType === "Women Bike"
                  ? "🏍️"
                  : rideType === "Women Auto"
                    ? "🛺"
                    : "🚗"}
              </Text>
            </View>

            <View style={styles.rideDetails}>
              <Text style={styles.rideName}>{rideType}</Text>

              <Text style={styles.rideInfo}>
                {distance || "4.8 km"} • {eta || "18 min"}
              </Text>
            </View>

            <Text style={styles.fare}>₹{rideFare}</Text>
          </View>
        </View>

        {/* Payment */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment method</Text>

          <TouchableOpacity style={styles.paymentRow} activeOpacity={0.8}>
            <View style={styles.paymentIcon}>
              <Text>💵</Text>
            </View>

            <View style={styles.paymentDetails}>
              <Text style={styles.paymentTitle}>Cash</Text>

              <Text style={styles.paymentSubtitle}>
                Pay the rider after the trip
              </Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.otherPayment} activeOpacity={0.8}>
            <Text style={styles.otherPaymentText}>Change payment method</Text>
          </TouchableOpacity>
        </View>

        {/* Fare Breakdown */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fare details</Text>

          <FareRow label="Ride fare" value={`₹${rideFare}`} />

          <FareRow label="Platform & safety fee" value={`₹${platformFee}`} />

          <View style={styles.separator} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>

            <Text style={styles.totalValue}>₹{total}</Text>
          </View>

          <Text style={styles.fareNote}>
            Final fare may change if the trip changes significantly.
          </Text>
        </View>

        {/* Safety */}

        <View style={styles.safetyBox}>
          <Text style={styles.safetyIcon}>🛡️</Text>

          <View style={styles.safetyContent}>
            <Text style={styles.safetyTitle}>Your safety matters</Text>

            <Text style={styles.safetyText}>
              Emergency assistance and trip sharing will be available during
              your ride.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom */}

      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
          activeOpacity={0.85}
        >
          <Text style={styles.confirmText}>Confirm Ride</Text>

          <Text style={styles.confirmPrice}>₹{total}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FareRow({ label, value }) {
  return (
    <View style={styles.fareRow}>
      <Text style={styles.fareLabel}>{label}</Text>

      <Text style={styles.fareValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  header: {
    height: 95,
    paddingTop: 38,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    fontSize: 31,
    color: "#333333",
    marginTop: -4,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: "#222222",
  },

  spacer: {
    width: 42,
  },

  content: {
    padding: 15,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 17,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#333333",
    marginBottom: 15,
  },

  locationRow: {
    flexDirection: "row",
  },

  routeColumn: {
    width: 25,
    alignItems: "center",
    position: "relative",
  },

  pickupDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: "#7B1FA2",
    backgroundColor: "#FFFFFF",
  },

  destinationDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#7B1FA2",
    position: "absolute",
    bottom: 4,
  },

  routeLine: {
    width: 1,
    flex: 1,
    backgroundColor: "#CCCCCC",
    marginVertical: 4,
  },

  locationContent: {
    flex: 1,
    marginLeft: 10,
  },

  locationLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#999999",
  },

  locationValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginTop: 3,
  },

  destinationBlock: {
    marginTop: 28,
  },

  rideRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  rideIcon: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  rideEmoji: {
    fontSize: 29,
  },

  rideDetails: {
    flex: 1,
    marginLeft: 13,
  },

  rideName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#333333",
  },

  rideInfo: {
    marginTop: 4,
    fontSize: 11,
    color: "#888888",
  },

  fare: {
    fontSize: 18,
    fontWeight: "900",
    color: "#333333",
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  paymentIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  paymentDetails: {
    flex: 1,
    marginLeft: 12,
  },

  paymentTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333333",
  },

  paymentSubtitle: {
    marginTop: 3,
    fontSize: 10,
    color: "#999999",
  },

  chevron: {
    fontSize: 25,
    color: "#AAAAAA",
  },

  otherPayment: {
    marginTop: 12,
  },

  otherPaymentText: {
    fontSize: 12,
    color: "#7B1FA2",
    fontWeight: "700",
  },

  fareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  fareLabel: {
    fontSize: 12,
    color: "#777777",
  },

  fareValue: {
    fontSize: 12,
    color: "#444444",
    fontWeight: "600",
  },

  separator: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 8,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  totalLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#333333",
  },

  totalValue: {
    fontSize: 19,
    fontWeight: "900",
    color: "#7B1FA2",
  },

  fareNote: {
    marginTop: 8,
    fontSize: 9,
    lineHeight: 14,
    color: "#999999",
  },

  safetyBox: {
    flexDirection: "row",
    backgroundColor: "#F3E5F5",
    borderRadius: 15,
    padding: 14,
  },

  safetyIcon: {
    fontSize: 22,
    marginRight: 10,
  },

  safetyContent: {
    flex: 1,
  },

  safetyTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#5E3570",
  },

  safetyText: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 15,
    color: "#76577F",
  },

  bottom: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },

  confirmButton: {
    height: 58,
    borderRadius: 29,
    backgroundColor: "#7B1FA2",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  confirmText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  confirmPrice: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
});
