export const API_URL = "http://187.127.138.247:5008/api";

export const ENDPOINTS = {
  // Partner Auth
  partnerSendOtp: `${API_URL}/partner/auth/send-otp`,
  partnerVerifyOtp: `${API_URL}/partner/auth/verify-otp`,
  partnerRegister: `${API_URL}/partner/auth/register`,

  // Partner
  partnerStatus: `${API_URL}/partner/status`,

  // Rides
  availableRides: `${API_URL}/rides/available`,

  acceptRide: (id) => `${API_URL}/rides/${id}/accept`,

  arrivingRide: (id) => `${API_URL}/rides/${id}/arriving`,

  startRide: (id) => `${API_URL}/rides/${id}/start`,

  completeRide: (id) => `${API_URL}/rides/${id}/complete`,
};
