# Specification

## Summary
**Goal:** Add mock data and search functionality to Store and FiTube sections to enable standalone operation without external API dependencies.

**Planned changes:**
- Replace external API calls in Store page with local mock data containing realistic sports products across gym equipment, running gear, apparel, and supplements categories (12-16 products)
- Add search input field to Store page with real-time filtering by product name/description, including 300ms debounce
- Replace external API calls in FiTube page with local mock data containing realistic fitness videos across workout tutorials, running tips, nutrition advice, and sports performance categories (12-16 videos)
- Update useGetExternalSportsProducts and useGetExternalFitnessVideos hooks to return mock data synchronously instead of making API calls

**User-visible outcome:** Users can browse a populated Store with searchable sports products and view a populated FiTube section with fitness videos, all working without external API configuration.
