import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    icon: "🛡️",
    title: "Safe Rides",
    description:
      "Travel with confidence through a mobility experience designed with safety at its heart.",
  },
  {
    id: 2,
    icon: "📍",
    title: "Track Your Ride",
    description:
      "Know where your rider is, see your journey in real time and stay connected throughout your trip.",
  },
  {
    id: 3,
    icon: "💜",
    title: "Women First Mobility",
    description:
      "Simple, reliable and empowering mobility built to make every journey more comfortable.",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSlide = slides[currentIndex];

  const isLastSlide = currentIndex === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      router.replace("/login");
      return;
    }

    setCurrentIndex(currentIndex + 1);
  };

  const handleSkip = () => {
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.illustrationCircle}>
          <Text style={styles.illustrationIcon}>{currentSlide.icon}</Text>
        </View>

        <View style={styles.smallCircleOne} />
        <View style={styles.smallCircleTwo} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{currentSlide.title}</Text>

        <Text style={styles.description}>{currentSlide.description}</Text>
      </View>

      {/* Progress */}
      <View style={styles.pagination}>
        {slides.map((slide, index) => (
          <View
            key={slide.id}
            style={[styles.dot, index === currentIndex && styles.activeDot]}
          />
        ))}
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleNext}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>
          {isLastSlide ? "Get Started" : "Next"}
        </Text>

        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  topBar: {
    height: 60,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  skipText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#777777",
  },

  illustrationContainer: {
    height: width * 0.95,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  illustrationCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
  },

  illustrationIcon: {
    fontSize: 85,
  },

  smallCircleOne: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#7B1FA2",
    top: 60,
    right: 70,
  },

  smallCircleTwo: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#CE93D8",
    bottom: 65,
    left: 75,
  },

  content: {
    paddingHorizontal: 30,
    alignItems: "center",
  },

  title: {
    fontSize: 29,
    fontWeight: "800",
    color: "#252525",
    textAlign: "center",
  },

  description: {
    marginTop: 15,
    fontSize: 16,
    lineHeight: 25,
    color: "#707070",
    textAlign: "center",
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D8D8D8",
    marginHorizontal: 4,
  },

  activeDot: {
    width: 25,
    backgroundColor: "#7B1FA2",
  },

  button: {
    marginHorizontal: 30,
    marginTop: 28,
    marginBottom: 20,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#7B1FA2",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 22,
    marginLeft: 12,
  },
});
