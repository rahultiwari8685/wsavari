export const API_URL = "http://187.127.138.247:5008/api";

export const ENDPOINTS = {
  partnerSendOtp: `${API_URL}/partner/auth/send-otp`,
  partnerVerifyOtp: `${API_URL}/partner/auth/verify-otp`,
  partnerRegister: `${API_URL}/partner/auth/register`,
  partnerStatus: `${API_URL}/partner/status`,

  availableRides: `${API_URL}/ride/available`,
  acceptRide: (id) => `${API_URL}/ride/${id}/accept`,
  startRide: (id) => `${API_URL}/ride/${id}/start`,
  completeRide: (id) => `${API_URL}/ride/${id}/complete`,
};
