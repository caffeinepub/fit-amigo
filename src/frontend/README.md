# FIT AMIGO - Fitness Platform

A comprehensive fitness platform built on the Internet Computer with e-commerce, workout tracking, and social features.

## Features

- **E-Commerce Store**: Browse and purchase fitness equipment and supplements
- **Hybrid Product Catalog**: View both internal products and external products from Go Store API
- **Workout Tracker**: Log and track your exercise sessions
- **Admin Dashboard**: Manage product inventory (admin users only)
- **Internet Identity**: Secure authentication using Internet Identity

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

#### Example Values

