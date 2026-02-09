# Google OAuth Setup - Step by Step

## 🔧 What You Need to Do

Based on your Clerk dashboard screenshot, you need to get **real Google OAuth credentials**. Here's how:

---

## Step 1: Create Google OAuth Credentials

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Sign in with your Google account

### 2. Create a New Project (or select existing)
- Click the project dropdown at the top
- Click "New Project"
- Name it: "Sweet Cravings" or similar
- Click "Create"

### 3. Enable Google+ API
- In the left sidebar, go to: **APIs & Services** → **Library**
- Search for: "Google+ API"
- Click on it and press **Enable**

### 4. Configure OAuth Consent Screen
- Go to: **APIs & Services** → **OAuth consent screen**
- Choose: **External** (for testing) or **Internal** (if you have Google Workspace)
- Click "Create"

**Fill in the form:**
- App name: `Sweet Cravings`
- User support email: Your email
- Developer contact: Your email
- Click "Save and Continue"

**Scopes:** Click "Add or Remove Scopes"
- Add these scopes (they're already in your Clerk config):
  - `openid`
  - `https://www.googleapis.com/auth/userinfo.email`
  - `https://www.googleapis.com/auth/userinfo.profile`
- Click "Update" → "Save and Continue"

**Test users:** (if using External)
- Add your email address
- Click "Save and Continue"

### 5. Create OAuth 2.0 Credentials
- Go to: **APIs & Services** → **Credentials**
- Click: **+ Create Credentials** → **OAuth client ID**
- Application type: **Web application**
- Name: `Sweet Cravings Web`

**Authorized redirect URIs:**
Copy this from your Clerk dashboard (the one shown in your screenshot):
```
https://primary-cattle-7.clerk.accounts.dev
```
Or it might be different - copy the exact URL from your Clerk dashboard.

- Click **Create**

### 6. Copy Your Credentials
You'll see a popup with:
- **Client ID** (looks like: `123456789-abc123def456.apps.googleusercontent.com`)
- **Client Secret** (looks like: `GOCSPX-abc123def456ghi789`)

**⚠️ Important:** Save these! You'll need them in the next step.

---

## Step 2: Add Credentials to Clerk

### 1. Go back to your Clerk Dashboard
- The screen you have open now (Google OAuth configuration)

### 2. Toggle ON "Use custom credentials"

### 3. Enter Your Google Credentials
Replace the placeholder values with the real ones from Google:

**Client ID:**
```
[Paste your Google Client ID here]
```
Example: `123456789-abc123def456.apps.googleusercontent.com`

**Client Secret:**
```
[Paste your Google Client Secret here]
```
Example: `GOCSPX-abc123def456ghi789`

**Authorized Redirect URI:**
This should already be filled in. Keep it as:
```
https://primary-cattle-7.clerk.accounts.dev
```

**Scopes:**
These should already be there:
- `openid`
- `https://www.googleapis.com/auth/userinfo.email`
- `https://www.googleapis.com/auth/userinfo.profile`

### 4. Save Your Changes
- Click the **Save** or **Apply** button at the bottom

---

## Step 3: Test the Integration

### 1. Restart Your Frontend (if needed)
```bash
cd client
npm run dev
```

### 2. Test Sign In
1. Open: http://localhost:3001 (or your port)
2. Click "Login"
3. Click "Continue with Google"
4. You should see the Google sign-in screen
5. Sign in with your Google account
6. You should be redirected back and signed in!

---

## 🔍 Current Issue with Your Screenshot

The credentials you have now are **test/placeholder values**:
- Client ID: `hamanth` ❌ (Not a real Google Client ID)
- Client Secret: `Hamanth@123` ❌ (Not a real Google Client Secret)

You need to replace these with **real credentials from Google Cloud Console**.

---

## ✅ What Real Credentials Look Like

**Real Google Client ID:**
```
123456789-abc123def456ghi789jkl012.apps.googleusercontent.com
```

**Real Google Client Secret:**
```
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45
```

---

## 🚨 Common Issues

### "Redirect URI Mismatch"
- Make sure the redirect URI in Google Cloud Console **exactly matches** the one in Clerk
- Copy it from Clerk and paste into Google (including `https://`)

### "Access Blocked: This app's request is invalid"
- Make sure you enabled the required APIs in Google Cloud
- Check that all 3 scopes are added in Google OAuth consent screen

### "Error 400: invalid_client"
- Double-check your Client ID and Client Secret
- Make sure there are no extra spaces when copying

---

## 📝 Quick Checklist

- [ ] Create Google Cloud project
- [ ] Enable Google+ API
- [ ] Configure OAuth consent screen
- [ ] Create OAuth 2.0 credentials
- [ ] Copy Client ID and Client Secret
- [ ] Paste into Clerk dashboard
- [ ] Save changes in Clerk
- [ ] Test sign-in with Google

---

## 🎯 Next Steps After Setup

Once Google OAuth is working:

1. Your users can sign in with one click
2. No need to remember passwords
3. Profile info (name, email, photo) automatically imported
4. Users can access their orders and wishlist

---

**Need Help?**
- Google Cloud Console: https://console.cloud.google.com/
- Clerk Dashboard: https://dashboard.clerk.com/
- Google OAuth Documentation: https://developers.google.com/identity/protocols/oauth2

---

**Status:** Waiting for real Google OAuth credentials to be configured
**Time Required:** ~10 minutes for first-time setup
