const express = require('express');
const router = express.Router();
const spotifyService = require('../services/spotify.service');
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const {pausePlayback, startPlayback} = require('../controllers/player.controller');
// Authentication routes
router.get('/login', authController.login);
router.get('/callback', authController.callback);

// Apply auth middleware to all routes except login and callback
router.use((req, res, next) => {
  if (req.path === '/login' || req.path === '/callback') {
    return next();
  }
  requireAuth(req, res, next);
});

// Main endpoint with all required data
router.get('/', async (req, res) => {
  try {
    // Get all required data in parallel
    const [nowPlaying, topTracks, followedArtists] = await Promise.all([
      spotifyService.getCurrentlyPlaying(),
      spotifyService.getTopTracks(10, 'short_term'),
      spotifyService.getFollowedArtists(10)
    ]);

    // Format the response with minimal data
    const response = {
      now_playing: nowPlaying?.item ? {
        name: nowPlaying.item.name,
        pause: '/spotify/pause',
        play: '/spotify/play'
      } : "not playing",
      
      top_tracks: (topTracks.items || []).map(track => ({
        name: track.name,
        play: `/spotify/play/${track.id}`
      })),
      
      followed_artists: (followedArtists.artists?.items || []).map(artist => ({
        name: artist.name
      }))
    };

    res.json(response);
  } catch (error) {
    console.error('Error in /spotify endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Spotify data',
      details: error.message 
    });
  }
});
router.get('/pause', pausePlayback);
router.get('/play', startPlayback);
router.get('/play/:trackId', startPlayback);

module.exports = router;
