# Specification

## Summary
**Goal:** Add a Food Tracker feature that allows users to manually search for foods, log meals with nutritional information, and view their daily macro breakdown.

**Planned changes:**
- Create a Food Tracker page at /food route displaying a food diary with logged foods and their nutritional breakdown (calories, protein, carbs, fat)
- Create an Add Food page with search interface for finding foods by name and logging them with serving sizes
- Implement backend methods to store and retrieve food entries with nutritional data and timestamps
- Integrate Nutritionix API for food search and nutritional data retrieval
- Create React Query hooks for food search, logging, and diary retrieval operations
- Add Food Tracker navigation link to the main Navigation component

**User-visible outcome:** Users can search for foods by name, log meals with serving sizes, and view their daily food diary with complete macro tracking (calories, protein, carbs, fat) alongside existing FIT AMIGO features.
