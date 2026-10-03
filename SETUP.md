# Saylor's Math Learning System - Setup Guide

## Architecture Overview

**Zero-cost, offline-first system** using:
- GitHub Gist for cloud data sync (free, no auth needed)
- Browser localStorage for offline data storage
- Static hosting on Netlify (free tier)
- No serverless functions (eliminated credit burn)

## Setup Steps

### 1. Create a GitHub Gist for Data Sync

1. Go to https://gist.github.com
2. Create a new public gist (or private if you prefer)
3. Filename: `saylor-progress.json`
4. Initial content: 
```json
{
  "turdTimes": {},
  "coins": 0,
  "prizes": [],
  "fastGameHistory": [],
  "qualifierMultiplier": 0,
  "qualifierLog": [],
  "timeSessions": [],
  "lastSync": null
}
```
5. Copy the Gist ID from the URL:
   - URL: `gist.github.com/your-username/abc123def456`
   - **ID: `abc123def456`**

### 2. Configure Saylor's iPad (Games App)

1. Open the games app on Saylor's iPad: https://saylor-tutoring.netlify.app
2. Go to Analytics tab (📊)
3. In the top right, paste the Gist ID into the "Gist ID" field
4. Tap the checkmark ✓
5. Status will show "✓ Syncing to cloud..."

**That's it!** Now every time Saylor practices:
- Her progress saves locally on the iPad
- When iPad has WiFi, it auto-syncs to the GitHub Gist
- The coach dashboard can read this data remotely

### 3. Set Up Your Coach Dashboard (Your Phone/Computer)

1. Open the coach dashboard: https://timely-tiramisu-444edd.netlify.app/coach-private.html
2. Paste the same Gist ID (76279152086bf980a3fd75733623eee6)
3. Click "✓ Connect"

Now you can:
- **Overview tab**: Summary of total practice time, sessions, coins, and practice breakdown by skill category
- **By Lesson tab**: Detailed breakdown showing time invested in each specific skill/lesson aligned to the 12-week plan (e.g., "Multiplication Facts 0-5", "2-Digit × 1-Digit", etc.)
- **Progress bars**: See which skills are getting the most practice and track progress toward Phase goals
- **Sessions tab**: View recent practice sessions with dates and durations
- **Alerts**: Get notified about engagement milestones and light practice weeks

The dashboard auto-refreshes every 30 seconds while you have it open.

## How It Works

### Offline-First Flow
```
iPad (Saylor practicing)
  ↓
saves to localStorage
  ↓
[WiFi connects?] → YES → sync to GitHub Gist
                    ↓
Your Phone/Coach Dashboard
  ↓
reads from Gist every 30s
```

### Time Tracking
The system automatically tracks:
- **Game sessions**: Each game start/stop records duration
- **Game type**: Which game was played (turdTimes, fastCash, bubbleBuster)
- **Skill mapping**: Games are automatically mapped to specific skills/lessons in the 12-week plan

Games auto-track when:
- ⏱️ Fast Cash game started → `trackSessionStart('fastCash')`
- ⏱️ Fast Cash game ended → `trackSessionEnd('fastCash')`
- 💩 Turd Times started → `trackSessionStart('turdTimes')`
- 🫧 Bubble Buster started → `trackSessionStart('bubbleBuster')`

### Skill-to-Game Mapping
The coach dashboard automatically groups practice time by specific skills aligned to the 12-week plan:

**Phase 1: Single-Digit Fluency (Weeks 1-3)**
- Multiplication Facts 0-5 (Week 1)
- Multiplication Facts 6-9 (Week 2)
- Division Facts 0-9 (Week 2)
- Full Fluency Review (Week 3)
→ Games: turdTimes, fastCash

**Phase 2: Multi-Digit Operations (Weeks 4-6)**
- 2-Digit × 1-Digit (Week 4)
- 3-Digit × 1-Digit (Week 5)
- 2-Digit × 2-Digit (Week 6)
- Division by 1-Digit (Week 6)
→ Games: turdTimes, bubbleBuster

**Phase 3: Fraction Foundations (Weeks 7-9)**
- Fractions & Equivalents (Week 7)
- Simplify & Compare Fractions (Week 8)
- Factors, GCF, LCM (Week 9)
→ Games: bubbleBuster

**Phase 4: Fraction Operations (Weeks 10-12)**
- Add & Subtract Fractions (Week 10)
- Multiply Fractions (Week 11)
- Divide Fractions (Week 12)
→ Games: bubbleBuster

### Data Sync
- **Automatic**: When WiFi is available, saves sync to Gist via GitHub API
- **Manual**: Export button on Analytics downloads JSON file
- **No auth needed**: Gist API is freely accessible, no credentials required
- **Rate limits**: GitHub allows 60 requests/hour (plenty for our use)

## Deployment

Changes to the games:
1. Edit HTML/JS files locally
2. `git push` to GitHub
3. Netlify auto-deploys within seconds
4. iPad/phone automatically get updated version on next load

## URLs

- **Games App** (for Saylor): https://saylor-tutoring.netlify.app/index.html
- **Coach Dashboard** (hidden, for you): https://saylor-tutoring.netlify.app/coach-private.html
- **Public Dashboard** (if shared with Saylor): https://saylor-tutoring.netlify.app/coach.html

## Troubleshooting

**"Gist not found" error**
- Check the Gist ID is correct
- Make sure Gist file is named `saylor-progress.json`
- Can be public or private, doesn't matter

**Data not syncing**
- Check iPad has WiFi (needs internet to reach GitHub)
- Check Gist ID is entered in Analytics tab
- Manual export: Use 📋 Export button as backup

**Coach dashboard shows "No data yet"**
- Refresh the page (browser cache)
- Wait 30 seconds for auto-refresh
- Check Gist ID matches what's on iPad

**Netlify not updating after push**
- Check https://app.netlify.com/sites/saylor-tutoring/deploys
- Should deploy within 30 seconds of push
- Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on PC)

## Cost Analysis

**Free tier usage:**
- Netlify: Static hosting (unlimited)
- GitHub Gist: Free (unlimited)
- GitHub API calls: <100/day (limit is 60/hour)
- Total monthly cost: **$0**

**What we eliminated:**
- Netlify serverless functions (was $0.025 per 100k invocations)
- You were at 75% of monthly credits before
- New system uses 0 function invocations = 0 costs

## Next Steps

1. Create Gist and get the ID
2. Push to Netlify (or ensure latest version is deployed)
3. Enter Gist ID on iPad in Analytics tab
4. Open coach-private.html on your phone
5. Start seeing real-time practice analytics!

## File Structure

```
index.html              - Games app (Saylor plays here)
coach.html             - Public dashboard
coach-private.html     - Your hidden coaching dashboard
SETUP.md              - This file
functions/            - Old Netlify functions (not deployed)
```

The hidden dashboard (`coach-private.html`) is your private URL - don't share it with Saylor. Everything else she can see.
