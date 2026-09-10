import { useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";

import { router } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { ENDPOINTS } from "../constants/api";

export default function PartnerScreen() {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);

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
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log("PARTNER STATUS:", response.status);

      console.log("PARTNER RESPONSE:", data);

      if (response.status === 401) {
        await AsyncStorage.removeItem("partnerToken");

        await AsyncStorage.removeItem("partnerData");

        router.replace("/login");

        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load partner");
      }

      setPartner(data.partner);

      await AsyncStorage.setItem("partnerData", JSON.stringify(data.partner));
    } catch (error) {
      console.error("Load partner error:", error);

      // Load cached data if API fails
      const cached = await AsyncStorage.getItem("partnerData");

      if (cached) {
        setPartner(JSON.parse(cached));
      } else {
        Alert.alert("Error", "Unable to load partner information.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPartner();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadPartner();
  };

  const toggleOnline = async () => {
    if (!partner) return;

    if (partner.status !== "APPROVED") {
      Alert.alert(
        "Approval Required",
        "Your account must be approved before you can go online.",
      );

      return;
    }

    try {
      setUpdating(true);

      const token = await AsyncStorage.getItem("partnerToken");

      const newOnlineStatus = !partner.isOnline;

      const response = await fetch(ENDPOINTS.partnerStatus, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isOnline: newOnlineStatus,
        }),
      });

      const data = await response.json();

      console.log("UPDATE PARTNER STATUS:", response.status);

      console.log("UPDATE RESPONSE:", data);

      if (!response.ok || !data.success) {
        Alert.alert("Error", data.message || "Unable to update online status.");

        return;
      }

      setPartner(data.partner);

      await AsyncStorage.setItem("partnerData", JSON.stringify(data.partner));
    } catch (error) {
      console.error("Toggle online error:", error);

      Alert.alert("Connection Error", "Unable to connect to server.");
    } finally {
      setUpdating(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("partnerToken");

    await AsyncStorage.removeItem("partnerData");

    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7B1FA2" />

        <Text style={styles.loadingText}>Loading partner account...</Text>
      </View>
    );
  }

  if (!partner) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Partner information not found.</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>WOMEN SAVARI</Text>

          <Text style={styles.title}>Partner Dashboard</Text>
        </View>

        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Status</Text>

        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              partner.status === "APPROVED"
                ? styles.approved
                : partner.status === "REJECTED"
                  ? styles.rejected
                  : styles.pending,
            ]}
          />

          <Text style={styles.status}>{partner.status}</Text>
        </View>

        {partner.status === "PENDING" && (
          <Text style={styles.description}>
            Your partner account is waiting for admin approval.
          </Text>
        )}

        {partner.status === "APPROVED" && (
          <Text style={styles.description}>
            Your partner account has been approved. You can now accept rides.
          </Text>
        )}

        {partner.status === "REJECTED" && (
          <Text style={styles.description}>
            Your partner application has been rejected. Please contact support.
          </Text>
        )}

        {partner.status === "SUSPENDED" && (
          <Text style={styles.description}>
            Your partner account is suspended.
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Partner Information</Text>

        <InfoRow label="Vehicle Type" value={partner.vehicleType} />

        <InfoRow label="Vehicle Number" value={partner.vehicleNumber} />

        <InfoRow
          label="Driving License"
          value={partner.drivingLicense || "Not provided"}
        />
      </View>

      {partner.status === "APPROVED" && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ride Availability</Text>

          <Text style={styles.description}>
            {partner.isOnline
              ? "You are online and can receive rides."
              : "You are offline and will not receive rides."}
          </Text>

          <TouchableOpacity
            style={[
              styles.onlineButton,
              partner.isOnline && styles.offlineButton,
            ]}
            onPress={toggleOnline}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.onlineButtonText}>
                {partner.isOnline ? "GO OFFLINE" : "GO ONLINE"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {partner.status === "APPROVED" && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Available Rides</Text>

          <Text style={styles.description}>
            Available rides will appear here when you are online.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>

      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: "#F7F7F7",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },

  loadingText: {
    marginTop: 15,
    color: "#777",
  },

  errorText: {
    color: "#555",
    fontSize: 16,
    marginBottom: 20,
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
    fontSize: 25,
    fontWeight: "800",
    color: "#191919",
    marginTop: 5,
  },

  logout: {
    color: "#7B1FA2",
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#222",
    marginBottom: 15,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },

  approved: {
    backgroundColor: "#2E7D32",
  },

  pending: {
    backgroundColor: "#F9A825",
  },

  rejected: {
    backgroundColor: "#D32F2F",
  },

  status: {
    fontSize: 18,
    fontWeight: "800",
  },

  description: {
    marginTop: 10,
    color: "#777",
    fontSize: 14,
    lineHeight: 21,
  },

  infoRow: {
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  infoLabel: {
    color: "#888",
    fontSize: 12,
    marginBottom: 4,
  },

  infoValue: {
    color: "#222",
    fontSize: 16,
    fontWeight: "700",
  },

  onlineButton: {
    height: 54,
    borderRadius: 12,
    backgroundColor: "#7B1FA2",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  offlineButton: {
    backgroundColor: "#555",
  },

  onlineButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  button: {
    backgroundColor: "#7B1FA2",
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 12,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
  },
});
