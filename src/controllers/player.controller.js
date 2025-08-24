const spotifyService = require('../services/spotify.service');

const getCurrentlyPlaying = async (req, res) => {
    try {
        const nowPlaying = await spotifyService.getCurrentlyPlaying(req);
        res.json(nowPlaying);
    } catch (error) {
        const errorMessage = error.response?.data?.error?.reason || error.message;
        console.error('Error getting currently playing track:', errorMessage);
        res.status(500).json({ 
            error: 'Error getting currently playing track',
            details: errorMessage 
        });
    }
};

const pausePlayback = async (req, res) => {
    try {
        await spotifyService.pausePlayback(req);
        res.json({ success: true, message: 'Playback paused' });
    } catch (error) {
        const errorMessage = error.response?.data?.error?.reason || error.message;
        console.error('Error pausing playback:', errorMessage);
        res.status(500).json({ 
            error: 'Error pausing playback',
            details: errorMessage 
        });
    }
};

const startPlayback = async (req, res) => {
    try {
        const { track_uri } = req.body; 
        await spotifyService.startPlayback(track_uri, req);
        res.json({ 
            success: true, 
            message: track_uri ? 'Track playback started' : 'Playback resumed' 
        });
    } catch (error) {
        const errorMessage = error.response?.data?.error?.reason || error.message;
        console.error('Error starting playback:', errorMessage);
        res.status(500).json({ 
            error: 'Error starting playback',
            details: errorMessage 
        });
    }
};


module.exports = {getCurrentlyPlaying,pausePlayback,startPlayback};
