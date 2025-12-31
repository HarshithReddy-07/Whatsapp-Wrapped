import re

# Read first few lines
with open(r"D:\Whatsapp-Analytics\Whatsapp Wrapped\WhatsApp Chat with Ugadi Pachadi 🤟✌️☝️.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()[:15]

print("First 15 lines:")
for i, line in enumerate(lines, 1):
    print(f"{i}: {repr(line)}")

# Test pattern
print("\n\nTesting pattern on different lines:")

patterns_to_test = [
    # Original attempt
    r'(\d{1,2}/\d{1,2}/\d{2,4}),\s*(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)\s*-\s*([^:]+?):\s*(.+?)$',
    # Without anchors
    r'(\d{1,2}/\d{1,2}/\d{2,4}),\s*(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)\s*-\s*([^:]+?):\s*(.+)',
    # More flexible
    r'(\d{1,2}/\d{1,2}/\d{2}),\s*(\d{1,2}:\d{2}(?:\s*AM|\s*PM)?) - ([^:]+): (.*)',
]

for line_idx in [3, 4, 5]:
    test_line = lines[line_idx].rstrip('\n')
    print(f"\nTesting line {line_idx}: {repr(test_line[:60])}")
    
    for p_idx, pattern in enumerate(patterns_to_test):
        match = re.search(pattern, test_line)
        if match:
            print(f"  Pattern {p_idx}: MATCH - {match.groups()[:2]}")
            break
    else:
        print(f"  No pattern matched!")
