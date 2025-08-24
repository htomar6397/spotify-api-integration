const spotifyService = require('../services/spotify.service');

const login = (req, res) => {
    try {
        const authUrl = spotifyService.getAuthorizationUrl();
        res.redirect(authUrl);
    } catch (error) {
        console.error('Error in login:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to initiate Spotify login' });
    }
};

const callback = async (req, res) => {
    const { code, state } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code is required' });
    }

    try {
        // Pass the request object to store tokens in the session
        await spotifyService.getAccessToken(code, req);
        
        // Get the redirect URL from session or default to /spotify
        const redirectTo = req.session.returnTo || '/spotify';
        
        // Clear the stored URL
        delete req.session.returnTo;
        
        // Redirect to the original URL or home
        res.redirect(redirectTo);
    } catch (error) {
        console.error('Error in Spotify callback:', error.response?.data || error.message);
        // Clear any partial session data on error
        if (req.session) {
            req.session.spotifyAccessToken = null;
            req.session.spotifyRefreshToken = null;
            req.session.spotifyTokenExpiry = null;
        }
        res.status(500).render('error', { 
            error: 'Failed to authenticate with Spotify',
            details: error.response?.data?.error_description || error.message
        });
    }
}

module.exports = {login,callback};
