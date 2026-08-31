import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import * as Location from "expo-location";

import MapView, { Marker } from "react-native-maps";

import { router } from "expo-router";

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLoadingLocation(false);

        Alert.alert(
          "Location Permission",
          "Please allow location access to use the map.",
        );

        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,

        longitude: currentLocation.coords.longitude,

        latitudeDelta: 0.012,

        longitudeDelta: 0.012,
      });

      setLoadingLocation(false);
    } catch (error) {
      console.log("Location error:", error);

      setLoadingLocation(false);

      Alert.alert("Location Error", "Unable to get your current location.");
    }
  };

  const handleSearch = () => {
    const query = searchText.trim();

    if (!query) {
      return;
    }

    router.push({
      pathname: "/booking/destination",
      params: {
        query,
      },
    });
  };

  const handleCurrentLocation = () => {
    getCurrentLocation();
  };

  const handleMenu = () => {
    Alert.alert("Menu", "Menu screen will be implemented soon.");
  };

  const handleNotification = () => {
    Alert.alert(
      "Notifications",
      "Notification center will be implemented soon.",
    );
  };

  return (
    <View style={styles.container}>
      {/* MAP */}

      <View style={styles.mapContainer}>
        {loadingLocation ? (
          <View style={styles.mapLoading}>
            <ActivityIndicator size="large" color="#7B1FA2" />

            <Text style={styles.loadingText}>Finding your location...</Text>
          </View>
        ) : location ? (
          <MapView
            style={styles.map}
            initialRegion={location}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={false}
            showsBuildings={true}
            showsTraffic={false}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="You are here"
            />
          </MapView>
        ) : (
          <View style={styles.mapLoading}>
            <Text style={styles.mapError}>Location unavailable</Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleCurrentLocation}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* TOP BAR */}

        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleMenu}
            activeOpacity={0.8}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>

          <View style={styles.brandContainer}>
            <Text style={styles.brand}>WOMEN SAVARI</Text>
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleNotification}
            activeOpacity={0.8}
          >
            <Text style={styles.notificationIcon}>♡</Text>
          </TouchableOpacity>
        </View>

        {/* CURRENT LOCATION BUTTON */}

        <TouchableOpacity
          style={styles.myLocationButton}
          onPress={handleCurrentLocation}
          activeOpacity={0.8}
        >
          <Text style={styles.myLocationIcon}>⌾</Text>
        </TouchableOpacity>
      </View>

      {/* BOTTOM BOOKING PANEL */}

      <View style={styles.bottomPanel}>
        {/* Greeting */}

        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greeting}>Hello 👋</Text>

            <Text style={styles.question}>Where are you going?</Text>
          </View>

          <View style={styles.safeBadge}>
            <Text style={styles.safeIcon}>🛡️</Text>

            <Text style={styles.safeText}>Safe</Text>
          </View>
        </View>

        {/* SEARCH */}

        <TouchableOpacity activeOpacity={0.9} onPress={() => {}}>
          <View style={styles.searchContainer}>
            <View style={styles.searchIconContainer}>
              <Text style={styles.searchIcon}>⌕</Text>
            </View>

            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Where would you like to go?"
              placeholderTextColor="#888888"
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />

            {searchText.length > 0 && (
              <TouchableOpacity onPress={handleSearch}>
                <Text style={styles.searchArrow}>→</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>

        {/* QUICK LOCATIONS */}

        <View style={styles.quickLocations}>
          <TouchableOpacity style={styles.quickItem} activeOpacity={0.8}>
            <View style={styles.quickIcon}>
              <Text>⌂</Text>
            </View>

            <View>
              <Text style={styles.quickTitle}>Home</Text>

              <Text style={styles.quickSubtitle}>Add home</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickItem} activeOpacity={0.8}>
            <View style={styles.quickIcon}>
              <Text>★</Text>
            </View>

            <View>
              <Text style={styles.quickTitle}>Work</Text>

              <Text style={styles.quickSubtitle}>Add work</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* RECENT */}

        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent</Text>

          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentItem}>
          <View style={styles.recentIcon}>
            <Text>↙</Text>
          </View>

          <View style={styles.recentTextContainer}>
            <Text style={styles.recentName}>Your recent destinations</Text>

            <Text style={styles.recentAddress}>
              Your previous rides will appear here
            </Text>
          </View>
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
    flex: 1,
    position: "relative",
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  mapLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666666",
  },

  mapError: {
    fontSize: 16,
    color: "#666666",
  },

  retryButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#7B1FA2",
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  topBar: {
    position: "absolute",
    top: 45,
    left: 18,
    right: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  menuIcon: {
    fontSize: 21,
    color: "#333333",
  },

  notificationIcon: {
    fontSize: 25,
    color: "#7B1FA2",
  },

  brandContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 3,
  },

  brand: {
    fontSize: 13,
    fontWeight: "900",
    color: "#7B1FA2",
    letterSpacing: 0.5,
  },

  myLocationButton: {
    position: "absolute",
    right: 18,
    bottom: 25,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  myLocationIcon: {
    fontSize: 28,
    color: "#7B1FA2",
  },

  bottomPanel: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 25,
    elevation: 15,
  },

  greetingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    fontSize: 14,
    color: "#777777",
  },

  question: {
    marginTop: 3,
    fontSize: 21,
    fontWeight: "800",
    color: "#222222",
  },

  safeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5EEF7",
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  safeIcon: {
    fontSize: 14,
    marginRight: 5,
  },

  safeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#7B1FA2",
  },

  searchContainer: {
    height: 58,
    borderRadius: 15,
    backgroundColor: "#F5F5F5",
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
  },

  searchIconContainer: {
    width: 35,
    alignItems: "center",
  },

  searchIcon: {
    fontSize: 27,
    color: "#7B1FA2",
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#222222",
    marginLeft: 5,
  },

  searchArrow: {
    fontSize: 23,
    color: "#7B1FA2",
    paddingHorizontal: 8,
  },

  quickLocations: {
    flexDirection: "row",
    marginTop: 17,
    gap: 10,
  },

  quickItem: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 14,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  quickIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  quickTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#333333",
  },

  quickSubtitle: {
    marginTop: 2,
    fontSize: 10,
    color: "#999999",
  },

  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },

  recentTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#333333",
  },

  seeAll: {
    fontSize: 12,
    color: "#7B1FA2",
    fontWeight: "700",
  },

  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  recentIcon: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  recentTextContainer: {
    marginLeft: 10,
    flex: 1,
  },

  recentName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555555",
  },

  recentAddress: {
    fontSize: 10,
    color: "#999999",
    marginTop: 2,
  },
});
