# Zendesk Analysis Tools

Simple browser scripts for analyzing Zendesk tickets and side conversations.

## 📁 Project Structure

```
zendesk-analysis-tools/
├── README.md                           # This file
├── package.json                        # Project configuration
├── .gitignore                         # Git ignore rules
├── ticket-ids.json                    # Configure your ticket IDs here
└── scripts/
    └── browser/                       # Browser scripts
        ├── zendesk_tickets_simple_browser.js      # Fetch ticket details & comments
        └── zendesk_side_conversations_simple_browser.js  # Fetch side conversations
```

## 🚀 Quick Start

### Prerequisites
- Be logged into Zendesk in your browser
- Have a list of ticket IDs to analyze

### Setup
1. Edit `ticket-ids.json` and add your ticket IDs to the array
2. Make sure the JSON file is in the same directory as the scripts

### Usage
1. Open Zendesk in your browser
2. Open browser console (F12)
3. Copy and paste one of the scripts
4. Run the script (it will automatically load ticket IDs from the JSON file)

## 📋 Available Tools

### Browser Scripts
- **`zendesk_tickets_simple_browser.js`** - Fetch ticket details and comments
- **`zendesk_side_conversations_simple_browser.js`** - Fetch side conversations and Slack channels

## 📊 Output

Both scripts will:
- ✅ Show progress in the console
- ✅ Display summary statistics
- ✅ Automatically download a CSV file
- ✅ Show full results in the console

## 🔧 How It Works

These scripts use your existing browser session to authenticate with Zendesk, so you don't need to provide any API credentials. Just make sure you're logged into Zendesk first!

## 📖 Features

### Ticket Details Script
- Fetches ticket subject, description, status, priority
- Gets all comments with author and timestamps
- Provides summary statistics
- Downloads CSV with all data

### Side Conversations Script
- Counts side conversations per ticket
- Identifies Slack channels from participants
- Lists all side conversation details
- Provides summary statistics
- Downloads CSV with all data

## 🤝 Contributing

Feel free to modify these scripts for your specific needs!
