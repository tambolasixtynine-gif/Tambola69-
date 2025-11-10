# 🎲 Tambola69 – Facebook Login Integration

This guide explains how to integrate **Facebook Login** securely for the **Tambola69** app.

---

## 🚀 1. Create Facebook App

1. Go to [https://developers.facebook.com/apps](https://developers.facebook.com/apps)
2. Click **"Create App"** → Choose **Consumer** type.
3. Enter:
   - App Name: `Tambola69`
   - Contact Email: your email
4. Click **Create App**.

After creation:
- Go to **Settings → Basic**
- Copy:
  - **App ID**
  - **App Secret** → click **Show** and enter your password to reveal.

---

## 🔐 2. Environment Setup

Create a `.env` file in your backend folder and add:

```env
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
FACEBOOK_CALLBACK_URL=http://localhost:5000/auth/facebook/callback
