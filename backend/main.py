from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import re
from datetime import datetime
from collections import Counter, defaultdict
from typing import Dict, List
import io

app = FastAPI(title="WhatsApp Wrapped Analytics")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class WhatsAppAnalyzer:
    """Parse and analyze WhatsApp exported chat files"""
    
    def __init__(self, chat_text: str):
        self.chat_text = chat_text
        self.messages = []
        self.parse_messages()
    
    def parse_messages(self):
        """Parse WhatsApp chat format"""
        # WhatsApp message format: M/D/YY, H:MM<nbsp>AM/PM - Username: Message
        # Properly handle multiline messages and system messages
        
        lines = self.chat_text.split('\n')
        
        system_keywords = [
            'added', 'left', 'created', 'changed', 'Messages and calls are encrypted',
            'You were added', 'This message was deleted', 'end-to-end encrypted',
            'group name from', 'removed', 'Malli typing', 'This message was edited',
            'is now admin', 'is no longer admin', 'You were removed', 'You are no longer admin',
            'restricted changes to admin', 'messages and calls are encrypted', 'pinned a message',
            'turned on admin approval', 'changed this group', "changed this group's icon"
        ]
        
        current_msg = None
        
        for line in lines:
            # Check if line starts with timestamp pattern
            timestamp_match = re.match(r'(\d{1,2}/\d{1,2}/\d{2,4}),\s*(\d{1,2}:\d{2}[\s\u202f]*(?:AM|PM|am|pm)?)\s*-\s*([^:]+?):\s*(.+)', line)
            
            if timestamp_match:
                # Save previous message if valid
                if current_msg and not self._is_system_message(current_msg['message'], system_keywords):
                    self.messages.append(current_msg)
                
                # Start new message
                sender = timestamp_match.group(3).strip()
                message = timestamp_match.group(4).strip()
                current_msg = {
                    'sender': sender,
                    'message': message,
                    'timestamp': f"{timestamp_match.group(1)}, {timestamp_match.group(2)}"
                }
            elif current_msg and line.strip():
                # Continuation of previous message (multiline)
                current_msg['message'] += ' ' + line.strip()
        
        # Don't forget last message
        if current_msg and not self._is_system_message(current_msg['message'], system_keywords):
            self.messages.append(current_msg)
    
    def _is_system_message(self, message: str, keywords: list) -> bool:
        """Check if message is a system message"""
        message_lower = message.lower()
        return any(keyword.lower() in message_lower for keyword in keywords)
    
    def get_message_stats(self) -> Dict:
        """Get message count per user"""
        counter = Counter(msg['sender'] for msg in self.messages)
        return dict(sorted(counter.items(), key=lambda x: x[1], reverse=True))
    
    def get_mentions(self) -> Dict:
        """Get mentions per user (format: @⁨username⁩ or @username)"""
        mentions_received = defaultdict(int)
        mentions_given = defaultdict(int)
        
        for msg in self.messages:
            # Find all mentions - handle both @⁨username⁩ (unicode) and @username formats
            # Unicode mention format: @⁨Username⁩
            unicode_mentions = re.findall(r'@⁨([^⁩]+)⁩', msg['message'])
            # Regular mention format: @username
            regular_mentions = re.findall(r'@(\w+)', msg['message'])
            
            all_mentions = unicode_mentions + regular_mentions
            
            for mention in all_mentions:
                mention = mention.strip()
                if mention:
                    mentions_received[mention] += 1
                    mentions_given[msg['sender']] += 1
        
        return {
            'mentions_received': dict(sorted(mentions_received.items(), key=lambda x: x[1], reverse=True)),
            'mentions_given': dict(sorted(mentions_given.items(), key=lambda x: x[1], reverse=True))
        }
    
    def get_media_stats(self) -> Dict:
        """Count media messages per user"""
        media_keywords = ['<image omitted>', '<media omitted>', '<video omitted>', '<audio omitted>', '.jpg', '.png', '.mp4', '.mp3']
        media_count = defaultdict(int)
        
        for msg in self.messages:
            if any(keyword.lower() in msg['message'].lower() for keyword in media_keywords):
                media_count[msg['sender']] += 1
        
        return dict(sorted(media_count.items(), key=lambda x: x[1], reverse=True))
    
    def get_social_media_links(self) -> Dict:
        """Extract social media links per user"""
        social_patterns = {
            'instagram': r'instagram\.com/\w+|@\w+\.instagram',
            'twitter': r'twitter\.com/\w+|x\.com/\w+',
            'facebook': r'facebook\.com/\w+',
            'tiktok': r'tiktok\.com/@\w+',
            'youtube': r'youtube\.com/@\w+|youtu\.be/\w+',
            'telegram': r't\.me/\w+',
            'linkedin': r'linkedin\.com/in/\w+',
            'github': r'github\.com/\w+'
        }
        
        user_links = defaultdict(lambda: defaultdict(int))
        
        for msg in self.messages:
            for platform, pattern in social_patterns.items():
                if re.search(pattern, msg['message'], re.IGNORECASE):
                    user_links[msg['sender']][platform] += 1
        
        return {user: dict(links) for user, links in sorted(user_links.items())}
    
    def get_analytics(self) -> Dict:
        """Get complete analytics"""
        return {
            'total_messages': len(self.messages),
            'total_users': len(set(msg['sender'] for msg in self.messages)),
            'messages_per_user': self.get_message_stats(),
            'mentions': self.get_mentions(),
            'media_stats': self.get_media_stats(),
            'social_media_links': self.get_social_media_links(),
            'users': sorted(set(msg['sender'] for msg in self.messages))
        }


@app.post("/api/upload")
async def upload_chat(file: UploadFile = File(...)):
    """Upload and analyze WhatsApp chat export"""
    try:
        # Read file content
        content = await file.read()
        text = content.decode('utf-8')
        
        # Analyze
        analyzer = WhatsAppAnalyzer(text)
        analytics = analyzer.get_analytics()
        # print(analytics)  # For debugging
        return JSONResponse({
            'success': True,
            'data': analytics
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/health")
async def health():
    """Health check endpoint"""
    return {'status': 'ok'}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
