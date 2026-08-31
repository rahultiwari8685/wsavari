import { useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import MapView, { Marker, Polyline } from "react-native-maps";

import { router, useLocalSearchParams } from "expo-router";

export default function RideOptionsScreen() {
  const { destination } = useLocalSearchParams();

  const [selectedRide, setSelectedRide] = useState("bike");

  /*
    TEMPORARY LOCATION

    Later these will come from:
    - Customer GPS
    - Google Places
    - Directions API
  */

  const pickup = {
    latitude: 28.6139,
    longitude: 77.209,
  };

  const destinationLocation = {
    latitude: 28.628,
    longitude: 77.219,
  };

  const rides = [
    {
      id: "bike",
      icon: "🏍️",
      name: "Women Bike",
      description: "Fast & affordable",
      passengers: "1 passenger",
      price: 72,
      eta: "3 min",
    },

    {
      id: "auto",
      icon: "🛺",
      name: "Women Auto",
      description: "Affordable city ride",
      passengers: "Up to 3 passengers",
      price: 96,
      eta: "5 min",
    },

    {
      id: "cab",
      icon: "🚗",
      name: "Women Cab",
      description: "Comfortable ride",
      passengers: "Up to 4 passengers",
      price: 142,
      eta: "6 min",
    },
  ];

  const selectedRideData = rides.find((ride) => ride.id === selectedRide);

  const handleContinue = () => {
    router.push({
      pathname: "/booking/confirm",
      params: {
        destination: destination || "Selected Destination",

        rideType: selectedRideData.name,

        fare: selectedRideData.price,

        eta: selectedRideData.eta,

        distance: "4.8 km",
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* MAP */}

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 28.621,
            longitude: 77.214,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          }}
          showsUserLocation={false}
          showsCompass={false}
          showsTraffic={false}
        >
          <Marker coordinate={pickup} title="Pickup">
            <View style={styles.pickupMarker}>
              <View style={styles.pickupDot} />
            </View>
          </Marker>

          <Marker coordinate={destinationLocation} title="Destination">
            <View style={styles.destinationMarker}>
              <Text style={styles.destinationMarkerText}>📍</Text>
            </View>
          </Marker>

          <Polyline
            coordinates={[
              pickup,
              {
                latitude: 28.618,
                longitude: 77.211,
              },
              {
                latitude: 28.623,
                longitude: 77.216,
              },
              destinationLocation,
            ]}
            strokeWidth={5}
            strokeColor="#7B1FA2"
          />
        </MapView>

        {/* Back */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        {/* Location summary */}

        <View style={styles.locationCard}>
          <View style={styles.locationRow}>
            <View style={styles.currentDot} />

            <Text style={styles.locationText} numberOfLines={1}>
              Current Location
            </Text>
          </View>

          <View style={styles.verticalLine} />

          <View style={styles.locationRow}>
            <View style={styles.destinationDot} />

            <Text style={styles.locationText} numberOfLines={1}>
              {destination || "Selected Destination"}
            </Text>
          </View>
        </View>
      </View>

      {/* RIDE OPTIONS */}

      <View style={styles.bottomSheet}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Trip Info */}

          <View style={styles.tripInfo}>
            <View>
              <Text style={styles.distance}>4.8 km</Text>

              <Text style={styles.tripLabel}>Distance</Text>
            </View>

            <View style={styles.infoDivider} />

            <View>
              <Text style={styles.distance}>18 min</Text>

              <Text style={styles.tripLabel}>Estimated time</Text>
            </View>
          </View>

          {/* Heading */}

          <Text style={styles.heading}>Choose your ride</Text>

          <Text style={styles.subheading}>
            All Women Savari rides are designed with your safety in mind.
          </Text>

          {/* Ride Cards */}

          {rides.map((ride) => {
            const selected = selectedRide === ride.id;

            return (
              <TouchableOpacity
                key={ride.id}
                style={[styles.rideCard, selected && styles.rideCardSelected]}
                onPress={() => setSelectedRide(ride.id)}
                activeOpacity={0.85}
              >
                {/* Radio */}

                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioInner} />}
                </View>

                {/* Icon */}

                <View style={styles.rideIcon}>
                  <Text style={styles.rideEmoji}>{ride.icon}</Text>
                </View>

                {/* Details */}

                <View style={styles.rideDetails}>
                  <View style={styles.rideNameRow}>
                    <Text style={styles.rideName}>{ride.name}</Text>

                    <View style={styles.etaBadge}>
                      <Text style={styles.etaText}>{ride.eta}</Text>
                    </View>
                  </View>

                  <Text style={styles.rideDescription}>{ride.description}</Text>

                  <Text style={styles.passengerText}>{ride.passengers}</Text>
                </View>

                {/* Price */}

                <View style={styles.priceContainer}>
                  <Text style={styles.price}>₹{ride.price}</Text>

                  <Text style={styles.priceLabel}>estimated</Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Safety */}

          <View style={styles.safetyBox}>
            <Text style={styles.safetyIcon}>🛡️</Text>

            <View style={styles.safetyContent}>
              <Text style={styles.safetyTitle}>Women-first safety</Text>

              <Text style={styles.safetyText}>
                Trip sharing, emergency assistance and rider information are
                available during your journey.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Continue */}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <View>
              <Text style={styles.continueLabel}>{selectedRideData.name}</Text>

              <Text style={styles.continuePrice}>
                ₹{selectedRideData.price}
              </Text>
            </View>

            <Text style={styles.continueText}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  mapContainer: {
    height: "42%",
    position: "relative",
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  backButton: {
    position: "absolute",
    top: 45,
    left: 18,
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },

  backText: {
    fontSize: 32,
    color: "#333333",
    marginTop: -4,
  },

  locationCard: {
    position: "absolute",
    top: 105,
    left: 18,
    right: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    elevation: 5,
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    fontWeight: "600",
    color: "#333333",
  },

  currentDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: "#7B1FA2",
    backgroundColor: "#FFFFFF",
  },

  destinationDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#7B1FA2",
  },

  verticalLine: {
    height: 18,
    width: 1,
    backgroundColor: "#CCCCCC",
    marginLeft: 5,
  },

  pickupMarker: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    borderWidth: 4,
    borderColor: "#7B1FA2",
    justifyContent: "center",
    alignItems: "center",
  },

  pickupDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#7B1FA2",
  },

  destinationMarker: {
    alignItems: "center",
  },

  destinationMarkerText: {
    fontSize: 28,
  },

  bottomSheet: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    elevation: 15,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },

  tripInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F5F9",
    borderRadius: 14,
    paddingVertical: 12,
  },

  distance: {
    fontSize: 15,
    fontWeight: "800",
    color: "#333333",
    textAlign: "center",
  },

  tripLabel: {
    marginTop: 2,
    fontSize: 10,
    color: "#888888",
    textAlign: "center",
  },

  infoDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#DDDDDD",
    marginHorizontal: 30,
  },

  heading: {
    marginTop: 20,
    fontSize: 21,
    fontWeight: "800",
    color: "#222222",
  },

  subheading: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 17,
    color: "#888888",
  },

  rideCard: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: "#E7E7E7",
    borderRadius: 16,
    marginTop: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  rideCardSelected: {
    borderColor: "#7B1FA2",
    backgroundColor: "#FCF9FD",
    borderWidth: 2,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#CCCCCC",
    justifyContent: "center",
    alignItems: "center",
  },

  radioSelected: {
    borderColor: "#7B1FA2",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#7B1FA2",
  },

  rideIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },

  rideEmoji: {
    fontSize: 27,
  },

  rideDetails: {
    flex: 1,
    marginLeft: 10,
  },

  rideNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  rideName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#333333",
  },

  etaBadge: {
    marginLeft: 7,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "#EFEFEF",
  },

  etaText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#666666",
  },

  rideDescription: {
    fontSize: 10,
    color: "#777777",
    marginTop: 3,
  },

  passengerText: {
    fontSize: 9,
    color: "#999999",
    marginTop: 3,
  },

  priceContainer: {
    alignItems: "flex-end",
    marginLeft: 5,
  },

  price: {
    fontSize: 16,
    fontWeight: "900",
    color: "#333333",
  },

  priceLabel: {
    fontSize: 8,
    color: "#999999",
    marginTop: 2,
  },

  safetyBox: {
    flexDirection: "row",
    backgroundColor: "#F8F5F9",
    borderRadius: 13,
    padding: 12,
    marginTop: 16,
  },

  safetyIcon: {
    fontSize: 21,
    marginRight: 10,
  },

  safetyContent: {
    flex: 1,
  },

  safetyTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#555555",
  },

  safetyText: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 15,
    color: "#888888",
  },

  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
  },

  continueButton: {
    height: 60,
    borderRadius: 30,
    backgroundColor: "#7B1FA2",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  continueLabel: {
    fontSize: 10,
    color: "#EBD9EF",
  },

  continuePrice: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    marginTop: 1,
  },

  continueText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
