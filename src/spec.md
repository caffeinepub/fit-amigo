# Specification

## Summary
**Goal:** Integrate external APIs to automatically populate sports products in the Store and fitness videos in FiTube.

**Planned changes:**
- Add backend method to fetch external sports products (gym equipment, running gear, sports apparel, supplements) from configurable API endpoint with category filtering
- Create React Query hook to fetch external sports products from backend
- Update Store page to display external sports products with photos, prices, and links to external product URLs, including category filtering
- Add backend method to fetch sports and fitness videos from external video API endpoint
- Create React Query hook to fetch external fitness videos from backend
- Update FiTube page to display external sports and fitness videos in grid layout with thumbnails, titles, uploader names, and view counts
- Add configuration instructions and environment variables for both APIs (VITE_SPORTS_PRODUCTS_API_URL, VITE_SPORTS_PRODUCTS_API_KEY, VITE_FITNESS_VIDEOS_API_URL, VITE_FITNESS_VIDEOS_API_KEY) to README.md and .env.example

**User-visible outcome:** Users can browse external sports products in the Store with category filters and click through to purchase from external vendors. Users can watch sports and fitness videos from external sources on the FiTube page.
