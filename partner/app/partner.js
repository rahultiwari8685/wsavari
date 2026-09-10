import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Location from "expo-location";

import { ENDPOINTS } from "../constants/api";

export default function PartnerDashboard() {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  const loadPartner = async () => {
    try {
      const token = await AsyncStorage.getItem("partnerToken");

      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(ENDPOINTS.partnerStatus, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("PARTNER STATUS:", data);

      if (!data.success) {
        Alert.alert(
          "Session Error",
          data.message || "Unable to load partner profile.",
        );

        await AsyncStorage.removeItem("partnerToken");
        await AsyncStorage.removeItem("partnerData");

        router.replace("/login");
        return;
      }

      setPartner(data.partner);

      await AsyncStorage.setItem("partnerData", JSON.stringify(data.partner));
    } catch (error) {
      console.error("Load partner error:", error);

      Alert.alert("Connection Error", "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartner();
  }, []);

  const toggleOnline = async () => {
    if (!partner) return;

    if (partner.status !== "APPROVED") {
      Alert.alert(
        "Approval Required",
        "Your partner account must be approved before going online.",
      );
      return;
    }

    try {
      setStatusLoading(true);

      const token = await AsyncStorage.getItem("partnerToken");

      if (!partner.isOnline) {
        // Request location permission
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Location Permission Required",
            "Women Savari needs your location to receive nearby rides.",
          );
          return;
        }

        // Get current location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;

        console.log("PARTNER LOCATION:", {
          latitude,
          longitude,
        });

        // Go online + save location
        const response = await fetch(ENDPOINTS.partnerStatus, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isOnline: true,
            latitude,
            longitude,
          }),
        });

        const data = await response.json();

        console.log("GO ONLINE RESPONSE:", data);

        if (!data.success) {
          Alert.alert(
            "Unable to go online",
            data.message || "Please try again.",
          );
          return;
        }

        setPartner(data.partner);

        await AsyncStorage.setItem("partnerData", JSON.stringify(data.partner));

        Alert.alert(
          "You're Online",
          "You can now receive nearby ride requests.",
        );
      } else {
        // Go offline
        const response = await fetch(ENDPOINTS.partnerStatus, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isOnline: false,
          }),
        });

        const data = await response.json();

        console.log("GO OFFLINE RESPONSE:", data);

        if (!data.success) {
          Alert.alert(
            "Unable to go offline",
            data.message || "Please try again.",
          );
          return;
        }

        setPartner(data.partner);

        await AsyncStorage.setItem("partnerData", JSON.stringify(data.partner));
      }
    } catch (error) {
      console.error("Toggle online error:", error);

      Alert.alert(
        "Location Error",
        "Unable to get your current location. Please make sure GPS is enabled.",
      );
    } finally {
      setStatusLoading(false);
    }
  };

  //   const toggleOnline = async () => {
  //     if (!partner) return;

  //     if (partner.status !== "APPROVED") {
  //       Alert.alert(
  //         "Approval Required",
  //         "Your partner account must be approved before going online.",
  //       );
  //       return;
  //     }

  //     try {
  //       setStatusLoading(true);

  //       const token = await AsyncStorage.getItem("partnerToken");

  //       const newOnlineStatus = !partner.isOnline;

  //       const response = await fetch(ENDPOINTS.partnerStatus, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           isOnline: newOnlineStatus,
  //         }),
  //       });

  //       const data = await response.json();

  //       console.log("UPDATE STATUS:", data);

  //       if (!data.success) {
  //         Alert.alert(
  //           "Unable to update status",
  //           data.message || "Please try again.",
  //         );
  //         return;
  //       }

  //       setPartner(data.partner);

  //       await AsyncStorage.setItem("partnerData", JSON.stringify(data.partner));
  //     } catch (error) {
  //       console.error("Toggle online error:", error);

  //       Alert.alert("Connection Error", "Unable to update your online status.");
  //     } finally {
  //       setStatusLoading(false);
  //     }
  //   };

  const logout = async () => {
    await AsyncStorage.removeItem("partnerToken");
    await AsyncStorage.removeItem("partnerData");

    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7B1FA2" />

        <Text style={styles.loadingText}>Loading partner account...</Text>
      </View>
    );
  }

  if (!partner) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Partner information not available.</Text>
      </View>
    );
  }

  const status = partner.status;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>WOMEN SAVARI</Text>

          <Text style={styles.title}>Partner Dashboard</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {partner.user?.name?.charAt(0)?.toUpperCase() || "W"}
          </Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{partner.user?.name || "Partner"}</Text>

          <Text style={styles.phone}>+91 {partner.user?.phone || ""}</Text>

          <Text style={styles.vehicle}>
            {partner.vehicleType?.toUpperCase()} • {partner.vehicleNumber}
          </Text>
        </View>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>ACCOUNT STATUS</Text>

        <Text
          style={[
            styles.statusValue,
            status === "APPROVED" && styles.approved,
            status === "PENDING" && styles.pending,
            status === "REJECTED" && styles.rejected,
          ]}
        >
          {status}
        </Text>
      </View>

      {status === "PENDING" && (
        <View style={styles.messageCard}>
          <Text style={styles.messageTitle}>Application Under Review</Text>

          <Text style={styles.messageText}>
            Your partner registration has been submitted. Please wait for
            approval before accepting rides.
          </Text>
        </View>
      )}

      {status === "REJECTED" && (
        <View style={styles.messageCard}>
          <Text style={styles.messageTitle}>Application Rejected</Text>

          <Text style={styles.messageText}>
            Your partner application has been rejected. Please contact Women
            Savari support.
          </Text>
        </View>
      )}

      {status === "APPROVED" && (
        <View style={styles.onlineSection}>
          <Text style={styles.onlineTitle}>
            {partner.isOnline ? "You are Online" : "You are Offline"}
          </Text>

          <Text style={styles.onlineSubtitle}>
            {partner.isOnline
              ? "Waiting for nearby ride requests"
              : "Go online to start receiving rides"}
          </Text>

          <TouchableOpacity
            style={[
              styles.onlineButton,
              partner.isOnline && styles.offlineButton,
              statusLoading && styles.disabledButton,
            ]}
            onPress={toggleOnline}
            disabled={statusLoading}
          >
            {statusLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.onlineButtonText}>
                {partner.isOnline ? "GO OFFLINE" : "GO ONLINE"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {partner.currentLocation?.latitude && (
        <View style={styles.locationCard}>
          <Text style={styles.locationTitle}>Current Location</Text>

          <Text style={styles.locationText}>
            Latitude: {partner.currentLocation.latitude}
          </Text>

          <Text style={styles.locationText}>
            Longitude: {partner.currentLocation.longitude}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F8",
    paddingHorizontal: 20,
    paddingTop: 55,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  loadingText: {
    marginTop: 12,
    color: "#777",
  },

  errorText: {
    color: "#777",
    fontSize: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  brand: {
    color: "#7B1FA2",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 1,
  },

  title: {
    marginTop: 4,
    fontSize: 24,
    fontWeight: "800",
    color: "#191919",
  },

  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  logoutText: {
    color: "#7B1FA2",
    fontWeight: "700",
  },

  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#7B1FA2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  avatarText: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "900",
  },

  profileInfo: {
    flex: 1,
  },

  name: {
    fontSize: 19,
    fontWeight: "800",
    color: "#222",
  },

  phone: {
    marginTop: 3,
    color: "#777",
  },

  vehicle: {
    marginTop: 7,
    color: "#555",
    fontWeight: "700",
  },

  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
  },

  statusLabel: {
    color: "#999",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  statusValue: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: "900",
  },

  approved: {
    color: "#16803C",
  },

  pending: {
    color: "#D97706",
  },

  rejected: {
    color: "#C62828",
  },

  messageCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
  },

  messageTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222",
  },

  messageText: {
    marginTop: 8,
    color: "#777",
    lineHeight: 21,
  },

  onlineSection: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
  },

  onlineTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#222",
  },

  onlineSubtitle: {
    marginTop: 7,
    textAlign: "center",
    color: "#777",
  },

  onlineButton: {
    width: "100%",
    height: 58,
    borderRadius: 15,
    backgroundColor: "#7B1FA2",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  offlineButton: {
    backgroundColor: "#444",
  },

  disabledButton: {
    opacity: 0.7,
  },

  onlineButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
  },

  locationCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginTop: 15,
  },

  locationTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },

  locationText: {
    color: "#777",
    marginTop: 3,
  },
});
