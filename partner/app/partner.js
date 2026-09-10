import { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Location from "expo-location";

import { ENDPOINTS } from "../constants/api";

export default function PartnerDashboard() {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  const [rides, setRides] = useState([]);
  const [ridesLoading, setRidesLoading] = useState(false);
  const [acceptingRideId, setAcceptingRideId] = useState(null);

  const [activeRide, setActiveRide] = useState(null);
  const [rideActionLoading, setRideActionLoading] = useState(false);

  const locationWatcherRef = useRef(null);

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

  const loadAvailableRides = async () => {
    try {
      setRidesLoading(true);

      const token = await AsyncStorage.getItem("partnerToken");

      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(ENDPOINTS.availableRides, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("AVAILABLE RIDES:", data);

      if (!data.success) {
        console.log("Available rides error:", data.message);

        return;
      }

      setRides(data.rides || []);
    } catch (error) {
      console.error("Load available rides error:", error);
    } finally {
      setRidesLoading(false);
    }
  };

  const acceptRide = async (rideId) => {
    try {
      setAcceptingRideId(rideId);

      const token = await AsyncStorage.getItem("partnerToken");

      const response = await fetch(ENDPOINTS.acceptRide(rideId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("ACCEPT RIDE RESPONSE:", data);

      if (!data.success) {
        Alert.alert(
          "Ride Not Available",
          data.message || "This ride is no longer available.",
        );

        await loadAvailableRides();

        return;
      }

      setRides([]);

      setActiveRide(data.ride);

      await AsyncStorage.setItem("activeRide", JSON.stringify(data.ride));

      Alert.alert("Ride Accepted", "You have accepted this ride.");

      await loadPartner();
    } catch (error) {
      console.error("Accept ride error:", error);

      Alert.alert("Connection Error", "Unable to accept the ride.");
    } finally {
      setAcceptingRideId(null);
    }
  };

  const updateRideStatus = async (action, rideId) => {
    try {
      setRideActionLoading(true);

      const token = await AsyncStorage.getItem("partnerToken");

      if (!token) {
        router.replace("/login");
        return;
      }

      let endpoint;

      if (action === "arriving") {
        endpoint = ENDPOINTS.arrivingRide(rideId);
      } else if (action === "start") {
        endpoint = ENDPOINTS.startRide(rideId);
      } else if (action === "complete") {
        endpoint = ENDPOINTS.completeRide(rideId);
      } else {
        return;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("========== RIDE STATUS DEBUG ==========");
      console.log("ACTION:", action);
      console.log("ENDPOINT:", endpoint);
      console.log("HTTP STATUS:", response.status);
      console.log("HTTP OK:", response.ok);

      const responseText = await response.text();

      console.log("SERVER RESPONSE:", responseText);
      console.log("========================================");

      let data;

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON PARSE ERROR:", parseError);

        Alert.alert(
          "Server Response Error",
          `HTTP ${response.status}\n\n${responseText.substring(0, 300)}`,
        );

        return;
      }

      console.log(`${action.toUpperCase()} RIDE RESPONSE:`, data);

      if (!data.success) {
        Alert.alert(
          "Unable to update ride",
          data.message || "Please try again.",
        );

        return;
      }

      if (action === "complete") {
        setActiveRide(null);

        await AsyncStorage.removeItem("activeRide");

        Alert.alert(
          "Ride Completed",
          "The ride has been completed successfully.",
        );

        await loadPartner();
        return;
      }

      setActiveRide(data.ride);

      await AsyncStorage.setItem("activeRide", JSON.stringify(data.ride));

      if (action === "arriving") {
        Alert.alert(
          "Status Updated",
          "Customer has been notified that you are arriving.",
        );
      }

      if (action === "start") {
        Alert.alert("Ride Started", "The ride has started successfully.");
      }
    } catch (error) {
      console.error("Update ride status error:", error);

      Alert.alert("Connection Error", "Unable to update ride status.");
    } finally {
      setRideActionLoading(false);
    }
  };

  useEffect(() => {
    const restoreActiveRide = async () => {
      try {
        const savedRide = await AsyncStorage.getItem("activeRide");

        if (savedRide) {
          const parsedRide = JSON.parse(savedRide);

          if (
            parsedRide &&
            ["ACCEPTED", "ARRIVING", "STARTED"].includes(parsedRide.status)
          ) {
            setActiveRide(parsedRide);
          } else {
            await AsyncStorage.removeItem("activeRide");
          }
        }
      } catch (error) {
        console.error("Restore active ride error:", error);
      }
    };

    restoreActiveRide();
  }, []);

  useEffect(() => {
    loadPartner();
  }, []);

  useEffect(() => {
    if (!partner) {
      return;
    }

    if (activeRide) {
      setRides([]);
      return;
    }

    if (partner.status !== "APPROVED") {
      setRides([]);
      return;
    }

    if (!partner.isOnline) {
      setRides([]);
      return;
    }

    loadAvailableRides();

    const interval = setInterval(() => {
      loadAvailableRides();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [partner?.isOnline, partner?.status, activeRide?._id]);

  //   useEffect(() => {
  //     if (!partner) {
  //       return;
  //     }

  //     if (partner.status !== "APPROVED") {
  //       setRides([]);
  //       return;
  //     }

  //     if (!partner.isOnline) {
  //       setRides([]);
  //       return;
  //     }

  //     loadAvailableRides();

  //     const interval = setInterval(() => {
  //       loadAvailableRides();
  //     }, 10000);

  //     return () => {
  //       clearInterval(interval);
  //     };
  //   }, [partner?.isOnline, partner?.status]);

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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

        {/* AVAILABLE RIDES */}

        {status === "APPROVED" && partner.isOnline && !activeRide && (
          <View style={styles.ridesSection}>
            <View style={styles.ridesHeader}>
              <Text style={styles.ridesTitle}>Available Rides</Text>

              <TouchableOpacity
                onPress={loadAvailableRides}
                disabled={ridesLoading}
              >
                <Text style={styles.refreshText}>Refresh</Text>
              </TouchableOpacity>
            </View>

            {ridesLoading && rides.length === 0 ? (
              <View style={styles.emptyRides}>
                <ActivityIndicator size="small" color="#7B1FA2" />

                <Text style={styles.ridesLoadingText}>Finding rides...</Text>
              </View>
            ) : rides.length === 0 ? (
              <View style={styles.emptyRides}>
                <Text style={styles.emptyIcon}>🚗</Text>

                <Text style={styles.emptyTitle}>No rides available</Text>

                <Text style={styles.emptyText}>
                  New ride requests will appear here.
                </Text>
              </View>
            ) : (
              rides.map((ride) => (
                <View key={ride._id} style={styles.rideCard}>
                  <View style={styles.rideHeader}>
                    <Text style={styles.rideTitle}>New Ride Request</Text>

                    <Text style={styles.rideStatus}>{ride.status}</Text>
                  </View>

                  <View style={styles.locationRow}>
                    <Text style={styles.locationDot}>●</Text>

                    <View style={styles.locationInfo}>
                      <Text style={styles.locationLabel}>PICKUP</Text>

                      <Text style={styles.address}>{ride.pickup.address}</Text>
                    </View>
                  </View>

                  <View style={styles.locationRow}>
                    <Text style={styles.destinationDot}>●</Text>

                    <View style={styles.locationInfo}>
                      <Text style={styles.locationLabel}>DESTINATION</Text>

                      <Text style={styles.address}>
                        {ride.destination.address}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rideDetails}>
                    <View>
                      <Text style={styles.detailLabel}>VEHICLE</Text>

                      <Text style={styles.detailValue}>
                        {ride.vehicleType.toUpperCase()}
                      </Text>
                    </View>

                    <View>
                      <Text style={styles.detailLabel}>ESTIMATED FARE</Text>

                      <Text style={styles.fareValue}>
                        ₹{ride.estimatedFare}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.acceptButton,
                      acceptingRideId === ride._id && styles.disabledButton,
                    ]}
                    onPress={() => acceptRide(ride._id)}
                    disabled={acceptingRideId === ride._id}
                  >
                    {acceptingRideId === ride._id ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.acceptButtonText}>ACCEPT RIDE</Text>
                    )}
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {/* ACTIVE RIDE */}

        {status === "APPROVED" && partner.isOnline && activeRide && (
          <View style={styles.activeRideSection}>
            <View style={styles.activeRideHeader}>
              <View>
                <Text style={styles.activeRideLabel}>ACTIVE RIDE</Text>

                <Text style={styles.activeRideTitle}>
                  {activeRide.status === "ACCEPTED"
                    ? "Ride Accepted"
                    : activeRide.status === "ARRIVING"
                      ? "You are Arriving"
                      : "Ride In Progress"}
                </Text>
              </View>

              <View style={styles.activeStatusBadge}>
                <Text style={styles.activeStatusText}>{activeRide.status}</Text>
              </View>
            </View>

            <View style={styles.activeLocationRow}>
              <Text style={styles.activePickupDot}>●</Text>

              <View style={styles.activeLocationInfo}>
                <Text style={styles.activeLocationLabel}>PICKUP</Text>

                <Text style={styles.activeAddress}>
                  {activeRide.pickup?.address}
                </Text>
              </View>
            </View>

            <View style={styles.activeLocationRow}>
              <Text style={styles.activeDestinationDot}>●</Text>

              <View style={styles.activeLocationInfo}>
                <Text style={styles.activeLocationLabel}>DESTINATION</Text>

                <Text style={styles.activeAddress}>
                  {activeRide.destination?.address}
                </Text>
              </View>
            </View>

            <View style={styles.customerCard}>
              <Text style={styles.customerLabel}>CUSTOMER</Text>

              <Text style={styles.customerName}>
                {activeRide.customer?.name || "Customer"}
              </Text>

              {activeRide.customer?.phone && (
                <Text style={styles.customerPhone}>
                  +91 {activeRide.customer.phone}
                </Text>
              )}
            </View>

            <View style={styles.activeFareRow}>
              <Text style={styles.activeFareLabel}>ESTIMATED FARE</Text>

              <Text style={styles.activeFareValue}>
                ₹{activeRide.estimatedFare}
              </Text>
            </View>

            {activeRide.status === "ACCEPTED" && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  rideActionLoading && styles.disabledButton,
                ]}
                onPress={() => updateRideStatus("arriving", activeRide._id)}
                disabled={rideActionLoading}
              >
                {rideActionLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.actionButtonText}>I'M ARRIVING</Text>
                )}
              </TouchableOpacity>
            )}

            {activeRide.status === "ARRIVING" && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  rideActionLoading && styles.disabledButton,
                ]}
                onPress={() => updateRideStatus("start", activeRide._id)}
                disabled={rideActionLoading}
              >
                {rideActionLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.actionButtonText}>START RIDE</Text>
                )}
              </TouchableOpacity>
            )}

            {activeRide.status === "STARTED" && (
              <TouchableOpacity
                style={[
                  styles.completeButton,
                  rideActionLoading && styles.disabledButton,
                ]}
                onPress={() => updateRideStatus("complete", activeRide._id)}
                disabled={rideActionLoading}
              >
                {rideActionLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.actionButtonText}>COMPLETE RIDE</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* CURRENT LOCATION */}

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

        {/* {partner.currentLocation?.latitude && (
          <View style={styles.locationCard}>
            {status === "APPROVED" && partner.isOnline && (
              <View style={styles.ridesSection}>
                <View style={styles.ridesHeader}>
                  <Text style={styles.ridesTitle}>Available Rides</Text>

                  <TouchableOpacity
                    onPress={loadAvailableRides}
                    disabled={ridesLoading}
                  >
                    <Text style={styles.refreshText}>Refresh</Text>
                  </TouchableOpacity>
                </View>

                {ridesLoading && rides.length === 0 ? (
                  <View style={styles.emptyRides}>
                    <ActivityIndicator size="small" color="#7B1FA2" />

                    <Text style={styles.ridesLoadingText}>
                      Finding rides...
                    </Text>
                  </View>
                ) : rides.length === 0 ? (
                  <View style={styles.emptyRides}>
                    <Text style={styles.emptyIcon}>🚗</Text>

                    <Text style={styles.emptyTitle}>No rides available</Text>

                    <Text style={styles.emptyText}>
                      New ride requests will appear here.
                    </Text>
                  </View>
                ) : (
                  rides.map((ride) => (
                    <View key={ride._id} style={styles.rideCard}>
                      <View style={styles.rideHeader}>
                        <Text style={styles.rideTitle}>New Ride Request</Text>

                        <Text style={styles.rideStatus}>{ride.status}</Text>
                      </View>

                      <View style={styles.locationRow}>
                        <Text style={styles.locationDot}>●</Text>

                        <View style={styles.locationInfo}>
                          <Text style={styles.locationLabel}>PICKUP</Text>

                          <Text style={styles.address}>
                            {ride.pickup.address}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.locationRow}>
                        <Text style={styles.destinationDot}>●</Text>

                        <View style={styles.locationInfo}>
                          <Text style={styles.locationLabel}>DESTINATION</Text>

                          <Text style={styles.address}>
                            {ride.destination.address}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.rideDetails}>
                        <View>
                          <Text style={styles.detailLabel}>VEHICLE</Text>

                          <Text style={styles.detailValue}>
                            {ride.vehicleType.toUpperCase()}
                          </Text>
                        </View>

                        <View>
                          <Text style={styles.detailLabel}>ESTIMATED FARE</Text>

                          <Text style={styles.fareValue}>
                            ₹{ride.estimatedFare}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.acceptButton,
                          acceptingRideId === ride._id && styles.disabledButton,
                        ]}
                        onPress={() => acceptRide(ride._id)}
                        disabled={acceptingRideId === ride._id}
                      >
                        {acceptingRideId === ride._id ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <Text style={styles.acceptButtonText}>
                            ACCEPT RIDE
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>
            )}

            {status === "APPROVED" && partner.isOnline && !activeRide && (
              <View style={styles.ridesSection}>
                <View style={styles.ridesHeader}>
                  <Text style={styles.ridesTitle}>Available Rides</Text>

                  <TouchableOpacity
                    onPress={loadAvailableRides}
                    disabled={ridesLoading}
                  >
                    <Text style={styles.refreshText}>Refresh</Text>
                  </TouchableOpacity>
                </View>

                {ridesLoading && rides.length === 0 ? (
                  <View style={styles.emptyRides}>
                    <ActivityIndicator size="small" color="#7B1FA2" />

                    <Text style={styles.ridesLoadingText}>
                      Finding rides...
                    </Text>
                  </View>
                ) : rides.length === 0 ? (
                  <View style={styles.emptyRides}>
                    <Text style={styles.emptyIcon}>🚗</Text>

                    <Text style={styles.emptyTitle}>No rides available</Text>

                    <Text style={styles.emptyText}>
                      New ride requests will appear here.
                    </Text>
                  </View>
                ) : (
                  rides.map((ride) => (
                    <View key={ride._id} style={styles.rideCard}>
                      <View style={styles.rideHeader}>
                        <Text style={styles.rideTitle}>New Ride Request</Text>

                        <Text style={styles.rideStatus}>{ride.status}</Text>
                      </View>

                      <View style={styles.locationRow}>
                        <Text style={styles.locationDot}>●</Text>

                        <View style={styles.locationInfo}>
                          <Text style={styles.locationLabel}>PICKUP</Text>

                          <Text style={styles.address}>
                            {ride.pickup.address}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.locationRow}>
                        <Text style={styles.destinationDot}>●</Text>

                        <View style={styles.locationInfo}>
                          <Text style={styles.locationLabel}>DESTINATION</Text>

                          <Text style={styles.address}>
                            {ride.destination.address}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.rideDetails}>
                        <View>
                          <Text style={styles.detailLabel}>VEHICLE</Text>

                          <Text style={styles.detailValue}>
                            {ride.vehicleType.toUpperCase()}
                          </Text>
                        </View>

                        <View>
                          <Text style={styles.detailLabel}>ESTIMATED FARE</Text>

                          <Text style={styles.fareValue}>
                            ₹{ride.estimatedFare}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.acceptButton,
                          acceptingRideId === ride._id && styles.disabledButton,
                        ]}
                        onPress={() => acceptRide(ride._id)}
                        disabled={acceptingRideId === ride._id}
                      >
                        {acceptingRideId === ride._id ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <Text style={styles.acceptButtonText}>
                            ACCEPT RIDE
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>
            )}

            {status === "APPROVED" && partner.isOnline && activeRide && (
              <View style={styles.activeRideSection}>
                <View style={styles.activeRideHeader}>
                  <View>
                    <Text style={styles.activeRideLabel}>ACTIVE RIDE</Text>

                    <Text style={styles.activeRideTitle}>
                      {activeRide.status === "ACCEPTED"
                        ? "Ride Accepted"
                        : activeRide.status === "ARRIVING"
                          ? "You are Arriving"
                          : "Ride In Progress"}
                    </Text>
                  </View>

                  <View style={styles.activeStatusBadge}>
                    <Text style={styles.activeStatusText}>
                      {activeRide.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.activeLocationRow}>
                  <Text style={styles.activePickupDot}>●</Text>

                  <View style={styles.activeLocationInfo}>
                    <Text style={styles.activeLocationLabel}>PICKUP</Text>

                    <Text style={styles.activeAddress}>
                      {activeRide.pickup?.address}
                    </Text>
                  </View>
                </View>

                <View style={styles.activeLocationRow}>
                  <Text style={styles.activeDestinationDot}>●</Text>

                  <View style={styles.activeLocationInfo}>
                    <Text style={styles.activeLocationLabel}>DESTINATION</Text>

                    <Text style={styles.activeAddress}>
                      {activeRide.destination?.address}
                    </Text>
                  </View>
                </View>

                <View style={styles.customerCard}>
                  <Text style={styles.customerLabel}>CUSTOMER</Text>

                  <Text style={styles.customerName}>
                    {activeRide.customer?.name || "Customer"}
                  </Text>

                  {activeRide.customer?.phone && (
                    <Text style={styles.customerPhone}>
                      +91 {activeRide.customer.phone}
                    </Text>
                  )}
                </View>

                <View style={styles.activeFareRow}>
                  <Text style={styles.activeFareLabel}>ESTIMATED FARE</Text>

                  <Text style={styles.activeFareValue}>
                    ₹{activeRide.estimatedFare}
                  </Text>
                </View>

                {activeRide.status === "ACCEPTED" && (
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      rideActionLoading && styles.disabledButton,
                    ]}
                    onPress={() => updateRideStatus("arriving", activeRide._id)}
                    disabled={rideActionLoading}
                  >
                    {rideActionLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.actionButtonText}>I'M ARRIVING</Text>
                    )}
                  </TouchableOpacity>
                )}

                {activeRide.status === "ARRIVING" && (
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      rideActionLoading && styles.disabledButton,
                    ]}
                    onPress={() => updateRideStatus("start", activeRide._id)}
                    disabled={rideActionLoading}
                  >
                    {rideActionLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.actionButtonText}>START RIDE</Text>
                    )}
                  </TouchableOpacity>
                )}

                {activeRide.status === "STARTED" && (
                  <TouchableOpacity
                    style={[
                      styles.completeButton,
                      rideActionLoading && styles.disabledButton,
                    ]}
                    onPress={() => updateRideStatus("complete", activeRide._id)}
                    disabled={rideActionLoading}
                  >
                    {rideActionLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.actionButtonText}>COMPLETE RIDE</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}
            <Text style={styles.locationTitle}>Current Location</Text>

            <Text style={styles.locationText}>
              Latitude: {partner.currentLocation.latitude}
            </Text>

            <Text style={styles.locationText}>
              Longitude: {partner.currentLocation.longitude}
            </Text>
          </View>
        )} */}
      </ScrollView>
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

  scrollContent: {
    paddingBottom: 40,
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

  ridesSection: {
    marginTop: 18,
    marginBottom: 30,
  },

  ridesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  ridesTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#222",
  },

  refreshText: {
    color: "#7B1FA2",
    fontWeight: "700",
  },

  ridesLoadingText: {
    marginTop: 8,
    color: "#777",
  },

  emptyRides: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 35,
    marginBottom: 8,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#222",
  },

  emptyText: {
    marginTop: 5,
    color: "#888",
    textAlign: "center",
  },

  rideCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },

  rideHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  rideTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#222",
  },

  rideStatus: {
    fontSize: 11,
    fontWeight: "800",
    color: "#D97706",
  },

  locationRow: {
    flexDirection: "row",
    marginBottom: 15,
  },

  locationDot: {
    color: "#7B1FA2",
    fontSize: 13,
    marginRight: 10,
    marginTop: 3,
  },

  destinationDot: {
    color: "#333",
    fontSize: 13,
    marginRight: 10,
    marginTop: 3,
  },

  locationInfo: {
    flex: 1,
  },

  locationLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#999",
    letterSpacing: 0.8,
  },

  address: {
    marginTop: 3,
    fontSize: 14,
    color: "#333",
    lineHeight: 19,
  },

  rideDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
    marginTop: 3,
  },

  detailLabel: {
    fontSize: 10,
    color: "#999",
    fontWeight: "800",
  },

  detailValue: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "800",
    color: "#333",
  },

  fareValue: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: "900",
    color: "#7B1FA2",
  },

  acceptButton: {
    height: 52,
    backgroundColor: "#7B1FA2",
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  acceptButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },

  activeRideSection: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginTop: 18,
    marginBottom: 30,
  },

  activeRideHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 22,
  },

  activeRideLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "#999",
    letterSpacing: 1,
  },

  activeRideTitle: {
    marginTop: 5,
    fontSize: 22,
    fontWeight: "900",
    color: "#222",
  },

  activeStatusBadge: {
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },

  activeStatusText: {
    color: "#7B1FA2",
    fontSize: 10,
    fontWeight: "900",
  },

  activeLocationRow: {
    flexDirection: "row",
    marginBottom: 18,
  },

  activeLocationInfo: {
    flex: 1,
  },

  activePickupDot: {
    color: "#7B1FA2",
    fontSize: 14,
    marginRight: 10,
    marginTop: 2,
  },

  activeDestinationDot: {
    color: "#333",
    fontSize: 14,
    marginRight: 10,
    marginTop: 2,
  },

  activeLocationLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "#999",
    letterSpacing: 0.8,
  },

  activeAddress: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 21,
    color: "#333",
  },

  customerCard: {
    backgroundColor: "#F7F7F8",
    borderRadius: 14,
    padding: 15,
    marginTop: 4,
    marginBottom: 15,
  },

  customerLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "#999",
    letterSpacing: 0.8,
  },

  customerName: {
    marginTop: 5,
    fontSize: 17,
    fontWeight: "800",
    color: "#222",
  },

  customerPhone: {
    marginTop: 3,
    color: "#777",
  },

  activeFareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
    marginBottom: 18,
  },

  activeFareLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "#999",
  },

  activeFareValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#7B1FA2",
  },

  actionButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#7B1FA2",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  completeButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#16803C",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
});
