// Configuration for external API integration
export const GO_STORE_API_URL = import.meta.env.VITE_GO_STORE_API_URL;
export const GO_STORE_API_KEY = import.meta.env.VITE_GO_STORE_API_KEY;

export const SPORTS_PRODUCTS_API_URL = import.meta.env.VITE_SPORTS_PRODUCTS_API_URL;
export const SPORTS_PRODUCTS_API_KEY = import.meta.env.VITE_SPORTS_PRODUCTS_API_KEY;

export const FITNESS_VIDEOS_API_URL = import.meta.env.VITE_FITNESS_VIDEOS_API_URL;
export const FITNESS_VIDEOS_API_KEY = import.meta.env.VITE_FITNESS_VIDEOS_API_KEY;

export const isGoStoreConfigured = (): boolean => {
  return !!GO_STORE_API_URL;
};

export const isSportsProductsConfigured = (): boolean => {
  return !!SPORTS_PRODUCTS_API_URL;
};

export const isFitnessVideosConfigured = (): boolean => {
  return !!FITNESS_VIDEOS_API_URL;
};
