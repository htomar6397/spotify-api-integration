const spotifyService = require('../services/spotify.service');

const requireAuth = (req, res, next) => {
  // Skip auth for login and callback routes
  if (req.path === '/login' || req.path === '/callback') {
    return next();
  }

  const { refreshToken } = spotifyService.getTokens(req) || {};
  
  // If no refresh token, redirect to login
  if (!refreshToken) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/spotify/login');
  }
  
  // If token is expired, try to refresh it
  if (spotifyService.isTokenExpired(req)) {
    return spotifyService.refreshAccessToken(req)
      .then(() => next())
      .catch((error) => {
        console.error('Error refreshing token:', error);
        req.session.returnTo = req.originalUrl;
        return res.redirect('/spotify/login');
      });
  }
  
  // Token is valid, continue
  next();
};

module.exports = { requireAuth };
