// Configuration for external API integration
export const GO_STORE_API_URL = import.meta.env.VITE_GO_STORE_API_URL;
export const GO_STORE_API_KEY = import.meta.env.VITE_GO_STORE_API_KEY;

export const isGoStoreConfigured = (): boolean => {
  return !!GO_STORE_API_URL;
};
