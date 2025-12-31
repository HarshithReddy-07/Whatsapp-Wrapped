import sys
sys.path.insert(0, '.')
from main import WhatsAppAnalyzer

with open(r'D:\Whatsapp-Analytics\Whatsapp Wrapped\WhatsApp Chat with Ugadi Pachadi 🤟✌️☝️.txt', 'r', encoding='utf-8') as f:
    chat_text = f.read()

analyzer = WhatsAppAnalyzer(chat_text)
analytics = analyzer.get_analytics()

print(f'✓ Parsed messages: {len(analyzer.messages)}')
print(f'✓ Total users: {analytics["total_users"]}')
print(f'✓ Top 5 users:')
for user, count in list(analytics['messages_per_user'].items())[:5]:
    print(f'  {user}: {count}')
print(f'✓ Mentions received: {len(analytics["mentions"]["mentions_received"])}')
if analytics["mentions"]["mentions_received"]:
    print(f'  Top mentions:')
    for user, count in list(analytics["mentions"]["mentions_received"].items())[:3]:
        print(f'    @{user}: {count}')
print(f'✓ Media messages: {len(analytics["media_stats"])}')
if analytics["media_stats"]:
    print(f'  Top users with media:')
    for user, count in list(analytics["media_stats"].items())[:3]:
        print(f'    {user}: {count}')
