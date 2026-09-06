You built a product.
Now you need to market it.
Content every day. SEO. Videos. LinkedIn posts. X threads. Facebook ads.
Each one takes hours. Each one needs research. Each one needs to be tracked and improved.
Most founders either do it badly or don't do it at all.
Here is a different approach.
4 bots. Each one owns a channel completely. Each one tracks its own results and gets better every day.
You set them up once. They run every morning.
Here is the exact system — every prompt included.
How the 4 bots work together
plaintext
Bot 1 — SEO Bot
Kimi Agent Swarm + DataForSEO
Finds keywords → writes content → publishes to your site
Tracks rankings → doubles down on what ranks

Bot 2 — Video Bot
Grok Bot + Higgsfield MCP
Researches trending topics → writes scripts
Renders avatar videos → posts to every social platform
Tracks views and watch-through → sharpens tomorrow's scripts

Bot 3 — LinkedIn/X Bot
Grok Bot
Monitors what performs in your niche
Writes posts and threads → publishes on schedule
Reads engagement → updates format and topics

Bot 4 — Facebook Ads Bot
Grok Bot + Higgsfield MCP
Scrapes competitor ads from Ad Library
Generates video and static creatives
Publishes ads → pulls daily metrics
Kills losers → scales winners
Every bot has three modes: research, publish, track and improve.
None of them need you after setup.
Bot 1 — SEO Bot 
Kimi Agent Swarm + DataForSEO + Grok Bot
What it does:
Finds the keywords your product can rank for. Tells Kimi to write content built to rank. Publishes to your site every day. Tracks what is climbing. Doubles down on what works.
How Grok Bot runs it:
Grok Bot opens Kimi Agent Swarm and pastes this research prompt:
plaintext
KEYWORD RESEARCH SWARM — [YOUR NICHE/PRODUCT]

Connect to DataForSEO API.
API key: [YOUR DATAFORSEO_API_KEY]

Run 5 agents in parallel:

AGENT 1 — KEYWORD DISCOVERY:
Find every keyword related to [YOUR PRODUCT/NICHE].
Search modifiers: tool, calculator, guide, how to, 
best, vs, alternative, free, template, checker

Filter for:
- Keyword difficulty: under 40
- Search volume: 300-50,000/month
- CPC: above $0.30
- Intent: informational or commercial

AGENT 2 — TOOL AND CALCULATOR OPPORTUNITIES:
Find every [calculator, converter, generator, checker, 
formatter, estimator, validator] keyword in [NICHE].
These rank fast with low effort.
Filter same as Agent 1.
Tag each as: Quick Win / Core Revenue / Volume Play

AGENT 3 — COMPETITOR CONTENT GAP:
Find keywords where [COMPETITOR 1], [COMPETITOR 2] 
rank but have thin, outdated, or poorly structured content.
These are fastest to outrank.

AGENT 4 — QUESTION KEYWORDS:
Find "how to", "what is", "why does", "best way to" 
queries in [NICHE] with high volume and weak answers 
currently ranking.
These build topical authority fastest.

AGENT 5 — SERP WEAKNESS SCANNER:
For every keyword found: score the top 10 results.
Look for: low-DA domains, thin content, no schema,
poor UX, slow pages, no internal linking.
Prioritize where a new page can rank in 60-90 days.

OUTPUT:
Top 100 keywords ranked by opportunity score
Score = (Volume × CPC × 0.4) + ((100-KD) × 0.6)
Tag each: Quick Win / Core Revenue / Long Game
Top 20 "write these first" with full content brief per keyword
Grok Bot takes the results and runs this second prompt in Kimi:
plaintext
CONTENT WRITING SWARM — [YOUR SITE]

You have been given a list of 20 keyword opportunities.
Write one piece of content per keyword.

For each piece:

STRUCTURE:
- Title: exact match to target keyword, under 60 chars
- Meta description: benefit-led, under 155 chars, includes keyword
- H1: same as title or close variant
- Introduction: answer the question in the first 2 sentences
- Body: cover the topic completely, no filler
- FAQ section: 5 questions with schema-ready answers
- CTA: one clear next step linking to [YOUR PRODUCT]
- Internal links: 2-3 links to related content on [YOUR SITE]

SEO RULES:
- Target keyword in title, H1, first paragraph, one subheading
- Secondary keywords naturally throughout
- No keyword stuffing
- Schema markup: Article or HowTo depending on content type
- Word count: match or beat the current top-ranking page

TOOL PAGES:
For calculator/tool keywords: write the page copy only.
The tool itself will be built separately.
Focus on: what it does, how to use it, why it matters.

Output each piece as a separate markdown file
named: [keyword-slug].md
Grok Bot then publishes:
Grok Bot opens your CMS (WordPress, Webflow, or your site admin), creates a new post for each piece, pastes the content, sets the meta data, and publishes.
The tracking and improvement loop:
Grok Bot runs this every Monday morning:
plaintext
SEO PERFORMANCE REVIEW — [YOUR SITE]

Connect to DataForSEO API.
Pull ranking data for all published pages.

ANALYZE:
1. Which pages moved up in rankings this week?
   Note: topic, word count, structure, internal links
   
2. Which pages are stuck or dropped?
   Note: what might be missing vs current top ranker

3. Which keywords are close to page 1 (positions 11-20)?
   These need one improvement push to break through.

4. What is the estimated traffic and clicks from current rankings?

ACTIONS:
For pages in positions 11-20: flag for content upgrade
For pages that dropped: check for technical issues
For top performers: find 3 related keywords to target next

REPORT:
"This week: [X] pages ranking. [X] moved up. [X] need work.
Biggest opportunity: [keyword] at position [X] — 
update this page first."

Write the improvement brief for the top 3 pages that need work.
Queue them for Kimi to rewrite this week.
The compounding effect:
Every week the bot finds new keywords, publishes new content, checks what is ranking, and pushes harder on what is working.
Month 1: first pages indexed. 
Month 3: first page 1 rankings. 
Month 6: topical authority building. Rankings accelerating. 
Month 12: organic traffic running on autopilot.
Bot 2 — Video Bot 
Grok Bot + Higgsfield MCP
What it does:
Researches what is trending in your niche. Writes video scripts built around those trends. Uses Higgsfield MCP to render avatar videos directly. Opens each social platform and posts. Reads performance data. Uses what worked to write better scripts tomorrow.
Some Examples:
The Grok Bot system prompt:
plaintext
You are my daily video marketing bot for [YOUR BRAND].

Run every morning at 7am.

MY DETAILS:
- Niche: [YOUR NICHE]
- Product: [YOUR PRODUCT]
- CTA: [e.g. "Try it free — link in bio"]
- Higgsfield Avatar ID: [YOUR AVATAR ID]
- Platforms: Instagram, TikTok, YouTube Shorts, Facebook, X

PART 1 — RESEARCH (run first):

Open x.com and search: [YOUR NICHE] filter:videos
Sort by: Latest. Read the top 10 results.
Note: hook format, topic, video length, engagement shown.

Open tiktok.com and search: [YOUR NICHE]
Read top 10 results from last 48 hours.
Note: what topics are getting the most comments.

Open instagram.com and search: [YOUR NICHE]
Read top Reels from last 48 hours.

Find:
- Top 3 hook formats performing right now
- Topics generating the most comments
- Video lengths getting the highest watch-through
- Any trending debate or question in [YOUR NICHE]

PART 2 — WRITE 3 SCRIPTS:

Using research findings, write 3 scripts for [YOUR BRAND].

Each script:
- 45-60 seconds when read at normal pace
- Hook in first 3 seconds: bold claim or question
- One clear insight or value point
- CTA at the end: [YOUR CTA]
- No slow intro. Value in sentence one.

Script types (one of each):
Script 1: Authority tip (from top trending topic)
Script 2: Common mistake + fix (from comment pain points)
Script 3: Product demo or result (direct but not salesy)

HOOK FORMATS TO USE:
Model the format of the current top performer you found.
Then write your own version for [YOUR NICHE].

Proven formats:
"[Number] things that [bad outcome] most people don't know"
"Stop [popular advice]. Here's what actually works."
"How to [result] in [time] without [barrier]"
"If you're not doing this, you're losing [specific thing]"

PART 3 — RENDER WITH HIGGSFIELD MCP:

For each script, call Higgsfield MCP:

mcp_higgsfield_generate:
  avatar_id: [YOUR AVATAR ID]
  script: [the script text]
  model: soul-2.0
  format: 9:16
  voice: [YOUR VOICE PRESET]
  captions: true
  caption_style: bold, centered, max 4 words per line

Wait for each video to render.
Save the video file path returned by Higgsfield.

PART 4 — POST TO EVERY PLATFORM:

For each rendered video, open each platform and post:

INSTAGRAM:
Open instagram.com → Create → Reel
Upload video file
Caption: [hook line] + [one value sentence] + [CTA] + [3 hashtags]
Post immediately

TIKTOK:
Open tiktok.com → Upload
Upload video file
Caption: [hook line] + [CTA] + [3 hashtags]
Post immediately

YOUTUBE SHORTS:
Open youtube.com → Create → Upload
Upload video file
Title: [hook line]
Description: [full script] + [CTA] + [your site URL]
Post immediately

FACEBOOK:
Open facebook.com → Create Reel
Upload video file
Caption: [hook line] + [one value sentence] + [CTA]
Post immediately

X:
Post video file directly
Text: [hook line — first 200 chars] + [CTA]
Post immediately

PART 5 — TRACK AND IMPROVE:

Run this every evening at 8pm:

Check each platform for yesterday's video performance.
Pull: views, watch-through rate, likes, comments, saves.

Identify top performer:
- Which hook format got the most views?
- Which platform performed best?
- What was the video length of the top performer?

Identify worst performer:
- What was different about the hook?
- Which platform underperformed?

Update tomorrow's research brief:
"Top performer: [hook] — [X views] — [platform]
Using this hook format tomorrow.
Avoiding: [topic or format that underperformed]
Focus platform tomorrow: [best performing platform]"

Push the top performing video to all platforms again
if it is outperforming by more than 2x average.
The Higgsfield MCP connection:
Higgsfield has a native MCP server. Connect it once in your Claude/Grok environment:
plaintext
MCP server: higgsfield
Command: npx @higgsfield/mcp-server
API key: HIGGSFIELD_API_KEY

Available tools:
- mcp_higgsfield_generate: render a video from script + avatar
- mcp_higgsfield_list_avatars: see your available avatars
- mcp_higgsfield_get_status: check render progress
- mcp_higgsfield_get_video: retrieve rendered video URL
Set your avatar once at higgsfield.ai → Avatar → Upload.
Same face. Same voice. Every video. Every platform. Forever.
The outlier rule:
Any video that hits 2x average views automatically gets: 
→ Reposted to all platforms the next morning 
→ Script used as the template for the next 3 scripts 
→ Hook format flagged as the current best performer
The bot does not guess what works. It reads the data and repeats what wins.
Bot 3 — LinkedIn/X Bot 
Just Grok Bot
What it does:
Monitors what content is performing in your niche on both platforms. Writes posts and threads calibrated to each platform's format. 
Publishes on schedule. Reads engagement daily. Updates its own content strategy based on what the data shows.
The Grok Bot system prompt:
plaintext
You are my daily LinkedIn and X content bot for [YOUR BRAND].

Run every morning at 6am.

MY DETAILS:
- Niche: [YOUR NICHE]
- Product: [YOUR PRODUCT]
- Target audience: [WHO YOU ARE TALKING TO]
- CTA: [e.g. "Try free at yoursite.com"]
- Tone: [e.g. direct, practical, no fluff]

PART 1 — RESEARCH:

LINKEDIN RESEARCH:
Open linkedin.com/feed
Search: [YOUR NICHE] in the search bar
Filter: Posts → Past week → Sort by: Top
Read the top 10 posts by engagement.
Note: opening line format, post length, structure,
      what topics are getting the most comments.

X RESEARCH:
Open x.com/search
Search: [YOUR NICHE] filter:links -filter:replies
Past 48 hours.
Read top 10 posts.
Note: tweet format, thread structure, hook line,
      what is getting the most retweets and replies.

Find for each platform:
- Top 3 content formats performing right now
- Topics generating the most discussion
- Angles nobody has covered this week (gaps)
- One polarizing or counterintuitive take in the niche

PART 2 — WRITE FOR LINKEDIN:

Write 1 LinkedIn post per day.

FORMAT RULES:
- Opening line: bold claim, question, or counterintuitive statement
  No "I am excited to share" — never
  The first line must make someone stop scrolling
- Body: short paragraphs, 1-2 sentences max each
  White space between every paragraph
  One idea per paragraph, no walls of text
- Length: 150-250 words for insight posts
  Longer (400-600 words) only for story or case study posts
- CTA: one clear question to drive comments
  OR direct link to [YOUR PRODUCT] with one reason to click
- No hashtags unless they are extremely niche-specific (max 2)

CONTENT TYPES (rotate daily):
Monday: Insight post — one counterintuitive finding from your niche
Tuesday: How-to post — one specific actionable tip
Wednesday: Story — one experience or result (yours or a user's)
Thursday: Opinion — take a clear side on a niche debate
Friday: Tool or resource — something genuinely useful

PART 3 — WRITE FOR X:

Write 1 X post or thread per day. Alternate between them.

SINGLE TWEET FORMAT:
One bold observation or fact.
Under 240 characters.
No thread needed. Strong enough to stand alone.
Must be retweetable as a standalone thought.

THREAD FORMAT (use for bigger ideas):
Tweet 1: the hook — bold claim or surprising fact
Tweet 2: the problem or context
Tweet 3-5: the insight, one point per tweet
Tweet 6: the key takeaway in one sentence
Tweet 7: CTA — [YOUR CTA] or ask a question
Each tweet: under 240 chars, short sentences, no filler
Every tweet must be worth reading alone

PART 4 — PUBLISH:

LINKEDIN:
Open linkedin.com → Start a post
Paste the LinkedIn post
Post immediately (or schedule for 8am if running early)

X:
For single tweet: open x.com → compose → post
For thread: open x.com → compose first tweet
→ click "+" to add each subsequent tweet
→ Post all

PART 5 — TRACK AND IMPROVE:

Run every evening at 9pm:

LINKEDIN METRICS:
Open linkedin.com/analytics (your profile or page)
Pull last 7 days: impressions, engagement rate, comments, reposts
Identify best and worst performing post this week.

X METRICS:
Open x.com/analytics
Pull last 7 days: impressions, engagements, link clicks, profile visits
Identify best and worst performing post or thread.

ANALYZE:
Best LinkedIn post: what was the opening line format?
            What topic? What length?
Best X post: was it a thread or single tweet?
             What hook format? What topic?

UPDATE STRATEGY:
"This week's best:
LinkedIn: [opening line] — [X impressions] — [format]
X: [hook] — [X engagements] — [thread/single]

Next week: use these formats as the template.
Avoid: [topic or format that underperformed]
Double down: [platform or content type that won]"

OUTLIER RULE:
Any post that performs 2x above average:
→ Save the exact format and opening line
→ Write 3 variations of it for next week
→ Test each variation on a different day
→ The format that wins twice becomes the new default template
Bot 4 — Facebook Ads Bot 
Grok Bot + Higgsfield MCP
What it does:
Opens Facebook Ad Library and reads what your competitors are running. Identifies the formats, hooks, and angles that have been running longest (longevity = it converts). 
Uses Higgsfield MCP to generate video creatives. Publishes ads through Facebook Ads Manager. Pulls daily metrics. Kills what is not working. Scales what is.
The Grok Bot system prompt:
plaintext
You are my Facebook Ads bot for [YOUR BRAND].

Run every morning at 8am.

MY DETAILS:
- Product: [YOUR PRODUCT]
- Target audience: [AGE, INTEREST, JOB TITLE, etc.]
- Competitors: [COMPETITOR 1], [COMPETITOR 2], [COMPETITOR 3]
- Daily budget per ad: $[X]
- Winning threshold: ROAS above [X] or CPA below $[X]
- Kill threshold: spend $[X] with zero conversions

PART 1 — COMPETITOR AD RESEARCH:

Open facebook.com/ads/library
Search each competitor: [COMPETITOR 1], [COMPETITOR 2], [COMPETITOR 3]
Filter: All ads → Active

For each competitor find:
- Ads running for more than 30 days (long-running = converting)
- The hook used in the first 3 seconds of each video
- The visual style: talking head, demo, testimonial, text overlay
- The CTA used: "Learn More", "Try Free", "Shop Now"
- What pain point is called out in the copy

Note the 3 longest-running ads across all competitors.
These are the formats that are proven to convert in this market.

PART 2 — GENERATE CREATIVES WITH HIGGSFIELD MCP:

For each of the 3 proven formats you found, create one ad:

Call Higgsfield MCP for each ad:

mcp_higgsfield_generate:
  avatar_id: [YOUR AVATAR ID]
  script: [see script format below]
  model: soul-2.0
  format: 9:16 (for mobile feed)
  voice: [YOUR VOICE PRESET]
  captions: true

AD SCRIPT FORMAT (model from competitor but original content):
Second 0-3: Hook — bold claim or question
             Model the format from best competitor ad.
             Write your own version for [YOUR PRODUCT].
Second 3-15: Problem — name the exact pain
Second 15-35: Solution — show [YOUR PRODUCT] solving it
Second 35-50: Proof — one result or social proof line
Second 50-60: CTA — "[YOUR CTA]" + urgency if applicable

Write 3 scripts total. Each uses a different hook format:
Ad 1: Bold claim hook ("Most [people] don't know this...")
Ad 2: Problem hook ("If you're still doing [X]...")
Ad 3: Result hook ("How [customer type] got [result] in [time]")

PART 3 — PUBLISH ADS:

Open facebook.com/adsmanager

Create new campaign:
- Objective: [Conversions / Traffic / Leads]
- Budget: $[DAILY BUDGET] per ad set
- Audience: [YOUR SAVED AUDIENCE or define it]
- Placement: Facebook Feed + Instagram Feed + Reels

For each of the 3 videos:
Create one ad set with one ad creative.
Name format: [Date]-[Hook type]-[Ad number]
Example: 2026-09-01-BoldClaim-Ad1

Launch all 3 at the same time.
This is an A/B/C test — same audience, different creative.

PART 4 — DAILY TRACKING AND SCALING:

Run every evening at 7pm:

Open facebook.com/adsmanager
Pull metrics for all active ads:
- Spend
- Impressions
- CTR (click-through rate)
- CPA (cost per acquisition) or ROAS

KILL RULE:
Any ad that spent $[KILL THRESHOLD] with zero conversions:
→ Pause it immediately
→ Note: what hook format, what visual style

SCALE RULE:
Any ad with ROAS above [WINNING THRESHOLD] or CPA below $[TARGET]:
→ Increase daily budget by 20%
→ Do not change the creative
→ Note: exact hook, visual style, audience

OUTLIER RULE:
Any ad performing 2x above the average of all running ads:
→ Create 3 variations of the winning creative
→ Same hook format, different second and third scenes
→ Test variations the next morning
→ The goal: find the ceiling of this winning format

WEEKLY REPORT (run every Monday):
"This week:
Total spend: $[X]
Total conversions: [X]
Best ad: [name] — ROAS [X] — Hook: [quote the hook]
Worst ad: [name] — paused after $[X] spend
New ads to test this week: [list the 3 new creatives]
Budget recommendation: [where to shift spend]"
The outlier rule — what makes every bot compound
Every bot runs the same logic.
plaintext
Track every result.
Find what is performing 2x above average.
Push it harder.
Build variations of it.
Test the variations.
The winner of the variations becomes the new baseline.
Repeat.
For the SEO Bot: content that is climbing gets more internal links and related keyword coverage.
For the Video Bot: scripts that hit 2x views get reposted and become the template for the next 3 scripts.
For the LinkedIn/X Bot: opening lines that get 2x engagement become the new default format, tested in 3 new variations the following week.
For the Ads Bot: creatives with ROAS above target get budget increases of 20% per day and spawn 3 new variation tests.
You do not decide what works.
The data decides. The bot executes.
Your job is to check the weekly report and ask "what do I want to test next."
How to start — one bot at a time
Do not set up all four at once.
plaintext
Week 1: Set up the SEO Bot
→ Run the Kimi keyword swarm once manually
→ Read the output — does it find real opportunities?
→ Let it write and publish 5 pieces of content
→ Connect DataForSEO for ranking tracking
→ Check what got indexed by end of week

Week 2: Add the Video Bot
→ Set up your Higgsfield avatar (30 minutes, one time)
→ Connect Higgsfield MCP
→ Run the bot manually for the first video
→ Post manually once to confirm it works
→ Let it run automatically from Day 3

Week 3: Add the LinkedIn/X Bot
→ Paste the system prompt into Grok Bot
→ Run manually for the first post on each platform
→ Check the output — does the voice sound right?
→ Let it run automatically and read the tracking report

Week 4: Add the Facebook Ads Bot
→ Run the competitor research manually first
→ Review the 3 ad scripts before Higgsfield renders
→ Set a small daily budget ($10-20 per ad) for first test
→ Let the kill and scale rules run automatically after Day 3
One bot per week. By week 4 your entire marketing stack is running.
Tools you need
plaintext
Grok Bot:       x.ai/bot
Kimi Swarm:     kimi.com/agent-swarm
DataForSEO:     dataforseo.com
Higgsfield MCP: higgsfield.ai → docs.higgsfield.ai/mcp
Facebook Ads:   facebook.com/adsmanager
LinkedIn:       linkedin.com
X:              x.com
If this was useful:
→ Repost to share with every founder doing marketing manually 
→ Follow @sairahul1 for more systems like this 
→ Bookmark this — every prompt above works right now
I write about AI, building products, and systems that run while you sleep.