# tools.zennisys.ai

## 🧠 Overview

A SaaS platform offering AI-powered tools for e-commerce sellers to:

- ✍️ Generate product descriptions  
- 💳 Handle subscriptions (free trial + Razorpay)  
- 📤 Export results via CSV  
- 🧠 Future: SEO meta tag generation, social tools, etc.

---

## 🛠️ Tech Stack

| Layer             | Tech Used                        |
|-------------------|----------------------------------|
| **Frontend**      | Next.js + Tailwind CSS           |
| **Auth**          | Supabase Auth                    |
| **Database**      | Supabase DB                      |
| **Payments**      | Razorpay                         |
| **Edge Functions**| Supabase + OpenAI                |
| **Deployment**    | Vercel (`tools.zennisys.ai`)     |

---

## 📄 Key Pages

| Route                | Purpose                               |
|----------------------|---------------------------------------|
| `/`                  | Landing page with free trial CTA      |
| `/signup`, `/login`  | Supabase email/password auth          |
| `/dashboard`         | Dashboard with usage & summary        |
| `/features/generate` | Product description tool (form + CSV) |
| `/subscribe`         | Razorpay checkout + plan manager      |
| `/profile`           | View plan + trial details             |

---

## 📊 Dashboard Highlights

- ✅ Welcome greeting w/ username  
- 📈 Usage chart (5-day) via Supabase RPC  
- 📦 Generated & available description counts  
- 🧭 Sidebar navigation + logout/profile panel

---

## 🔐 Auth Flow

- Signup → email verification  
- Login → dashboard  
- Profile created automatically on signup  
- Trial expires after 7 days

---

## ✨ Description Generator

- Powered by OpenAI (via Supabase Edge Function)  
- Input: product title + feature  
- Output: clear, SEO-optimized product description  
- CSV support for bulk input/export

---

## 🚧 Upcoming Features

- [ ] SEO Meta Tag Generator  
- [ ] Ad & email copywriting  
- [ ] Shopify CSV export support  
- [ ] Usage quota banners and reports  
- [ ] Charts, filters, export tracking

---

## 📁 Project Structure

```bash
/app
  ├─ dashboard/
  ├─ features/generate/
  ├─ profile/
  ├─ subscribe/
  └─ layout.tsx
/components
  └─ DashboardLayout.tsx
/supabase/functions/generate-description/index.ts
```

---

## 📦 Install & Run Locally

```bash
git clone https://github.com/your-org/tools.zennisys.ai
cd tools.zennisys.ai
npm install
npm run dev
```

---

## 📝 License

©Zennisys 2025
