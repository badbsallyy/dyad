# Dyad Web Application

This is the web version of Dyad, converted from the Electron desktop application to run in the browser.

## Architecture

The web version consists of two main components:

### Backend Server (`/server`)
- Express.js HTTP server
- WebSocket server for real-time streaming
- REST API endpoints replacing Electron IPC handlers
- SQLite database (same as desktop version)
- File system operations handled server-side

### Frontend (`/src`)
- React application (same UI as desktop version)
- Uses `WebIpcClient` instead of Electron IPC
- Communicates with backend via HTTP REST and WebSocket

## Development

### Prerequisites
- Node.js >= 20
- npm

### Install Dependencies
```bash
npm install
```

### Run in Development Mode
```bash
npm run web:dev
```

This starts:
- Backend server on `http://localhost:3000`
- Frontend dev server on `http://localhost:5173`

The frontend proxies API and WebSocket requests to the backend.

### Build for Production
```bash
npm run web:build
```

This creates:
- `dist/` - Frontend static files
- `dist-server/` - Compiled backend server

### Run Production Build
```bash
npm run web:start
```

This starts the production server on `http://localhost:3000`, serving both the API and static frontend files.

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=production
DATABASE_PATH=./userData/dyad.db
```

## Key Differences from Desktop Version

1. **No Electron**: All Electron-specific features removed
2. **Backend Server**: File operations, Git, database access handled server-side
3. **Authentication**: Web version would need proper auth (not implemented in basic version)
4. **File Access**: Limited to server-side operations, no direct file system access from browser
5. **Auto-updates**: Handled via web deployment instead of Electron auto-updater
6. **Deep Links**: Handled via URL routing instead of custom protocol

## API Endpoints

### Settings
- `GET /api/settings` - Get user settings
- `PATCH /api/settings` - Update user settings

### Apps
- `GET /api/apps` - List all apps
- `GET /api/apps/:appId` - Get specific app
- `POST /api/apps` - Create new app
- `DELETE /api/apps/:appId` - Delete app

### Chats
- `GET /api/chats` - List all chats
- `GET /api/chats/:chatId` - Get specific chat
- `POST /api/chats` - Create new chat

### WebSocket Events
- `chat:stream` - Start chat streaming
- `chat:cancel` - Cancel ongoing chat
- `chat:response:chunk` - Receive chat response chunks
- `chat:response:end` - Chat response complete
- `chat:response:error` - Chat error occurred

## Deployment

The web version can be deployed to any Node.js hosting platform:

- **Vercel/Netlify**: Frontend only (requires separate backend)
- **Heroku/Railway**: Full-stack deployment
- **Docker**: Containerize both frontend and backend
- **VPS**: Traditional server deployment

## Limitations

The basic web conversion includes:
- Core UI and navigation
- Settings management
- Basic app/chat structure
- WebSocket streaming setup

Not yet fully implemented:
- All IPC handlers (would need individual conversion)
- File upload/download
- Git operations
- Database migrations
- Authentication/Authorization
- Multi-user support
- All desktop-specific features

## Contributing

To contribute to the web version, follow the same contribution guidelines as the desktop version.

## License

MIT License - Same as Dyad Desktop
