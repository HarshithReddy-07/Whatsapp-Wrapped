# WhatsApp Wrapped - Development Setup

## Prerequisites
- Python 3.8+
- Node.js 14+ and npm
- Git

## Installation Steps

### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
venv\Scripts\activate  # or source venv/bin/activate on macOS/Linux
python main.py
```

Backend runs on: `http://localhost:8000`

### Terminal 2 - Frontend
```bash
cd frontend
npm install
# If using a tunnel or accessing from mobile, set the backend URL explicitly:
# REACT_APP_API_URL=https://<your-backend-tunnel> npm start
npm start
```

Frontend runs on: `http://localhost:3000` (by default)

**Notes for mobile / remote access:**
- Do NOT rely on `http://localhost:8000` when accessing the app from a mobile device — `localhost` will refer to the mobile device.
- If you expose the frontend via a tunnel, set `REACT_APP_API_URL` to your backend tunnel URL (e.g. `https://backend-123.tunnel.example`) so API requests route correctly.
- The app performs a quick `/api/health` check before attempting uploads and will show a helpful error if the backend is unreachable or blocked by mixed content (HTTP vs HTTPS).

## API Documentation

Once the backend is running, visit: `http://localhost:8000/docs`

This provides an interactive API documentation using Swagger UI.

## Project Features

### Backend (`/backend`)
- **FastAPI** REST API
- WhatsApp chat file parsing
- Analytics calculation:
  - Message count per user
  - Mention statistics
  - Media message tracking
  - Social media link detection
- CORS enabled for frontend integration

### Frontend (`/frontend`)
- **React 18** application
- Beautiful UI with gradient design
- File upload with drag-and-drop support
- Multiple analytics views:
  - Messages dashboard
  - Media statistics
  - Mentions analysis
  - Social media links
- Interactive charts using Recharts
- Responsive design for mobile/tablet

## Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed
- Check virtual environment is activated
- Install requirements: `pip install -r requirements.txt`

### Frontend won't start
- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`

### CORS errors
- Ensure backend is running on port 8000
- Check frontend is trying to connect to correct URL

## Development Notes

- Backend hot-reload is enabled in FastAPI
- Frontend uses React hot module replacement
- All analytics are computed server-side
- No data is persisted or stored

## Building for Production

### Backend
```bash
pip install gunicorn
gunicorn main:app --workers 4
```

### Frontend
```bash
npm run build
```

## Support

For detailed documentation, see [README.md](./README.md)
