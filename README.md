# MarketsXHub

Four bots. Entire marketing stack. They run every morning.

A workspace for any founder — not just us. Free: 7 X runs + 1 SEO brief. Desk $39 (founding 50 at $19). Floor $99.

```bash
npm install
cp .env.example .env.local   # XAI_API_KEY + Supabase URL/anon key
npm run dev
```

- `/` landing · `/start` onboard · `/pricing` · `/playbook` · `/login`
- `/hub/x` X Content Bot · `/hub/seo` SEO briefs
- `POST /api/run-desk` — auth + `consume_bot_run` RPC, then xAI
- `POST /api/founding-lead` — writes to `founding_leads`

`XAI_API_KEY` unlocks live generation (Grok 4.6 + X/web search). Without it, the MarketsXHub demo queue still ships.

**Persist:** run [`supabase/schema.sql`](supabase/schema.sql) then [`supabase/stripe.sql`](supabase/stripe.sql) in the SQL editor. Enable magic-link auth. Allow redirect URLs `https://www.marketsxhub.com/**` and `http://localhost:3000/**`. First login hydrates the hub from `workspaces` and keeps saving brand/posts/metrics there.

**Stripe:** Desk $39, Founding Desk $19, Floor $99. Webhook `https://www.marketsxhub.com/api/stripe/webhook` for `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`. Checkout requires login. Founding is capped at 50 emails; after 12 months a subscription schedule switches founding subs to the $39 Desk price. Generate is `POST /api/run-desk` only (auth + quota; refunded if Grok fails).

**Analytics:** Enable Web Analytics + Speed Insights on the Vercel project. Run [`supabase/analytics.sql`](supabase/analytics.sql). Funnel lives at `/hub/insights`. Page views: Vercel dashboard. Conversion events: first-party `analytics_events`.
