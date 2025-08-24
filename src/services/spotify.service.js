const axios = require('axios');
const querystring = require('querystring');
const { generateRandomString } = require('../utils/random');
const { spotify: spotifyConfig } = require('../config');

class SpotifyService {

  getAuthorizationUrl() {
    const state = generateRandomString(16);
    const queryParams = querystring.stringify({
      client_id: spotifyConfig.clientId,
      response_type: 'code',
      redirect_uri: spotifyConfig.redirectUri,
      state: state,
      scope: spotifyConfig.scopes
    });

    return `${spotifyConfig.authUrl}?${queryParams}`;
  }

  // Get tokens from session
  getTokens(req) {
    return {
      accessToken: req.session.spotifyAccessToken,
      refreshToken: req.session.spotifyRefreshToken,
      tokenExpiry: req.session.spotifyTokenExpiry
    };
  }

  // Set tokens in session
  setTokens(req, { accessToken, refreshToken, expiresIn }) {
    req.session.spotifyAccessToken = accessToken;
    if (refreshToken) {
      req.session.spotifyRefreshToken = refreshToken;
    }
    if (expiresIn) {
      req.session.spotifyTokenExpiry = Date.now() + (expiresIn * 1000);
    }
  }

  // Check if token is expired
  isTokenExpired(req) {
    const { tokenExpiry } = this.getTokens(req);
    return !tokenExpiry || Date.now() > tokenExpiry;
  }

  async getAccessToken(code, req) {
    try {
      const response = await axios({
        method: 'post',
        url: spotifyConfig.tokenUrl,
        data: querystring.stringify({
          code,
          redirect_uri: spotifyConfig.redirectUri,
          grant_type: 'authorization_code',
        }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`).toString('base64'),
        },
      });

      const { access_token, refresh_token, expires_in } = response.data;
      this.setTokens(req, {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in
      });
      
      return { accessToken: access_token, refreshToken: refresh_token, expiresIn: expires_in };
    } catch (error) {
      console.error('Error getting access token:', error.response?.data || error.message);
      throw error;
    }
  }

  async refreshAccessToken(req) {
    const { refreshToken } = this.getTokens(req);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios({
        method: 'post',
        url: spotifyConfig.tokenUrl,
        data: querystring.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`).toString('base64'),
        },
      });

      const { access_token, expires_in, refresh_token } = response.data;
      this.setTokens(req, {
        accessToken: access_token,
        refreshToken: refresh_token, // Spotify may return a new refresh token
        expiresIn: expires_in
      });
      
      return { accessToken: access_token, expiresIn: expires_in };
    } catch (error) {
      console.error('Error refreshing access token:', error.response?.data || error.message);
      // Clear invalid tokens on error
      this.setTokens(req, { accessToken: null, refreshToken: null, expiresIn: 0 });
      throw error;
    }
  }

  async makeRequest(endpoint, method = 'get', data = null, req) {
    if (!req) {
      throw new Error('Request object is required for SpotifyService methods');
    }

    try {
      if (this.isTokenExpired(req)) {
        await this.refreshAccessToken(req);
      }

      const { accessToken } = this.getTokens(req);
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await axios({
        method,
        url: `${spotifyConfig.apiBaseUrl}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        data,
      });

      return response.data;
    } catch (error) {
      console.error('Spotify API request failed:', error.response?.data || error.message);
      throw error;
    }
  }

  // Player methods
  getCurrentlyPlaying(req) {
    if (!req) throw new Error('Request object is required');
    return this.makeRequest('/me/player/currently-playing', 'get', null, req);
  }

  pausePlayback(req) {
    if (!req) throw new Error('Request object is required');
    return this.makeRequest('/me/player/pause', 'put', null, req);
  }

  startPlayback(trackUri = null, req) {
    if (!req) throw new Error('Request object is required');
    const data = trackUri ? { uris: [trackUri] } : undefined;
    return this.makeRequest('/me/player/play', 'put', data, req);
  }

  // Library methods
  getTopTracks(limit = 10, timeRange = 'short_term', req) {
    if (!req) throw new Error('Request object is required');
    return this.makeRequest(
      `/me/top/tracks?limit=${limit}&time_range=${timeRange}`,
      'get',
      null,
      req
    );
  }

  getFollowedArtists(limit = 20, req) {
    if (!req) throw new Error('Request object is required');
    return this.makeRequest(
      `/me/following?type=artist&limit=${limit}`,
      'get',
      null,
      req
    );
  }
}


module.exports = new SpotifyService();
