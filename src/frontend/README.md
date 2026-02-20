# FIT AMIGO - Fitness Platform

A comprehensive fitness platform built on the Internet Computer with e-commerce, workout tracking, and social features.

## Features

- **E-Commerce Store**: Browse and purchase fitness equipment and supplements
- **Hybrid Product Catalog**: View both internal products and external products from multiple APIs
- **Workout Tracker**: Log and track your exercise sessions
- **FiTube**: Watch and share fitness videos from internal uploads and external sources
- **Admin Dashboard**: Manage product inventory (admin users only)
- **Internet Identity**: Secure authentication using Internet Identity
- **Global Search**: Search across all FIT AMIGO content and external fitness resources

## External API Configuration

### Go Store API Integration

The platform integrates with the Go Store API to display external products alongside internal inventory. To enable this feature, you need to configure the following environment variables:

#### Required Environment Variables

1. **GO_STORE_API_URL**: The endpoint URL for the Go Store API
2. **GO_STORE_API_KEY**: Your API credentials for authentication

#### Setup Instructions

1. Create a `.env` file in the `frontend` directory (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your Go Store API credentials:
   ```env
   VITE_GO_STORE_API_URL=https://gostore.icp0.io/api/products
   VITE_GO_STORE_API_KEY=your_actual_api_key_here
   ```

3. Restart the development server for changes to take effect:
   ```bash
   npm run start
   ```

### External Fitness Search API Configuration

The platform integrates with a fitness-specific search API to provide external web search results alongside internal FIT AMIGO content. This feature enhances the search experience by including fitness news, workout databases, and nutrition information from trusted external sources.

#### Required Environment Variables

1. **VITE_FITNESS_SEARCH_API_URL**: The endpoint URL for the fitness search API
2. **VITE_FITNESS_SEARCH_API_KEY**: Your API credentials for authentication

#### Setup Instructions

1. Edit the `.env` file in the `frontend` directory and add your fitness search API credentials:
   ```env
   VITE_FITNESS_SEARCH_API_URL=https://api.fitness-search-provider.com/search
   VITE_FITNESS_SEARCH_API_KEY=your-api-key-here
   ```

2. Restart the development server for changes to take effect:
   ```bash
   npm run start
   ```

#### Notes

- These environment variables are **optional**. If not configured, the search feature will still work but will only display internal FIT AMIGO content.
- External search results are clearly distinguished from internal results with visual indicators and badges.
- All external links open in new tabs for user convenience.
- The feature gracefully degrades if the API is unavailable or not configured.

### Sports Products API Configuration

The Store section integrates with an external sports products API to display a wide range of sports equipment, running gear, sports apparel, and supplements alongside internal inventory.

#### Required Environment Variables

1. **VITE_SPORTS_PRODUCTS_API_URL**: The endpoint URL for the sports products API
2. **VITE_SPORTS_PRODUCTS_API_KEY**: Your API credentials for authentication

#### Setup Instructions

1. Edit the `.env` file in the `frontend` directory and add your sports products API credentials:
   ```env
   VITE_SPORTS_PRODUCTS_API_URL=https://workoutpuppy.com/api/marketplace
   VITE_SPORTS_PRODUCTS_API_KEY=your-api-key-here
   ```

2. Restart the development server for changes to take effect:
   ```bash
   npm run start
   ```

#### Features

- **Category Filtering**: Filter products by gym equipment, running gear, sports apparel, and supplements
- **Search Integration**: Search terms are passed to the external API for relevant results
- **Visual Distinction**: External products are clearly marked with badges and distinct styling
- **Direct Links**: Each external product includes a link to view the full product on the external site

#### Notes

- This integration is **optional**. If not configured, the Store will only display internal products.
- External products open in new tabs when clicked.
- The feature gracefully handles API failures and continues to display internal products.

### Fitness Videos API Configuration

The FiTube section integrates with an external fitness videos API to automatically fetch and display sports and fitness videos from external sources alongside user-uploaded content.

#### Required Environment Variables

1. **VITE_FITNESS_VIDEOS_API_URL**: The endpoint URL for the fitness videos API
2. **VITE_FITNESS_VIDEOS_API_KEY**: Your API credentials for authentication

#### Setup Instructions

1. Edit the `.env` file in the `frontend` directory and add your fitness videos API credentials:
   ```env
   VITE_FITNESS_VIDEOS_API_URL=https://workoutpuppy.com/api/youtube
   VITE_FITNESS_VIDEOS_API_KEY=your-api-key-here
   ```

2. Restart the development server for changes to take effect:
   ```bash
   npm run start
   ```

#### Features

- **Automatic Content**: External fitness and sports videos are automatically fetched and displayed
- **Visual Distinction**: External videos are clearly marked with "External" badges
- **Unified Experience**: External videos appear alongside user-uploaded content in the same grid
- **Direct Playback**: Clicking external videos opens them in a new tab for viewing

#### Notes

- This integration is **optional**. If not configured, FiTube will only display user-uploaded videos.
- External videos include metadata such as title, uploader, view count, and duration.
- The feature gracefully handles API failures and continues to display internal videos.

## Development
