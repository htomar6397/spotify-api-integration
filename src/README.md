# Spotify API Integration (Modularized)

This is the modularized version of the Spotify API integration for your portfolio website.

## Project Structure

```
src/
├── config/               # Configuration files
│   └── index.js         # Environment variables and constants
├── controllers/         # Request handlers
│   ├── auth.controller.js    # Authentication related handlers
│   ├── player.controller.js  # Player related handlers
│   └── library.controller.js # Library related handlers
├── middleware/          # Custom middleware
├── routes/              # Route definitions
│   └── index.js         # API routes
├── services/            # Business logic
│   └── spotify.service.js  # Spotify API service
├── utils/               # Utility functions
│   └── random.js       # Random string generator
├── server.js            # Main application entry point
└── package.json         # Project dependencies and scripts
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd src
   npm install express cors axios dotenv
   ```

2. **Environment Variables**
   Create a `.env` file in the `src` directory with the following variables:
   ```
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SPOTIFY_REDIRECT_URI=http://your-domain.com/spotify/callback
   PORT=3000
   ```

3. **Run the Application**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

- `GET /spotify/login` - Initiate Spotify OAuth flow
- `GET /spotify/callback` - OAuth callback URL
- `GET /spotify/player/now-playing` - Get currently playing track
- `PUT /spotify/player/pause` - Pause playback
- `PUT /spotify/player/play` - Start/resume playback (optionally with track URI)
- `GET /spotify/top-tracks` - Get user's top tracks
- `GET /spotify/followed-artists` - Get user's followed artists
- `GET /spotify` - Combined endpoint with all data

## Deployment

1. **Build Process**
   - No build step is required for this Node.js application
   - Ensure all dependencies are installed in the production environment

2. **Environment Variables**
   - Set up the same environment variables in your production environment
   - For security, never commit your `.env` file to version control

3. **Process Manager**
   Use a process manager like PM2 to keep the application running:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name "spotify-api"
   pm2 save
   pm2 startup
   ```

## Security Considerations

1. **HTTPS**
   - Always use HTTPS in production
   - Set up SSL certificates (e.g., using Let's Encrypt)

2. **Rate Limiting**
   - Consider implementing rate limiting to prevent abuse
   - Example using `express-rate-limit`:
     ```javascript
     const rateLimit = require('express-rate-limit');
     
     const apiLimiter = rateLimit({
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 100 // limit each IP to 100 requests per windowMs
     });
     
     app.use('/spotify', apiLimiter);
     ```

3. **CORS**
   - Configure CORS to only allow requests from your portfolio domain
   - Example:
     ```javascript
     const corsOptions = {
       origin: 'https://your-portfolio-domain.com',
       optionsSuccessStatus: 200
     };
     app.use(cors(corsOptions));
     ```

## Testing

To test the API endpoints, you can use tools like:

1. **cURL**
   ```bash
   # Get top tracks
   curl http://localhost:3000/spotify/top-tracks
   
   # Pause playback
   curl -X PUT http://localhost:3000/spotify/player/pause
   ```

2. **Postman**
   - Import the Postman collection from `postman/` directory
   - Update environment variables in Postman

## Troubleshooting

1. **Authentication Errors**
   - Verify your Spotify client ID and secret
   - Ensure the redirect URI matches exactly with the one registered in the Spotify Developer Dashboard

2. **CORS Issues**
   - Check that the correct origin is allowed
   - Verify that the client is making requests to the correct URL

3. **Rate Limiting**
   - If you encounter rate limiting, implement proper error handling and retry logic

## License

MIT
