# WhatsApp Wrapped Analytics

A full-stack web application that analyzes exported WhatsApp group chats and generates beautiful insights.

## Features

✨ **Analytics Dashboard**
- 📊 Messages per user analysis
- 📸 Media message tracking
- @ Mention statistics (received & given)
- 🔗 Social media links detection

## Project Structure

```
├── backend/               # FastAPI backend server
│   ├── main.py           # API endpoints and analytics engine
│   └── requirements.txt   # Python dependencies
│
└── frontend/             # React frontend application
    ├── public/           # Static assets
    ├── src/
    │   ├── components/   # React components
    │   ├── styles/       # CSS styles
    │   ├── App.js        # Main app component
    │   └── index.js      # Entry point
    └── package.json      # npm dependencies
```

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## How to Use

1. Export your WhatsApp group chat:
   - Open WhatsApp → Group chat → Menu (⋮) → More → Export chat
   - Choose "Without Media"
   - Save the .txt file

2. Upload the chat file to the web application

3. View your WhatsApp Wrapped analytics:
   - 💬 Messages Per User - See who's the most active
   - 📸 Media - Track media sharing habits
   - @ Mentions - Find out who's most mentioned
   - 🔗 Links - See social media profiles shared

## Technologies Used

**Backend:**
- FastAPI - Modern Python web framework
- Python regex - Chat message parsing
- CORS - Cross-origin resource sharing

**Frontend:**
- React 18 - UI library
- Recharts - Data visualization
- Axios - HTTP client
- CSS3 - Styling with gradients and animations

## API Endpoints

### POST `/api/upload`
Upload a WhatsApp chat export file and receive analytics.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (text file)

**Response:**
```json
{
  "success": true,
  "data": {
    "total_messages": 1250,
    "total_users": 8,
    "messages_per_user": {...},
    "mentions": {...},
    "media_stats": {...},
    "social_media_links": {...}
  }
}
```

### GET `/api/health`
Health check endpoint.

## Supported Social Media Platforms

The app detects links for:
- Instagram
- Twitter/X
- Facebook
- TikTok
- YouTube
- Telegram
- LinkedIn
- GitHub

## Notes

- Maximum file size: Depends on your server configuration
- The app only requires message text, no media files needed
- All analysis is done locally, no data is stored
- Works with WhatsApp exports from both Android and iOS

## Future Enhancements

- [ ] Time-based analytics (messages by hour/day)
- [ ] Emoji usage statistics
- [ ] Word frequency analysis
- [ ] Conversation threads analysis
- [ ] Export analytics as PDF/Image
- [ ] Compare multiple chats

## License

MIT License

## Support

For issues or feature requests, please create an issue in the repository.
