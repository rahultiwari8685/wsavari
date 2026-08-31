import { useState } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

export default function DestinationScreen() {
  const { query } = useLocalSearchParams();

  const [search, setSearch] = useState(query || "");

  const handleBack = () => {
    router.back();
  };

  const handleDestination = () => {
    if (!search.trim()) {
      return;
    }

    router.push({
      pathname: "/booking/ride-options",
      params: {
        destination: search.trim(),
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Choose Destination</Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Search */}

      <View style={styles.searchContainer}>
        <View style={styles.searchIcon}>
          <Text>⌕</Text>
        </View>

        <TextInput
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          placeholder="Search destination"
          placeholderTextColor="#999999"
          autoFocus
          returnKeyType="search"
          onSubmitEditing={handleDestination}
        />

        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Text style={styles.clear}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Pickup */}

      <View style={styles.routeContainer}>
        <View style={styles.routeLine} />

        <View style={styles.routeRow}>
          <View style={styles.pickupDot} />

          <View style={styles.routeText}>
            <Text style={styles.routeLabel}>PICKUP</Text>

            <Text style={styles.routeValue}>Current Location</Text>
          </View>
        </View>

        <View style={styles.routeRow}>
          <View style={styles.destinationDot} />

          <View style={styles.routeText}>
            <Text style={styles.routeLabel}>DESTINATION</Text>

            <Text style={styles.routeValue}>
              {search || "Enter destination"}
            </Text>
          </View>
        </View>
      </View>

      {/* Suggestions */}

      <View style={styles.suggestions}>
        <Text style={styles.sectionTitle}>Suggestions</Text>

        <Suggestion
          icon="⌂"
          title="Home"
          subtitle="Saved home location"
          onPress={() => setSearch("Home")}
        />

        <Suggestion
          icon="★"
          title="Work"
          subtitle="Saved work location"
          onPress={() => setSearch("Work")}
        />

        <Suggestion
          icon="◷"
          title="Recent destination"
          subtitle="Your recent places"
          onPress={() => setSearch("Recent destination")}
        />
      </View>

      {/* Continue */}

      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.button, !search.trim() && styles.buttonDisabled]}
          disabled={!search.trim()}
          onPress={handleDestination}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Confirm Destination</Text>

          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function Suggestion({ icon, title, subtitle, onPress }) {
  return (
    <TouchableOpacity
      style={styles.suggestion}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.suggestionIcon}>
        <Text>{icon}</Text>
      </View>

      <View style={styles.suggestionText}>
        <Text style={styles.suggestionTitle}>{title}</Text>

        <Text style={styles.suggestionSubtitle}>{subtitle}</Text>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: 90,
    paddingHorizontal: 20,
    paddingTop: 35,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F6F6F6",
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

  headerSpacer: {
    width: 42,
  },

  searchContainer: {
    marginHorizontal: 20,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  searchIcon: {
    width: 30,
    alignItems: "center",
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#222222",
    marginLeft: 5,
  },

  clear: {
    fontSize: 25,
    color: "#777777",
    paddingHorizontal: 5,
  },

  routeContainer: {
    marginHorizontal: 20,
    marginTop: 25,
    position: "relative",
  },

  routeLine: {
    position: "absolute",
    left: 8,
    top: 22,
    bottom: 22,
    width: 1,
    backgroundColor: "#CCCCCC",
  },

  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  pickupDot: {
    width: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: 4,
    borderColor: "#7B1FA2",
    backgroundColor: "#FFFFFF",
    zIndex: 2,
  },

  destinationDot: {
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: "#7B1FA2",
    zIndex: 2,
  },

  routeText: {
    marginLeft: 15,
  },

  routeLabel: {
    fontSize: 9,
    color: "#999999",
    fontWeight: "700",
  },

  routeValue: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
  },

  suggestions: {
    marginHorizontal: 20,
    marginTop: 15,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#333333",
    marginBottom: 10,
  },

  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  suggestionText: {
    flex: 1,
    marginLeft: 12,
  },

  suggestionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333333",
  },

  suggestionSubtitle: {
    fontSize: 11,
    color: "#999999",
    marginTop: 3,
  },

  chevron: {
    fontSize: 24,
    color: "#AAAAAA",
  },

  bottom: {
    marginTop: "auto",
    paddingHorizontal: 20,
    paddingBottom: 25,
  },

  button: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7B1FA2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonDisabled: {
    backgroundColor: "#D5D5D5",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 22,
    marginLeft: 10,
  },
});
