const spotifyService = require('../services/spotify.service');

const getTopTracks = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const timeRange = req.query.time_range || 'short_term';
        
        const topTracks = await spotifyService.getTopTracks(limit, timeRange, req);
        res.json(topTracks);
    } catch (error) {
        const errorMessage = error.response?.data?.error?.message || error.message;
        console.error('Error getting top tracks:', errorMessage);
        res.status(500).json({ 
            error: 'Failed to fetch top tracks',
            details: errorMessage 
        });
    }
};

const getFollowedArtists = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const followedArtists = await spotifyService.getFollowedArtists(limit, req);
        res.json(followedArtists);
    } catch (error) {
        const errorMessage = error.response?.data?.error?.message || error.message;
        console.error('Error getting followed artists:', errorMessage);
        res.status(500).json({ 
            error: 'Failed to fetch followed artists',
            details: errorMessage 
        });
    }
};

module.exports = {getTopTracks,getFollowedArtists};
