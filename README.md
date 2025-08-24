# Spotify API Integration

A Node.js Express API that integrates with Spotify Web API to provide music data and playback controls.

## Features

- Get top 10 tracks
- Show currently playing song
- List followed artists
- Stop current playback
- Play any of the top 10 songs

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Spotify App at https://developer.spotify.com/dashboard

3. Set up environment variables in `.env`:

   ```
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
   ```

4. Run the application:
   ```bash
   npm start
   ```

## API Endpoints

- `GET /auth` - Start Spotify authentication
- `GET /callback` - Handle Spotify auth callback
- `GET /spotify/top-tracks` - Get top 10 tracks
- `GET /spotify/now-playing` - Get currently playing song
- `GET /spotify/following` - Get followed artists
- `POST /spotify/pause` - Stop current playback
- `POST /spotify/play` - Play a specific track

## Deployment

This API is designed to be deployed as part of your portfolio website at the `/spotify` route.

## Authentication

The application uses Spotify's Authorization Code Flow for secure API access.
