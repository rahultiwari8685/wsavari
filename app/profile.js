import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>👩</Text>
      </View>

      <Text style={styles.title}>Create Your Profile</Text>

      <Text style={styles.subtitle}>
        Profile setup will be implemented next.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#FFFFFF",
  },

  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 45,
  },

  title: {
    marginTop: 25,
    fontSize: 27,
    fontWeight: "800",
    color: "#252525",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 15,
    color: "#777777",
    textAlign: "center",
  },

  button: {
    marginTop: 35,
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7B1FA2",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
